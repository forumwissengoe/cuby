import * as xml from 'xml-js';
import {oc} from 'ts-optchain';
import {cache} from './AOPFunctions';

export class LidoObject
{
	data:any = null;
	lidoString:string = null;
	
	// Currently supported elements
	lidoRecID:string | undefined = undefined;
	objectPublishedID:string[] | undefined = [];
	
	// Grunddaten
	title:LidoAppellation | undefined = undefined ;
	
	// Zitieren und Nachnutzen
	handleLink:string | undefined = undefined;
	
	// Klassifikationen, Taxonomien und Schlagworte
	category:LidoConcept[] = [];
	objectWorkType:LidoConcept[] = [];
	classification:LidoConcept[] = [];
	
	// Beschreibung
	inscriptions:{type: string | undefined, transcription:string | undefined, descriptionNote: string | undefined, descriptionID: string | undefined}[] = [];
	repository:{legalBodyID:string | undefined, legalBodyName:LidoAppellation | undefined, legalBodyWeblink:string | undefined, locationName:LidoAppellation | undefined, position:LidoRepositoryLocation | undefined}[] = [];
	state:string | undefined = undefined;
	edition:string | undefined = undefined;
	
	description:{type:string | undefined, description:string | undefined}[] = [];
	measurements:LidoMeasurement[] = [];
	
	// Events
	events: LidoEvent[] = [];
	
	// Relations NOT FULLY SUPPORTED -> IRRELEVANT
	subjectRelations:{display:string | undefined, concept: LidoConcept, date: LidoDate | undefined, place: LidoPlace | undefined, actor: LidoActor | undefined}[] = [];
	relatedWorks:{display:string | undefined, relTypeConcept: LidoConcept | undefined, id:string | undefined, note: string | undefined, webresouce:string | undefined}[] = [];
	
	constructor() {}
	
