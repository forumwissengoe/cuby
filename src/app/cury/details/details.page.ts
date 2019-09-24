import {Component, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ImageOverlay} from '../../components/overlay/image-overlay.component';
import {DetailsController} from './details.controller.service';
import {IonSlides} from '@ionic/angular';
import {Router} from '@angular/router';
import {StorageService} from '../../storage.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit
{
    @ViewChild('detailsOverlay') overlay: ImageOverlay;
    @ViewChild('slides') slides: IonSlides;
    
    current_number:number = 1;
    total_number:number = 0;
    loading:boolean = true;
    
    slideOpts:any = {
        effect: 'flip',
    };

    displayData:any = [];
    displayItems:any = [{label: "Standort", value: ""}, {label: "Datierung", value: ""}, {label: "Beteiligte", value: ""}, {label: "Maße / Umfang", value: ""}];

    constructor(private renderer: Renderer2, private detailsController:DetailsController, private router:Router, private storageService:StorageService) {}
	
    
    ngOnInit() {}
    
    ionViewWillEnter()
	{
		this.loading = true;
		this.detailsController.setLoadingFinishedCallback(this.loadingFinishedCallback.bind(this));
		this.detailsController.clearDisplayData();
		//let records:string[] = this.evaluateService.getCurrentLikabilityLevel1();
		let records:{record: string, feedback: boolean}[] = this.storageService.localState.detailsList;
		if(records.length != 0)
			this.detailsController.loadRecordList(records.map(x => x.record));
		else
			this.detailsController.loadDummyList();
	}
    
    slideChanged()
	{
		this.slides.getActiveIndex().then((index:number) => {
			this.current_number = index +1;
		});
	}
    
    loadingFinishedCallback()
	{
		this.displayData = this.detailsController.displayData;
		this.total_number = this.detailsController.displayData.length;
		this.loading = false;
	}
    
    overlayOpen(data:any)
    {
    	this.overlay.setImageService(data.image_service);
    	this.overlay.open();
    }
    
    voted(data:any, like:boolean)
	{
		data.like = like;
		//this.evaluateService.removeCurrentLevel1(data.record);
		
		let index = this.storageService.localState.detailsList.indexOf(data.record);
		if(index != -1 && index <= this.storageService.localState.detailsList.length)
			this.storageService.localState.detailsList.splice(index, 1);
		
		if(like)
		{
			//this.evaluateService.publishLikabilityLevel2(data.record);
			this.storageService.localState.likedLevel2.push(data.record);
			this.storageService.localState.feedbackList.push(data.record);
		}
		let all:boolean = true;
		for(let dat of this.displayData)
			if(dat.like == undefined)
				all = false;
		if(all)
			this.votingFinished();
		setTimeout(() => this.slides.slideNext(), 750);
	}
	
	votingFinished()
	{
		let likedOne:boolean = false;
		for(let dat of this.displayData)
			if(dat)
				likedOne = true;
		if(likedOne)
			this.router.navigate(['/feedback']);
		this.storageService.saveLocalState();
	}
}
