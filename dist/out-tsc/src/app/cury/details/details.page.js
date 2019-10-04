import * as tslib_1 from "tslib";
import { Component, Renderer2, ViewChild } from '@angular/core';
import { ImageOverlay } from '../../additions/overlay/image-overlay.component';
import { DetailsController } from './details.controller.service';
import { IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from '../../storage.service';
var DetailsPage = /** @class */ (function () {
    function DetailsPage(renderer, detailsController, router, storageService) {
        this.renderer = renderer;
        this.detailsController = detailsController;
        this.router = router;
        this.storageService = storageService;
        this.current_number = 1;
        this.total_number = 0;
        this.loading = true;
        this.slideOpts = {
            effect: 'flip',
        };
        this.displayData = [];
        this.displayItems = [{ label: "Standort", value: "" }, { label: "Datierung", value: "" }, { label: "Beteiligte", value: "" }, { label: "Maße / Umfang", value: "" }];
    }
    DetailsPage.prototype.ngOnInit = function () { };
    DetailsPage.prototype.ionViewWillEnter = function () {
        this.loading = true;
        this.detailsController.setLoadingFinishedCallback(this.loadingFinishedCallback.bind(this));
        this.detailsController.clearDisplayData();
        //let records:string[] = this.evaluateService.getCurrentLikabilityLevel1();
        var records = this.storageService.localState.detailsList;
        if (records.length != 0)
            this.detailsController.loadRecordList(records);
        else
            this.detailsController.loadDummyList();
    };
    DetailsPage.prototype.slideChanged = function () {
        var _this = this;
        this.slides.getActiveIndex().then(function (index) {
            _this.current_number = index + 1;
        });
    };
    DetailsPage.prototype.loadingFinishedCallback = function () {
        this.displayData = this.detailsController.displayData;
        this.total_number = this.detailsController.displayData.length;
        this.loading = false;
    };
    DetailsPage.prototype.overlayOpen = function (data) {
        this.overlay.setImageService(data.image_service);
        this.overlay.open();
    };
    DetailsPage.prototype.voted = function (data, like) {
        var _this = this;
        data.like = like;
        //this.evaluateService.removeCurrentLevel1(data.record);
        var index = this.storageService.localState.detailsList.indexOf(data.record);
        if (index != -1 && index <= this.storageService.localState.detailsList.length)
            this.storageService.localState.detailsList.splice(index, 1);
        if (like) {
            //this.evaluateService.publishLikabilityLevel2(data.record);
            this.storageService.localState.likedLevel2.push(data.record);
            this.storageService.localState.feedbackList.push(data.record);
        }
        var all = true;
        for (var _i = 0, _a = this.displayData; _i < _a.length; _i++) {
            var dat = _a[_i];
            if (dat.like == undefined || dat.like == null)
                all = false;
        }
        if (all)
            this.votingFinished();
        setTimeout(function () { return _this.slides.slideNext(); }, 750);
    };
    DetailsPage.prototype.votingFinished = function () {
        var likedOne = false;
        for (var _i = 0, _a = this.displayData; _i < _a.length; _i++) {
            var dat = _a[_i];
            if (dat)
                likedOne = true;
        }
        if (likedOne)
            this.router.navigate(['/feedback']);
        this.storageService.saveLocalState();
    };
    tslib_1.__decorate([
        ViewChild('detailsOverlay'),
        tslib_1.__metadata("design:type", ImageOverlay)
    ], DetailsPage.prototype, "overlay", void 0);
    tslib_1.__decorate([
        ViewChild('slides'),
        tslib_1.__metadata("design:type", IonSlides)
    ], DetailsPage.prototype, "slides", void 0);
    DetailsPage = tslib_1.__decorate([
        Component({
            selector: 'app-details',
            templateUrl: './details.page.html',
            styleUrls: ['./details.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [Renderer2, DetailsController, Router, StorageService])
    ], DetailsPage);
    return DetailsPage;
}());
export { DetailsPage };
//# sourceMappingURL=details.page.js.map