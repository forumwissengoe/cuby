import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {PicyController, PicyObject} from '../picy.controller.service';
import {ImageOverlay} from '../../components/overlay/image-overlay.component';
import * as L from 'leaflet';
import * as $ from 'jquery';
import {DataLoader} from '../../../data/DataLoader';
import {oc} from 'ts-optchain';

@Component({
  	selector: 'app-display',
  	templateUrl: './display.page.html',
  	styleUrls: ['./display.page.scss'],
})
export class DisplayPage implements OnInit {
	
	@Input() recordID: string;
	
	@ViewChild("rightsElem") rights_element:ElementRef;
	@ViewChild("imgElem") image_element:ElementRef;
	@ViewChild("displayOverlay") overlay:ImageOverlay;
	
	type: number = 0;
	map: L.Map = null;
	markers: L.Marker[] = [];
	markerLayer: L.LayerGroup = null;
	timeframe: number[] = [0, 1];
	times:{time: number | undefined, timeEarly: number | undefined, timeLate: number | undefined, eventName: string | undefined, eventPlace: string | undefined}[] = [];
	
	index: number;
	dataObject:PicyObject = null;
	loading: boolean = true;
	rights_shown: boolean = false;
	
	constructor(private modalCtrl: ModalController, private picyCtrl: PicyController) { }
	
	// Open Modal
	openModal()
	{
		this.index = this.picyCtrl.getIndexForRecord(this.recordID);
		this.picyCtrl.index = this.index;
		if(document.getElementById("displayMap") && !this.map)
			this.buildMap();
		this.buildTimeline();
		this.loadNewObject(this.index);
	}
	
	// Build the Map
	buildMap()
	{
		this.map = new L.Map('displayMap').setView([51.534399, 9.934757], 12);
		L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(this.map);
		this.markerLayer = L.layerGroup().addTo(this.map);
	}
	
	// Build the Timeline
	buildTimeline()
	{}
	
	// Change the modal type (images, map or timeline)
	changeModalType(newType: number)
	{
		this.type = newType;
		if(this.type == 1 && document.getElementById("displayMap") && !this.map)
		{
			this.buildMap();
			this.loadMarkers();
		}
		else if(this.type == 1 && document.getElementById("displayMap"))
			this.loadMarkers();
		if(this.type == 2)
			this.buildTimeline();
	}
	
	// Close Modal
	closeModal()
	{
		this.map = null;
		this.markers = [];
		this.modalCtrl.dismiss();
	}
	
