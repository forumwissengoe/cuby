import { Injectable } from '@angular/core';
import {IiiFObject} from '../../data/IiiFObject';
import {DataLoader} from '../../data/DataLoader';
import {LidoAppellation, LidoConcept, LidoObject} from '../../data/LidoObject';
import {StorageService} from '../storage.service';
import {log, watch} from '../../data/AOPFunctions';

@Injectable({
	providedIn: 'root'
})
export class PicyController {
	
	index:number = 0;
	
	dataset:PicyObject[] = [];
	gallery:IiiFObject[] = [];
	menuEntries = [];
	records:string[] = ["record_kuniweb_945664", "record_kuniweb_666297", "record_kuniweb_943917", "record_kuniweb_681925", "record_kuniweb_854325"];
	error_recieved:boolean = false;
	error_code:number = null;
	
	config:any = null;
	
	loadingFinishedCallback:() => void;
	galleryLoadingFinishedCallback:() => void;
	count:number = 0;
	
	constructor(private storageService:StorageService)
	{
		DataLoader.loadPicyConfigFile(this.storageService).then((config:any) => this.config = config);
	}
	
	loadGallery()
	{
		let galleryRecords = this.storageService.localState.picyGallery;
		this.gallery = [];
		if(galleryRecords.length == 0)
		{
			this.index = -1;
			if(this.loadingFinishedCallback)
				this.loadingFinishedCallback();
			if(this.galleryLoadingFinishedCallback)
				this.galleryLoadingFinishedCallback();
			return;
		}
		
		DataLoader.loadGallery(this.storageService, galleryRecords).then((value:{iiif:IiiFObject[], error:number[]}) => {
			for(let iiif of value.iiif)
			{
				this.gallery.push(iiif);
				
				let data:PicyObject = new PicyObject();
				data.set(iiif.label, iiif.getThumbnailImageUrl(), iiif.getImageService(), iiif.attribution, iiif.record_id);
				DataLoader.downloadLIDO(this.storageService, iiif.record_id).then((lidoObject:LidoObject) => {
					
					if(this.config != null)
						data.load(lidoObject, iiif, this.config, this.storageService, this.storageService.configuration.viewHeight);
					else
						console.log("Config is null");
					
					this.dataset.push(data);
					this.index = 0;
					
					if(this.loadingFinishedCallback)
						this.loadingFinishedCallback();
					
				}).catch((error) => {
					this.error_recieved = true;
					this.error_code = error;
					console.log("ERROR while downloading", error);
				});
			}
			
			this.buildGallery();
			
			if(this.galleryLoadingFinishedCallback != null)
				this.galleryLoadingFinishedCallback();
			
		});
	}
	
	buildGallery()
	{
		let data = [];
		let tmp = [];
		for(let i = 0; i < this.gallery.length; i++)
		{
			let img;
			if((img = this.storageService.loadLocalImage(this.gallery[i].record_id, this.storageService.configuration.viewWidth * 0.2, undefined, undefined, undefined, "square")) == null)
			{
				img = this.gallery[i].getThumbnailForAttributes(this.storageService.configuration.viewWidth * 0.2, undefined, undefined, undefined, "square");
				this.storageService.saveLocalImage(this.gallery[i].record_id, img, this.storageService.configuration.viewWidth * 0.2, undefined, undefined, undefined, "square");
			}
			tmp[i % 4] = {img: img,	record: this.gallery[i].record_id};
			if(i % 4 == 3)
			{
				data.push(tmp);
				tmp = [];
			}
		}
		if(tmp != [])
			data.push(tmp);
		
		console.log("Gallery", data);
		this.menuEntries = data;
	}
	
	setLoadingFinishedCallback(cb:() => void)
	{
		this.loadingFinishedCallback = cb;
	}
	
	setGalleryLoadingFinishedCallback(cb:() => void)
	{
		this.galleryLoadingFinishedCallback = cb;
	}
	
	gallerySelectAll()
	{
		this.gallery = [];
		for(let element of this.dataset)
			this.gallery.push(element.iiif);
		this.buildGallery();
	}
	
	gallerySelectPlace()
	{
		this.gallery = [];
		for(let element of this.dataset)
			if(element.hasPlace)
				this.gallery.push(element.iiif);
		this.buildGallery();
	}
	
	gallerySelectTime()
	{
		this.gallery = [];
		for(let element of this.dataset)
			if(element.hasTime)
				this.gallery.push(element.iiif);
		this.buildGallery();
	}
	
	getInitIndex():number
	{
		return this.index;
	}
	
