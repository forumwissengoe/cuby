import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FeedbackPage } from './feedback.page';
import {ImageOverlayModule} from '../../additions/overlay/image-overlay.module';

const routes: Routes = [
	{
    	path: '',
    	component: FeedbackPage
  	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
	  	ImageOverlayModule,
		RouterModule.forChild(routes)
  	],
  	declarations: [FeedbackPage]
})
export class FeedbackPageModule {}
