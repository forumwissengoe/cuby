import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DisplayPage } from './display.page';
import {ImageOverlayModule} from '../../components/overlay/image-overlay.module';

const routes: Routes = [
  {
    path: '',
    component: DisplayPage
  }
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
		ImageOverlayModule
	],
  declarations: [DisplayPage]
})
export class DisplayPageModule {}
