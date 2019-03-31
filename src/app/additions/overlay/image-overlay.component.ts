import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';

declare var OpenSeadragon: any;

@Component({
	selector: "image-overlay",
	template: `<div #overlay class="overlay">
			       <div class="close_container">
			           <ion-icon name="close-circle-outline" (click)="close()"></ion-icon>
			       </div>
				   <div id="mapid"></div>
			   </div>`,
	styleUrls: ['./image-overlay.component.scss']
})

export class ImageOverlay
{
	@ViewChild('overlay') overlay:ElementRef;
	
	image_service:any = null;
	map:any = null;
	rebuild:boolean = true;
	
	closeCallback:any = null;
	constructor(private renderer:Renderer2) {}
	
	ngOnInit() {}
	
	close()
	{
		this.renderer.removeClass(this.overlay.nativeElement, "shown");
		if(this.closeCallback != null) this.closeCallback();
	}
	
	open()
	{
		this.renderer.addClass(this.overlay.nativeElement, "shown");
		if(this.rebuild && this.image_service != null)
		{
			let sequenceControl:boolean = false;
			if(this.image_service instanceof Array)
				sequenceControl = this.image_service.length > 1;
			
			//console.log("Rebuild", this.image_service);
			
			if(this.map != null)
			{
				console.log("Destroy");
				this.map.destroy();
				this.map = null;
			}
			
			this.map = OpenSeadragon({
				id: "mapid", // Image Container
				prefixUrl: '../../../assets/js/openseadragon/images/', // Folder of button images
				preserveViewport: true,
				visibilityRatio:    1,
				minZoomLevel:       1,
				defaultZoomLevel:   1,
				sequenceMode:       true,
				navigationControlAnchor: OpenSeadragon.ControlAnchor.BOTTOM_LEFT,
				showSequenceControl: sequenceControl,
				showFullPageControl: false,
				showRotationControl: true,
				tileSources: this.image_service
			});
			let a = this.map;
			//console.log("Map", this.map);
			
			this.rebuild = false;
		}
	}
	
	setImageService(image_service:any)
	{
		this.image_service = image_service;
		this.rebuild = true;
	}
	
	setCloseCallback(cb:() => void)
	{
		this.closeCallback = cb;
	}
}