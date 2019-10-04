import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ImageOverlay } from './image-overlay.component';
var ImageOverlayModule = /** @class */ (function () {
    function ImageOverlayModule() {
    }
    ImageOverlayModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
            ],
            declarations: [ImageOverlay],
            exports: [
                ImageOverlay
            ]
        })
    ], ImageOverlayModule);
    return ImageOverlayModule;
}());
export { ImageOverlayModule };
//# sourceMappingURL=image-overlay.module.js.map