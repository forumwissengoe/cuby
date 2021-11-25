import { Injectable } from '@angular/core';
import { DataLoader } from '../../data/DataLoader';
import { IiiFObject } from '../../data/IiiFObject';
import {StorageService} from '../storage.service';
import {LidoAppellation, LidoConcept, LidoObject} from '../../data/LidoObject';

@Injectable({
	providedIn: 'root'
})
export class CuryControllerService {
	
	constructor(private storageService:StorageService)
	{
		DataLoader.loadDetailsConfigFile(this.storageService).then((config) => this.detailConfig = config);
		DataLoader.loadFeedbackConfigFile(this.storageService).then((config) => this.feedbackConfig = config);
	}
	
	// PART: CURY
	public static NUMBER_ELEMENTS:number = 8;
	curyImages:IiiFObject[] = [];
	curyLoadingFinishedCallback:(failed:boolean) => void = null;
	curyCurrentlyLoading:boolean = false;
	
	setCuryLoadingFinishedCallback(cb:(failed:boolean) => void)
	{
		this.curyLoadingFinishedCallback = cb;
	}
	
	initialLoad()
	{
		this.curyCurrentlyLoading = true;
		this.curyImages = [];
		//let records = this.storageService.localState.curyStack;
		//let count = records.length;
		
		this.storageService.localState.curyStack = [];
		DataLoader.requestCuryImages(this.storageService, this.storageService.configuration.cury_url, CuryControllerService.NUMBER_ELEMENTS)
			.then( (images:IiiFObject[]) => {
				for(let img of images)
					this.curyImages.push(img);
				this.curyCurrentlyLoading = false;
				if(this.curyLoadingFinishedCallback)
					this.curyLoadingFinishedCallback(false);
			}).catch(() => {
				if(this.curyLoadingFinishedCallback)
					this.curyLoadingFinishedCallback(true);
			});
	}
	
	loadNewImages(number:number)
	{
		DataLoader.requestCuryImages(this.storageService, this.storageService.configuration.cury_url, number)
			.then((imgs:IiiFObject[]) => {
				for(let img of imgs)
					this.curyImages.push(img);
				
				if(this.curyLoadingFinishedCallback != null)
					this.curyLoadingFinishedCallback(false);
			});
	}
	
	
	// PART: DETAIL
	detailEntries:DetailsObject[] = [];
	
	detailLoadingFinishedCallback:(errorCode:number) => void;
	detailCount:number = 0;
	
	detailConfig:any = null;
	
	clearEntries() {
		this.detailEntries = [];
	}
	
	setDetailLoadingFinishedCallback(cb:(errorCode) => void) {
		this.detailLoadingFinishedCallback = cb;
	}
	
	loadDetailRecordList(records:{record: string, feedback: boolean}[])
	{
		let size = records.length;
		for(let record of records)
			DataLoader.downloadManifest(this.storageService, record.record)
				.then((iiiFObject:IiiFObject) =>
				{
					console.log("Before download lido");
					DataLoader.downloadLIDO(this.storageService, iiiFObject.record_id)
						.then((lidoObject:LidoObject) =>
						{
							let detailsObject = new DetailsObject();
							console.log("Before download details object");
							detailsObject.load(lidoObject, iiiFObject, this.detailConfig, this.feedbackConfig, this.storageService, this.storageService.configuration.viewHeight * 0.4);
							detailsObject.selected = record.feedback;
							this.detailEntries.push(detailsObject);
							console.log("After download details object");
							
							this.detailCount++;
							if(this.detailCount >= size && this.detailLoadingFinishedCallback)
								this.detailLoadingFinishedCallback(null);
						})
						.catch((error) => {
							console.error("DETAILS: ERROR while downloading Lido", error);
							if(this.detailLoadingFinishedCallback)
								this.detailLoadingFinishedCallback(error);
						});
				})
				.catch((error) => {
					console.error("ERROR while downloading IiiF", error);
					if(this.detailLoadingFinishedCallback)
						this.detailLoadingFinishedCallback(error);
				});
	}
	