	loadLIDO(lidoData:string)
	{
		lidoData = lidoData.replace(/lido:/g, "");
		lidoData = lidoData.replace(/gml:/g, "");
		lidoData = lidoData.replace(/xml:/g, "");
		let tmp :any = undefined;
		let data:any = JSON.parse(xml.xml2json(lidoData, {compact: true, spaces: 4, alwaysArray: true}));
		
		// BASIS LIDO
		this.lidoRecID = oc(data).lido[0].lidoRecID[0]._text[0]();
		
		for(let obj of oc(data).lido[0].objectPublishedID([]))
			this.objectPublishedID.push(oc(obj)._text[0]());
		
		this.handleLink = this.objectPublishedID.find((v) => {return v.indexOf("handle") >= 0;});
		
		for(let obj of oc(data).lido[0].category([]))
			this.category.push(LidoConcept.concept(obj));
		
		// DESCRIPTIVE METADATA
		// Object Classification
		for(let obj of oc(data).lido[0].descriptiveMetadata[0].objectClassificationWrap[0].objectWorkTypeWrap([]))
			this.objectWorkType.push(LidoConcept.concept(oc(obj).objectWorkType[0]()));
		
		for(let obj of oc(data).lido[0].descriptiveMetadata[0].objectClassificationWrap[0].classificationWrap([]))
			this.classification.push(LidoConcept.concept(oc(obj).classification[0]()));
	
		// Object Identification
		this.title = LidoAppellation.appellation(oc(data).lido[0].descriptiveMetadata[0].objectIdentificationWrap[0].titleWrap[0].titleSet[0]([]));
		
		for(let obj of oc(data).lido[0].descriptiveMetadata[0].objectIdentificationWrap[0].inscriptionsWrap[0].inscriptions([]))
			this.inscriptions.push({type: oc(obj)._attributes[0].type[0](), transcription: oc(obj).inscriptionTranscription[0](), descriptionNote: oc(obj).inscriptionDescription[0].descriptiveNoteValue[0](), descriptionID: oc(obj).inscriptionDescription[0].descriptiveID[0]()});
		
		for(let obj of oc(data).lido[0].descriptiveMetadata[0].objectIdentificationWrap[0].repositoryWrap([]))
			this.repository.push({legalBodyID: oc(obj).repositorySet[0].repositoryName[0].legalBodyID[0]._text[0](), legalBodyName: oc(obj).repositorySet[0].repositoryName[0].legalBodyName[0].appellationValue[0]._text[0](), legalBodyWeblink: oc(obj).repositorySet[0].repositoryName[0].legalBodyWeblink[0]._text[0](), locationName: LidoAppellation.appellation(oc(obj).repositorySet[0].repositoryLocation[0].namePlaceSet[0]()), position: LidoRepositoryLocation.location(oc(obj).repositorySet[0].repositoryLocation[0]())});
		
		this.state = oc(data).lido[0].descriptiveMetadata[0].displayStateEditionWrap[0].displayState[0]._text[0]();
		this.edition = oc(data).lido[0].descriptiveMetadata[0].displayStateEditionWrap[0].displayEdition[0]._text[0]();
		
		for(let obj of oc(data).lido[0].descriptiveMetadata[0].objectIdentificationWrap[0].objectDescriptionWrap([]))
			this.description.push({type: oc(obj).objectDescriptionSet[0]._attributes[0].type[0](), description: oc(obj).objectDescriptionSet[0].descriptiveNoteValue[0]._text[0]()});
	
		for(let obj of oc(data).lido[0].descriptiveMetadata[0].objectIdentificationWrap[0].objectMeasurementsWrap[0].objectMeasurementsSet([]))
			this.measurements.push(LidoMeasurement.measurement(obj));
		
		// Events
		for(let obj of oc(data).lido[0].descriptiveMetadata[0].eventWrap[0].eventSet([]))
			this.events.push(LidoEvent.event(obj));
		
		// Object Relations
		for(let obj of oc(data).lido[0].descriptiveMetadata[0].objectRelationWrap[0].subjectWrap[0].subjectSet([]))
			this.subjectRelations.push({display: oc(obj).displaySubject[0]._text[0](), concept: LidoConcept.concept(oc(obj).subject[0].subjectConcept[0]()), date: LidoDate.date(oc(obj).subject[0].subjectDate[0]()), place: LidoPlace.place(oc(obj).subject[0].subjectPlace[0]()), actor: LidoActor.actor(oc(obj).subject[0].subjectActor[0]())});
		
		for(let obj of oc(data).lido[0].descriptiveMetadata[0].objectRelationWrap[0].relatedWorksWrap[0].relatedWorkSet([]))
			this.relatedWorks.push({display: oc(obj).relatedWork[0].displayObject[0]._text[0](), id: oc(obj).relatedWork[0].object[0].objectID[0]._text[0](), note: oc(obj).relatedWork[0].object[0].objectNote[0]._text[0](), webresouce: oc(obj).relatedWork[0].object[0].objectWebResource[0]._text[0](), relTypeConcept: LidoConcept.concept(oc(obj).relatedWorkRelType[0]())});
	}
	
	@cache
	hasPlace()
	{
		for(let element of this.events)
			if(element.eventPlace != undefined && !element.eventPlace.empty())
				return true;
		for(let element of this.subjectRelations)
			if(element.place != undefined && !element.place.empty())
				return true;
		return false;
	}
	
	@cache
	hasTime()
	{
		for(let element of this.events)
			if(element.eventDate != undefined && !element.eventDate.empty())
				return true;
		for(let element of this.subjectRelations)
			if(element.date != undefined && !element.date.empty())
				return true;
		return false;
	}
	
}

export class LidoConcept
{
	conceptID: any[] = [];
	term: any[] = [];
	
