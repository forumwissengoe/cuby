import {Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import * as LidoReader from "../../../data/LidoReader"
import { Direction, StackConfig, Stack, Card, ThrowEvent, DragEvent, SwingStackComponent, SwingCardComponent } from 'angular2-swing'
import {OverlayComponent} from '../overlay/overlay.component';

@Component({
	selector: 'app-visionary',
	templateUrl: './visionary.page.html',
	styleUrls: ['./visionary.page.scss'],
})
export class VisionaryPage implements OnInit {

	@ViewChild('swingStack1') swingStack: SwingStackComponent;
	@ViewChildren('swingCards1') swingCards: QueryList<SwingCardComponent>;
	@ViewChild('overlay') overlay: OverlayComponent;

	cards: Array<any>;
	removedCards: Array<ElementRef>;

	image:string = "../../assets/icon/static_px.png";

	stackConfig: StackConfig;

	constructor()
	{
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

		this.cards = [];
		this.removedCards = [];

		const reader = new LidoReader.LidoReader();
		const self = this;
		const links = ["record_kuniweb_945664", "record_kuniweb_666297", "record_kuniweb_943917", "record_kuniweb_681925", "record_kuniweb_854325"];//, "record_kuniweb_944543"];


		for(let i = 0; i < links.length; i++)
		{
			const xhr = new XMLHttpRequest();
			xhr.open("GET", "https://sammlungen.uni-goettingen.de/lidoresolver?id=" + links[i]);
			xhr.onload = function(ev) {
				if(xhr.readyState === 4)
				{
					if(xhr.status === 200)
					{
						reader.readLido(xhr.responseText).then((result) => {
						  //console.log(result);
							let tmp = Array();
							for(let i = 0; i < result.lido.descriptiveMetadata[0].objectRelationWrap[0].relatedWorksWrap[0].relatedWorkSet.length; i++)
							{
							  let x = result.lido.descriptiveMetadata[0].objectRelationWrap[0].relatedWorksWrap[0].relatedWorkSet[i].relatedWorkRelType[0].term[1];
							  if(x === "Sammlung")
								  tmp.push(result.lido.descriptiveMetadata[0].objectRelationWrap[0].relatedWorksWrap[0].relatedWorkSet[i].relatedWork[0].displayObject[0]);
							}

							let data = {
							  image: result.lido.administrativeMetadata[0].resourceWrap[0].resourceSet[0].resourceRepresentation[0].linkResource[0]._,
							  title: result.lido.descriptiveMetadata[0].objectIdentificationWrap[0].titleWrap[0].titleSet[0].appellationValue[0],
							  location: result.lido.descriptiveMetadata[0].objectIdentificationWrap[0].repositoryWrap[0].repositorySet[0].repositoryLocation[0].namePlaceSet[0].appellationValue[0],
							  collection: tmp
							};
							//console.log("IMAGE:", data.image);
							//console.log("TITLE:", data.title);
							//console.log("LOCATION: ", data.location);
							//console.log("COLLECTION: ", data.collection);

							self.cards.push({ name: data.title, title: data.title, image: data.image, location: data.location, collection: data.collection})
						});

					}
					else {
		            	console.error(xhr.statusText);
					}
				}
			};
		  	xhr.send();
		}
	}

	ngAfterViewInit() {	}

	onItemMove(element, x, y, r)
	{
		let hex = Math.trunc(Math.min(16*16 - Math.abs(x), 16*16)).toString(16);

		element.style.background = x > 0 ? ('#FF' + hex + hex) : ('#' + hex + "FF" + hex);
		element.style['transform'] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
	}

	onThrowOut(like: boolean) {
		let removedCard = this.cards.pop();
		this.removedCards.push(removedCard);

		this.image = "../../assets/icon/static_px.png";

		this.overlay.show_overlay();

		setTimeout(() => {
			if(like) this.image = "../../assets/icon/check_animated.gif";
			else this.image = "../../assets/icon/decline_animated.gif";
		}, 500);

	}

	ngOnInit() {
	}

	reload()
	{
		for(let i = 0; i < this.removedCards.length; i++)
			this.cards.push(this.removedCards[i]);
		this.removedCards = [];
	}

}
