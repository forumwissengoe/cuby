import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NfcPickPagePage } from './nfc-pick-page.page';

const routes: Routes = [
  {
    path: '',
    component: NfcPickPagePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NfcPickPagePage]
})
export class NfcPickPagePageModule {}
