import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../storage.service';
var CategoriesPage = /** @class */ (function () {
    function CategoriesPage(router, storageService) {
        this.router = router;
        this.storageService = storageService;
        this.dummy = false;
        this.loading = true;
        this.categoryPairs = [];
        if (!this.dummy) {
            if (!this.storageService.homyFinished)
                this.storageService.homyCallback = this.categoriesLoaded.bind(this);
            else
                this.categoriesLoaded();
        }
        else
            this.dummyCategories();
    }
    CategoriesPage.prototype.ngOnInit = function () { };
    CategoriesPage.prototype.categoriesLoaded = function () {
        var x = null;
        for (var _i = 0, _a = this.storageService.configuration.homy_categories; _i < _a.length; _i++) {
            var cat = _a[_i];
            if (x == null)
                x = { name: cat.name, id: cat.type, img: cat.cover, url: cat.url, locked: false };
            else {
                this.categoryPairs.push({
                    a: x,
                    b: { name: cat.name, id: cat.type, img: cat.cover, url: cat.url, locked: false }
                });
                x = null;
            }
        }
        if (x != null) {
            this.categoryPairs.push({
                a: x,
                b: { name: "", id: "", img: "", url: "", locked: true }
            });
            x = null;
        }
        this.categoryPairs.push({
            a: { name: "", id: "", img: "", url: "", locked: true },
            b: { name: "", id: "", img: "", url: "", locked: true }
        });
        for (var _b = 0, _c = this.categoryPairs; _b < _c.length; _b++) {
            var p = _c[_b];
            if (p.a.img === "" && !p.a.locked)
                p.a.img = "../../assets/images/blocked.svg";
            if (p.b.img === "" && !p.b.locked)
                p.b.img = "../../assets/images/blocked.svg";
        }
        this.loading = false;
    };
    CategoriesPage.prototype.dummyCategories = function () {
        // Dummy
        this.categoryPairs.push({
            a: { name: "Botanik", id: "", img: "https://sammlungen.uni-goettingen.de/rest/image/record_naniweb_454752/record_naniweb_454752_5968.jpg/square/!400,400/0/default.jpg", url: "", locked: false },
            b: { name: "Kunst", id: "", img: "https://sammlungen.uni-goettingen.de/rest/image/record_kuniweb_594094/record_kuniweb_594094_362862.jpg/square/!400,400/0/default.jpg", url: "", locked: false },
        });
        this.categoryPairs.push({
            a: { name: "Ethnologie", id: "", img: "https://sammlungen.uni-goettingen.de/rest/image/record_kuniweb_948640/record_kuniweb_948640_444883.jpg/square/!400,400/0/default.jpg", url: "", locked: false },
            b: { name: "Geologie", id: "", img: "https://sammlungen.uni-goettingen.de/rest/image/record_naniweb_365739/record_naniweb_365739_2162.jpg/square/!400,400/0/default.jpg", url: "", locked: false }
        });
        this.categoryPairs.push({
            a: { name: "", id: "", img: "", url: "", locked: true },
            b: { name: "", id: "", img: "", url: "", locked: true }
        });
    };
    CategoriesPage.prototype.selectCategory = function (category) {
        if (category.locked)
            return;
        console.log("Selected: ", category);
        this.router.navigate(['/question', category.id]);
    };
    CategoriesPage.prototype.home = function () {
        this.router.navigate(['/homy']);
    };
    CategoriesPage = tslib_1.__decorate([
        Component({
            selector: 'app-categories',
            templateUrl: './categories.page.html',
            styleUrls: ['./categories.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [Router, StorageService])
    ], CategoriesPage);
    return CategoriesPage;
}());
export { CategoriesPage };
//# sourceMappingURL=categories.page.js.map