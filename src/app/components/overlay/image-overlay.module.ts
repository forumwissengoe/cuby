import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {ImageOverlay} from './image-overlay.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
	],
	declarations: [ImageOverlay],
	exports: [
		ImageOverlay
	]
})
export class ImageOverlayModule {}