import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Level3Like, StorageService} from '../../storage.service';
import {AlertController, IonSlides, ModalController} from '@ionic/angular';
import {CuryPage} from '../cury/cury.page';
import {ImageOverlay} from '../../components/overlay/image-overlay.component';
import {CuryControllerService, DetailsObject} from '../cury.controller.service';
import {oc} from 'ts-optchain';
import * as $ from 'jquery';
import {DataLoader} from '../../../data/DataLoader';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.page.html',
  styleUrls: ['./carousel.page.scss'],
})
export class CarouselPage {
	
	@ViewChild('carouselOverlay') overlay: ImageOverlay;
	@ViewChild('slides') slides: IonSlides;
	swiper: any = null;
	
	current_number: number = 1;
	total_number:   number = 1;
	index:			number = 0;
	
	loading: boolean = true;
	dummy:   boolean = false;
	
	entries:DetailsObject[] = [];
	object:DetailsObject = null;
	
	constructor(private renderer: Renderer2,
				private router:Router,
				private storageService:StorageService,
				private modalCtrl: ModalController,
				private curyCtrl: CuryControllerService,
				private alertCtrl: AlertController
	) { }
	
	ionViewWillEnter() {
		this.loadRecords();
	}
	
	loadRecords()
	{
		this.loading = true;
		let records:{record: string, feedback: boolean}[] = this.storageService.localState.detailsList;
		this.curyCtrl.setDetailLoadingFinishedCallback(this.loadingFinishedCallback.bind(this));
		this.curyCtrl.clearEntries();
		if(records.length != 0)
			this.curyCtrl.loadDetailRecordList(records);
		else if(this.dummy)
			this.curyCtrl.loadDetailDummyList();
		else
			this.openCury();
	}
	
	slideDidChange($event)
	{
		this.swiper = (<any>this.slides).el.swiper;
		let tmp = oc($event).target.swiper.realIndex(undefined);
		if(tmp === undefined)
		{
			this.slides.slideTo(this.index);
		}
		else {
			this.index = tmp;
			this.current_number = this.index + 1;
			this.object = this.entries[tmp];
		}
	}
	
	loadingFinishedCallback(errorCode:number)
	{
		if(!errorCode)
		{
			this.entries = this.curyCtrl.detailEntries;
			this.object = this.entries[0];
			this.total_number = this.curyCtrl.detailEntries.length;
		}
		else
			console.error(errorCode);
		this.loading = false;
	}
	
	overlayOpen(data:any)
	{
		this.overlay.setImageService(this.entries[this.index].image_service);
		this.overlay.open();
	}
	
	voted(like:boolean)
	{
		if(like)
		{
			this.entries[this.index].selected = true;
			this.storageService.localState.detailsList.forEach(x => { if(x.record === this.entries[this.index].record) x.feedback = true; });
			this.storageService.setLikedLevel2(this.entries[this.index].record);
		}
		else {
			this.removeEntry(this.entries[this.index].record);
		}
		this.swiper.update();
	}
	
	async send()
	{
		const alert = await this.alertCtrl.create({
			message: "Feedback senden?",
			buttons: [
				{
					text: "Nein",
					role: 'cancel',
				},
				{
					text: "Ja",
					handler: () => this._send()
				}
			]
		});
		await alert.present();
	}
	
	_send() {
		this.storageService.setLikedLevel3(this.entries[this.index].record, this.entries[this.index].feedbackObject.entries.filter(x => x.check).map(x => x.value), this.entries[this.index].feedbackObject.comment);
		this.storageService.localState.picyGallery.push(this.entries[this.index].record);
		this.storageService.saveLocalState();
		this.removeEntry(this.entries[this.index].record);
	}
	
	removeEntry(record: string)
	{
		this.swiper = (<any>this.slides).el.swiper;
		
		let ind = -1;
		for(let i = 0; i < this.storageService.localState.detailsList.length; i++)
			if(this.storageService.localState.detailsList[i].record === record)
				ind = i;
		if (ind != -1 && ind < this.storageService.localState.detailsList.length)
			this.storageService.localState.detailsList.splice(ind, 1);
		
		let obj = this.storageService.localState.feedbackData.find(x => x.record === record);
		DataLoader.publishFeedback(obj, this.storageService);
		
		this.swiper.removeSlide(this.index);
		this.entries.splice(this.index, 1);
		this.total_number = this.entries.length;
		if(this.entries.length === 0)
			this.openCury();
	}
	
	openCury()
	{
		const self = this;
		(async function() {
			const modal = await self.modalCtrl.create({
				component: CuryPage
			});
			await modal.present();
			const { data } = await modal.onWillDismiss();
			if(data.home)
				self.router.navigate(["/home"]);
			else
				self.loadRecords();
		})();
	}
}
