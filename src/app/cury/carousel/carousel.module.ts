import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CarouselPage } from './carousel.page';
import {ImageOverlayModule} from '../../components/overlay/image-overlay.module';
import { SlidesControllerDirective } from './slides-controller.directive';

const routes: Routes = [
  {
    path: '',
    component: CarouselPage
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
  declarations: [CarouselPage, SlidesControllerDirective]
})
export class CarouselPageModule {}
