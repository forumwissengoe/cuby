import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VoteIconGroup } from './VoteIconGroup';
var VoteIconGroupModule = /** @class */ (function () {
    function VoteIconGroupModule() {
    }
    VoteIconGroupModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
            ],
            declarations: [VoteIconGroup],
            exports: [
                VoteIconGroup
            ]
        })
    ], VoteIconGroupModule);
    return VoteIconGroupModule;
}());
export { VoteIconGroupModule };
//# sourceMappingURL=VoteIconGroup.module.js.map