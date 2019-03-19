import {LidoObject} from './LidoObject';
import {IiiFObject} from './IiiFObject';
import {StorageService} from '../app/storage.service';

export class DataLoader
{
	public static manifestBaseUrl:string = "https://sammlungen.uni-goettingen.de/rest/iiif/manifests/";
	public static lidoBaseUrl:string = "https://sammlungen.uni-goettingen.de/lidoresolver?id=";
	public static gallery:string[] = ["record_kuniweb_592553", "record_kuniweb_675675", "record_kuniweb_592566", "record_kuniweb_945664", "record_kuniweb_666297", "record_kuniweb_943917", "record_kuniweb_681925", "record_kuniweb_854325"];
	public static primeConfig:string = "http://wissenskiosk.uni-goettingen.de/cuby/cuby-config/primeconfig.json";
	
	constructor() {}
	
	static loadPrimeConfig()
	{
		return new Promise<any>((resolve, reject) =>
		{
			const xhr = new XMLHttpRequest();
			xhr.open("GET", DataLoader.primeConfig);
			xhr.onload = (ev) => {
				if(xhr.readyState == 4)
				{
					if(xhr.status == 200)
					{
						resolve(JSON.parse(xhr.responseText));
					}
					
					else {
						console.log("ERROR. Prime config could not be loaded");
						reject(xhr.status);
					}
				}
			};
			xhr.send();
		});
	}
	
	static async requestCuryImages(storageService:StorageService, number:number)
	{
		// TODO Build server backend. Request new load of images from it.
		let x:number = 0;
		if(number > 0)
			x = number;
		else
			x = DataLoader.gallery.length;
		let images = Array(x);
		for(let i = 0; i < x; i++)
		{
			const gal = DataLoader.gallery[i];
			try {
				images[i] = await DataLoader.downloadManifest(storageService, gal);
			} catch (e) {
				images[i] = null;
			}
		}
		return images;
	}
	
	static loadPicyConfigFile():Promise<any>
	{
		return new Promise<any>((resolve, reject) =>
		{
			const xhr = new XMLHttpRequest();
			xhr.open("GET", "../assets/config/picy-card-config.json");
			xhr.onload = (ev) => {
				if(xhr.readyState == 4)
				{
					if(xhr.status == 200)
						resolve(JSON.parse(xhr.responseText));
					else {
						console.log("ERROR. Config could not be loaded");
						reject(xhr.status);
					}
				}
			};
			xhr.send();
		});
	}
	
	static loadDetailsConfigFile():Promise<any>
	{
		return new Promise<any>((resolve, reject) =>
		{
			const xhr = new XMLHttpRequest();
			xhr.open("GET", "../assets/config/details-card-config.json");
			xhr.onload = (ev) => {
				if(xhr.readyState == 4)
				{
					if(xhr.status == 200)
						resolve(JSON.parse(xhr.responseText));
					else {
						console.log("ERROR. Config could not be loaded");
						reject(xhr.status);
					}
				}
			};
			xhr.send();
		});
	}
	
	static loadFeedbackConfigFile():Promise<any>
	{
		return new Promise<any>((resolve, reject) =>
		{
			const xhr = new XMLHttpRequest();
			xhr.open("GET", "../assets/config/feedback-card-config.json");
			xhr.onload = (ev) => {
				if(xhr.readyState == 4)
				{
					if(xhr.status == 200)
						resolve(JSON.parse(xhr.responseText));
					else {
						console.log("ERROR. Config could not be loaded");
						reject(xhr.status);
					}
				}
			};
			xhr.send();
		});
	}
	
	static downloadManifest(storageService:StorageService, recordID:string):Promise<IiiFObject>
	{
		return new Promise<IiiFObject>((resolve, reject) => {
			
			if(storageService.localState.locallySavedObjectsIiiF.indexOf(recordID) != -1)
				storageService.loadLocalIiiF(recordID).then(iiif => resolve(iiif));
			else {
				const xhr = new XMLHttpRequest();
				xhr.open("GET", DataLoader.manifestBaseUrl + recordID + "/manifest/");
				xhr.onload = (ev) =>
				{
					if(xhr.readyState == 4)
					{
						if(xhr.status == 200)
						{
							let obj = new IiiFObject();
							obj.loadManifest(xhr.responseText);
							storageService.saveIiiFLocal(obj);
							resolve(obj);
						}
						else {
							reject(xhr.status);
						}
					}
				};
				xhr.send();
			}
		})
	}
	
	static downloadLIDO(storageService:StorageService, recordID:string):Promise<LidoObject>
	{
		return new Promise<LidoObject>((resolve, reject) => {
			
			if(recordID == undefined || recordID == "")
				reject();
			else {
				if(storageService.localState.locallySavedObjectsLido.indexOf(recordID) != -1)
					storageService.loadLocalLido(recordID).then(lido => resolve(lido));
				else {
					let str = DataLoader.lidoBaseUrl + recordID;
					
					const xhr = new XMLHttpRequest();
					xhr.open("GET", str);
					xhr.onload = (ev) =>
					{
						if(xhr.readyState == 4)
						{
							if(xhr.status == 200)
							{
								let obj = new LidoObject();
								obj.loadLIDO(xhr.responseText, () => {
									storageService.saveLidoLocal(obj);
									resolve(obj);
								});
							}
							else {
								reject(xhr.status);
							}
						}
					};
					xhr.send();
				}
			}
		})
		
		
	}
	
	static async loadGallery(storageService:StorageService, galleryRecords:string[])
	{
		let iiif:IiiFObject[] = Array(galleryRecords.length);
		let error:number[] = Array(galleryRecords.length);
		for(let i = 0; i < galleryRecords.length; i++)
		{
			let gal = galleryRecords[i];
			try {
				iiif[i] = await DataLoader.downloadManifest(storageService, gal);
			} catch (e) {
				error[i] = e.message;
			}
		}
		return {iiif: iiif, error:error};
	}
}