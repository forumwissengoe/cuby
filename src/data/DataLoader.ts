import {LidoObject} from './LidoObject';
import {IiiFObject} from './IiiFObject';
import {StorageService} from '../app/storage.service';
import {Data} from '@angular/router';

export class DataLoader
{
	public static manifestBaseUrl:string = "https://sammlungen.uni-goettingen.de/rest/iiif/manifests/";
	public static lidoBaseUrl:string = "https://sammlungen.uni-goettingen.de/lidoresolver?id=";
	public static gallery:string[] = ["record_kuniweb_592553", "record_kuniweb_675675", "record_kuniweb_592566", "record_kuniweb_945664", "record_kuniweb_666297", "record_kuniweb_943917", "record_kuniweb_681925", "record_kuniweb_854325"];
	
	public static primeConfig:string = "http://wissenskiosk.uni-goettingen.de/cuby/cuby-config/primeconfig.json";
	
	constructor() {}
	
	static loadPrimeConfig(primeConfig:string)
	{
		return new Promise<any>((resolve, reject) =>
		{
			const xhr = new XMLHttpRequest();
			xhr.open("GET", primeConfig);
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
	
	static loadHomyConfig(configURL:string)
	{
		return new Promise<any>((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open("GET", configURL);
			xhr.onload = (ev) => {
				if(xhr.readyState == 4)
				{
					if(xhr.status == 200)
					{
						resolve(JSON.parse(xhr.responseText));
					}
					
					else {
						console.log("ERROR. Questions config could not be loaded");
						reject(xhr.status);
					}
				}
			};
			xhr.send();
		})
	}
	
	static loadHomyQuestions(url:string, type:string)
	{
		if(!url.endsWith(".php"))
			url = url + "index.php";
		
		url = url + "?type=" + encodeURIComponent(type);
		
		return new Promise<any>((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open("GET", url);
			xhr.onload = (ev) => {
				if(xhr.readyState == 4)
				{
					if(xhr.status == 200)
					{
						let obj = JSON.parse(xhr.responseText);
						if(obj != [])
							resolve(obj);
						else
							reject(xhr.responseText);
					}
					
					else {
						console.log("ERROR. Questions config could not be loaded");
						reject(xhr.status);
					}
				}
			};
			xhr.send();
		})
	}
	
	static publishHomyHighscore(url:string, highscore:number)
	{
		// TODO Dummy location
		let location = "all";
		
		if(!url.endsWith(".php"))
			url = url + "index.php";
		
		return new Promise<any>( (resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open("POST", url, true);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			
			xhr.onload = (ev) => {
				if(xhr.readyState == 4)
				{
					if(xhr.status == 200)
					{
						resolve();
					}
					else {
						reject(xhr.status);
					}
				}
			};
			
			xhr.send("score=" + highscore + "&location=" + location);
		});
	}
	
	static requestHomyHighscore(url:string)
	{
		if(!url.endsWith(".php"))
			url = url + "index.php";
		
		return new Promise<any>( (resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open("GET", url);
			xhr.onload = (ev) => {
				if(xhr.readyState == 4)
				{
					if(xhr.status == 200)
						resolve(JSON.parse(xhr.responseText));
					else
						reject(xhr.status);
				}
			};
			xhr.send();
		})
	}
	
	static async requestCuryImages(storageService:StorageService, url:string, number:number)
	{
		let base = null;
		try {
			base = await new Promise<any>((resolve, reject) =>
			{
				const xhr = new XMLHttpRequest();
				xhr.open("GET", url);
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
		} catch(e) {
			return null;
		}
		if(!Array.isArray(base) || base.length < 2)
			return null;
		
		let result = Array(number);
		let images = Array(number);
		let index = -1;
		for(let i = 0; i < number; i++)
		{
			index++;
			if(index >= base.length)
				index = 0;
			
			let arr = base[index];
			if(arr.length == 0 || Math.random() < 0.3) // Discard empty arrays and discard some randomly
			{
				i--;
				continue;
			}
			
			for(let a = 0; a < arr.length; a++)
			{
				if(images.indexOf(arr[a]) == -1 || storageService.localState.curyStack.indexOf(arr[a]) == -1 && arr[a])
				{
					images[i] = arr[a];
					storageService.localState.curyStack.push(arr[a]);
					break;
				}
			}
			if(!images[i])
			{
				i--;
				continue;
			}
			
			try {
				result[i] = await DataLoader.downloadManifest(storageService, images[i]);
			} catch (e) {
				result[i] = null;
			}
		}
		return result;
	}
	
	static async loadPicyConfigFile(storageService:StorageService):Promise<any>
	{
		let urls = ["../assets/config/picy-card-config-fallback.json"];
		for(let u of storageService.config.display_config_picy)
			if(DataLoader.validURL(u))
				urls.push(u);
		let result = [];
		
		for(let u of urls)
		{
			await new Promise((resolve => {
				const xhr = new XMLHttpRequest();
				xhr.open("GET", u);
				xhr.onload = (ev) => {
					if(xhr.readyState == 4)
					{
						if(xhr.status == 200)
						{
							let obj = JSON.parse(xhr.responseText);
							result = result.concat(obj);
							resolve();
						}
						
						else {
							console.log("ERROR. Config could not be loaded");
						}
					}
				};
				xhr.send();
			}))
		}
		return result;
	}
	
	static async loadDetailsConfigFile(storageService:StorageService):Promise<any>
	{
		let urls = ["../assets/config/details-card-config-fallback.json"];
		for(let u of storageService.config.display_config_cury_details)
			if(DataLoader.validURL(u))
				urls.push(u);
		let result = [];
		
		for(let u of urls)
		{
			console.log("Load url: ", u);
			await new Promise((resolve => {
				const xhr = new XMLHttpRequest();
				xhr.open("GET", u);
				xhr.onload = (ev) => {
					if(xhr.readyState == 4)
					{
						if(xhr.status == 200)
						{
							let obj = JSON.parse(xhr.responseText);
							result = result.concat(obj);
							resolve();
						}
						
						else {
							console.log("ERROR. Config could not be loaded");
						}
					}
				};
				xhr.send();
			}))
		}
		return result;
	}
	
	static async loadFeedbackConfigFile(storageService:StorageService):Promise<any>
	{
		let urls = ["../assets/config/feedback-card-config-fallback.json"];
		for(let u of storageService.config.display_config_cury_feedback)
			if(DataLoader.validURL(u))
				urls.push(u);
		let result = [];
		
		for(let u of urls)
		{
			await new Promise((resolve => {
				const xhr = new XMLHttpRequest();
				xhr.open("GET", u);
				xhr.onload = (ev) => {
					if(xhr.readyState == 4)
					{
						if(xhr.status == 200)
						{
							let obj = JSON.parse(xhr.responseText);
							result = result.concat(obj);
							resolve();
						}
						
						else {
							console.log("ERROR. Config could not be loaded");
						}
					}
				};
				xhr.send();
			}))
		}
		return result;
	}
	
	static downloadManifest(storageService:StorageService, recordID:string):Promise<IiiFObject>
	{
		return new Promise<IiiFObject>((resolve, reject) => {
			
			if(storageService.localState.locallySavedObjectsIiiF.indexOf(recordID) != -1)
				storageService.loadLocalIiiF(recordID).then(iiif => resolve(iiif));
			else {
				const xhr = new XMLHttpRequest();
				// TODO change url
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
					// TODO Change url
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
				console.log("Error: ", e);
			}
		}
		return {iiif: iiif, error:error};
	}
	
	// Helper
	static validURL(str) {
		var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
			'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
		return !!pattern.test(str);
	}
}