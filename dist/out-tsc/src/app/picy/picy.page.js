import * as tslib_1 from "tslib";
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Events, MenuController } from '@ionic/angular';
import { ImageOverlay } from '../additions/overlay/image-overlay.component';
import { PicyController, PicyObject } from './picy.controller.service';
var PicyPage = /** @class */ (function () {
    function PicyPage(menuCtrl, renderer, events, picyController) {
        this.menuCtrl = menuCtrl;
        this.renderer = renderer;
        this.events = events;
        this.picyController = picyController;
        this.loading = true;
        this.dataObject = new PicyObject();
        this.index = 0;
        this.rights_shown = false;
    }
    PicyPage.prototype.ionViewWillEnter = function () {
        this.picyController.setLoadingFinishedCallback(this.galleryLoadingFinishedCallback.bind(this));
        this.picyController.setMenuLoadingFinishedCallback(this.menuLoadingFinishedCallback.bind(this));
        this.loading = true;
        this.menuCtrl.enable(true, "picyMenu");
        this.events.subscribe("picy:MenuSelected", this.select.bind(this));
        this.overlay.setCloseCallback(this.callback.bind(this));
        this.picyController.loadGallery();
        this.index = this.picyController.getInitIndex();
    };
    PicyPage.prototype.ngOnDestroy = function () {
        this.menuCtrl.enable(false, "picyMenu");
    };
    PicyPage.prototype.menuLoadingFinishedCallback = function () {
        this.events.publish('picy:MenuChanged', this.picyController.menuEntries);
    };
    PicyPage.prototype.galleryLoadingFinishedCallback = function () {
        this.index = this.picyController.index;
        console.log("Gallery loaded. Index: ", this.index, " Gallery: ", this.picyController.dataset);
        if (this.index != -1) {
            this.overlay.setImageService(this.picyController.dataset[this.index].image_service[0]);
            this.dataObject = this.picyController.dataset[this.index];
        }
        this.loading = false;
    };
    PicyPage.prototype.show = function (min) {
        if (min)
            return "ios-arrow-forward";
        else
            return "ios-arrow-down";
    };
    PicyPage.prototype.image_information = function (event) {
        event.stopPropagation();
        if (!this.rights_shown) {
            this.image_element.nativeElement.style.opacity = 0.2;
            this.rights_element.nativeElement.style.opacity = 1.0;
        }
        else {
            this.image_element.nativeElement.style.opacity = 1.0;
            this.rights_element.nativeElement.style.opacity = 0.0;
        }
        this.rights_shown = !this.rights_shown;
    };
    PicyPage.prototype.overlayOpen = function (img) {
        this.menuCtrl.enable(false);
        if (!this.rights_shown) {
            this.overlay.setImageService(img);
            this.overlay.open();
        }
    };
    PicyPage.prototype.callback = function () {
        this.menuCtrl.enable(true);
    };
    PicyPage.prototype.openAll = function () {
        for (var i = 0; i < this.dataObject.cards.length; i++) {
            this.dataObject.cards[i].min = false;
        }
    };
    PicyPage.prototype.closeAll = function () {
        for (var i = 0; i < this.dataObject.cards.length; i++) {
            this.dataObject.cards[i].min = true;
        }
    };
    PicyPage.prototype.next = function () {
        this.index = this.picyController.getNextIndex();
        this.dataObject = this.picyController.dataset[this.index];
    };
    PicyPage.prototype.previous = function () {
        this.index = this.picyController.getPreviousIndex();
        this.dataObject = this.picyController.dataset[this.index];
    };
    PicyPage.prototype.select = function (record) {
        var tmp = this.picyController.getIndexForRecord(record);
        if (tmp != undefined) {
            this.index = tmp;
            this.dataObject = this.picyController.dataset[this.index];
        }
        this.menuCtrl.close("picyMenu");
    };
    tslib_1.__decorate([
        ViewChild("rightsElem"),
        tslib_1.__metadata("design:type", ElementRef)
    ], PicyPage.prototype, "rights_element", void 0);
    tslib_1.__decorate([
        ViewChild("imgElem"),
        tslib_1.__metadata("design:type", ElementRef)
    ], PicyPage.prototype, "image_element", void 0);
    tslib_1.__decorate([
        ViewChild("picyOverlay"),
        tslib_1.__metadata("design:type", ImageOverlay)
    ], PicyPage.prototype, "overlay", void 0);
    PicyPage = tslib_1.__decorate([
        Component({
            selector: 'app-picy',
            templateUrl: './picy.page.html',
            styleUrls: ['./picy.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [MenuController, Renderer2, Events, PicyController])
    ], PicyPage);
    return PicyPage;
}());
export { PicyPage };
//# sourceMappingURL=picy.page.js.map