	static concept(obj: any) : LidoConcept
	{
		let concept = new LidoConcept();
		if(obj != undefined)
		{
			for(let c of oc(obj).conceptID([]))
				concept.conceptID.push({txt: oc(c)._text[0](), attr: oc(c)._attributes({})});
			for(let t of  oc(obj).term([]))
				concept.term.push({txt: oc(t)._text[0](), attr: oc(t)._attributes({})});
		}
		return concept;
	}
	
	getTerm(attr?:string, val?:string): string | undefined
	{
		if(this.term == undefined)
			return undefined;
		if(attr == undefined || val == undefined)
			for(let obj of this.term)
				if(JSON.stringify(obj.attr) === '{}')
					return obj.txt;
		else
			for(let obj of this.term)
				if(obj.attr.hasOwnProperty(attr) && obj.attr[attr] === val)
					return obj;
		return undefined;
	}
	
	getConceptID(attr?:string, val?:string): string | undefined
	{
		if(this.conceptID == undefined)
			return undefined;
		if(attr == undefined || val == undefined)
			for(let obj of this.conceptID)
				if(JSON.stringify(obj.attr) === '{}')
					return obj.txt;
		else
			for(let obj of this.conceptID)
				if(obj.attr.hasOwnProperty(attr) && obj.attr[attr] === val)
					return obj;
		return undefined;
	}
}

export class LidoAppellation
{
	appellation: any[] = [];
	
	static appellation(obj:any) : LidoAppellation
	{
		let appellation = new LidoAppellation();
		if(obj != undefined)
		{
			for(let a of oc(obj).appellationValue([]))
				appellation.appellation.push({txt: oc(a)._text[0](), attr: oc(a)._attributes({})});
		}
		return appellation;
	}
	
	get(attr?:string, val?:string): string | undefined
	{
		if(this.appellation == [])
			return undefined;
		if(attr == undefined || val == undefined)
			for(let obj of this.appellation)
				if(JSON.stringify(obj.attr) === '{}')
					return obj.txt;
		else
			for(let obj of this.appellation)
				if(obj.attr.hasOwnProperty(attr) && obj.attr[attr] === val)
					return obj;
		return undefined;
	}
}

export class LidoMeasurement
{
	displayMeasurements: string | undefined = undefined;
	type: any[] = [];
	unit: any[] = [];
	value: any[] = [];
	
	extend: string | undefined = undefined;
	qualifier: string | undefined = undefined;
	format: string | undefined = undefined;
	shape: string | undefined = undefined;
	scale: string | undefined = undefined;
	
	static measurement(obj: any) : LidoMeasurement | undefined
	{
		let measurement = new LidoMeasurement();
		if(obj != undefined)
		{
			measurement.displayMeasurements = oc(obj).displayObjectMeasurements[0]._text[0]();
			measurement.extend = oc(obj).objectMeasurements[0].extentMeasurements[0]._text[0]();
			measurement.qualifier = oc(obj).objectMeasurements[0].qualifierMeasurements[0]._text[0]();
			measurement.format = oc(obj).objectMeasurements[0].formatMeasurements[0]._text[0]();
			measurement.shape = oc(obj).objectMeasurements[0].shapeMeasurements[0]._text[0]();
			measurement.scale = oc(obj).objectMeasurements[0].scaleMeasurements[0]._text[0]();
			
			for(let a of oc(obj).objectMeasurements[0].measurementsSet[0].measurementType([]))
				measurement.type.push({txt: oc(a)._text[0](), attr: oc(a)._attributes({})});
			for(let a of oc(obj).objectMeasurements[0].measurementsSet[0].measurementUnit([]))
				measurement.unit.push({txt: oc(a)._text[0](), attr: oc(a)._attributes({})});
			for(let a of oc(obj).objectMeasurements[0].measurementsSet[0].measurementValue([]))
				measurement.value.push({txt: oc(a)._text[0](), attr: oc(a)._attributes({})});
		}
		return measurement;
	}
	
