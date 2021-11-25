import {Component, Renderer2} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {PicyController} from '../picy.controller.service';
import {DisplayPage} from '../display/display.page';
import {MapPage} from '../map/map.page';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage {
	
	gallery = [];
	menuOpen:boolean = false;
	galleryType:string = "grid";
	loading:boolean = true;
	
	constructor(private renderer:Renderer2, private picyController:PicyController, private modalCtrl: ModalController)
	{}
	
	ionViewWillEnter()
	{
		this.picyController.setGalleryLoadingFinishedCallback(this.galleryLoadingFinishedCallback.bind(this));
		this.picyController.loadGallery();
	}
  	
  	galleryLoadingFinishedCallback()
	{
		this.gallery = this.picyController.menuEntries;
		this.loading = false;
	}
	
	refreshGallery(event)
	{
		this.picyController.setGalleryLoadingFinishedCallback(() => {event.target.complete(); this.gallery = this.picyController.menuEntries; });
		this.picyController.loadGallery();
	}
	
	galleryTypeSelected(type)
	{
		if(type === this.galleryType)
			return;
		this.loading = true;
		this.gallery = [];
		this.galleryType = type;
		if(type === "grid")
			this.picyController.gallerySelectAll();
		else if(type === "place")
			this.picyController.gallerySelectPlace();
		else if(type === "time")
			this.picyController.gallerySelectTime();
		this.gallery = this.picyController.menuEntries;
		this.loading = false;
	}
	
	openMap()
	{
		const _self = this;
		(async function () {
			const modal = await _self.modalCtrl.create({
				component: MapPage,
			});
			return await modal.present();
		})();
	}
	
	galleryEntrySelected(record)
	{
		const _self = this;
		(async function() {
			const modal = await _self.modalCtrl.create({
				component: DisplayPage,
				componentProps: {
					'recordID': record,
					'index': 0
				}
			});
			return await modal.present();
		})();
	}

}
