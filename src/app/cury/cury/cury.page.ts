import { Component } from '@angular/core';
import {CuryControllerService} from '../cury.controller.service';
import {Router} from '@angular/router';
import {StorageService} from '../../storage.service';
import {Direction, StackConfig} from 'angular2-swing';
import {ModalController, Platform} from '@ionic/angular';
import {Subscription} from 'rxjs';

@Component({
  	selector: 'app-cury',
  	templateUrl: './cury.page.html',
  	styleUrls: ['./cury.page.scss'],
})
export class CuryPage {
	
	loading:boolean = true;
	size: number;
	cards: any;
	stackConfig: StackConfig;
	
	likedCards: any;
	dislikedCards: any;
	
	backButtonSubscription:Subscription = null;
	
	constructor(private curyController:CuryControllerService, private router:Router, private storageService:StorageService, private modalCtrl: ModalController, private platform: Platform)
	{
		this.loading = true;
		this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(9999, () => {});
		this.curyController.setCuryLoadingFinishedCallback(this.onElementsLoaded.bind(this));
		this.curyController.initialLoad();
		
		this.stackConfig = {
			allowedDirections: [Direction.LEFT, Direction.RIGHT],
			throwOutConfidence: (offsetX, offsetY, element) => {
				return Math.min(Math.max(Math.abs(offsetX) / (element.offsetWidth / 1.7), Math.abs(offsetY) / (element.offsetHeight / 2)), 1);
			},
			transform: (element, x, y, r) =>
			{
				let hex = Math.trunc(Math.min(16*16 - Math.abs(x), 16*16)).toString(16);
				if(Math.abs(x) < 0.5)
					element.style['background-color'] = ('#FFFFFFFF');
				else
					element.style['background-color'] = x > 0 ? ('#FF' + hex + hex) : ('#' + hex + "FF" + hex);
				element.style['transform'] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
			},
			
			throwOutDistance: (d) => {
				return 400;
			},
		};
		console.log("Constructor");
		this.cards = [];
		this.likedCards = [];
		this.dislikedCards = [];
	}
	
	ionViewWillEnter()
	{
		if(!this.curyController.curyCurrentlyLoading && this.size < CuryControllerService.NUMBER_ELEMENTS)
			this.curyController.loadNewImages(CuryControllerService.NUMBER_ELEMENTS - this.size);
	}
	
	onElementsLoaded()
	{
		for(let i = 0; i < this.curyController.curyImages.length; i++)
			this.cards.push({image: this.curyController.curyImages[i].getThumbnailImageUrl(),
				image_service: this.curyController.curyImages[i].getImageService(),
				record: this.curyController.curyImages[i].record_id});
		this.size = this.cards.length;
		this.loading = false;
	}
	
	onThrowOut(like: boolean)
	{
		let card = this.cards.pop();
		let index = this.storageService.localState.curyStack.indexOf(card.record);
		if(index != -1 && index <= this.storageService.localState.curyStack.length)
			this.storageService.localState.curyStack.splice(index, 1);
		
		if(like)
		{
			this.likedCards.push(card);
			this.storageService.setLikedLevel1(card.record);
			this.storageService.localState.detailsList.push({record: card.record, feedback: false});
		}
		else
			this.dislikedCards.push(card);
	
		if(this.likedCards.length + this.dislikedCards.length >= this.size && this.storageService.localState.detailsList.length == 0)
		{
			this.storageService.saveLocalState();
			this.backButtonSubscription.unsubscribe();
			this.modalCtrl.dismiss({'home': true});
		}
		else if(this.likedCards.length + this.dislikedCards.length >= this.size)
		{
			this.storageService.saveLocalState();
			this.backButtonSubscription.unsubscribe();
			this.modalCtrl.dismiss({'home': false});
		}
	}
	
	home()
	{
		this.storageService.saveLocalState();
		this.backButtonSubscription.unsubscribe();
		this.modalCtrl.dismiss({'home': true});
	}
	
	cardStyle(index:number)
	{
		return {
			"background-image": 'url(' + this.cards[index].image + ')',
			"transform": "translate( 0, " + (this.cards.length -1 - index)*5 + "px)"
		}
	}

}
