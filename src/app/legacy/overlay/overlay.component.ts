import { Component, ElementRef, Renderer2, AfterViewInit } from '@angular/core';

@Component({
	selector: 'overlay',
	templateUrl: 'overlay.component.html',
	styleUrls: ['./overlay.component.scss'],
})
export class OverlayComponent implements AfterViewInit {

	constructor( private elementRef : ElementRef, private renderer : Renderer2) {}

	ngAfterViewInit() { }

	hide_overlay() {
		this.renderer.removeClass( this.elementRef.nativeElement, 'shown' );
	}

	show_overlay() {
		this.renderer.addClass( this.elementRef.nativeElement, 'shown');

		setTimeout(() => {
			this.hide_overlay();
		}, 3000);
	}
}