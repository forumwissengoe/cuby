import { Component, OnInit } from '@angular/core';
import {DataLoader} from '../../data/DataLoader';
import {StorageService} from '../storage.service';

@Component({
  selector: 'app-homy',
  templateUrl: './homy.page.html',
  styleUrls: ['./homy.page.scss'],
})
export class HomyPage implements OnInit {
	
	highscore:boolean = true;
	highscoreLoading:boolean = true;
	
	region:string = "100m";
	otherPlayers:any[] = [];
	
	constructor(private storageService:StorageService) { }

	ngOnInit() {}
	
	ionViewWillEnter()
	{
		this.highscoreLoading = true;
		if(!this.storageService.homyFinished)
			this.storageService.homyCallback = this.requestOtherPlayers.bind(this);
		else
			this.requestOtherPlayers();
		console.log("After view init");
	}
	
	
	// TODO region when location services finished.
	requestOtherPlayers()
	{
		let region = "all";
		
		if(this.storageService && this.storageService.homyConfig && this.storageService.homyConfig.highscore_url && this.storageService.homyConfig.highscore_url != "")
		{
			console.log("Loading Other players");
			DataLoader.requestHomyHighscore(this.storageService.homyConfig.highscore_url)
				.then((data) => {
					if(data[region] && Array.isArray(data[region]))
					{
						let arr = data[region];
						arr.sort((a, b) => {return parseInt(b) - parseInt(a);});
						this.otherPlayers = [];
						for(let a of arr)
							this.otherPlayers.push({highscore: a});
						this.highscore = true;
						if(region == "all")
							this.region = "Global";
						else
							this.region = region;
					}
					else if(data["all"] && Array.isArray(data["all"]))
					{
						let arr = data["all"];
						arr.sort((a, b) => {
							return parseInt(b) - parseInt(a);
						});
						this.otherPlayers = [];
						for (let a of arr)
							this.otherPlayers.push({highscore: a});
						this.highscore = true;
						this.region = "Global";
					}
					else
						this.highscore = false;
					this.highscoreLoading = false;
				})
				.catch((error) => {
					console.log("Highscore error: ", error);
					this.highscoreLoading = false;
				})
		}
	}
}
