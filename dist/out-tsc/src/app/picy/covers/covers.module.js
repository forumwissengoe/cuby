import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CoversPage } from './covers.page';
import { VoteIconGroupModule } from '../../cury/details/VoteIconGroup.module';
var routes = [
    {
        path: '',
        component: CoversPage
    }
];
var CoversPageModule = /** @class */ (function () {
    function CoversPageModule() {
    }
    CoversPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes),
                VoteIconGroupModule
            ],
            declarations: [CoversPage]
        })
    ], CoversPageModule);
    return CoversPageModule;
}());
export { CoversPageModule };
//# sourceMappingURL=covers.module.js.map