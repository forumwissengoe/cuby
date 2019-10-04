import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FeedbackPage } from './feedback.page';
import { ImageOverlayModule } from '../../additions/overlay/image-overlay.module';
var routes = [
    {
        path: '',
        component: FeedbackPage
    }
];
var FeedbackPageModule = /** @class */ (function () {
    function FeedbackPageModule() {
    }
    FeedbackPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                ImageOverlayModule,
                RouterModule.forChild(routes)
            ],
            declarations: [FeedbackPage]
        })
    ], FeedbackPageModule);
    return FeedbackPageModule;
}());
export { FeedbackPageModule };
//# sourceMappingURL=feedback.module.js.map