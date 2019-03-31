import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homy',
  templateUrl: './homy.page.html',
  styleUrls: ['./homy.page.scss'],
})
export class HomyPage implements OnInit {
	
	highscore:boolean = false;
	
	otherPlayers:any[] = [
		{id: "", distance: ""},
		{id: "", distance: ""},
		{id: "", distance: ""},
		{id: "", distance: ""}
	];
	
	constructor() { }

	ngOnInit() {}
	
	
	// TODO
	requestOtherPlayers()
	{
	
	}
}
