import { Component, OnInit } from '@angular/core';
import {StorageService} from '../../storage.service';
import {ActivatedRoute} from '@angular/router';
import {DataLoader} from '../../../data/DataLoader';
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-milstone',
  templateUrl: './milestone-page.component.html',
  styleUrls: ['./milestone-page.component.scss'],
})
export class MilestonePage implements OnInit {
	
	categoryName:string = "Objektgattung";
	categoryID:string = "";
	progress:number = 0;
	congrats:boolean = false;
	booh:boolean = false;
	
  	constructor(private storageService:StorageService, private route: ActivatedRoute, private alertCtrl: AlertController) { }

	ngOnInit()
	{
		this.categoryID = this.route.snapshot.paramMap.get('id');
		this.categoryName = this.storageService.getCategoryNameForType(this.categoryID);
		
		if(this.storageService.localState.homyPostHighscoreAsk != null)
			this.askAgain = this.storageService.localState.homyPostHighscoreAsk;
		
		if(this.storageService.localState.homyPostHighscore != null)
			this.autoPost = this.storageService.localState.homyPostHighscore;

		if(this.storageService.homyState.correct_records != [])
			for(let item in this.storageService.homyState.correct_records)
				this.storageService.localState.picyGallery.push(item);

		let target = 100;
		if(this.storageService.homyState && this.storageService.homyState.current_points != undefined)
		{
			target = this.storageService.homyState.current_points * 10;
			this.storageService.homyState.current_points = 0;
		}
		
		const interval = setInterval(() => {
			if(this.progress >= target)
			{
				clearInterval(interval);
				if(target >= 100)
					setTimeout(() => this.congrats = true, 150);
				if(target == 0)
					setTimeout(() => this.booh = true, 150);
			}
			else
				this.progress++;
			
		}, 25);
		
		const timeout = setTimeout(() => {
			if(this.askAgain)
				this.askPublishHighscore();
			else if(this.autoPost)
				this.publishHighscore(true);
		}, 2000);
  	}
  	
	askAgain:boolean = false;
  	autoPost:boolean = false;
  	
  	async askPublishHighscore()
	{
		const alert = await this.alertCtrl.create({
			header: "Highscore: " + this.storageService.homyState.total_points,
			message: `<b>Möchtest du deinen neuen Highscore veröffentlichen?</b>`,
			inputs: [
				{
					name: 'askItAgain',
					type: 'checkbox',
					label: 'Nicht wieder fragen',
					value: 'dontAskAgain',
					checked: !this.askAgain
				}
			],
			buttons: [
				{
					text: "Ja",
					handler: (data:any[]) =>
					{
						this.askAgain = data.indexOf('dontAskAgain') == -1;
						this.publishHighscore(true);
					}
				},
				{
					text: "Nein",
					handler: (data:any[]) =>
					{
						this.askAgain = data.indexOf('dontAskAgain') == -1;
						this.publishHighscore(false);
					}
				}
			]
		});
		await alert.present();
	}
	
  	
  	
  	publishHighscore(should:boolean)
	{
		console.log("Ask Again: ", this.askAgain);
		if(should)
		{
			console.log("Publishing highscore...");
			if(this.storageService.homyState && this.storageService.homyState.total_points != undefined)
			{
				if(this.storageService.configuration && this.storageService.configuration.homy_highscore_url && this.storageService.configuration.homy_highscore_url != "")
					DataLoader.publishHomyHighscore(this.storageService.configuration.homy_highscore_url, this.storageService.homyState.total_points)
						.then(() => console.log("Published highscore"))
						.catch(() => console.log("Failed to publish highscore"));
				else
					console.log("Failed to find homys config or highscore_url");
			}
			else
				console.log("Failed to find homys state or total_points");
		}
		else
		{
			console.log("Don't publish highscore");
		}
		this.storageService.localState.homyPostHighscore = this.askAgain;
	}

}
