import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CoversPage } from './covers.page';
import {VoteIconGroupModule} from '../../cury/details/VoteIconGroup.module';

const routes: Routes = [
  {
    path: '',
    component: CoversPage
  }
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
		VoteIconGroupModule
	],
  declarations: [CoversPage]
})
export class CoversPageModule {}