	detailDummyRecords:{record: string, feedback: boolean}[] = [
		{record: "record_kuniweb_945664", feedback: false},
		{record: "record_kuniweb_666297", feedback: false},
		{record: "record_kuniweb_943917", feedback: false},
		{record: "record_kuniweb_681925", feedback: false},
		{record: "record_kuniweb_854325", feedback: false}
	];
	
	loadDetailDummyList()
	{
		console.log("Load dummy list");
		this.loadDetailRecordList(this.detailDummyRecords);
	}
	
	
	// PART: FEEDBACK
	feedbackConfig:any = null;
	/*feedbackDisplayData:FeedbackObject[] = [];
	feedbackIndex:number = 0;
	
	feedbackLoadingFinishedCallback:(error:number) => void = null;
	feedbackSize:number = 0;
	feedbackCount:number = 0;
	
	loadFeedbackRecordList(records:string[])
	{
		this.feedbackDisplayData = [];
		this.feedbackSize = records.length;
		this.feedbackCount = 0;
		this.feedbackIndex = 0;
		for(let record of records)
			DataLoader.downloadManifest(this.storageService, record)
				.then((iiif:IiiFObject) =>
				{
					DataLoader.downloadLIDO(this.storageService, iiif.record_id)
						.then((lido:LidoObject) =>
						{
							let object = new FeedbackObject();
							object.load(lido, iiif, this.feedbackConfig, this.storageService, this.storageService.configuration.viewHeight * 0.3);
							this.feedbackDisplayData.push(object);
							
							this.feedbackCount++;
							if(this.feedbackCount >= this.feedbackSize && this.feedbackLoadingFinishedCallback != null)
								this.feedbackLoadingFinishedCallback(null);
							
						})
						.catch((error) => {
							if(this.feedbackLoadingFinishedCallback)
								this.feedbackLoadingFinishedCallback(error);
							console.log("ERROR while downloading", error);
						});
				})
				.catch((error) => {
					if(this.feedbackLoadingFinishedCallback)
						this.feedbackLoadingFinishedCallback(error);
					console.log("ERROR while downloading", error);
				});
	}
	
	setFeedbackLoadingFinishedCallback(cb:(error:number) => void)
	{
		this.feedbackLoadingFinishedCallback = cb;
	}
	
	dummy_records:string[] = ["record_kuniweb_945664"];
	
	loadFeedbackDummyList()
	{
		this.loadFeedbackRecordList(this.dummy_records);
	}
	
	next()
	{
		if(this.feedbackIndex+1 >= this.feedbackDisplayData.length)
			return -1;
		else
			return ++this.feedbackIndex;
	}*/
}


export class DetailsObject
{
	record:string = "";
	lidoObj:LidoObject = null;
	iiifObj:IiiFObject = null;
	
	name:string = "";
	thumbnail:string = "";
	image_service:any[] = null;
	like:boolean = null;
	
	selected:boolean = false;
	feedbackObject:FeedbackObject = null;
	
	entries:any[] = [];
	
	load(lido: LidoObject, iiif: IiiFObject, detailsConfig: any, feedbackConfig: any, storageService: StorageService, height: number)
	{
		this.name = iiif.label;
		if((this.thumbnail = storageService.loadLocalImage(iiif.record_id, undefined, height)) == null)
		{
			this.thumbnail = iiif.getThumbnailForAttributes(undefined, height);
			storageService.saveLocalImage(iiif.record_id, this.thumbnail, undefined, height);
		}
		this.image_service = iiif.getImageService();
		this.record = iiif.record_id;
		
		this.lidoObj = lido;
		this.iiifObj = iiif;
		
		this.feedbackObject = new FeedbackObject().load(lido, iiif, feedbackConfig, storageService, height);
		
		if(detailsConfig != null)
		{
			for(let con of detailsConfig.reverse())
			{
				if(con.pattern != undefined && con.config != undefined && DetailsObject.testPattern(lido, iiif, con.pattern))
				{
					for(let s of con.config)
					{
						let x = {label: null, value: null};
						x.label = DetailsObject.getVariable(lido, iiif, s.title);
						x.value = DetailsObject.getVariable(lido, iiif, s.data);
						if(s.pattern == undefined)
						{
							this.entries.push({label: DetailsObject.atos(x.label), value: DetailsObject.atos(x.value)});
							continue;
						}
						
						let b = DetailsObject.testPattern(lido, iiif, s.pattern, x.label, x.value);
						
						if(typeof b == 'number' && b != -1)
							if(Array.isArray(x.value))
								this.entries.push({label: DetailsObject.atos(x.label), value: x.value[b]});
							else if(Array.isArray(x.label))
								this.entries.push({label: x.label[b], value: DetailsObject.atos(x.value)});
							else
								this.entries.push({label: DetailsObject.atos(x.label), value: DetailsObject.atos(x.value)});
						
						else if(typeof b == 'boolean' && b)
							this.entries.push({label: DetailsObject.atos(x.label), value: DetailsObject.atos(x.value)});
					}
					break;
				}
			}
		}
		return this;
	}
	
