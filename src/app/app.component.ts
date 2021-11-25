import { Component } from '@angular/core';

import {ModalController, Platform} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {Router} from '@angular/router';
import { NFC, Ndef } from '@ionic-native/nfc/ngx';
import {StorageService} from './storage.service';
import {NdefEvent, NdefRecord} from '@ionic-native/nfc';
import {FeedbackPageModal} from './modals/feedback/feedback-page-modal.component';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss']
})
export class AppComponent {
	
	constructor(
		private platform: Platform,
		private splashScreen: SplashScreen,
		private statusBar: StatusBar,
		private router: Router,
		private nfc: NFC,
		private ndef: Ndef,
		private storageService:StorageService,
		private modalCtrl: ModalController
	) {
		this.initializeApp();
	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.overlaysWebView(false);
			// Uni Blau
			this.statusBar.backgroundColorByHexString('#113e74');
			this.splashScreen.hide();
		});
	}
  
	ngOnInit() {
		this.platform.ready().then(() => this.platformReady());
	}
	
	// Execute startup and load configurations
	platformReady()
	{
		if(this.platform.is('cordova'))
		{
			this.nfc.addNdefListener().subscribe((event:NdefEvent) => {
				console.log("Tag found");
				console.log("Event: ", event);
				this.readTag(event.tag.ndefMessage);
			});
			this.storageService.cordovaAvailable = true;
		}
		
		this.storageService.startup();
		
		this.platform.pause.subscribe(e => this.storageService.saveLocalState());
		window.addEventListener('beforeunload', () => this.storageService.saveLocalState());
	}
	
	readTag(messages:NdefRecord[])
	{
		let result:string[] = [];
		for(let msg of messages)
			result.push(this.nfc.bytesToString(msg.payload.slice(3)));
		console.log("Payloads: ", result);
		this.storageService.setNFCRecord(result);
		this.router.navigate(['/nfc-pick-page']);
	}

	async presentFeedbackModal() {
		const modal = await this.modalCtrl.create({
			component: FeedbackPageModal
		});
		return await modal.present();
	}
}
