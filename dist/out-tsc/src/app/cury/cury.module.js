import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CuryPage } from './cury.page';
import { SwingModule } from 'angular2-swing';
import { ImageOverlayModule } from '../additions/overlay/image-overlay.module';
var routes = [
    {
        path: '',
        component: CuryPage
    }
];
var CuryPageModule = /** @class */ (function () {
    function CuryPageModule() {
    }
    CuryPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                SwingModule,
                ImageOverlayModule,
                RouterModule.forChild(routes)
            ],
            declarations: [CuryPage]
        })
    ], CuryPageModule);
    return CuryPageModule;
}());
export { CuryPageModule };
//# sourceMappingURL=cury.module.js.map