	getNextIndex():number
	{
		this.index++;
		if(this.index > this.dataset.length -1)
			this.index = this.dataset.length -1;
		return this.index;

	}
	
	getPreviousIndex():number
	{
		this.index--;
		if(this.index < 0)
			this.index = 0;
		return this.index;
	}
	
	getIndexForRecord(record:string):number
	{
		for(let i = 0; i < this.dataset.length; i++)
			if(this.dataset[i].recordID == record)
				return i;
	}
}

export class PicyObject
{
	recordID:string = "";
	
	title:string = "";
	image_thumbnail:string = "";
	image_service:any = null;
	rights:string = "";
	
	iiif:IiiFObject = undefined;
	lido:LidoObject = undefined;
	hasPlace:boolean = false;
	hasTime:boolean = false;
	
	cards:PicyObjectCard[] = [];
	
	set(title:string, image_thumbnail:string, images_service:any, rights:string, recordID:string)
	{
		this.title = title;
		this.image_thumbnail = image_thumbnail;
		this.image_service = images_service;
		this.rights = rights;
		this.recordID = recordID;
	}
	
	load(lido: LidoObject, iiif: IiiFObject, config: any, storageService: StorageService, viewHeight: number): PicyObject
	{
		this.iiif = iiif;
		this.lido = lido;
		
		this.title = lido.title.get();
		if((this.image_thumbnail = storageService.loadLocalImage(iiif.record_id, undefined, viewHeight * 0.4)) == null)
		{
			this.image_thumbnail = iiif.getThumbnailForAttributes(undefined, viewHeight * 0.4);
			storageService.saveLocalImage(iiif.record_id, this.image_thumbnail,undefined, viewHeight * 0.4)
		}
		this.image_service = iiif.getImageService();
		this.rights = iiif.getAttributionForLanguage("de");
		this.recordID = iiif.record_id;
		
		this.hasPlace = lido.hasPlace();
		this.hasTime = lido.hasTime();
		
		if(config != null)
		{
			for(let con of config.reverse())
			{
				if(con.pattern != undefined && (PicyObject.testPattern(lido, con.pattern)))
				{
					for(let c of con.config)
					{
						let cardObj = new PicyObjectCard();
						let data = [];
						let t = PicyObject.getLidoVariable(lido, c.title);
						if(c.structure != undefined)
						{
							for(let s of c.structure)
							{
								let x = {title: "", data: ""};
								x.title = PicyObject.getLidoVariable(lido, s.title);
								x.data = PicyObject.getLidoVariable(lido, s.data);
								if(x.title == undefined || x.data == undefined)
									continue;
								if(s.pattern == undefined || PicyObject.testPattern(lido, s.pattern, x.title, x.data))
									data.push(x);
							}
						}
						if(c.pattern == undefined || PicyObject.testPattern(lido, c.pattern, t))
						{
							cardObj.set(t, data, true);
							this.cards.push(cardObj);
						}
					}
					break;
				}
			}
		}
		return this;
	}
	
	static getLidoVariable(lido:LidoObject, str:string):string
	{
		if(str[0] != '/')
			return str;
		
		let split = str.substring(1).split('/');
		let _lido = lido;
		let res = null;
		for(let sp of split)
		{
			if(_lido[sp] != undefined)
				_lido = _lido[sp];
			else
				return null;
		}
		if(_lido instanceof LidoAppellation)
			res = _lido.get();
		else if(_lido instanceof LidoConcept)
			res = _lido.getTerm();
		else
			res = _lido;
		
		return res;
	}
	
	static testPattern(lido:LidoObject, pattern:string, title?:string, data?:string)
	{
		let _variable = "/" + pattern.substring(1, pattern.indexOf("/", 2));
		let _regex = pattern.substring(pattern.indexOf("/", 2)+1, pattern.lastIndexOf("/"));//.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
		let _flag = pattern.substring(pattern.lastIndexOf("/")+1);
		
		let variable;
		if(title != undefined && (_variable == "/t" || _variable == "/T"))
			variable = title;
		else if((data != undefined) && (_variable == "/d" || _variable == "/D"))
			variable = data;
		else
			variable = PicyObject.getLidoVariable(lido, _variable);
		
		return new RegExp(_regex, _flag).test(variable)
	}
}

export class PicyObjectCard
{
	title:string = "";
	data:any = [];
	min:boolean = false;
	
	set(title:string, data:any, min:boolean)
	{
		this.title = title;
		this.data = data;
		this.min = min;
	}
}