	getType(attr?:string, val?:string): string | undefined
	{
		if(this.type == undefined)
			return undefined;
		if(attr == undefined || val == undefined)
			for(let obj of this.type)
				if(JSON.stringify(obj.attr) === '{}')
					return obj.txt;
		else
			for(let obj of this.type)
				if(obj.attr.hasOwnProperty(attr) && obj.attr[attr] === val)
					return obj;
		return undefined;
	}
	
	getUnit(attr?:string, val?:string): string | undefined
	{
		if(this.unit == undefined)
			return undefined;
		if(attr == undefined || val == undefined)
			for(let obj of this.unit)
				if(JSON.stringify(obj.attr) === '{}')
					return obj.txt;
				else
					for(let obj of this.unit)
						if(obj.attr.hasOwnProperty(attr) && obj.attr[attr] === val)
							return obj;
		return undefined;
	}
	
	getValue(attr?:string, val?:string): string | undefined
	{
		if(this.value == undefined)
			return undefined;
		if(attr == undefined || val == undefined)
			for(let obj of this.value)
				if(obj.attr === {})
					return obj.txt;
				else
					for(let obj of this.value)
						if(obj.attr.hasOwnProperty(attr) && obj.attr[attr] === val)
							return obj;
		return undefined;
	}
	
}

export class LidoDate
{
	displayDate: string | undefined = undefined;
	earliest: number | undefined = undefined;
	latest: number | undefined = undefined;
	
	static date(obj:any) : LidoDate
	{
		let date = new LidoDate();
		
		if(obj != undefined)
		{
			date.displayDate = oc(obj).displayDate[0]._text[0]();
			date.earliest = new Date(oc(obj).date[0].earliestDate[0]._text[0]()).getTime();
			date.latest = new Date(oc(obj).date[0].latestDate[0]._text[0]()).getTime();
		}
		return date;
	}
	
	empty()
	{
		return this.earliest === undefined && this.latest === undefined;
	}
}

export class LidoPlace
{
	displayPlace: string | undefined = undefined;
	placeID: string | undefined = undefined;
	placeName: LidoAppellation | undefined = undefined;
	pos: number[] = [];
	
	static place(obj:any): LidoPlace
	{
		let place = new LidoPlace();
		if(obj != undefined)
		{
			place.displayPlace = oc(obj).displayPlace[0]._text[0]();
			place.placeID = oc(obj).place[0].placeID[0]._text[0]();
			place.placeName = LidoAppellation.appellation(oc(obj).place[0].namePlaceSet[0]());
			place.pos = (oc(obj).place[0].gml[0].Point[0].pos[0]._text[0]() || "").split(" ").map(v => parseFloat(v));
			if(place.pos == undefined || isNaN(place.pos[0]) || isNaN(place.pos[1]))
				place.pos = undefined;
		}
		return place;
	}
	
	empty()
	{
		return this.pos === undefined;
	}
}

export class LidoRepositoryLocation extends LidoPlace
{
	static location(obj:any): LidoRepositoryLocation
	{
		let repositoryLocation = new LidoRepositoryLocation();
		if(obj != undefined)
		{
			repositoryLocation.displayPlace = oc(obj).displayPlace[0]._text[0]();
			repositoryLocation.placeID = oc(obj).placeID[0]._text[0]();
			repositoryLocation.placeName = LidoAppellation.appellation(oc(obj).namePlaceSet[0]());
			repositoryLocation.pos = (oc(obj).gml[0].Point[0].pos[0]._text[0]() || "").split(" ").map(v => parseFloat(v));
			if(repositoryLocation.pos == undefined || isNaN(repositoryLocation.pos[0]) || isNaN(repositoryLocation.pos[1]))
				repositoryLocation.pos = undefined;
		}
		return repositoryLocation;
	}
}