	static getVariable(lido:LidoObject, iiif:IiiFObject, str:string):string | string[]
	{
		if(str[0] != '/')
			return str;
		
		let data;
		if(str[1] == "i" || str[1] == "I")
			data = iiif;
		else
			data = lido;
		
		let split = str.substring(3).split('/');
		let res;
		if(split.indexOf("[]") != -1)
		{
			let tmp = data;
			let index;
			for(let index = 0; index < split.indexOf("[]"); index++)
				tmp = tmp[split[index]];
			
			let result:any[] = Array(tmp.length);
			for(let i = 0; i < result.length; i++)
				result[i] = data;
			
			for(let sp of split)
			{
				for(let i = 0; i <  result.length; i++)
				{
					if(sp != "[]")
					{
						result[i] = result[i][sp];
						if(result[i] == undefined) result[i] = null;
					}
					else {
						result[i] = result[i][i];
					}
				}
			}
			return result;
		}
		for(let sp of split)
			if(data[sp] != undefined)
				data = data[sp];
			else
				return null;
		
		if(data instanceof LidoAppellation)
			res = data.get();
		else if(data instanceof LidoConcept)
			res = data.getTerm();
		else
			res = data;
		return res;
	}
	
	static testPattern(lido:LidoObject, iiif:IiiFObject, pattern:string, title?:string, data?:string)
	{
		let _flag = pattern.substring(pattern.lastIndexOf("/")+1);
		pattern = pattern.substr(0, pattern.length -2);
		let _location = pattern.substring(1, 2);
		pattern = pattern.substring(2);
		let _regex = pattern.substring(pattern.indexOf("|") +1);
		pattern = pattern.substring(0, pattern.indexOf("|"));
		let _variable = pattern;
		
		let variable;
		if(title != undefined && (_location == "t" || _location == "T"))
			variable = title;
		if(data != undefined && (_location == "d" || _location == "D"))
			variable = data;
		else
			variable = DetailsObject.getVariable(lido, iiif, "/" + _location + _variable);
		
		if(!Array.isArray(variable))
			return new RegExp(_regex, _flag).test(variable);
		
		for(let i = 0; i < variable.length; i++)
			if(new RegExp(_regex, _flag).test(variable[i]))
				return i;
		return false;
	}
	
	static atos(arr:any):string
	{
		if(Array.isArray(arr))
			return String(arr[0]);
		else
			return String(arr);
	}
}

export class FeedbackObject
{
	record:string = "";
	lidoObj:LidoObject = null;
	iiifObj:IiiFObject = null;
	
	name:string = "";
	thumbnail:string = "";
	image_service:any[] = null;
	check:boolean = false;
	imageChecked:boolean = false;
	comment:string = "";
	
	entries:{label:string, value:string, check:boolean}[] = [];
	
