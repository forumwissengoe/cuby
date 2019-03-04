import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {VoteIconGroup} from './VoteIconGroup';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
	],
	declarations: [VoteIconGroup],
	exports: [
		VoteIconGroup
	]
})
export class VoteIconGroupModule {}