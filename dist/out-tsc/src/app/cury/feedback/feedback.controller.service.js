import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { DataLoader } from '../../../data/DataLoader';
import { StorageService } from '../../storage.service';
var FeedbackController = /** @class */ (function () {
    function FeedbackController(storageService) {
        var _this = this;
        this.storageService = storageService;
        this.displayData = [];
        this.index = 0;
        this.loadingFinishedCallback = null;
        this.size = 0;
        this.count = 0;
        this.config = null;
        this.error_recieved = false;
        this.error_code = 0;
        this.dummy_records = ["record_kuniweb_945664"];
        DataLoader.loadFeedbackConfigFile(this.storageService).then(function (config) { return _this.config = config; });
    }
    FeedbackController.prototype.loadRecordList = function (records) {
        var _this = this;
        this.displayData = [];
        this.size = records.length;
        this.count = 0;
        this.index = 0;
        for (var _i = 0, records_1 = records; _i < records_1.length; _i++) {
            var record = records_1[_i];
            DataLoader.downloadManifest(this.storageService, record)
                .then(function (iiif) {
                DataLoader.downloadLIDO(_this.storageService, iiif.record_id)
                    .then(function (lido) {
                    var object = new FeedbackObject();
                    object.load(lido, iiif, _this.config, _this.storageService, _this.storageService.configuration.viewHeight * 0.3);
                    _this.displayData.push(object);
                    _this.count++;
                    if (_this.count >= _this.size && _this.loadingFinishedCallback != null)
                        _this.loadingFinishedCallback();
                })
                    .catch(function (error) {
                    _this.error_recieved = true;
                    _this.error_code = error;
                    console.log("ERROR while downloading", error);
                });
            })
                .catch(function (error) {
                _this.error_recieved = true;
                _this.error_code = error;
                console.log("ERROR while downloading", error);
            });
        }
    };
    FeedbackController.prototype.setLoadingFinishedCallback = function (cb) {
        this.loadingFinishedCallback = cb;
    };
    FeedbackController.prototype.loadDummyList = function () {
        console.log("Load dummy list");
        this.loadRecordList(this.dummy_records);
    };
    FeedbackController.prototype.next = function () {
        if (this.index + 1 >= this.displayData.length)
            return -1;
        else
            return ++this.index;
    };
    FeedbackController = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [StorageService])
    ], FeedbackController);
    return FeedbackController;
}());
export { FeedbackController };
var FeedbackObject = /** @class */ (function () {
    function FeedbackObject() {
        this.record = "";
        this.lidoObj = null;
        this.iiifObj = null;
        this.name = "";
        this.thumbnail = "";
        this.image_service = null;
        this.check = false;
        this.entries = [];
    }
    FeedbackObject.prototype.load = function (lido, iiif, config, storageService, height) {
        this.name = iiif.label;
        this.record = iiif.record_id;
        if ((this.thumbnail = storageService.loadLocalImage(iiif.record_id, undefined, height)) == null) {
            this.thumbnail = iiif.getThumbnailForAttributes(undefined, height);
            storageService.saveLocalImage(iiif.record_id, this.thumbnail, undefined, height);
        }
        this.image_service = iiif.getImageService();
        this.lidoObj = lido;
        this.iiifObj = iiif;
        if (config != null) {
            for (var _i = 0, _a = config.reverse(); _i < _a.length; _i++) {
                var con = _a[_i];
                if (con.pattern != undefined && con.config != undefined && FeedbackObject.testPattern(lido, iiif, con.pattern)) {
                    for (var _b = 0, _c = con.config; _b < _c.length; _b++) {
                        var s = _c[_b];
                        var x = { label: null, value: null };
                        x.label = FeedbackObject.getVariable(lido, iiif, s.title);
                        x.value = FeedbackObject.getVariable(lido, iiif, s.data);
                        if (s.pattern == undefined) {
                            this.entries.push({ label: FeedbackObject.atos(x.label), value: FeedbackObject.atos(x.value) });
                            continue;
                        }
                        var b = FeedbackObject.testPattern(lido, iiif, s.pattern, x.label, x.value);
                        if (typeof b == 'number' && b != -1)
                            if (Array.isArray(x.value))
                                this.entries.push({ label: FeedbackObject.atos(x.label), value: x.value[b] });
                            else if (Array.isArray(x.label))
                                this.entries.push({ label: x.label[b], value: FeedbackObject.atos(x.value) });
                            else
                                this.entries.push({ label: FeedbackObject.atos(x.label), value: FeedbackObject.atos(x.value) });
                        else if (typeof b == 'boolean' && b)
                            this.entries.push({ label: FeedbackObject.atos(x.label), value: FeedbackObject.atos(x.value) });
                    }
                    break;
                }
            }
        }
    };
    FeedbackObject.getVariable = function (lido, iiif, str) {
        if (str[0] != '/')
            return str;
        var data;
        if (str[1] == "i" || str[1] == "I")
            data = iiif;
        else
            data = lido;
        var split = str.substring(3).split('/');
        if (split.indexOf("[]") != -1) {
            var tmp = data;
            var index = void 0;
            for (var index_1 = 0; index_1 < split.indexOf("[]"); index_1++)
                tmp = tmp[split[index_1]];
            var result = Array(tmp.length);
            for (var i = 0; i < result.length; i++)
                result[i] = data;
            for (var _i = 0, split_1 = split; _i < split_1.length; _i++) {
                var sp = split_1[_i];
                for (var i = 0; i < result.length; i++) {
                    if (sp != "[]") {
                        result[i] = result[i][sp];
                        if (result[i] == undefined)
                            result[i] = null;
                    }
                    else {
                        result[i] = result[i][i];
                    }
                }
            }
            return result;
        }
        for (var _a = 0, split_2 = split; _a < split_2.length; _a++) {
            var sp = split_2[_a];
            if (data[sp] != undefined) {
                data = data[sp];
            }
            else {
                return null;
            }
        }
        return String(data);
    };
    FeedbackObject.testPattern = function (lido, iiif, pattern, title, data) {
        var _flag = pattern.substring(pattern.lastIndexOf("/") + 1);
        pattern = pattern.substr(0, pattern.length - 2);
        var _location = pattern.substring(1, 2);
        pattern = pattern.substring(2);
        var _regex = pattern.substring(pattern.indexOf("|") + 1);
        pattern = pattern.substring(0, pattern.indexOf("|"));
        var _variable = pattern;
        var variable;
        if (title != undefined && (_location == "t" || _location == "T"))
            variable = title;
        if (data != undefined && (_location == "d" || _location == "D"))
            variable = data;
        else
            variable = FeedbackObject.getVariable(lido, iiif, "/" + _location + _variable);
        if (!Array.isArray(variable))
            return new RegExp(_regex, _flag).test(variable);
        for (var i = 0; i < variable.length; i++)
            if (new RegExp(_regex, _flag).test(variable[i]))
                return i;
        return false;
    };
    FeedbackObject.atos = function (arr) {
        if (Array.isArray(arr))
            return String(arr[0]);
        else
            return String(arr);
    };
    return FeedbackObject;
}());
export { FeedbackObject };
//# sourceMappingURL=feedback.controller.service.js.map