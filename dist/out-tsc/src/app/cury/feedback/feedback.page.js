import * as tslib_1 from "tslib";
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ImageOverlay } from '../../additions/overlay/image-overlay.component';
import { FeedbackController } from './feedback.controller.service';
import { Router } from '@angular/router';
import { Level3Like, StorageService } from '../../storage.service';
import { AlertController } from '@ionic/angular';
var FeedbackPage = /** @class */ (function () {
    function FeedbackPage(feedbackController, router, storageService, alertCtrl) {
        this.feedbackController = feedbackController;
        this.router = router;
        this.storageService = storageService;
        this.alertCtrl = alertCtrl;
        this.image = "http://www.adweek.com/files/2015_May/iStock-Unfinished-Business-6.jpg";
        this.record = "";
        this.items = [{ label: "Standort", value: "Kunstsammlung der Univeristät" }, { label: "Datierung", value: "1513" }, { label: "Beteiligte", value: "Altdorfer, Albrecht" }, { label: "Maße / Umfang", value: "Breite: 99mm" }];
        this.comment = "";
        this.index = 0;
        this.total = 0;
        this.imageChecked = false;
        this.loading = true;
    }
    FeedbackPage.prototype.ngAfterViewChecked = function () {
    };
    FeedbackPage.prototype.ionViewWillEnter = function () {
        this.loading = true;
        this.feedbackController.setLoadingFinishedCallback(this.loadingFinished.bind(this));
        var records = this.storageService.localState.feedbackList;
        if (records.length != 0)
            this.feedbackController.loadRecordList(records);
        else
            this.feedbackController.loadDummyList();
    };
    FeedbackPage.prototype.loadingFinished = function () {
        this.index = this.feedbackController.index;
        this.total = this.feedbackController.displayData.length;
        var entry = this.feedbackController.displayData[this.index];
        console.log("RECORD: ", entry);
        this.image = entry.thumbnail;
        this.record = entry.record;
        this.items = entry.entries;
        this.overlay.setImageService(entry.image_service);
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var i = _a[_i];
            i.check = false;
        }
        this.imageChecked = false;
        this.loading = false;
    };
    FeedbackPage.prototype.openOverlay = function () {
        this.overlay.open();
    };
    FeedbackPage.prototype.checkImage = function () {
        if (!this.imageChecked) {
            this.imageElement.nativeElement.style.opacity = 0.2;
            this.imageElement2.nativeElement.style.opacity = 1.0;
            this.imageChecked = true;
        }
        else {
            this.imageElement.nativeElement.style.opacity = 1.0;
            this.imageElement2.nativeElement.style.opacity = 0.0;
            this.imageChecked = false;
        }
    };
    FeedbackPage.prototype.send = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertCtrl.create({
                            message: "Feedback senden?",
                            buttons: [
                                {
                                    text: "Nein",
                                    role: 'cancel',
                                },
                                {
                                    text: "Ja",
                                    handler: function () { return _this._send(); }
                                }
                            ]
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FeedbackPage.prototype._send = function () {
        var l3 = new Level3Like();
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var entry = _a[_i];
            if (entry.check)
                l3.likedFields.push(entry.value);
        }
        l3.comment = this.comment;
        l3.recordID = this.record;
        var index = this.storageService.localState.feedbackList.indexOf(l3.recordID);
        if (index != -1 && index <= this.storageService.localState.feedbackList.length)
            this.storageService.localState.feedbackList.splice(index, 1);
        this.storageService.localState.likedLevel3.push(l3);
        console.log("L3: ", l3);
        this.storageService.localState.picyGallery.push(l3.recordID);
        //this.evaluationService.publishLikabilityLevel3(l3);
        //this.router.navigate(['/home']);
        this.storageService.saveLocalState();
        if (this.feedbackController.next() != -1) {
            this.loadingFinished();
        }
        else
            this.router.navigate(['/home']);
    };
    tslib_1.__decorate([
        ViewChild("feedbackOverlay"),
        tslib_1.__metadata("design:type", ImageOverlay)
    ], FeedbackPage.prototype, "overlay", void 0);
    tslib_1.__decorate([
        ViewChild("imageElement"),
        tslib_1.__metadata("design:type", ElementRef)
    ], FeedbackPage.prototype, "imageElement", void 0);
    tslib_1.__decorate([
        ViewChild("imageElement2"),
        tslib_1.__metadata("design:type", ElementRef)
    ], FeedbackPage.prototype, "imageElement2", void 0);
    FeedbackPage = tslib_1.__decorate([
        Component({
            selector: 'app-feedback',
            templateUrl: './feedback.page.html',
            styleUrls: ['./feedback.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [FeedbackController, Router, StorageService, AlertController])
    ], FeedbackPage);
    return FeedbackPage;
}());
export { FeedbackPage };
//# sourceMappingURL=feedback.page.js.map