import { Component, OnInit } from '@angular/core';
import {StorageService} from '../../storage.service';
import {ActivatedRoute} from '@angular/router';
import {DataLoader} from '../../../data/DataLoader';

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
	
  	constructor(private storageService:StorageService, private route: ActivatedRoute) { }

	ngOnInit()
	{
		this.categoryID = this.route.snapshot.paramMap.get('id');
		this.categoryName = this.storageService.getCategoryNameForType(this.categoryID);
		
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
		
		this.publishHighscore();
  	}
  	
  	
  	publishHighscore()
	{
		if(this.storageService.homyState && this.storageService.homyState.total_points != undefined)
		{
			if(this.storageService.homyConfig && this.storageService.homyConfig.highscore_url && this.storageService.homyConfig.highscore_url != "")
				DataLoader.publishHomyHighscore(this.storageService.homyConfig.highscore_url, this.storageService.homyState.total_points)
					.then(() => console.log("Published highscore"))
					.catch(() => console.log("Failed to publish highscore"));
		}
	}

}
