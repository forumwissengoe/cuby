import { Injectable } from '@angular/core';
import {DataLoader} from '../../../data/DataLoader';
import {IiiFObject} from '../../../data/IiiFObject';
import {LidoObject} from '../../../data/LidoObject';
import {StorageService} from '../../storage.service';

@Injectable({
	providedIn: 'root'
})
export class FeedbackController
{
	displayData:FeedbackObject[] = [];
	index:number = 0;
	
	loadingFinishedCallback:() => void = null;
	size:number = 0;
	count:number = 0;
	config:any = null;
	
	error_recieved:boolean = false;
	error_code:number = 0;
	
	constructor(private storageService:StorageService)
	{
		DataLoader.loadFeedbackConfigFile(this.storageService).then(config => this.config = config );
	}
	
	loadRecordList(records:string[])
	{
		this.displayData = [];
		this.size = records.length;
		this.count = 0;
		this.index = 0;
		for(let record of records)
			DataLoader.downloadManifest(this.storageService, record)
				.then((iiif:IiiFObject) =>
				{
					DataLoader.downloadLIDO(this.storageService, iiif.record_id)
						.then((lido:LidoObject) =>
						{
							let object = new FeedbackObject();
							object.load(lido, iiif, this.config, this.storageService, this.storageService.configuration.viewHeight * 0.3);
							this.displayData.push(object);
							
							this.count++;
							if(this.count >= this.size && this.loadingFinishedCallback != null)
								this.loadingFinishedCallback();
							
						})
						.catch((error) => {
							this.error_recieved = true;
							this.error_code = error;
							console.log("ERROR while downloading", error);
						});
				})
				.catch((error) => {
					this.error_recieved = true;
					this.error_code = error;
					console.log("ERROR while downloading", error);
				});
	}
	
	setLoadingFinishedCallback(cb:() => void)
	{
		this.loadingFinishedCallback = cb;
	}
	
	dummy_records:string[] = ["record_kuniweb_945664"];
	
	loadDummyList()
	{
		console.log("Load dummy list");
		this.loadRecordList(this.dummy_records);
	}
	
	next()
	{
		if(this.index+1 >= this.displayData.length)
			return -1;
		else
			return ++this.index;
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
	
	entries:any[] = [];
	
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
							this.entries.push({label: FeedbackObject.atos(x.label), value: FeedbackObject.atos(x.value)});
							continue;
						}
						
						let b = FeedbackObject.testPattern(lido, iiif, s.pattern, x.label, x.value);
						
						if(typeof b == 'number' && b != -1)
							if(Array.isArray(x.value))
								this.entries.push({label: FeedbackObject.atos(x.label), value: x.value[b]});
							else if(Array.isArray(x.label))
								this.entries.push({label: x.label[b], value: FeedbackObject.atos(x.value)});
							else
								this.entries.push({label: FeedbackObject.atos(x.label), value: FeedbackObject.atos(x.value)});
						
						else if(typeof b == 'boolean' && b)
							this.entries.push({label: FeedbackObject.atos(x.label), value: FeedbackObject.atos(x.value)});
					}
					break;
				}
			}
		}
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
		return String(data);
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