	// Load (new) Object
	loadNewObject(index: number)
	{
		this.loading = true;
		this.closeOldObject();
		
		this.index = index;
		this.dataObject = this.picyCtrl.dataset[this.index];
		
		// Load times
		if(this.dataObject.hasTime)
		{
			for(let event of this.dataObject.lido.events)
				if(event.eventDate.earliest != undefined && event.eventDate.latest != undefined && event.eventName != undefined)
					this.times.push({time: event.eventDate.earliest === event.eventDate.latest ? event.eventDate.earliest : undefined,
						timeEarly: event.eventDate.earliest !== event.eventDate.latest ? event.eventDate.earliest : undefined,
						timeLate: event.eventDate.latest !== event.eventDate.earliest ? event.eventDate.latest : undefined,
						eventName: event.eventName.get(), eventPlace: event.eventPlace.displayPlace ? event.eventPlace.displayPlace : ""});
			for(let subject of this.dataObject.lido.subjectRelations)
				if(subject.date.earliest != undefined && subject.date.latest != undefined && subject.display != undefined)
					this.times.push({time: subject.date.earliest === subject.date.latest ? subject.date.earliest : undefined,
						timeEarly: subject.date.earliest !== subject.date.latest ? subject.date.earliest : undefined,
						timeLate: subject.date.latest !== subject.date.earliest ? subject.date.latest : undefined, eventName: subject.display, eventPlace: subject.place.displayPlace ? subject.place.displayPlace : ""});
		}
		//console.log("Times: ", this.times.map(x => new Date(x.timeEarly).toDateString() + " -> " + new Date(x.timeLate).toDateString()));
		this.constructTimeline();
		
		// Load places
		if(this.dataObject.hasPlace)
		{
			for(let rep of this.dataObject.lido.repository)
				if(rep.position.pos != undefined && rep.position.pos[0] != undefined && rep.position.pos[1] != undefined)
					this.markers.push(L.marker([rep.position.pos[0], rep.position.pos[1]], {icon: DataLoader.leafletGreenIcon}).bindPopup(`<b>Sammlung</b><br>${rep.locationName.get() ? rep.locationName.get() : "Sammlungen der Georg-August-Universität Göttingen"}`));
			for(let event of this.dataObject.lido.events)
				if(event.eventPlace.pos[0] != undefined && event.eventPlace.pos[1] != undefined && event.eventType.getTerm() != undefined)
					this.markers.push(L.marker([event.eventPlace.pos[0], event.eventPlace.pos[1]], {icon: DataLoader.leafletBlueIcon}).bindPopup(`<b>${event.eventType.getTerm()}</b><br>${event.eventDate.displayDate ? event.eventDate.displayDate : ""}`));
			for(let subject of this.dataObject.lido.subjectRelations)
				if(subject.place.pos[0] != undefined && subject.place.pos[1] != undefined && subject.display != undefined)
					this.markers.push(L.marker([subject.place.pos[0], subject.place.pos[1]], {icon: DataLoader.leafletBlueIcon}).bindPopup(`<b>${subject.display}</b><br>${subject.date.displayDate ? subject.date.displayDate : ""}`));
		}
		
		this.loadMarkers();
		this.loading = false;
	}
	
	// Close (old) Object
	closeOldObject()
	{
		this.markers = [];
		this.times = [];
		this.dataObject = null;
		this.unloadMarkers();
	}
	
	// Load Markers
	loadMarkers()
	{
		if(this.map != null)
		{
			let group = L.featureGroup();
			for (let marker of this.markers) {
				marker.addTo(this.markerLayer);
				marker.addTo(group);
			}
			setTimeout(() => this.map.invalidateSize(), 3);
			if(this.markers.length > 0)
				setTimeout(() => this.map.fitBounds(group.getBounds().pad(0.3)), 2000);
		}
	}
	
	// Delete Markers
	unloadMarkers()
	{
		if(this.map != null)
			this.markerLayer.clearLayers();
	}
	
	// Construct timeframe and timepositions
	constructTimeline()
	{
		let min: number = Number.MAX_SAFE_INTEGER, max: number = Number.MIN_SAFE_INTEGER;
		for(let time of this.times)
		{
			if((time.time || time.timeEarly) < min)
				min = time.time || time.timeEarly;
			if((time.time || time.timeLate) > max)
				max = time.time || time.timeLate;
		}
		let offset = (max - min) * 0.15 > 31449600000 ? (max - min) * 0.15 : 31449600000;
		min -= offset;
		max += offset;
		this.timeframe = [new Date(min).getFullYear(), new Date(max).getFullYear()];
		
		this.times = this.times.map(val => {
			if(val.time)
				val.time = (val.time - min) / (max - min);
			else {
				val.timeEarly = (val.timeEarly - min) / (max - min);
				val.timeLate = (val.timeLate - min) / (max - min);
			}
			return val;
		});
		$('.tooltip').removeClass("active");
		console.log("Times: ", this.times);
	}
	
	
	
	
	