	load(lido: LidoObject, iiif: IiiFObject, config: any, storageService: StorageService, height: number)
	{
		this.name = iiif.label;
		this.record = iiif.record_id;
		if((this.thumbnail = storageService.loadLocalImage(iiif.record_id, undefined, height)) == null)
		{
			this.thumbnail = iiif.getThumbnailForAttributes(undefined, height);
			storageService.saveLocalImage(iiif.record_id, this.thumbnail, undefined, height);
		}
		this.image_service = iiif.getImageService();
		
		this.lidoObj = lido;
		this.iiifObj = iiif;
		
		if(config != null)
		{
			for(let con of config.reverse())
			{
				if(con.pattern != undefined && con.config != undefined && FeedbackObject.testPattern(lido, iiif, con.pattern))
				{
					for(let s of con.config)
					{
						let x = {label: null, value: null};
						x.label = FeedbackObject.getVariable(lido, iiif, s.title);
						x.value = FeedbackObject.getVariable(lido, iiif, s.data);
						if(s.pattern == undefined)
						{
							this.entries.push({label: FeedbackObject.atos(x.label), value: FeedbackObject.atos(x.value), check: false});
							continue;
						}
						
						let b = FeedbackObject.testPattern(lido, iiif, s.pattern, x.label, x.value);
						
						if(typeof b == 'number' && b != -1)
							if(Array.isArray(x.value))
								this.entries.push({label: FeedbackObject.atos(x.label), value: x.value[b], check: false});
							else if(Array.isArray(x.label))
								this.entries.push({label: x.label[b], value: FeedbackObject.atos(x.value), check: false});
							else
								this.entries.push({label: FeedbackObject.atos(x.label), value: FeedbackObject.atos(x.value), check: false});
						
						else if(typeof b == 'boolean' && b)
							this.entries.push({label: FeedbackObject.atos(x.label), value: FeedbackObject.atos(x.value), check: false});
					}
					break;
				}
			}
		}
		return this;
	}
	
	static getVariable(lido:LidoObject, iiif:IiiFObject, str:string):string | string[]
	{
		if(str[0] != '/')
			return str;
		
		let data;
		if(str[1] == "i" || str[1] == "I")
			data = iiif;
		else
			data = lido;
		
		let split = str.substring(3).split('/');
		if(split.indexOf("[]") != -1)
		{
			let tmp = data;
			let index;
			for(let index = 0; index < split.indexOf("[]"); index++)
				tmp = tmp[split[index]];
			
			let result:any[] = Array(tmp.length);
			for(let i = 0; i < result.length; i++)
				result[i] = data;
			
			for(let sp of split)
			{
				for(let i = 0; i <  result.length; i++)
				{
					if(sp != "[]")
					{
						result[i] = result[i][sp];
						if(result[i] == undefined) result[i] = null;
					}
					else {
						result[i] = result[i][i];
					}
				}
			}
			return result;
		}
		for(let sp of split)
		{
			if(data[sp] != undefined)
			{
				data = data[sp];
			}
			else
			{
				return null;
			}
		}
		let res:string = "";
		if(data instanceof LidoAppellation)
			res = data.get();
		else if(data instanceof LidoConcept)
			res = data.getTerm();
		else
			res = data;
		
		return res;
	}
	
	static testPattern(lido:LidoObject, iiif:IiiFObject, pattern:string, title?:string, data?:string)
	{
		let _flag = pattern.substring(pattern.lastIndexOf("/")+1);
		pattern = pattern.substr(0, pattern.length -2);
		let _location = pattern.substring(1, 2);
		pattern = pattern.substring(2);
		let _regex = pattern.substring(pattern.indexOf("|") +1);
		pattern = pattern.substring(0, pattern.indexOf("|"));
		let _variable = pattern;
		
		let variable;
		if(title != undefined && (_location == "t" || _location == "T"))
			variable = title;
		if(data != undefined && (_location == "d" || _location == "D"))
			variable = data;
		else
			variable = FeedbackObject.getVariable(lido, iiif, "/" + _location + _variable);
		
		if(!Array.isArray(variable))
			return new RegExp(_regex, _flag).test(variable);
		
		for(let i = 0; i < variable.length; i++)
			if(new RegExp(_regex, _flag).test(variable[i]))
				return i;
		return false;
	}
	
	static atos(arr:any):string
	{
		if(Array.isArray(arr))
			return String(arr[0]);
		else
			return String(arr);
	}
}