export class LidoActor
{
	displayActor: LidoAppellation | undefined = undefined;
	actorID: string | undefined = undefined;
	actorName: LidoAppellation | undefined = undefined;
	actorNationality: LidoConcept | undefined = undefined;
	actorVitalDates: LidoDate | undefined = undefined;
	actorGender: string | undefined = undefined;
	actorRole: LidoConcept | undefined = undefined;
	actorExtend: string | undefined = undefined;
	actorAttribution: string | undefined = undefined;
	
	static actor(obj:any) : LidoActor
	{
		let actor = new LidoActor();
		if(obj != undefined)
		{
			actor.displayActor = LidoAppellation.appellation(oc(obj).displayActor[0]()) || LidoAppellation.appellation(oc(obj).displayActorInRole[0]());
			actor.actorID = oc(obj).actor[0]._text[0]();
			actor.actorName = LidoAppellation.appellation(oc(obj).actor[0].nameActorSet[0]());
			actor.actorNationality = LidoConcept.concept(oc(obj).actor[0].nationalityActor[0]());
			actor.actorVitalDates = LidoDate.date(oc(obj).actor[0].vitalDatesActor[0]());
			actor.actorGender = oc(obj).actor[0].genderActor[0]._text[0]();
			actor.actorRole = LidoConcept.concept(oc(obj).actorInRole[0].roleActor[0]());
			actor.actorExtend = oc(obj).actorInRole[0].extendActor[0]._text[0]();
			actor.actorAttribution = oc(obj).actorInRole[0].attributionQualifierActor[0]._text[0]();
		}
		return actor;
	}
}

export class LidoEvent
{
	displayEvent: LidoAppellation | undefined = undefined;
	eventID: string | undefined = undefined;
	eventType: LidoConcept | undefined = undefined;
	roleInEvent: LidoConcept | undefined = undefined;
	eventName: LidoAppellation | undefined = undefined;
	eventActor: LidoActor[] = [];
	eventCulture: LidoConcept | undefined = undefined;
	eventDate: LidoDate | undefined = undefined;
	eventPeriodName: LidoConcept | undefined = undefined;
	eventPlace: LidoPlace | undefined = undefined;
	eventMethod: LidoConcept | undefined = undefined;
	eventDescriptiveNoteID: string | undefined = undefined;
	eventDescriptiveNoteValue: string | undefined = undefined;
	
	// THING PRESENT AND MATERIALS TECH NOT SUPPORTED (REASON: IRRELEVANT, NOT DISPLAYED)
	// RELATED EVENTS NOT SUPPORTED, POSSIBILITY OF INFINITY LOOPS
	
	static event(obj:any) : LidoEvent | undefined
	{
		let event = new LidoEvent();
		if(obj != undefined)
		{
			event.displayEvent = LidoAppellation.appellation(oc(obj).displayEvent[0]());
			event.eventID = oc(obj).event[0].eventID[0]._text[0]();
			event.eventType = LidoConcept.concept(oc(obj).event[0].eventType[0]());
			event.roleInEvent = LidoConcept.concept(oc(obj).event[0].roleInEvent[0]());
			event.eventName = LidoAppellation.appellation(oc(obj).event[0].eventName[0]());
			event.eventCulture = LidoConcept.concept(oc(obj).event[0].eventCulture[0]());
			event.eventDate = LidoDate.date(oc(obj).event[0].eventDate[0]());
			event.eventPeriodName = LidoConcept.concept(oc(obj).event[0].periodName[0]());
			event.eventPlace = LidoPlace.place(oc(obj).event[0].eventPlace[0]());
			event.eventMethod = LidoConcept.concept(oc(obj).event[0].eventMethod[0]());
			event.eventDescriptiveNoteID = oc(obj).event[0].eventDescriptionSet[0].descriptiveNoteID[0]._text[0]();
			event.eventDescriptiveNoteValue = oc(obj).event[0].eventDescriptionSet[0].descriptiveNoteID[0]._text[0]();
			
			for(let o of oc(obj).event[0].eventActor([]))
				event.eventActor.push(LidoActor.actor(o));
		}
		return event;
	}
}
