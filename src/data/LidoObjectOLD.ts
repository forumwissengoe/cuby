import * as xml from 'xml2js';

export class LidoObject
{
	data:any = null;
	lidoString:string = null;
	
	// Currently supported elements
	recordID:string = "";
	objectPublishedID:string[] = [""];
	
	// Grunddaten
	title:string = "";
	location:string = "";
	collection:string = "";
	
	// Zitieren und Nachnutzen
	handleLink:string = "";
	
	// Klassifikationen, Taxonomien und Schlagworte
	category:[{conceptID:string, term:string}] = [{conceptID: "", term: ""}];
	objectWorkType:[{conceptID:string, term:string}] = [{conceptID: "", term: ""}];
	classification:[{type:string, term:string}] = [{type: "", term: ""}];
	
	// Beschreibung
	inscriptions:[{type: string, transcription:string, descriptionNote: string, descriptionID: string}] = [{type: "", transcription: "", descriptionID: "", descriptionNote: ""}];
	repository:[{legalBodyID:string, legalBodyName:string, legalBodyWeblink:string, locationName:string, position:string}] = [{legalBodyID: "", legalBodyName: "", legalBodyWeblink: "", locationName: "", position: "", }];
	state:string = "";
	edition:string = "";
	
	description:[{type:string, description:string}] = [{type: "", description: ""}];
	measurements:[{display:string, measure:LidoMeasuringObject[]}] = [{display: "", measure: []}];
	
	// Events
	events:[{display:string, conceptID:string, object:LidoEventObject}] = [{display: "", conceptID: "", object:null}];
	
	// Relations [not fully supported]
	subjectRelations:[{display:string, conceptID:string, term:string}] = [{display: "", conceptID: "", term: ""}];
	relatedWorks:[{display:string, reltypeID:string, reltypeTerm:string, id:string, note: string, webresouce:string}] = [{display: "", reltypeID: "", reltypeTerm: "", id: "", note: "", webresouce: ""}];
	
	
	constructor() {}
	
	loadLIDO(lidoData:string, cb:() => void)
	{
		this.lidoString = lidoData;
		
		lidoData = lidoData.replace(/lido:/g, "");
		lidoData = lidoData.replace(/gml:/g, "");
		
		new xml.Parser().parseString(lidoData, (error, result) => {
			this.data = result;
			this.loadData();
			
			for(let id of this.objectPublishedID)
				if(id.includes("handle"))
					this.handleLink = id;
				
			//console.log("DATA", this.data);
			cb();
		});
	}
	
	
	
