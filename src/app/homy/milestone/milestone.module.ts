import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MilestonePage } from './milestone-page.component';
import {ProgressBarModule} from '../../components/progress-bar/progress-bar.module';

const routes: Routes = [
  {
    path: '',
    component: MilestonePage
  }
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ProgressBarModule,
		RouterModule.forChild(routes)
  	],
  	declarations: [MilestonePage]
})
export class MilestonePageModule {}
