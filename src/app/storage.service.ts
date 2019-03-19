import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import {IiiFObject} from '../data/IiiFObject';
import {LidoObject} from '../data/LidoObject';
import {DataLoader} from '../data/DataLoader';
import {Entry, File} from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';

@Injectable({
  	providedIn: 'root'
})
export class StorageService {
	
	constructor(private storage:Storage, private file:File, private filePath:FilePath, private webview:WebView, private fileTransfer:FileTransfer) { }
	
	cordovaAvailable:boolean = false;
	
	// Configuration
	config:{
		viewWidth: number,
		viewHeight: number,
		
		picyConfig: any,
		detailsConfig: any,
		feedbackConfig: any
	} = {viewWidth: 0, viewHeight: 0, picyConfig: null, detailsConfig: null, feedbackConfig: null};
	
	loadConfig()
	{
		this.storage.get('configuration').then(config => {
			console.log("configuration", config);
			this.config.viewHeight = window.innerHeight;
			this.config.viewWidth = window.innerWidth;
		});
		DataLoader.loadPrimeConfig().then(config => {
			this.config.picyConfig = config.picyConfig;
			this.config.feedbackConfig = config.feedbackConfig;
			this.config.detailsConfig = config.detailsConfig;
		})
	}
	
	// Local state
	localState:{
		picyGallery:string[],
		curyStack:string[],
		detailsList:string[],
		feedbackList:string[],
		
		locallySavedObjectsIiiF:string[],
		locallySavedObjectsLido:string[],
		locallySavedImages:string[],
		
		likedLevel1:string[]
		likedLevel2:string[]
		likedLevel3:Level3Like[]
		
	} = {picyGallery: [], curyStack: [], detailsList: [], feedbackList: [], locallySavedObjectsIiiF: [], locallySavedObjectsLido: [], locallySavedImages: [], likedLevel1: [], likedLevel2: [], likedLevel3: [] };
	
	loadLocalState()
	{
		let dummy:boolean = true;
		this.storage.get('localState').then(str => {
			if(!dummy)
				this.localState = JSON.parse(str);
			else
			{
				// Dummy state
				this.localState = {
					picyGallery: ["record_kuniweb_592553", "record_kuniweb_675675", "record_kuniweb_592566", "record_kuniweb_945664", "record_kuniweb_666297", "record_kuniweb_943917", "record_kuniweb_681925", "record_kuniweb_854325"],
					curyStack: ["record_kuniweb_592553", "record_kuniweb_675675", "record_kuniweb_592566", "record_kuniweb_945664", "record_kuniweb_666297", "record_kuniweb_943917", "record_kuniweb_681925", "record_kuniweb_854325"],
					detailsList: [],
					feedbackList: [],
					
					locallySavedObjectsIiiF: [],
					locallySavedObjectsLido: [],
					locallySavedImages: [],
					
					likedLevel1: [],
					likedLevel2: [],
					likedLevel3: []
				};
			}
			if(this.cordovaAvailable)
				this.imagesAvailable().then(result => console.log("Saved Images: ", result));
		});
		
		/*console.log("XHR load");
		const xhr = new XMLHttpRequest();
		xhr.open("GET", "https://sammlungen.uni-goettingen.de/api?action=query&q=MD_UNIGOE_OBJEKTGATTUNG:Binärer+Speicher;;MD_UNIGOE_DC:Rechnermuseum+der+GWDG;;");
		xhr.onload = (ev) =>
		{
			if(xhr.readyState == 4)
			{
				if(xhr.status == 200)
				{
					let obj = JSON.parse(xhr.responseText);
					let nobj = [];
					for(let o of obj)
					{
						if(o.collection != null)
							nobj.push(o);
					}
					console.log("OBJ", obj);
					console.log("Nobj", nobj);
				}
				else {
					console.error("Loading error", xhr.status);
				}
			}
		};
		xhr.send();*/
	}
	
	loadLocalIiiF(record:string)
	{
		
		return new Promise<IiiFObject>((resolve, reject) => {
			
			if (this.cordovaAvailable) {
				this.storage.keys().then(keys => {
					if (keys.indexOf('iiif:' + record)) {
						this.storage.get('iiif:' + record).then(img => {
							let obj = new IiiFObject();
							obj.loadManifest(img);
							resolve(obj);
						});
					} else
						reject();
				});
			} else {
				reject();
			}
		});
	}
	
