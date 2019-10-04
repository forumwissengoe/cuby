import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DetailsPage } from './details.page';
import { VoteIconGroupModule } from './VoteIconGroup.module';
import { ImageOverlayModule } from '../../additions/overlay/image-overlay.module';
var routes = [
    {
        path: '',
        component: DetailsPage
    }
];
var DetailsPageModule = /** @class */ (function () {
    function DetailsPageModule() {
    }
    DetailsPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                VoteIconGroupModule,
                ImageOverlayModule,
                RouterModule.forChild(routes)
            ],
            declarations: [DetailsPage]
        })
    ], DetailsPageModule);
    return DetailsPageModule;
}());
export { DetailsPageModule };
//# sourceMappingURL=details.module.js.map