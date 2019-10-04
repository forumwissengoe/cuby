import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { DataLoader } from '../../data/DataLoader';
import { StorageService } from '../storage.service';
var CuryControllerService = /** @class */ (function () {
    function CuryControllerService(storageService) {
        this.storageService = storageService;
        this.images = [];
        this.loadingFinishedCallback = null;
        this.currentlyLoading = false;
    }
    CuryControllerService_1 = CuryControllerService;
    CuryControllerService.prototype.initialLoad = function () {
        var _this = this;
        this.images = [];
        var records = this.storageService.localState.curyStack;
        var count = records.length;
        this.currentlyLoading = true;
        if (records.length < CuryControllerService_1.NUMBER_ELEMENTS) {
            DataLoader.requestCuryImages(this.storageService, this.storageService.configuration.cury_url, CuryControllerService_1.NUMBER_ELEMENTS - count)
                .then(function (imgs) {
                for (var _i = 0, imgs_1 = imgs; _i < imgs_1.length; _i++) {
                    var img = imgs_1[_i];
                    _this.images.push(img);
                }
                count -= imgs.length;
                if (count <= 0) {
                    if (_this.loadingFinishedCallback != null) {
                        _this.currentlyLoading = false;
                        _this.loadingFinishedCallback();
                    }
                    else
                        console.log("No loading finished callback");
                }
            });
            count = CuryControllerService_1.NUMBER_ELEMENTS;
        }
        for (var _i = 0, records_1 = records; _i < records_1.length; _i++) {
            var record = records_1[_i];
            DataLoader.downloadManifest(this.storageService, record).then(function (img) {
                _this.images.push(img);
                count--;
                if (count <= 0) {
                    if (_this.loadingFinishedCallback != null) {
                        _this.currentlyLoading = false;
                        _this.loadingFinishedCallback();
                    }
                    else
                        console.log("No loading finished callback");
                }
            });
        }
    };
    CuryControllerService.prototype.loadNewImages = function (number) {
        var _this = this;
        DataLoader.requestCuryImages(this.storageService, this.storageService.configuration.cury_url, number)
            .then(function (imgs) {
            for (var _i = 0, imgs_2 = imgs; _i < imgs_2.length; _i++) {
                var img = imgs_2[_i];
                _this.images.push(img);
            }
            if (_this.loadingFinishedCallback != null)
                _this.loadingFinishedCallback();
        });
    };
    CuryControllerService.prototype.setLoadingFinishedCallback = function (cb) {
        this.loadingFinishedCallback = cb;
    };
    var CuryControllerService_1;
    CuryControllerService.NUMBER_ELEMENTS = 8;
    CuryControllerService = CuryControllerService_1 = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [StorageService])
    ], CuryControllerService);
    return CuryControllerService;
}());
export { CuryControllerService };
//# sourceMappingURL=cury.controller.service.js.map