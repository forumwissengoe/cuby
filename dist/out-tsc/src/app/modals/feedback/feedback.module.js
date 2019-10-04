import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FeedbackPageModal } from './feedback-page-modal.component';
import { FeedbackResponseOverlay } from './feedback-response-overlay';
var routes = [
    {
        path: '',
        component: FeedbackPageModal
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
                RouterModule.forChild(routes)
            ],
            exports: [
                FeedbackResponseOverlay
            ],
            declarations: [FeedbackPageModal, FeedbackResponseOverlay]
        })
    ], FeedbackPageModule);
    return FeedbackPageModule;
}());
export { FeedbackPageModule };
//# sourceMappingURL=feedback.module.js.map