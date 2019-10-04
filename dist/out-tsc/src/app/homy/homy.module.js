import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HomyPage } from './homy.page';
var routes = [
    {
        path: '',
        component: HomyPage
    }
];
var HomyPageModule = /** @class */ (function () {
    function HomyPageModule() {
    }
    HomyPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [HomyPage]
        })
    ], HomyPageModule);
    return HomyPageModule;
}());
export { HomyPageModule };
//# sourceMappingURL=homy.module.js.map