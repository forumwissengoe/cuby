import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NfcPickPagePage } from './nfc-pick-page.page';
var routes = [
    {
        path: '',
        component: NfcPickPagePage
    }
];
var NfcPickPagePageModule = /** @class */ (function () {
    function NfcPickPagePageModule() {
    }
    NfcPickPagePageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [NfcPickPagePage]
        })
    ], NfcPickPagePageModule);
    return NfcPickPagePageModule;
}());
export { NfcPickPagePageModule };
//# sourceMappingURL=nfc-pick-page.module.js.map