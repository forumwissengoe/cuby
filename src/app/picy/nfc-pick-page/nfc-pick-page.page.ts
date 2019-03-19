import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {DataLoader} from '../../../data/DataLoader';
import {IiiFObject} from '../../../data/IiiFObject';
import {StorageService} from '../../storage.service';
import * as OtpCrypto from 'otp-crypto';
import * as Base64 from 'base-64';

@Component({
  selector: 'app-nfc-pick-page',
  templateUrl: './nfc-pick-page.page.html',
  styleUrls: ['./nfc-pick-page.page.scss'],
})
export class NfcPickPagePage implements OnInit {
	
	private secret:string = 'LXKR7AM5XnnqCfOGksmeY+ETTzPcC1EYePrlX9YHfIoZDMCfjkQYLz9uh/7u47hqoCo=';
	private prefix:string = '000';
	
	dummyRecord:string = "record_kuniweb_1290372";
	
	loading:boolean = true;
	
	// Record
	image = "https://sammlungen.uni-goettingen.de/rest/image/record_kuniweb_1290372/record_kuniweb_1290372_509821.jpg/full/520,/0/default.jpg";
	title_header = "Objektbezeichnung";
	title_data = "Title";
	recordID = "";
	
	constructor(private router:Router, private storageService:StorageService)
	{
		let records = this.storageService.getNFCRecord();
		console.log("Records", records);
		if(records.length == 0)
			this.loadObjekt(this.dummyRecord);
		else
			this.decryptRecords(records);
			//this.decryptRecords("HUKhnmZaMQuOVpjz/KDpBoNMeQTqMmAu");
	}

	ngOnInit() {
	}
	
	decryptRecords(data:any[])
	{
		let result = "";
		for(let i = 0; i < data.length; i++)
		{
			let encrypted = data[i];
			console.log("Enc:", encrypted);
			
			var raw = Base64.decode(this.secret);
			let key = new Uint8Array(new ArrayBuffer(raw.length));
			
			for(let i = 0; i < raw.length; i++) {
				key[i] = raw.charCodeAt(i);
			}
			
			const otpDecrypted = OtpCrypto.decrypt(encrypted, key);
			let str:string = otpDecrypted.plaintextDecrypted;
			
			let strings:string[] = str.split("|");
			if(strings.length > 1)
				str = strings[Math.floor(Math.random() * strings.length -1)];
			
			console.log("Str ", str);
			
			if(str.indexOf("record_") != -1 && str.startsWith(this.prefix))
			{
				str = str.replace(this.prefix, "");
				console.log("Load", str);
				this.loadObjekt(str);
			}
			else if(!str.startsWith(this.prefix))
			{
				// TODO Nice try
				str = "";
			}
		}
		if(result == "")
		{
			console.log("Could not read record. Maybe wrong format?");
		}
		else
			console.log("Res", result);
		
	}
	
	loadObjekt(record:string)
	{
		DataLoader.downloadManifest(this.storageService, record).then((iiif:IiiFObject) => {
			this.image = iiif.getThumbnailForAttributes(undefined, this.storageService.config.viewHeight * 0.3);
			this.title_data = iiif.label;
			this.loading = false;
			this.recordID = record;
		});
	}
	
	addToSelection()
	{
		if(this.recordID != "")
			this.storageService.localState.picyGallery.push(this.recordID);
		else
			alert("Fehler beim Speichern des Objektes. Versuchen Sie es nochmal");
		this.router.navigate(['/home']);
	}
}
