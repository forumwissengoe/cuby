import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {ProgressBarComponent} from './progress-bar.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
	],
	declarations: [ProgressBarComponent],
	exports: [
		ProgressBarComponent
	]
})
export class ProgressBarModule {}