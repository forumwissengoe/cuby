import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MilestonePage } from './milestone-page.component';
import { ProgressBarModule } from '../../additions/progress-bar/progress-bar.module';
var routes = [
    {
        path: '',
        component: MilestonePage
    }
];
var MilestonePageModule = /** @class */ (function () {
    function MilestonePageModule() {
    }
    MilestonePageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                ProgressBarModule,
                RouterModule.forChild(routes)
            ],
            declarations: [MilestonePage]
        })
    ], MilestonePageModule);
    return MilestonePageModule;
}());
export { MilestonePageModule };
//# sourceMappingURL=milestone.module.js.map