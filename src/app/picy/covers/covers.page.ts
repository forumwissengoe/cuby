import {Component, OnInit, ViewChild} from '@angular/core';
import {QRScanner, QRScannerStatus} from '@ionic-native/qr-scanner/ngx';
import {Router} from '@angular/router';
import {SocketService} from './socket.service';
import {Subject} from 'rxjs';
import {VoteIconGroup} from '../../cury/details/VoteIconGroup';
import {map} from 'rxjs/operators';
import {StorageService} from '../../storage.service';

@Component({
  selector: 'app-covers',
  templateUrl: './covers.page.html',
  styleUrls: ['./covers.page.scss'],
})
export class CoversPage implements OnInit {

	private firstOpening:boolean = true;
	private sotd:string = "pqmwpn";
	
	private image:string = "../../assets/images/ripple-loading.svg";
	
	chat_host:string = "localhost";
	chat_port:string = "6389";
	
	@ViewChild('votegroup') votegroup:VoteIconGroup;
	
	subject:Subject<string> = null;
	record:string = null;
	
	constructor(private qrScanner: QRScanner, private router: Router, private wsService: SocketService, private storageService: StorageService)
	{
	
	}

  	ngOnInit(): void
	{
		if(this.firstOpening)
		{
			this.openScanner();
			this.firstOpening = false;
		}
		
		this.connect();
	}
	
	openScanner()
	{
		this.qrScanner.prepare()
			.then((status:QRScannerStatus) => {
				if(status.authorized)
				{
					let scanSub = this.qrScanner.scan().subscribe((text:string) => {
						this.qrScanner.hide();
						scanSub.unsubscribe();
						
						const url = new URL(text);
						this.chat_host = url.hostname;
						
						this.sotd = url.pathname.replace("/vote/", "").replace(/\/[\s\S]*/, ""); // RegExp deletes everything after the first /
						
						this.connect();
					})
				}
			})
		  .catch((e: any) => console.log("Scan error: ", e));
	}
	
	connected:boolean = false;
	
	connect()
	{
		console.log("Connecting....");
		
		this.subject = <Subject<string>>this.wsService.connect("ws://" + this.chat_host + ":" + this.chat_port + "/")
							.pipe(map( (msgEvent:MessageEvent) => { return msgEvent.data } ));
		
		this.subject.subscribe(msg =>
		{
			//console.log("Msg: ", msg);
			if(msg.substring(0, 5) === "IMAG:")
			{
				msg = msg.substring(5);
				if(CoversPage.isURLvalid(msg))
				{
					this.image = msg;
					if(msg.match(/(\/record_([a-z-_])*_([a-z0-9-_])*\/)/gi) != null)
						this.record = msg.match(/(\/record_([a-z-_])*_([a-z0-9-_])*\/)/gi)[0].replace(/\//g, "");
					if(this.votegroup)
						this.votegroup.reset();
					this.connected = true;
					this.picUpBox = false;
				}
				else
					console.log("Invalid: ", msg);
			}
			else if(msg.substring(0, 4) === "INCO")
			{
				alert("Diese Verbindung ist abgelaufen.");
				if(this.votegroup)
					this.votegroup.reset();
				this.connected = false;
			}
		});
	}
	
	picUpBox:boolean = false;
	
	voted(liked)
	{
		if(this.connected)
		{
			if(liked)
			{
				this.subject.next("VOTE:+:" + this.sotd);
				this.picUpBox = true;
			}
			else
				this.subject.next("VOTE:-:" + this.sotd);
		}
	}
	
	addToPicy()
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
		console.log("Collected: ", this.record);
		this.picUpBox = false;
	}
	
	decline()
	{
		this.picUpBox = false;
	}
	
	
	
	static isURLvalid(str) {
		var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_,!.~+]*)*'+ // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
			'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
		return !!pattern.test(str);
	}
}
