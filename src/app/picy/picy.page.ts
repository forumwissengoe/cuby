import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Events, MenuController} from '@ionic/angular';
import {ImageOverlay} from '../additions/overlay/image-overlay.component';
import {PicyController, PicyObject} from './picy.controller.service';


@Component({
	selector: 'app-picy',
	templateUrl: './picy.page.html',
	styleUrls: ['./picy.page.scss'],
})
export class PicyPage implements OnDestroy {

	@ViewChild("rightsElem") rights_element:ElementRef;
	@ViewChild("imgElem") image_element:ElementRef;
	@ViewChild("overlay") overlay:ImageOverlay;
	
	loading:boolean = true;
	
	dataObject:PicyObject = new PicyObject();
	index:number = 0;
	rights_shown:boolean = false;
	
	constructor(private menuCtrl: MenuController, private renderer:Renderer2, private events:Events, private picyController:PicyController)
	{
		this.picyController.setLoadingFinishedCallback(this.galleryLoadingFinishedCallback.bind(this));
		this.picyController.setMenuLoadingFinishedCallback(this.menuLoadingFinishedCallback.bind(this));
	}
	
	ionViewWillEnter() {
		this.loading = true;
		this.menuCtrl.enable(true, "picyMenu");
		this.events.subscribe("picy:MenuSelected", this.select.bind(this));
		this.overlay.setCloseCallback(this.callback.bind(this));
		this.picyController.loadGallery();
		this.index = this.picyController.getInitIndex();
	}
	
	ngOnDestroy()
	{
		this.menuCtrl.enable(false, "picyMenu");
	}
	
	menuLoadingFinishedCallback()
	{
		console.log("Loading finished callback");
		console.log("Menu entries", this.picyController.menuEntries);
		this.events.publish('picy:MenuChanged', this.picyController.menuEntries);
	}
	
	galleryLoadingFinishedCallback()
	{
		this.overlay.setImageService(this.picyController.dataset[this.index].image_service[0]);
		this.dataObject = this.picyController.dataset[this.index];
		this.loading = false;
	}
	
	show(min:boolean)
	{
		if(min) return "ios-arrow-forward";
		else return "ios-arrow-down";
	}
	
	image_information(event:Event)
	{
		event.stopPropagation();
		if(!this.rights_shown)
		{
			this.image_element.nativeElement.style.opacity = 0.2;
			this.rights_element.nativeElement.style.opacity = 1.0;
		}
		else {
			this.image_element.nativeElement.style.opacity = 1.0;
			this.rights_element.nativeElement.style.opacity = 0.0;
		}
		this.rights_shown = !this.rights_shown;
	}
	
	overlayOpen(img:any)
	{
		this.menuCtrl.enable(false);
		if(!this.rights_shown)
		{
			this.overlay.setImageService(img);
			this.overlay.open();
		}
	}
	
	callback()
	{
		this.menuCtrl.enable(true);
	}
	
	openAll()
	{
		for(let i = 0; i < this.dataObject.cards.length; i++)
		{
			this.dataObject.cards[i].min = false;
		}
	}
	closeAll()
	{
		for(let i = 0; i < this.dataObject.cards.length; i++)
		{
			this.dataObject.cards[i].min = true;
		}
	}
	
	next()
	{
		this.index = this.picyController.getNextIndex();
		this.dataObject = this.picyController.dataset[this.index];
	}
	
	previous()
	{
		this.index = this.picyController.getPreviousIndex();
		this.dataObject = this.picyController.dataset[this.index];
	}
	
	select(record:string)
	{
		let tmp = this.picyController.getIndexForRecord(record);
		if(tmp != undefined)
		{
			this.index = tmp;
			this.dataObject = this.picyController.dataset[this.index];
		}
		this.menuCtrl.close("picyMenu");
	}
}