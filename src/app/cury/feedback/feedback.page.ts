import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-feedback',
	templateUrl: './feedback.page.html',
	styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {
	
	image:string = "http://www.adweek.com/files/2015_May/iStock-Unfinished-Business-6.jpg";
	
	items:any = [{label: "Standort", value: "Kunstsammlung der Univeristät"}, {label: "Datierung", value: "1513"}, {label: "Beteiligte", value: "Altdorfer, Albrecht"}, {label: "Maße / Umfang", value: "Breite: 99mm"}];
	
	constructor() { }

    ngOnInit() {
		
    }

}
