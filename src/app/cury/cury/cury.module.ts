import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CuryPage } from './cury.page';
import {SwingModule} from 'angular2-swing';

const routes: Routes = [
  {
    path: '',
    component: CuryPage
  }
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
		SwingModule
	],
  declarations: [CuryPage]
})
export class CuryPageModule {}