	private loadData()
	{
		let x = null;
		
		try {
			if ((this.recordID = this.data.lido.lidoRecID[0]._) == undefined)
				this.recordID = '';
		} catch (e) {}
		//console.log("Record ID", this.recordID);
		
		try {
			for (let obj of this.data.lido.objectPublishedID) {
				try {
					if (obj._ != undefined)
						this.objectPublishedID.push(obj._);
				} catch (e) {}
			}
		} catch (e) {}
		if(this.objectPublishedID.length > 1) this.objectPublishedID.shift();
		//console.log("ObjectPublishedID", this.objectPublishedID);
		
		try {
			for (let obj of this.data.lido.category) {
				try {
					if (obj.conceptID[0]._ != undefined && obj.term[0]._ != undefined)
						this.category.push({conceptID: obj.conceptID[0]._, term: obj.term[0]._});
				} catch (e) {}
			}
		} catch (e) {}
		if(this.category.length > 1) this.category.shift();
		//console.log("Category", this.category);
		
		try {
			for (let obj of this.data.lido.descriptiveMetadata[0].objectClassificationWrap[0].objectWorkTypeWrap) {
				try {
					if (obj.objectWorkType[0].conceptID[0]._ != undefined && obj.objectWorkType[0].term[0] != undefined)
						this.objectWorkType.push({conceptID: obj.objectWorkType[0].conceptID[0]._, term: obj.objectWorkType[0].term[0]});
				} catch (e) {}
			}
		} catch (e) {}
		if(this.objectWorkType.length > 1) this.objectWorkType.shift();
		//console.log("ObjectWorkType", this.objectWorkType);
		
		try {
			for (let obj of this.data.lido.descriptiveMetadata[0].objectClassificationWrap[0].classificationWrap) {
				try {
					if (obj.classification[0].$.type != undefined && obj.classification[0].term[0] != undefined)
						this.classification.push({type: obj.classification[0].$.type, term: obj.classification[0].term[0]});
				} catch (e) {}
			}
		} catch (e) {}
		if(this.classification.length > 1) this.classification.shift();
		//console.log("Classification", this.classification);
		
		try {
			if ((this.title = this.data.lido.descriptiveMetadata[0].objectIdentificationWrap[0].titleWrap[0].titleSet[0].appellationValue[0]) == undefined)
				this.title = '';
			if (typeof this.title == "object" && !(this.title = this.data.lido.descriptiveMetadata[0].objectIdentificationWrap[0].titleWrap[0].titleSet[0].appellationValue[0]._))
				this.title = '';
		} catch (e) {}
		//console.log("Title", this.title);
		
		try {
			for (let obj of this.data.lido.descriptiveMetadata[0].objectIdentificationWrap[0].inscriptionsWrap[0].inscriptions) {
				x = {type: '', transcription: '', descriptionNote: '', descriptionID: ''};
				try {
					if (obj.$.type != undefined)
						x.type = obj.$.type;
				} catch (e) {}
				try {
					if (obj.inscriptionTranscription[0] != undefined)
						x.transcription = obj.inscriptionTranscription[0];
				} catch (e) {}
				try {
					if (obj.inscriptionDescription[0].descriptiveNoteValue != undefined)
						x.descriptionNote = obj.inscriptionDescription[0].descriptiveNoteValue;
				} catch (e) {}
				try {
					if (obj.inscriptionDescription[0].descriptiveID != undefined)
						x.descriptionID = obj.inscriptionDescription[0].descriptiveID;
				} catch (e) {}
				this.inscriptions.push(x);
			}
		} catch (e) {}
		if(this.inscriptions.length > 1) this.inscriptions.shift();
		//console.log("Inscriptions", this.inscriptions);
		
		try {
			for (let obj of this.data.lido.descriptiveMetadata[0].objectIdentificationWrap[0].repositoryWrap) {
				x = {legalBodyID: '', legalBodyName: '', legalBodyWeblink: '', locationName: '', position: ''};
				try {
					if (obj.repositorySet[0].repositoryName[0].legalBodyID[0]._ != undefined)
						x.legalBodyID = obj.repositorySet[0].repositoryName[0].legalBodyID[0]._;
				} catch (e) {}
				try {
					if (obj.repositorySet[0].repositoryName[0].legalBodyName[0].appellationValue[0] != undefined)
						x.legalBodyName = obj.repositorySet[0].repositoryName[0].legalBodyName[0].appellationValue[0];
				} catch (e) {}
				try {
					if (obj.repositorySet[0].repositoryName[0].legalBodyWeblink[0] != undefined)
						x.legalBodyWeblink = obj.repositorySet[0].repositoryName[0].legalBodyWeblink[0];
				} catch (e) {}
				try {
					if (obj.repositorySet[0].repositoryLocation[0].namePlaceSet[0].appellationValue[0] != undefined)
						x.locationName = obj.repositorySet[0].repositoryLocation[0].namePlaceSet[0].appellationValue[0];
				} catch (e) {}
				try {
					if (obj.repositorySet[0].repositoryLocation[0].gml[0].Point[0].pos[0] != undefined)
						x.position = obj.repositorySet[0].repositoryLocation[0].gml[0].Point[0].pos[0];
				} catch (e) {console.log("e4", e);}
				this.repository.push(x);
			}
		} catch (e) {
		}
		if(this.repository.length > 1) this.repository.shift();
		//console.log("Repository", this.repository);
		
		try {
			if ((this.state = this.data.lido.descriptiveMetadata[0].displayStateEditionWrap[0].displayState[0]) == undefined)
				this.state = '';
		} catch (e) {
		}
		
		try {
			if ((this.edition = this.data.lido.descriptiveMetadata[0].displayStateEditionWrap[0].displayEdition[0]) == undefined)
				this.edition = '';
		} catch (e) {
		}
		
		try {
			for (let obj of this.data.lido.descriptiveMetadata[0].objectIdentificationWrap[0].objectDescriptionWrap[0].objectDescriptionSet) {
				x = {type: '', description: ''};
				try {
					if (obj.$.type != undefined)
						x.type = obj.$.type;
				} catch (e) {}
				try {
					if (obj.descriptiveNoteValue[0] != undefined)
						x.description = obj.descriptiveNoteValue[0];
				} catch (e) {}
				this.description.push(x);
			}
		} catch (e) {}
		if(this.description.length > 1) this.description.shift();
		//console.log("Description", this.description);
		
		try {
			for (let obj of this.data.lido.descriptiveMetadata[0].objectIdentificationWrap[0].objectMeasurementsWrap[0].objectMeasurementsSet) {
				x = {display: '', measure: []};
				try {
					if (obj.displayObjectMeasurements[0] != undefined)
						x.display = obj.displayObjectMeasurements[0];
				} catch (e) {}
				try {
					if(obj.objectMeasurements[0] != undefined) {
						x.measure = LidoMeasuringObject.loadData(obj.objectMeasurements[0], 'de');
					}
				} catch (e) {}
				this.measurements.push(x);
			}
		} catch (e) {}
		if(this.measurements.length > 1) this.measurements.shift();
		//console.log("Measurements", this.measurements);
		
		try {
			for (let obj of this.data.lido.descriptiveMetadata[0].eventWrap[0].eventSet) {
				x = {display: '', conceptID: '', object: null};
				try {
					if (obj.event[0] != undefined) {
						x.object = LidoEventObject.loadData(LidoEventObject.compactify(obj.event[0]));
						x.conceptID = x.object.conceptID;
					}
				} catch (e) {
				}
				try {
					if (obj.displayEvent[0] != undefined)
						x.display = obj.displayEvent[0];
				} catch (e) {
				}
				this.events.push(x);
			}
		} catch (e) {
		}
		if(this.events.length > 1) this.events.shift();
		//console.log("Events", this.events);
		
		try {
			for (let obj of this.data.lido.descriptiveMetadata[0].objectRelationWrap[0].subjectWrap[0].subjectSet) {
				let x = {display: '', conceptID: '', term: ''};
				try {
					if (obj.displaySubject[0] != undefined)
						x.display = obj.displaySubject[0];
				} catch (e) {
				}
				try {
					if (obj.subject[0].subjectConcept[0].conceptID[0] != undefined)
						x.conceptID = obj.subject[0].subjectConcept[0].conceptID[0];
				} catch (e) {
				}
				try {
					if (obj.subject[0].subjectConcept[0].term[0] != undefined)
						x.term = obj.subject[0].subjectConcept[0].term[0];
				} catch (e) {
				}
				this.subjectRelations.push(x);
			}
		} catch (e) {
		}
		if(this.subjectRelations.length > 1) this.subjectRelations.shift();
		//console.log("Subject", this.subjectRelations);
		
		try {
			for (let obj of this.data.lido.descriptiveMetadata[0].objectRelationWrap[0].relatedWorksWrap[0].relatedWorkSet) {
				let x = {display: '', reltypeID: '', reltypeTerm: '', id: '', note: '', webresouce: ''};
				try {
					if (obj.relatedWork[0].displayObject[0] != undefined)
						x.display = obj.relatedWork[0].displayObject[0];
				} catch (e) {
				}
				try {
					if (obj.relatedWork[0].object[0].objectWebResource[0]._ != undefined)
						x.webresouce = obj.relatedWork[0].object[0].objectWebResource[0]._;
					else if (obj.relatedWork[0].object[0].objectWebResource[0] != undefined)
						x.webresouce = obj.relatedWork[0].object[0].objectWebResource[0];
				} catch (e) {
				}
				try {
					if (obj.relatedWork[0].object[0].objectID[0]._ != undefined)
						x.id = obj.relatedWork[0].object[0].objectID[0]._;
					else if (obj.relatedWork[0].object[0].objectID[0] != undefined)
						x.id = obj.relatedWork[0].object[0].objectID[0];
				} catch (e) {
				}
				try {
					if (obj.relatedWork[0].object[0].objectNote[0]._ != undefined)
						x.note = obj.relatedWork[0].object[0].objectNote[0]._;
					else if (obj.relatedWork[0].object[0].objectNote[0] != undefined)
						x.note = obj.relatedWork[0].object[0].objectNote[0];
				} catch (e) {
				}
				try {
					if (obj.relatedWorkRelType[0].conceptID[0]._ != undefined)
						x.reltypeID = obj.relatedWorkRelType[0].conceptID[0]._;
					else if (obj.relatedWorkRelType[0].conceptID[0] != undefined)
						x.reltypeID = obj.relatedWorkRelType[0].conceptID[0];
				} catch (e) {
				}
				try {
					if (obj.relatedWorkRelType[0].term[0]._ != undefined)
						x.reltypeTerm = obj.relatedWorkRelType[0].term[0]._;
					else if (obj.relatedWorkRelType[0].term[0] != undefined)
						x.reltypeTerm = obj.relatedWorkRelType[0].term[0];
				} catch (e) {
				}
				this.relatedWorks.push(x);
			}
		} catch (e) {
		}
		if(this.relatedWorks.length > 1) this.relatedWorks.shift();
		//console.log("Related", this.relatedWorks);
	}
}