	ngOnInit(): void {
		this.openModal();
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
	
	openAll()
	{
		for(let i = 0; i < this.dataObject.cards.length; i++)
			this.dataObject.cards[i].min = false;
	}
	
	closeAll()
	{
		for(let i = 0; i < this.dataObject.cards.length; i++)
			this.dataObject.cards[i].min = true;
	}
	
	showTooltip($event)
	{
		let tooltip = $('.tooltip');
		let headline = oc($event).path[0].dataset.headline();
		let text = oc($event).path[0].dataset.text();
		if(headline || text)
		{
			tooltip.addClass('active');
			$('#tooltiptext').html(`${headline ? '<b>' + headline + '</b><br>' : ""}${text ? text : ""}`);
			setTimeout(() => {
				let tooltipRect = $('.tooltip')[0].getBoundingClientRect();
				let clientRect = document.getElementById("tooltip-rect-1").getBoundingClientRect();
				tooltip.css({
					left: clientRect.left + (clientRect.right - clientRect.left) / 2, //- (tooltipRect.right - tooltipRect.left) / 2,
					top: clientRect.top - (tooltipRect.bottom - tooltipRect.top) / 2
				});
			}, 100);
		}
	}
	
	/*typeChange()
	{
		console.log("Map: ", this.map);
		this.loadElement();
	}*/
	
	/*
	ngOnInit() {
		this.index = this.picyCtrl.getIndexForRecord(this.recordID);
		this.loadElement();
		this.loading = false;
  	}
  	
  	close() {
		this.modalCtrl.dismiss();
	}
	
	loadElement()
	{
		this.dataObject = this.picyCtrl.dataset[this.index];
		if(this.map != null)
			for(let marker of this.markers)
				this.map.removeLayer(marker);
		this.times = [];
		this.markers = [];
		if(this.dataObject.hasTime)
		{
			for(let event of this.dataObject.lido.events)
				if(event.eventDate.earliest != undefined && event.eventDate.latest != undefined)
					this.times.push({timeEarly: event.eventDate.earliest, timeLate: event.eventDate.latest, eventName: event.eventName.get(), eventPlace: event.eventPlace.displayPlace});
			for(let subject of this.dataObject.lido.subjectRelations)
				if(subject.date.earliest != undefined && subject.date.latest != undefined)
					this.times.push({timeEarly: subject.date.earliest, timeLate: subject.date.latest, eventName: subject.display, eventPlace: subject.place.displayPlace});
		}
		if(this.dataObject.hasPlace)
		{
			for(let rep of this.dataObject.lido.repository)
				if(rep.position.pos != undefined && rep.position.pos[0] != undefined && rep.position.pos[1] != undefined)
					this.markers.push(L.marker([rep.position.pos[0], rep.position.pos[1]], {icon: DataLoader.leafletGreenIcon}).bindPopup(`<b>Sammlung</b><br>${rep.position.displayPlace ? rep.position.displayPlace : "Georg-August-Universität Göttingen"}`));
			for(let event of this.dataObject.lido.events)
				if(event.eventPlace.pos[0] != undefined && event.eventPlace.pos[1] != undefined)
					this.markers.push(L.marker([event.eventPlace.pos[0], event.eventPlace.pos[1]], {icon: DataLoader.leafletBlueIcon}).bindPopup(`<b>${event.eventType.getTerm() ? event.eventType.getTerm() : ""}</b><br>${event.eventDate.displayDate ? event.eventDate.displayDate : ""}`));
			for(let subject of this.dataObject.lido.subjectRelations)
				if(subject.place.pos[0] != undefined && subject.place.pos[1] != undefined)
					this.markers.push(L.marker([subject.place.pos[0], subject.place.pos[1]], {icon: DataLoader.leafletBlueIcon}).bindPopup(`<b>${subject.display}</b><br>${subject.date.displayDate}`));
			console.log("Place: ", this.markers);
		}
		
		if(this.type == 1)
		{
			try {
				if(this.map == null)
				{
					this.map = new L.Map('displayMap').setView([51.534399, 9.934757], 12);
					L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
						attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					}).addTo(this.map);
				}
				
				let group = L.featureGroup();
				for(let marker of this.markers)
				{
					marker.addTo(this.map);
					marker.addTo(group);
				}
				if(this.map != null) setTimeout(() => this.map.invalidateSize(), 3);
				setTimeout(() => this.map.fitBounds(group.getBounds().pad(0.3)), 2000);
				
			} catch(e) {
				console.log("Map creation error: ", e);
			}
		}
	}
	 */
}