	saveIiiFLocal(iiif:IiiFObject)
	{
		if(this.cordovaAvailable)
			this.storage.set('iiif:' + iiif.record_id, iiif.manifest)
				.then(() => this.localState.locallySavedObjectsIiiF.push(iiif.record_id));
	}
	
	loadLocalLido(record:string) {
		return new Promise<LidoObject>((resolve, reject) => {
			if (this.cordovaAvailable) {
				this.storage.keys().then(keys => {
					if (keys.indexOf('lido:' + record)) {
						this.storage.get('lido:' + record).then(img => {
							let obj = new LidoObject();
							obj.loadLIDO(img, () => {
								resolve(obj);
							});
						}).catch(() => reject());
					} else
						reject();
				});
			} else
				reject();
		});
	}
	
	saveLidoLocal(lido:LidoObject)
	{
		if(this.cordovaAvailable)
			this.storage.set('lido:' + lido.recordID, lido.lidoString)
				.then(() => this.localState.locallySavedObjectsLido.push(lido.recordID));
	}
	
	imagesAvailable()
	{
		return new Promise((resolve, reject) => {
			if (this.cordovaAvailable) {
				let result: string[] = [];
				this.file.listDir(this.file.dataDirectory, '').then((entries: Entry[]) => {
					for (let entry of entries)
						if (entry.fullPath.substring(entry.fullPath.lastIndexOf('.')) == '.jpg')
							result.push(entry.fullPath);
					resolve(result);
				}).catch(() => reject());
			} else
				reject();
		});
	}
	
	loadLocalImage(recordID:string, width?:number, height?:number, rotation?:number, type?:string, region?:string)
	{
		if (this.cordovaAvailable) {
			let _size: string = '';
			if (width == undefined && height == undefined) _size = 'max';
			else if (width == undefined) _size = ',' + Math.ceil(height);
			else if (height == undefined) _size = Math.ceil(width) + ',';
			else _size = Math.ceil(width) + ',' + Math.ceil(height);
			
			if (rotation == undefined) rotation = 0;
			else rotation = Math.ceil(rotation);
			
			if (type == undefined) type = 'default';
			if (region == undefined) region = 'full';
			
			let fileName = recordID + '-' + _size + '-' + rotation + '-' + type + '-' + region + '.jpg';
			if (this.file.dataDirectory && this.webview)
				return this.file.dataDirectory + this.webview.convertFileSrc(fileName);
			else
				return null;
		}
	}
	
	saveLocalImage(recordID:string, url:string, width?:number, height?:number, rotation?:number, type?:string, region?:string) {
		if (this.cordovaAvailable) {
			let _size: string = '';
			if (width == undefined && height == undefined) _size = 'max';
			else if (width == undefined) _size = ',' + Math.ceil(height);
			else if (height == undefined) _size = Math.ceil(width) + ',';
			else _size = Math.ceil(width) + ',' + Math.ceil(height);
			
			if (rotation == undefined) rotation = 0;
			else rotation = Math.ceil(rotation);
			
			if (type == undefined) type = 'default';
			if (region == undefined) region = 'full';
			
			let fileName = recordID + '-' + _size + '-' + rotation + '-' + type + '-' + region + '.jpg';
			let filePath = this.file.dataDirectory + this.webview.convertFileSrc(fileName);
			
			let path;
			if ((path = this.loadLocalImage(recordID, width, height, rotation, type, region)) != null)
				this.fileTransfer.create().download(url, path).then((entry) => console.log("Download complete: ", entry.toUrl()));
		}
	}
	
	
	
	saveLocalState()
	{
		if(this.storage)
		{
			this.storage.set('localState', JSON.stringify(this.localState));
			this.storage.set('configuration', JSON.stringify(this.config));
		}
		else console.log("Tried to save state. Failure");
	}
	
	
	nfc_record:string[] = [];
	
	setNFCRecord(records:string[])
	{
		this.nfc_record = records;
	}
	
	getNFCRecord()
	{
		let tmp = this.nfc_record;
		this.nfc_record = [];
		return tmp;
	}
}

export class Level3Like
{
	recordID:string = "";
	likedFields:string[] = [];
	comment:string = "";
}
