import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PicyPage } from './picy.page';
import { ImageOverlayModule } from '../additions/overlay/image-overlay.module';
var routes = [
    {
        path: '',
        component: PicyPage
    }
];
var PicyPageModule = /** @class */ (function () {
    function PicyPageModule() {
    }
    PicyPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                ImageOverlayModule,
                RouterModule.forChild(routes)
            ],
            declarations: [PicyPage]
        })
    ], PicyPageModule);
    return PicyPageModule;
}());
export { PicyPageModule };
//# sourceMappingURL=picy.module.js.map