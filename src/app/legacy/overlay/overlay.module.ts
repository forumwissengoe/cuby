import { NgModule } from '@angular/core'
import { IonicModule } from '@ionic/angular'
import { OverlayComponent} from './overlay.component';

@NgModule({
	declarations: [ OverlayComponent ],
	imports: [ IonicModule ],
	exports: [ OverlayComponent ],
	entryComponents: [ OverlayComponent ]
})
export class OverlayModule {}