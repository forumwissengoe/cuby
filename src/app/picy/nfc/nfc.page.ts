import {Component, ElementRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {StorageService} from '../../storage.service';
import {DataLoader} from '../../../data/DataLoader';
import {IiiFObject} from '../../../data/IiiFObject';
import * as OtpCrypto from 'otp-crypto';
import * as Base64 from 'base-64';
import {LidoObject} from '../../../data/LidoObject';
import {PicyObject} from '../picy.controller.service';
import {ImageOverlay} from '../../components/overlay/image-overlay.component';
import {AlertController} from '@ionic/angular';

@Component({
	selector: 'app-nfc',
	templateUrl: './nfc.page.html',
	styleUrls: ['./nfc.page.scss'],
})
export class NfcPage {
	
	private secret:string = 'LXKR7AM5XnnqCfOGksmeY+ETTzPcC1EYePrlX9YHfIoZDMCfjkQYLz9uh/7u47hqoCo=';
	private prefix:string = '000';
	
	@ViewChild("nfcRightsElem") rights_element:ElementRef;
	@ViewChild("nfcImgElem") image_element:ElementRef;
	@ViewChild("nfcOverlay") overlay:ImageOverlay;
	
	dummyRecord:string = "record_kuniweb_1290372";
	
	loading:boolean = true;
	failed:boolean = false;
	rights_shown:boolean = false;
	record:string = "";
	
	config:any = null;
	
	// Record
	image = "https://sammlungen.uni-goettingen.de/rest/image/record_kuniweb_1290372/record_kuniweb_1290372_509821.jpg/full/520,/0/default.jpg";
	title_data = "Title";
	
	dataObject:PicyObject = null;
	iiif: IiiFObject = null;
	lido: LidoObject = null;
	
	constructor(private router:Router, private storageService:StorageService, private alertCtrl: AlertController)
	{
		this.loading = true;
		DataLoader.loadPicyConfigFile(this.storageService).then((config:any) => this.config = config);
		let records = this.storageService.getNFCRecord();
		if(records.length == 0)
		{
			this.record = this.dummyRecord;
			this.loadObjekt();
		}
		else
			this.decryptRecords(records);
		//this.decryptRecords("HUKhnmZaMQuOVpjz/KDpBoNMeQTqMmAu");
	}
	
	decryptRecords(data:any[]) {
		let result = "";
		for (let i = 0; i < data.length; i++) {
			let encrypted = data[i];
			console.log("Enc:", encrypted);
			
			var raw = Base64.decode(this.secret);
			let key = new Uint8Array(new ArrayBuffer(raw.length));
			
			for (let i = 0; i < raw.length; i++) {
				key[i] = raw.charCodeAt(i);
			}
			
			const otpDecrypted = OtpCrypto.decrypt(encrypted, key);
			let str: string = otpDecrypted.plaintextDecrypted;
			
			let strings: string[] = str.split("|");
			if (strings.length > 1)
				str = strings[Math.floor(Math.random() * strings.length - 1)];
			
			console.log("Str ", str);
			
			if (str.indexOf("record_") != -1 && str.startsWith(this.prefix)) {
				str = str.replace(this.prefix, "");
				console.log("Load", str);
				this.record = str;
				this.loadObjekt();
			} else if (!str.startsWith(this.prefix)) {
				str = "";
				const self = this;
				(async function() {
					const alert = await self.alertCtrl.create({
						header: 'Hmm...',
						message: 'Netter Versuch. Die Tags sind selbstverständlich verschlüsselt.',
						buttons: ['Schade']
					});
					await alert.present();
				})();
			}
		}
		if (result == "")
			console.log("Could not read record. Maybe wrong format?");
		else
			console.log("Res", result);
	}
	
	loadObjekt()
	{
		this.loading = true;
		let iiif_l, lido_l;
		Promise.all([
			DataLoader.downloadManifest(this.storageService, this.record).then((iiif:IiiFObject) => {
				iiif_l = iiif;
				this.image = iiif.getThumbnailForAttributes(undefined, this.storageService.configuration.viewHeight * 0.3);
				this.title_data = iiif.label;
			}),
			DataLoader.downloadLIDO(this.storageService, this.record).then((lido:LidoObject) => {
				lido_l = lido;
			})]).then(() => {
				this.dataObject = new PicyObject().load(lido_l, iiif_l, this.config, this.storageService, this.storageService.configuration.viewHeight);
		})
			.catch((e) => { console.error(e); this.failed = true; })
			.finally(() => this.loading = false);
	}
	
	addToSelection()
	{
		if(this.record != "")
		{
			let already:boolean = false;
			for(let rec of this.storageService.localState.picyGallery)
				if(rec === this.record)
					already = true;
			if(!already)
				this.storageService.localState.picyGallery.push(this.record);
			
		}
		else
			alert("Fehler beim Speichern des Objektes. Versuchen Sie es nochmal");
		this.router.navigate(['/home']);
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
	
	openOverlay(image_service)
	{
		if(!this.rights_shown)
		{
			this.overlay.setImageService(image_service);
			this.overlay.open();
		}
	}
}
