import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {PicyController} from '../picy.controller.service';
import * as L from 'leaflet';
import {DataLoader} from '../../../data/DataLoader';
import {marker} from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
	
	map: L.Map = null;
	
	constructor(private modalCtrl: ModalController, private picyCtrl: PicyController) { }
	
	ngOnInit() {
		if(this.map == null)
		{
			this.map = L.map('map').setView([51.534399, 9.934757], 12);
			L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(this.map);
		}
		setTimeout(() => this.generateMarkers(), 1);
	}
	
	generateMarkers()
	{
		let markers: L.Marker[] = [];
		let lines: L.Polyline[] = [];
		const icons: any[] = [DataLoader.leafletBlueIcon, DataLoader.leafletGreenIcon, DataLoader.leafletRedIcon, DataLoader.leafletBlackIcon, DataLoader.leafletGreyIcon, DataLoader.leafletOrangeIcon, DataLoader.leafletVioletIcon, DataLoader.leafletYellowIcon];
		const colors: string[] = ['blue', 'green', 'red', 'black', 'grey', 'orange', 'violet', 'yellow'];
		for(let i = 0; i < this.picyCtrl.dataset.length; i++)
		{
			let element = this.picyCtrl.dataset[i];
			let points = [];
			if(element.hasPlace)
			{
				for(let rep of element.lido.repository) {
					if (rep.position.pos != undefined && rep.position.pos[0] != undefined && rep.position.pos[1] != undefined) {
						markers.push(L.marker([rep.position.pos[0], rep.position.pos[1]], {icon: icons[i % 8]}).bindPopup(`<b>Sammlung</b><br>${rep.locationName.get() ? rep.locationName.get() : "Sammlungen der Georg-August-Universität Göttingen"}`));
						points.push(rep.position.pos);
					}
				}
				for(let event of element.lido.events) {
					if (event.eventPlace.pos[0] != undefined && event.eventPlace.pos[1] != undefined && event.eventType.getTerm() != undefined) {
						markers.push(L.marker([event.eventPlace.pos[0], event.eventPlace.pos[1]], {icon: icons[i % 8]}).bindPopup(`<b>${event.eventType.getTerm()}</b><br>${event.eventDate.displayDate ? event.eventDate.displayDate : ""}`));
						points.push(event.eventPlace.pos)
					}
				}
				for(let subject of element.lido.subjectRelations) {
					if (subject.place.pos[0] != undefined && subject.place.pos[1] != undefined && subject.display != undefined) {
						markers.push(L.marker([subject.place.pos[0], subject.place.pos[1]], {icon: icons[i % 8]}).bindPopup(`<b>${subject.display}</b><br>${subject.date.displayDate ? subject.date.displayDate : ""}`));
						points.push(subject.place.pos);
					}
				}
				lines.push(L.polyline(points, {color: colors[i % 8]}))
			}
		}
		
		let group = L.featureGroup();
		let markerLayer = L.layerGroup().addTo(this.map);
		for (let marker of markers) {
			marker.addTo(group);
			marker.addTo(markerLayer);
		}
		for (let line of lines)
			line.addTo(markerLayer);
		
		setTimeout(() => this.map.invalidateSize(), 50);
		if(markers.length > 0)
			setTimeout(() => this.map.fitBounds(group.getBounds().pad(0.3)), 2000);
	}

	closeModal()
	{
		this.modalCtrl.dismiss();
	}
}