export class LidoMeasuringObject
{
	language:string = "";
	type:string = "";
	unit:string = "";
	value:string = "";
	
	extend:string = "";
	qualifier:string = "";
	format:string = "";
	shape:string = "";
	scale:string = "";
	
	public static loadData(dataset:any, language:string)
	{
		let obj = new LidoMeasuringObject();
		obj.language = language;
		let second = new LidoMeasuringObject();
		let tmp = null;
		try {
			if ((tmp = dataset.measurementsSet[0].measurementType) != undefined) {
				for (let type of tmp) {
					try {
						if (type.$ == undefined || type.$['xml:lang'] == undefined)
							obj.type = type;
						else {
							if (second.language == type.$['xml:lang'] || second.language == '') {
								second.type = type._;
								second.language = type.$['xml:lang'];
							}
						}
					} catch (e) {}
				}
			}
		} catch (e) {}
		
		try {
			if ((tmp = dataset.measurementsSet[0].measurementUnit) != undefined) {
				for (let unit of tmp) {
					try {
						if (unit.$ == undefined || unit.$['xml:lang'] == undefined)
							obj.unit = unit;
						else {
							if (second.language == unit.$['xml:lang'] || second.language == '') {
								second.unit = unit._;
								second.language = unit.$['xml:lang'];
							}
						}
					} catch (e) {}
				}
			}
		} catch (e) {}
		
		try {
			if ((tmp = dataset.measurementsSet[0].measurementValue) != undefined) {
				for (let value of tmp) {
					try {
						if (value.$ == undefined || value.$['xml:lang'] == undefined)
							obj.value = value;
						else {
							if (second.language == value.$['xml:lang'] || second.language == '') {
								second.value = value._;
								second.language = value.$['xml:lang'];
							}
						}
					} catch (e) {
					}
				}
			}
		} catch (e) {
		}
		
		try {
			if (dataset.measurementsSet[0].extendMeasurements[0] != undefined)
				obj.extend = dataset.measurementsSet[0].extendMeasurements[0];
		} catch (e) {
		}
		
		try {
			if (dataset.measurementsSet[0].qualifierMeasurements[0] != undefined)
				obj.qualifier = dataset.measurementsSet[0].qualifierMeasurements[0];
		} catch (e) {
		}
		
		try {
			if (dataset.measurementsSet[0].formatMeasurements[0] != undefined)
				obj.format = dataset.measurementsSet[0].formatMeasurements[0];
		} catch (e) {
		}
		
		try {
			if (dataset.measurementsSet[0].shapeMeasurements[0] != undefined)
				obj.shape = dataset.measurementsSet[0].shapeMeasurements[0];
		} catch (e) {
		}
		
		try {
			if (dataset.measurementsSet[0].scaleMeasurements[0] != undefined)
				obj.scale = dataset.measurementsSet[0].scaleMeasurements[0];
		} catch (e) {
		}
		
		return [obj, second];
	}
}

