import { Component } from '@angular/core';

import {Events, MenuController, Platform} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {Router, RouterEvent} from '@angular/router';
import { NFC, Ndef } from '@ionic-native/nfc/ngx';
import {StorageService} from './storage.service';
import {NdefEvent, NdefRecord} from '@ionic-native/nfc';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss']
})
export class AppComponent {
	
	data = [];
	
	constructor(
		private platform: Platform,
		private splashScreen: SplashScreen,
		private statusBar: StatusBar,
		private router: Router,
		private menuCtrl: MenuController,
		private events: Events,
		private nfc: NFC,
		private ndef: Ndef,
		private storageService:StorageService,
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
		this.router.events.subscribe((event: RouterEvent) => {
			this.menuCtrl.enable(false);
		});
		this.events.subscribe('picy:MenuChanged', (new_data:any) => {
			this.data = new_data;
			console.log("Menu changed");
		});
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
		//this.storageService.loadConfig();
		//this.storageService.loadLocalState();
		
		this.platform.pause.subscribe(e => this.storageService.saveLocalState());
		window.addEventListener('beforeunload', () => this.storageService.saveLocalState());
	}
	
	menuEntrySelected(record:string)
	{
		this.events.publish("picy:MenuSelected", record);
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
}
