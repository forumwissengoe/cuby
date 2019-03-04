import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { VisionaryPage } from './visionary.page';
import { SwingModule } from 'angular2-swing';
import {OverlayModule} from '../overlay/overlay.module';

const routes: Routes = [
	{
		path: '',
		component: VisionaryPage
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
	  	SwingModule,
		OverlayModule,
		RouterModule.forChild(routes)
	],
	declarations: [VisionaryPage]
})
export class VisionaryPageModule {}
