import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { DataLoader } from '../../data/DataLoader';
import { StorageService } from '../storage.service';
var PicyController = /** @class */ (function () {
    function PicyController(storageService) {
        var _this = this;
        this.storageService = storageService;
        this.dataset = [];
        this.gallery = [];
        this.index = 0;
        this.menuEntries = [];
        this.records = ["record_kuniweb_945664", "record_kuniweb_666297", "record_kuniweb_943917", "record_kuniweb_681925", "record_kuniweb_854325"];
        this.error_recieved = false;
        this.error_code = null;
        this.config = null;
        this.count = 0;
        DataLoader.loadPicyConfigFile(this.storageService).then(function (config) { return _this.config = config; });
    }
    PicyController.prototype.loadGallery = function () {
        var _this = this;
        var galleryRecords = this.storageService.localState.picyGallery;
        this.gallery = [];
        if (galleryRecords.length == 0) {
            this.index = -1;
            if (this.loadingFinishedCallback)
                this.loadingFinishedCallback();
            if (this.menuLoadingFinishedCallback)
                this.menuLoadingFinishedCallback();
            return;
        }
        var first = true;
        DataLoader.loadGallery(this.storageService, galleryRecords).then(function (value) {
            var _loop_1 = function (iiif) {
                _this.gallery.push(iiif);
                var data_1 = new PicyObject();
                data_1.set(iiif.label, iiif.getThumbnailImageUrl(), iiif.getImageService(), iiif.attribution, iiif.record_id);
                DataLoader.downloadLIDO(_this.storageService, iiif.record_id).then(function (lidoObject) {
                    if (_this.config != null)
                        data_1.load(lidoObject, iiif, _this.config, _this.storageService, _this.storageService.configuration.viewHeight);
                    else
                        console.log("Config is null");
                    _this.dataset.push(data_1);
                    if (first) {
                        _this.index = 0;
                        first = false;
                    }
                    _this.loadingFinishedCallback();
                }).catch(function (error) {
                    _this.error_recieved = true;
                    _this.error_code = error;
                    console.log("ERROR while downloading", error);
                });
            };
            for (var _i = 0, _a = value.iiif; _i < _a.length; _i++) {
                var iiif = _a[_i];
                _loop_1(iiif);
            }
            var data = [];
            var tmp = [];
            for (var i = 0; i < _this.gallery.length; i++) {
                var img = void 0;
                if ((img = _this.storageService.loadLocalImage(_this.gallery[i].record_id, _this.storageService.configuration.viewWidth * 0.2, undefined, undefined, undefined, "square")) == null) {
                    img = _this.gallery[i].getThumbnailForAttributes(_this.storageService.configuration.viewWidth * 0.2, undefined, undefined, undefined, "square");
                    _this.storageService.saveLocalImage(_this.gallery[i].record_id, img, _this.storageService.configuration.viewWidth * 0.2, undefined, undefined, undefined, "square");
                }
                tmp[i % 4] = { img: img, record: _this.gallery[i].record_id };
                if (i % 4 == 3) {
                    data.push(tmp);
                    tmp = [];
                }
            }
            if (tmp != [])
                data.push(tmp);
            console.log("Gallery", data);
            _this.menuEntries = data;
            if (_this.menuLoadingFinishedCallback != null)
                _this.menuLoadingFinishedCallback();
        });
    };
    PicyController.prototype.setLoadingFinishedCallback = function (cb) {
        this.loadingFinishedCallback = cb;
    };
    PicyController.prototype.setMenuLoadingFinishedCallback = function (cb) {
        this.menuLoadingFinishedCallback = cb;
    };
    PicyController.prototype.getInitIndex = function () {
        return this.index;
    };
    PicyController.prototype.getNextIndex = function () {
        this.index++;
        if (this.index > this.dataset.length - 1)
            this.index = this.dataset.length - 1;
        return this.index;
    };
    PicyController.prototype.getPreviousIndex = function () {
        this.index--;
        if (this.index < 0)
            this.index = 0;
        return this.index;
    };
    PicyController.prototype.getIndexForRecord = function (record) {
        for (var i = 0; i < this.dataset.length; i++)
            if (this.dataset[i].recordID == record)
                return i;
    };
    PicyController = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [StorageService])
    ], PicyController);
    return PicyController;
}());
export { PicyController };
var PicyObject = /** @class */ (function () {
    function PicyObject() {
        this.recordID = "";
        this.title = "";
        this.image_thumbnail = "";
        this.image_service = null;
        this.rights = "";
        this.cards = [];
    }
    PicyObject.prototype.set = function (title, image_thumbnail, images_service, rights, recordID) {
        this.title = title;
        this.image_thumbnail = image_thumbnail;
        this.image_service = images_service;
        this.rights = rights;
        this.recordID = recordID;
    };
    PicyObject.prototype.load = function (lido, iiif, config, storageService, viewHeight) {
        this.title = lido.title.get();
        if ((this.image_thumbnail = storageService.loadLocalImage(iiif.record_id, undefined, viewHeight * 0.4)) == null) {
            this.image_thumbnail = iiif.getThumbnailForAttributes(undefined, viewHeight * 0.4);
            storageService.saveLocalImage(iiif.record_id, this.image_thumbnail, undefined, viewHeight * 0.4);
        }
        this.image_service = iiif.getImageService();
        this.rights = iiif.getAttributionForLanguage("de");
        this.recordID = iiif.record_id;
        if (config != null) {
            for (var _i = 0, _a = config.reverse(); _i < _a.length; _i++) {
                var con = _a[_i];
                if (con.pattern != undefined && (PicyObject.testPattern(lido, con.pattern))) {
                    for (var _b = 0, _c = con.config; _b < _c.length; _b++) {
                        var c = _c[_b];
                        var cardObj = new PicyObjectCard();
                        var data = [];
                        var t = PicyObject.getLidoVariable(lido, c.title);
                        if (c.structure != undefined) {
                            for (var _d = 0, _e = c.structure; _d < _e.length; _d++) {
                                var s = _e[_d];
                                var x = { title: "", data: "" };
                                x.title = PicyObject.getLidoVariable(lido, s.title);
                                x.data = PicyObject.getLidoVariable(lido, s.data);
                                if (s.pattern == undefined || PicyObject.testPattern(lido, s.pattern, x.title, x.data))
                                    data.push(x);
                            }
                        }
                        if (c.pattern == undefined || PicyObject.testPattern(lido, c.pattern, t)) {
                            cardObj.set(t, data, true);
                            this.cards.push(cardObj);
                        }
                    }
                    break;
                }
            }
        }
    };
    PicyObject.getLidoVariable = function (lido, str) {
        if (str[0] != '/')
            return str;
        var split = str.substring(1).split('/');
        var _lido = lido;
        for (var _i = 0, split_1 = split; _i < split_1.length; _i++) {
            var sp = split_1[_i];
            if (_lido[sp] != undefined)
                _lido = _lido[sp];
            else
                return null;
        }
        return String(_lido);
    };
    PicyObject.testPattern = function (lido, pattern, title, data) {
        var _variable = "/" + pattern.substring(1, pattern.indexOf("/", 2));
        var _regex = pattern.substring(pattern.indexOf("/", 2) + 1, pattern.lastIndexOf("/")); //.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        var _flag = pattern.substring(pattern.lastIndexOf("/") + 1);
        var variable;
        if (title != undefined && (_variable == "/t" || _variable == "/T"))
            variable = title;
        else if ((data != undefined) && (_variable == "/d" || _variable == "/D"))
            variable = data;
        else
            variable = PicyObject.getLidoVariable(lido, _variable);
        return new RegExp(_regex, _flag).test(variable);
    };
    return PicyObject;
}());
export { PicyObject };
var PicyObjectCard = /** @class */ (function () {
    function PicyObjectCard() {
        this.title = "";
        this.data = [];
        this.min = false;
    }
    PicyObjectCard.prototype.set = function (title, data, min) {
        this.title = title;
        this.data = data;
        this.min = min;
    };
    return PicyObjectCard;
}());
export { PicyObjectCard };
//# sourceMappingURL=picy.controller.service.js.map