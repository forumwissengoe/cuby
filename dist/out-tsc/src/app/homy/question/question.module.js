import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { QuestionPage } from './question.page';
import { ImageOverlayModule } from '../../additions/overlay/image-overlay.module';
var routes = [
    {
        path: '',
        component: QuestionPage
    }
];
var QuestionPageModule = /** @class */ (function () {
    function QuestionPageModule() {
    }
    QuestionPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                ImageOverlayModule,
                RouterModule.forChild(routes)
            ],
            declarations: [QuestionPage]
        })
    ], QuestionPageModule);
    return QuestionPageModule;
}());
export { QuestionPageModule };
//# sourceMappingURL=question.module.js.map