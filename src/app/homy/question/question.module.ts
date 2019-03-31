import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { QuestionPage } from './question.page';
import { ImageOverlayModule } from '../../additions/overlay/image-overlay.module';

const routes: Routes = [
  {
    path: '',
    component: QuestionPage
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
  	declarations: [QuestionPage]
})
export class QuestionPageModule {}
