import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProgressBarComponent } from './progress-bar.component';
var ProgressBarModule = /** @class */ (function () {
    function ProgressBarModule() {
    }
    ProgressBarModule = tslib_1.__decorate([
        NgModule({
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
    ], ProgressBarModule);
    return ProgressBarModule;
}());
export { ProgressBarModule };
//# sourceMappingURL=progress-bar.module.js.map