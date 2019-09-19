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
	
	constructor(private storage: Storage, private file: File, private filePath: FilePath, private webview: WebView, private fileTransfer: FileTransfer) {
	}
	
	cordovaAvailable: boolean = false;
	
	// CAUTION !!!!!!!!!!!
	private wipeStorage: boolean = true;
	
	private dummy: boolean = true;
	private local: boolean = false;
	
	// Configuration (primeconfig.json)
	private static primeconfig: string = "http://wissenskiosk.uni-goettingen.de/cuby/primeconfig.json";
	private static testconfig: string = "http://wissenskiosk.uni-goettingen.de/cuby/testconfig.json";
	private static localconfig: string = "http://localhost/localconfig.json";
	
	startup() {
		const self = this;
		(async function () {
			if (self.wipeStorage)
				await self.storage.clear();
		})().then(() => {
			this.loadLocalState();
			this.loadConfig();
			this.loadHomyState();
		});
	}
	
	configuration: {
		viewWidth: number;
		viewHeight: number;
		
		message_nonce: number,
		
		iiif_url: string,
		lido_url: string,
		
		cury_url: string,
		cury_feedback_url: string,
		
		homy_highscore_url: string,
		
		homy_categories: { name: string, cover: string, type: string, url: string }[],
		
		display_config_picy: [],
		display_config_cury_details: [],
		display_config_cury_feedback: [],
	} = {
		viewWidth: 0,
		viewHeight: 0,
		message_nonce: 0,
		
		iiif_url: "http://sammlungen.uni-goettingen.de/rest/iiif/manifests/",
		lido_url: "http://sammlungen.uni-goettingen.de/lidoresolver?id=",
		
		cury_url: "https://container.uni-goettingen.de/cuby-api/cury",
		cury_feedback_url: "https://container.uni-goettingen.de/cuby-api/feedback",
		
		homy_highscore_url: "https://container.uni-goettingen.de/cuby-api/highscore",
		
		homy_categories: [
			{
				name: "Objektgattungen",
				cover: "https://sammlungen.uni-goettingen.de/rest/image/record_kuniweb_675605/record_kuniweb_675605_362153.jpg/full/!400,400/0/default.jpg",
				type: "qtype_01_01",
				url: "http://container.uni-goettingen.de/cuby-api/homy"
			},
			{
				name: "Sammlungen",
				cover: "https://sammlungen.uni-goettingen.de/rest/image/record_kuniweb_948782/record_kuniweb_948782_445206.jpg/full/!400,400/0/default.jpg",
				type: "qtype_01_02",
				url: "http://container.uni-goettingen.de/cuby-api/homy"
			},
			{
				name: "Bezeichnung",
				cover: "https://sammlungen.uni-goettingen.de/rest/image/record_kuniweb_948728/record_kuniweb_948728_445133.jpg/full/!400,400/0/default.jpg",
				type: "qtype_02_01",
				url: "http://container.uni-goettingen.de/cuby-api/homy"
			},
			{
				name: "Datierung",
				cover: "https://sammlungen.uni-goettingen.de/rest/image/record_kuniweb_617433/record_kuniweb_617433_531458.jpg/full/!400,400/0/default.jpg",
				type: "qtype_02_02",
				url: "http://container.uni-goettingen.de/cuby-api/homy"
			},
			{
				name: "Karte",
				cover: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Long_and_Loop_Street_map.svg",
				type: "qtype_03_01",
				url: ""
			},
			{
				name: "Zeitstrahl",
				cover: "https://upload.wikimedia.org/wikipedia/commons/8/8b/2010-07-20_Black_windup_alarm_clock_face.jpg",
				type: "qtype_04_01",
				url: ""
			}
		],
		
		display_config_picy: [],
		display_config_cury_details: [],
		display_config_cury_feedback: [],
	};
	
	homyState: {
		current_points: number,
		total_points: number,
		index: number,
		correct_records: string[]
	} = {
		current_points: 0,
		total_points: 0,
		index: 0,
		correct_records: []
	};
	homyCallback: () => void = null;
	homyFinished: boolean = false;
	
	loadConfig() {
		this.storage.get('configuration').then(async config => {
			console.log("Loaded configuration from storage: ", config);
			this.configuration.viewHeight = window.innerHeight;
			this.configuration.viewWidth = window.innerWidth;
			
			let conf;
			if(this.local)
				conf = await DataLoader.loadPrimeConfig(StorageService.localconfig);
			else
				conf = await DataLoader.loadPrimeConfig(StorageService.testconfig);
			
			this.configuration = {...this.configuration, ...config, ...conf};
			
			// Insert hyphens in category names
			for (let cat of this.configuration.homy_categories) {
				if (cat.name.indexOf("Objekt") != -1)
					cat.name = cat.name.replace("Objekt", "Objekt\u00AD");
				if (cat.name.indexOf("objekt") != -1)
					cat.name = cat.name.replace("objekt", "\u00ADobjekt\u00AD");
			}
		});
	}
	
	loadHomyState() {
		console.log("Load homy config");
		this.storage.get('homyState')
			.then(state => {
				if (state) this.homyState = state;
			})
			.then(() => {
				if (this.homyCallback)
					this.homyCallback();
				this.homyFinished = true;
			});
	}
	
	localState: {
		picyGallery: string[],
		curyStack: string[],
		detailsList: string[],
		feedbackList: string[],
		
		locallySavedObjectsIiiF: string[],
		locallySavedObjectsLido: string[],
		locallySavedImages: string[],
		
		homyPostHighscoreAsk: boolean,
		homyPostHighscore: boolean,
		
		likedLevel1: string[]
		likedLevel2: string[]
		likedLevel3: Level3Like[]
		
	} = {
		picyGallery: [],
		curyStack: [],
		detailsList: [],
		feedbackList: [],
		locallySavedObjectsIiiF: [],
		locallySavedObjectsLido: [],
		locallySavedImages: [],
		homyPostHighscore: null,
		homyPostHighscoreAsk: true,
		likedLevel1: [],
		likedLevel2: [],
		likedLevel3: []
	};
	
	dummyState = {
		picyGallery: ["record_kuniweb_592553", "record_kuniweb_675675", "record_kuniweb_592566", "record_kuniweb_945664", "record_kuniweb_666297", "record_kuniweb_943917", "record_kuniweb_681925", "record_kuniweb_854325"],
		curyStack: ["record_kuniweb_592553", "record_kuniweb_675675", "record_kuniweb_592566", "record_kuniweb_945664", "record_kuniweb_666297", "record_kuniweb_943917", "record_kuniweb_681925", "record_kuniweb_854325"],
		detailsList: [],
		feedbackList: [],
		locallySavedObjectsIiiF: [],
		locallySavedObjectsLido: [],
		locallySavedImages: [],
		homyPostHighscore: null,
		homyPostHighscoreAsk: true,
		likedLevel1: [],
		likedLevel2: [],
		likedLevel3: []
	};
	
	loadLocalState() {
		this.storage.get('localState').then(str => {
			if (this.dummy)
				this.localState = this.dummyState;
			
			else if (str && str != "") {
				this.localState = JSON.parse(str);
				console.log("Local state: ", this.localState);
			} else
				console.log("Local state clean");
			
			if (this.cordovaAvailable)
				this.imagesAvailable().then(result => console.log("Saved Images: ", result));
		});
	}
	
	saveLocalState() {
		if (this.storage) {
			this.storage.set('localState', JSON.stringify(this.localState));
			this.storage.set('configuration', JSON.stringify(this.configuration));
			this.storage.set('homyState', JSON.stringify(this.homyState));
		} else console.log("Tried to save state. Failure");
	}
	
	// Helpers
	getCategoryNameForType(type: string) {
		for (let cat of this.configuration.homy_categories)
			if (cat.type === type)
				return cat.name;
		return "";
	}
	
	getCategoryUrlForType(type: string) {
		for (let cat of this.configuration.homy_categories)
			if (cat.type === type)
				return cat.url;
		return "";
	}
	
	nfc_record: string[] = [];
	
	setNFCRecord(records: string[]) {
		this.nfc_record = records;
	}
	
	getNFCRecord() {
		let tmp = this.nfc_record;
		this.nfc_record = [];
		return tmp;
	}
	
	// Locally saved images
	loadLocalIiiF(record: string) {
		
		return new Promise<IiiFObject>((resolve, reject) => {
			
			if (this.cordovaAvailable) {
				this.storage.keys().then(keys => {
					console.log("keys:", keys.indexOf('iiif:' + record));
					if (keys.indexOf('iiif:' + record) > -1) {
						this.storage.get('iiif:' + record).then(img => {
							console.log("img: ", img);
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
	
	saveIiiFLocal(iiif: IiiFObject) {
		if (this.cordovaAvailable)
			this.storage.set('iiif:' + iiif.record_id, iiif.manifest)
				.then(() => this.localState.locallySavedObjectsIiiF.push(iiif.record_id));
	}
	
	loadLocalLido(record: string) {
		return new Promise<LidoObject>((resolve, reject) => {
			if (this.cordovaAvailable) {
				this.storage.keys().then(keys => {
					if (keys.indexOf('lido:' + record) > -1) {
						this.storage.get('lido:' + record).then(img => {
							let obj = new LidoObject();
							obj.loadLIDO(img);
							resolve(obj);
						}).catch(() => reject());
					} else
						reject();
				});
			} else
				reject();
		});
	}
	
	saveLidoLocal(lido: LidoObject) {
		if (this.cordovaAvailable)
			this.storage.set('lido:' + lido.lidoRecID, lido.lidoString)
				.then(() => this.localState.locallySavedObjectsLido.push(lido.lidoRecID));
	}
	
	imagesAvailable() {
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
	
	loadLocalImage(recordID: string, width?: number, height?: number, rotation?: number, type?: string, region?: string) {
		if (this.cordovaAvailable) {
			let _size: string = '';
			if (width == undefined && height == undefined) _size = 'max';
			else if (width == undefined) _size = 'o' + Math.ceil(height);
			else if (height == undefined) _size = Math.ceil(width) + 'o';
			else _size = Math.ceil(width) + 'o' + Math.ceil(height);
			
			if (rotation == undefined) rotation = 0;
			else rotation = Math.ceil(rotation);
			
			if (type == undefined) type = 'default';
			if (region == undefined) region = 'full';
			
			let fileName = recordID + '-' + _size + '-' + rotation + '-' + type + '-' + region + '.jpg';
			if (this.file.dataDirectory && this.webview) {
				console.log("File name: ", this.webview.convertFileSrc(this.file.dataDirectory + fileName));
				this.file.checkFile(this.webview.convertFileSrc(this.file.dataDirectory + fileName), "").then(b => {
					if (b)
						return this.webview.convertFileSrc(this.file.dataDirectory + fileName);
					else
						return null;
				});
			} else
				return null;
		}
	}
	
	saveLocalImage(recordID: string, url: string, width?: number, height?: number, rotation?: number, type?: string, region?: string) {
		if (this.cordovaAvailable) {
			let _size: string = '';
			if (width == undefined && height == undefined) _size = 'max';
			else if (width == undefined) _size = 'o' + Math.ceil(height);
			else if (height == undefined) _size = Math.ceil(width) + 'o';
			else _size = Math.ceil(width) + 'o' + Math.ceil(height);
			
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
}

export class Level3Like
{
	recordID:string = "";
	likedFields:string[] = [];
	comment:string = "";
}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	// Old
	/**
	config:{
		viewWidth: number,
		viewHeight: number,
		
		picyConfig: any,
		detailsConfig: any,
		feedbackConfig: any,
		
		questionsUrl: string,
		message_nonce: number,
		
		iiif_url:string,
		lido_url:string,
		
		cury_url:string,
		cury_config:string,
		cury_feedback:string,
		homy_config:string,
		
		display_config_picy:[],
		display_config_cury_details:[],
		display_config_cury_feedback:[],
		
	} = {
		viewWidth: 0, viewHeight: 0, message_nonce: 0,
		cury_url: "http://wissenskiosk.uni-goettingen.de/cuby/cury/cury.php",
		cury_config: "http://wissenskiosk.uni-goettingen.de/cuby/cury/config.json",
		cury_feedback: "http://wissenskiosk.uni-goettingen.de/cuby/cury/feedback.php",
		homy_config: "http://wissenskiosk.uni-goettingen.de/cuby/homy/config.json",
		display_config_picy: [], display_config_cury_details: [], display_config_cury_feedback: [],
		iiif_url: "http://sammlungen.uni-goettingen.de/rest/iiif/manifests/",
		lido_url: "http://sammlungen.uni-goettingen.de/lidoresolver?id="
	};
	
	loadConfig_old()
	{
		if(this.wipeStorage)
		{
			this.storage.clear().then(() =>
			{
				this.storage.get('configuration').then(config => {
					this._loadConfig(config);
				});
				
			});
		}
		else
		{
			this.storage.get('configuration').then(config => {
				this._loadConfig(config);
			});
		}
	}
	
	_loadConfig(config)
	{
		console.log("configuration", config);
		this.config.viewHeight = window.innerHeight;
		this.config.viewWidth = window.innerWidth;
		
		if(config)
		{
			if(config.iiif_url)
				this.config.iiif_url = config.iiif_url;
			if(config.lido_url)
				this.config.lido_url = config.lido_url;
			if(config.cury_url)
				this.config.cury_url = config.cury_url;
			if(config.cury_feedback)
				this.config.cury_feedback = config.cury_feedback;
			if(config.homy_config)
				this.config.homy_config = config.homy_config;
			
			if(config.display_config_cury_feedback)
				this.config.display_config_cury_feedback = config.display_config_cury_feedback;
			if(config.display_config_cury_details)
				this.config.display_config_cury_details = config.display_config_cury_details;
			if(config.display_config_picy)
				this.config.display_config_picy = config.display_config_picy;
		}
		DataLoader.loadPrimeConfig(StorageService.primeconfig).then(conf =>
		{
			if(conf.iiif_url)
				this.config.iiif_url = conf.iiif_url;
			if(conf.lido_url)
				this.config.lido_url = conf.lido_url;
			if(conf.cury_url)
				this.config.cury_url = conf.cury_url;
			if(conf.cury_feedback)
				this.config.cury_feedback = conf.cury_feedback;
			if(conf.homy_config)
				this.config.homy_config = conf.homy_config;
			
			if(conf.display_config && conf.display_config.cury_feedback)
				this.config.display_config_cury_feedback = conf.display_config.cury_feedback;
			if(conf.display_config && conf.display_config.cury_details)
				this.config.display_config_cury_details = conf.display_config.cury_details;
			if(conf.display_config && conf.display_config.picy)
				this.config.display_config_picy = conf.display_config.picy;
		}).catch(() => {});
	}
	
	homyConfig:{
		highscore_url:string,
		categories:[{name:string, cover:string, type:string, url:string}]
	} = {
		highscore_url: "http://wissenskiosk.uni-goettingen.de/cuby/questions/highscore.php",
		categories: [
			{
				name: "Objektgattungen",
				cover: "",
				type: "qtype_01_01",
				url: "http://wissenskiosk.uni-goettingen.de/cuby/questions/index.php"
			}
		]
	};
	
	homyState:{
		current_points:number,
		total_points:number,
		index:number,
		correct_records:string[]
	} = {current_points: 0, total_points: 0, index: 0, correct_records:[]};
	homyCallback:() => void = null;
	homyFinished:boolean = false;
	
	loadHomyConfig_old() {
		console.log("Load homy config");
		Promise.all([
			DataLoader.loadHomyConfig(this.config.homy_config).then(config => {
				if (config.highscore_url)
					this.homyConfig.highscore_url = config.highscore_url;
				if (config.categories)
					this.homyConfig.categories = config.categories;
				
				// Insert hyphens in category names
				for (let cat of this.homyConfig.categories) {
					if (cat.name.indexOf("Objekt") != -1)
						cat.name = cat.name.replace("Objekt", "Objekt\u00AD");
					if (cat.name.indexOf("objekt") != -1)
						cat.name = cat.name.replace("objekt", "\u00ADobjekt\u00AD");
				}
			}),
			this.storage.get('homyState').then(state => {
					if (state)
						this.homyState = state;
				}
			)]).then(() => {
			if (this.homyCallback)
				this.homyCallback();
			this.homyFinished = true;
		});
	}
} */
