import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CategoriesPage } from './categories.page';
var routes = [
    {
        path: '',
        component: CategoriesPage
    }
];
var CategoriesPageModule = /** @class */ (function () {
    function CategoriesPageModule() {
    }
    CategoriesPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [CategoriesPage]
        })
    ], CategoriesPageModule);
    return CategoriesPageModule;
}());
export { CategoriesPageModule };
//# sourceMappingURL=categories.module.js.map