export class LidoEventObject
{
	conceptID:string = "";
	eventID:string = "";
	eventTerm:string = "";
	roleInEvent_ID:string = "";
	roleInEvent_term:string = "";
	eventName:string = "";
	
	eventActor: [{
		displayActor: string,
		actorInRole: {
			actorID: string,
			actorName: string,
			actorNationality: string,
			actorVitalDates: string,
			actorGender: string,
			actorRoleID: string,
			actorRoleName: string,
		},
		extend: string,
		attribution: string
	}] = [{displayActor: "", actorInRole: {actorID: "", actorName: "", actorNationality: "", actorVitalDates: "", actorGender: "", actorRoleID: "", actorRoleName: ""}, extend: "", attribution: ""}];
	
	cultureID: string = "";
	cultureTerm: string = "";
	
	eventDateDisplay: string = "";
	eventDateEarlies: string = "";
	eventDateLatest: string = "";
	periodID: string = "";
	periodTerm: string = "";
	
	placeDisplay: string = "";
	placeName: string = "";
	placePoint: string = "";
	placeClassificationID: string = "";
	placeClassificationName: string = "";
	
	methodID: string = "";
	methodName: string = "";
	
	materials:[{
		display: string,
		conceptID: string,
		term: string,
		extend: string
	}] = [{display: "", conceptID: "", term: "", extend: ""}];
	
