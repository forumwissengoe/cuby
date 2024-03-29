import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NfcPage } from './nfc.page';
import {ImageOverlayModule} from '../../components/overlay/image-overlay.module';

const routes: Routes = [
  	{
    	path: '',
    	component: NfcPage
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
  	declarations: [NfcPage]
})
export class NfcPageModule {}
