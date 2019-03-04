import { Component, OnInit } from '@angular/core';
import {Direction, StackConfig} from 'angular2-swing';
import * as LidoReader from "../../data/LidoReader"

@Component({
  selector: 'app-cury',
  templateUrl: './cury.page.html',
  styleUrls: ['./cury.page.scss'],
})
export class CuryPage implements OnInit {

	public static NUMBER_ELEMENTS:number = 8;


	cards: any;
	stackConfig: StackConfig;

	likedCards: any;
	dislikedCards: any;

	constructor() {

		this.cards = [];
		this.stackConfig = {
			allowedDirections: [Direction.LEFT, Direction.RIGHT],
			throwOutConfidence: (offsetX, offsetY, element) => {
				return Math.min(Math.max(Math.abs(offsetX) / (element.offsetWidth / 1.7), Math.abs(offsetY) / (element.offsetHeight / 2)), 1);
			},
			transform: (element, x, y, r) => this.onItemMove(element, x, y, r),

			throwOutDistance: (d) => {
				return 800;
			}
		};

		this.likedCards = [];
		this.dislikedCards = [];
		this.onloadElements();
	}

	ngOnInit() {

	}

	onItemMove(element, x, y, r)
	{
		let hex = Math.trunc(Math.min(16*16 - Math.abs(x), 16*16)).toString(16);

		element.style.background = x > 0 ? ('#FF' + hex + hex) : ('#' + hex + "FF" + hex);
		element.style['transform'] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
	}

	onloadElements()
	{
		let elements:any = [];

		// TODO Request new elements from server
		for(let i = 0; i < CuryPage.NUMBER_ELEMENTS; i++)
		{
			switch (i%4) {
				case 0:
					elements.push({image: "http://www.kiplinger.com/kipimages/pages/18048.jpg"});
					break;
				case 1:
					elements.push({image: "http://www.apimages.com/Images/Ap_Creative_Stock_Header.jpg"});
					break;
				case 2:
					elements.push({image: "https://44u8552epjw3rivfs1yfikr1-wpengine.netdna-ssl.com/wp-content/uploads/2017/11/young-man-2939344_1280.jpg"});
					break;
				case 3:
					elements.push({image: "http://www.adweek.com/files/2015_May/iStock-Unfinished-Business-6.jpg"});
					break;
			}
		}

		this.cards = elements;
	}

	onThrowOut(like: boolean)
	{
		if(like)
			this.likedCards.push(this.cards.pop());
		else
			this.dislikedCards.push(this.cards.pop());
	}

}