	thingPresent: [{
		display: string,
		webresource: string,
		id: string,
		note: string
	}] = [{display: "", webresource: "", id: "", note: ""}];
	
	// NOTE:  NOT SUPPORTED, POSSIBILITY OF INFINITE LOOPS
	relatedEvent:LidoEventObject[] = [];
	
	description:string[] = [];
	
	public static loadData(dataset:any)
	{
		let obj = new LidoEventObject();
		try {
			if (dataset.eventID[0] != undefined)
				obj.eventID = dataset.eventID[0];
		} catch (e) {
		}
		
		try {
			if (dataset.eventType[0].conceptID[0] != undefined)
				obj.conceptID = dataset.eventType[0].conceptID[0];
		} catch (e) {
		}
		
		try {
			for (let tmp of dataset.eventType[0].term)
			{
				if (tmp.$ == undefined || tmp.$['xml:lang'] == undefined)
					obj.eventTerm = tmp;
			}
		} catch(e) {}
		
		try {
			if (dataset.roleInEvent[0].conceptID[0] != undefined)
				obj.roleInEvent_ID = dataset.roleInEvent[0].conceptID[0];
		} catch (e) {
		}
		
		try {
			if (dataset.roleInEvent[0].term[0] != undefined)
				obj.roleInEvent_term = dataset.roleInEvent[0].term[0];
		} catch (e) {
		}
		
		try {
			if (dataset.eventName[0].appellationValue[0] != undefined)
				obj.eventName = dataset.eventName[0].appellationValue[0];
		} catch (e) {
		}
		
		try {
			for (let tmp of dataset.eventActor) {
				let x = {displayActor: '',
					actorInRole: {
						actorID: '',
						actorName: '',
						actorNationality: '',
						actorVitalDates: '',
						actorGender: '',
						actorRoleID: '',
						actorRoleName: ''
					},
					extend: '',
					attribution: ''
				};
				try {
					if (tmp.displayActorInRole[0] != undefined)
						x.displayActor = tmp.displayActorInRole[0];
				} catch (e) {
				}
				
				try {
					if (tmp.actorInRole[0].actor[0].actorID[0] != undefined)
						x.actorInRole.actorID = tmp.actorInRole[0].actor[0].actorID[0];
				} catch (e) {
				}
				
				try {
					if (tmp.actorInRole[0].actor[0].nameActorSet[0].appellationValue[0] != undefined)
						x.actorInRole.actorName = tmp.actorInRole[0].actor[0].nameActorSet[0].appellationValue[0];
				} catch (e) {
				}
				
				try {
					if (tmp.actorInRole[0].actor[0].nationalityActor[0].term[0] != undefined)
						x.actorInRole.actorNationality = tmp.actorInRole[0].actor[0].nationalityActor[0].term[0];
				} catch (e) {
				}
				
				try {
					if (tmp.actorInRole[0].actor[0].genderActor[0] != undefined)
						x.actorInRole.actorGender = tmp.actorInRole[0].actor[0].genderActor[0];
				} catch (e) {
				}
				
				try {
					if (tmp.actorInRole[0].actor[0].vitalDatesActor[0] != undefined)
						x.actorInRole.actorVitalDates = tmp.actorInRole[0].actor[0].vitalDatesActor[0];
				} catch (e) {
				}
				
				try {
					if (tmp.actorInRole[0].roleActor[0].conceptID[0] != undefined)
						x.actorInRole.actorRoleID = tmp.actorInRole[0].roleActor[0].conceptID[0];
				} catch (e) {
				}
				
				try {
					if (tmp.actorInRole[0].roleActor[0].term[0] != undefined)
						x.actorInRole.actorRoleName = tmp.actorRole[0].roleActor[0].term[0];
				} catch (e) {
				}
				
				try {
					if (tmp.extentActor[0] != undefined)
						x.extend = tmp.extentActor[0];
				} catch (e) {
				}
				
				try {
					if (tmp.attributionQualifierActor[0] != undefined)
						x.attribution = tmp.attributionQualifierActor[0];
				} catch (e) {
				}
				
				obj.eventActor.push(x);
			}
		} catch (e) {
		}
		if(obj.eventActor.length > 1) obj.eventActor.shift();
		
		try {
			if (dataset.culture[0].conceptID[0] != undefined)
				obj.cultureID = dataset.culture[0].conceptID[0];
		} catch (e) {
		}
		
		try {
			if (dataset.culture[0].term[0] != undefined)
				obj.cultureTerm = dataset.culture[0].term[0];
		} catch (e) {
		}
		
		try {
			if (dataset.eventDate[0].displayDate[0] != undefined)
				obj.eventDateDisplay = dataset.eventDate[0].displayDate[0];
		} catch (e) {
		}
		
		try {
			if (dataset.date[0].earliestDate[0] != undefined)
				obj.eventDateEarlies = dataset.date[0].earliestDate[0];
		} catch (e) {
		}
		
		try {
			if (dataset.date[0].latestDate[0] != undefined)
				obj.eventDateLatest = dataset.date[0].latestDate[0];
		} catch (e) {
		}
		
		try {
			if (dataset.periodName[0].conceptID[0] != undefined)
				obj.periodID = dataset.periodName[0].conceptID[0];
		} catch (e) {
		}
		
		try {
			if (dataset.periodName[0].term[0] != undefined)
				obj.periodTerm = dataset.periodName[0].term[0];
		} catch (e) {
		}
		
		try {
			if (dataset.eventPlace[0].displayPlace[0] != undefined)
				obj.placeDisplay = dataset.eventPlace[0].displayPlace[0];
		} catch (e) {
		}
		
		try {
			if (dataset.eventPlace[0].place[0].namePlaceSet[0].appellationValue[0] != undefined)
				obj.placeName = dataset.eventPlace[0].place[0].namePlaceSet[0].appellationValue[0];
		} catch (e) {
		}
		
		try {
			if (dataset.eventPlace[0].placeClassification[0].conceptID[0] != undefined)
				obj.placeClassificationID = dataset.eventPlace[0].placeClassification[0].conceptID[0];
		} catch (e) {
		}
		
		try {
			if (dataset.eventPlace[0].placeClassification[0].term[0] != undefined)
				obj.placeClassificationName = dataset.eventPlace[0].placeClassification[0].term[0];
		} catch (e) {
		}
		
		try {
			if (dataset.eventPlace[0].gml[0].Point[0].pos[0] != undefined)
				obj.placePoint = dataset.eventPlace[0].gml[0].Point[0].pos[0];
		} catch (e) {
		}
		
		try {
			if (dataset.eventMethod[0].conceptID[0] != undefined)
				obj.methodID = dataset.eventMethod[0].conceptID[0];
		} catch (e) {
		}
		
		try {
			if (dataset.eventMethod[0].term[0] != undefined)
				obj.methodName = dataset.eventMethod[0].term[0];
		} catch (e) {
		}
		
		try {
			for (let tmp of dataset.eventMaterialsTech) {
				let x = {display: '', conceptID: '', term: '', extend: ''};
				try {
					if (tmp.displayMaterialsTech[0] != undefined)
						x.display = tmp.displayMaterialsTech[0];
				} catch (e) {
				}
				
				try {
					if (tmp.materialsTech[0].termMaterialsTech[0].conceptID[0] != undefined)
						x.conceptID = tmp.materialsTech[0].termMaterialsTech[0].conceptID[0];
				} catch (e) {
				}
				
				try {
					if (tmp.materialsTech[0].termMaterialsTech[0].term[0] != undefined)
						x.term = tmp.materialsTech[0].termMaterialsTech[0].term[0];
				} catch (e) {
				}
				
				try {
					if (tmp.materialsTech[0].extentMaterialsTech[0] != undefined)
						x.extend = tmp.materialsTech[0].extentMaterialsTech[0];
				} catch (e) {
				}
				
				obj.materials.push(x);
			}
		} catch (e) {
		}
		if(obj.materials.length > 1) obj.materials.shift();
		
		try {
			for (let tmp of dataset.thingPresent) {
				let x = {display: '', webresource: '', id: '', note: ''};
				try {
					if (tmp.displayObject[0] != undefined)
						x.display = tmp.displayObject[0];
				} catch (e) {
				}
				
				try {
					if (tmp.object[0].objectWebResource[0] != undefined)
						x.webresource = tmp.object[0].objectWebResource[0];
				} catch (e) {
				}
				
				try {
					if (tmp.object[0].objectID[0] != undefined)
						x.id = tmp.object[0].objectID[0];
				} catch (e) {
				}
				
				try {
					if (tmp.object[0].objectNote[0] != undefined)
						x.note = tmp.object[0].objectNote[0];
				} catch (e) {
				}
				obj.thingPresent.push(x);
			}
		} catch (e) {
		}
		if(obj.thingPresent.length > 1) obj.thingPresent.shift();
		
		try {
			for (let tmp of dataset.eventDescriptionSet) {
				try {
					if (tmp.descriptiveNoteValue[0] != undefined)
						obj.description.push(tmp.descriptiveNoteValue[0]);
				} catch (e) {
				}
			}
		} catch (e) {
		}
		if(obj.description.length > 1) obj.description.shift();
		
		return obj;
	}
	
	public static compactify(dataset)
	{
		var keys = Object.keys(dataset);
		for(let key of keys)
		{
			if(typeof dataset[key] === 'object')
			{
				if(!Array.isArray(dataset[key]))
				{
					dataset[key] = [dataset[key]];
				}
				for(let i = 0; i < dataset[key].length; i++)
				{
					if(dataset[key][i].hasOwnProperty("_"))
					{
						dataset[key][i] = dataset[key][i]["_"];
					}
					if(typeof dataset[key][i] === 'object')
						dataset[key][i] = this.compactify(dataset[key][i]);
				}
			}
		}
		return dataset;
	}
}
