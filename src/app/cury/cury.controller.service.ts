import { Injectable } from '@angular/core';
import { DataLoader } from '../../data/DataLoader';
import { IiiFObject } from '../../data/IiiFObject';
import {StorageService} from '../storage.service';

@Injectable({
	providedIn: 'root'
})
export class CuryControllerService {
	
	public static NUMBER_ELEMENTS:number = 8;
	
	images:IiiFObject[] = [];
	loadingFinishedCallback:() => void = null;
	currentlyLoading:boolean = false;
	
	constructor(private storageService:StorageService) {}
	
	initialLoad()
	{
		this.images = [];
		let records = this.storageService.localState.curyStack;
		let count = records.length;
		this.currentlyLoading = true;
		console.log("Download", records);
		if(records.length < CuryControllerService.NUMBER_ELEMENTS)
		{
			DataLoader.requestCuryImages(this.storageService, CuryControllerService.NUMBER_ELEMENTS - count).then( (imgs:IiiFObject[]) => {
				for(let img of imgs)
					this.images.push(img);
				count -= imgs.length;
				if(count <= 0)
				{
					if(this.loadingFinishedCallback != null)
					{
						this.currentlyLoading = false;
						this.loadingFinishedCallback();
					}
					else
						console.log("No loading finished callback");
				}
			});
			count = CuryControllerService.NUMBER_ELEMENTS;
		}
		
		for(let record of records)
		{
			DataLoader.downloadManifest(this.storageService, record).then(img => {
				this.images.push(img);
				
				count--;
				if(count <= 0)
				{
					if(this.loadingFinishedCallback != null)
					{
						this.currentlyLoading = false;
						console.log("Loading finished");
						this.loadingFinishedCallback();
					}
					else
						console.log("No loading finished callback");
				}
			});
		}
	}
	
	loadNewImages(number:number)
	{
		DataLoader.requestCuryImages(this.storageService, number)
			.then((imgs:IiiFObject[]) => {
				for(let img of imgs)
					this.images.push(img);
				
				if(this.loadingFinishedCallback != null)
					this.loadingFinishedCallback();
				else
					console.log("No loading finished callback");
				this.loadingFinishedCallback();
			});
	}
  	
  	setLoadingFinishedCallback(cb:() => void)
	{
		this.loadingFinishedCallback = cb;
	}
}
