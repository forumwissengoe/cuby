import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FeedbackPageModal } from './feedback-page-modal.component';
import {FeedbackResponseOverlay} from './feedback-response-overlay';

const routes: Routes = [
  {
    path: '',
    component: FeedbackPageModal
  }
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes)
	],
	exports: [
		FeedbackResponseOverlay
	],
	declarations: [FeedbackPageModal, FeedbackResponseOverlay]
})
export class FeedbackPageModule {}
