import {AfterViewChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ImageOverlay} from '../../additions/overlay/image-overlay.component';
import {FeedbackController} from './feedback.controller.service';
import {Router} from '@angular/router';
import {Level3Like, StorageService} from '../../storage.service';

@Component({
	selector: 'app-feedback',
	templateUrl: './feedback.page.html',
	styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements AfterViewChecked {
	
	@ViewChild("overlay") overlay:ImageOverlay;
	@ViewChild("imageElement") imageElement:ElementRef;
	@ViewChild("imageElement2") imageElement2:ElementRef;
	
	image:string = "http://www.adweek.com/files/2015_May/iStock-Unfinished-Business-6.jpg";
	record:string = "";
	items:any = [{label: "Standort", value: "Kunstsammlung der Univeristät"}, {label: "Datierung", value: "1513"}, {label: "Beteiligte", value: "Altdorfer, Albrecht"}, {label: "Maße / Umfang", value: "Breite: 99mm"}];
	comment:string = "";
	
	index:number = 0;
	imageChecked:boolean = false;
	loading:boolean = true;
	
	
	constructor(private feedbackController:FeedbackController, private router:Router, private storageService:StorageService) {}

    ngAfterViewChecked() {
    }
    
    ionViewWillEnter()
	{
		this.loading = true;
		this.feedbackController.setLoadingFinishedCallback(this.loadingFinished.bind(this));
		//let records:string[] = this.evaluationService.getCurrentLikabilityLevel2();
		let records:string[] = this.storageService.localState.feedbackList;
		if(records.length != 0)
			this.feedbackController.loadRecordList(records);
		else
			this.feedbackController.loadDummyList();
	}
    
    loadingFinished()
	{
		let entry = this.feedbackController.displayData[this.index];
		this.image = entry.thumbnail;
		this.record = entry.record;
		this.items = entry.entries;
		this.overlay.setImageService(entry.image_service);
		
		for(let i of this.items)
			i.check = false;
		this.loading = false;
	}
	
    openOverlay()
	{
		this.overlay.open();
	}
	
	checkImage()
	{
		if(!this.imageChecked)
		{
			this.imageElement.nativeElement.style.opacity = 0.2;
			this.imageElement2.nativeElement.style.opacity = 1.0;
			this.imageChecked = true;
		}
		else
		{
			this.imageElement.nativeElement.style.opacity = 1.0;
			this.imageElement2.nativeElement.style.opacity = 0.0;
			this.imageChecked = false;
		}
	}
	
	send()
	{
		let l3 = new Level3Like();
		for(let entry of this.items)
			if(entry.check)
				l3.likedFields.push(entry.value);
		l3.comment = this.comment;
		l3.recordID = this.record;
		let index = this.storageService.localState.feedbackList.indexOf(l3.recordID);
		if(index != -1 && index <= this.storageService.localState.feedbackList.length)
			this.storageService.localState.feedbackList.splice(index, 1);
		
		this.storageService.localState.likedLevel3.push(l3);
		//this.evaluationService.publishLikabilityLevel3(l3);
		
		this.router.navigate(['/home']);
		this.storageService.saveLocalState();
	}
 
}
