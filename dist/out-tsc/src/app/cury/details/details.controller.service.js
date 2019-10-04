import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { DataLoader } from '../../../data/DataLoader';
import { StorageService } from '../../storage.service';
var DetailsController = /** @class */ (function () {
    function DetailsController(storageService) {
        var _this = this;
        this.storageService = storageService;
        this.displayData = [];
        this.error_recieved = false;
        this.error_code = null;
        this.size = 0;
        this.count = 0;
        this.config = null;
        this.dummy_records = ["record_kuniweb_945664", "record_kuniweb_666297", "record_kuniweb_943917", "record_kuniweb_681925", "record_kuniweb_854325"];
        DataLoader.loadDetailsConfigFile(this.storageService).then(function (config) {
            _this.config = config;
        });
    }
    DetailsController.prototype.loadRecordList = function (records) {
        var _this = this;
        this.size = records.length;
        for (var _i = 0, records_1 = records; _i < records_1.length; _i++) {
            var record = records_1[_i];
            DataLoader.downloadManifest(this.storageService, record)
                .then(function (iiiFObject) {
                DataLoader.downloadLIDO(_this.storageService, iiiFObject.record_id)
                    .then(function (lidoObject) {
                    var detailsObject = new DetailsObject();
                    detailsObject.load(lidoObject, iiiFObject, _this.config, _this.storageService, _this.storageService.configuration.viewHeight * 0.4);
                    _this.displayData.push(detailsObject);
                    _this.count++;
                    if (_this.count >= _this.size && _this.loadingFinishedCallback != null)
                        _this.loadingFinishedCallback();
                })
                    .catch(function (error) {
                    _this.error_recieved = true;
                    _this.error_code = error;
                    console.error("ERROR while downloading Lido", error);
                });
            })
                .catch(function (error) {
                _this.error_recieved = true;
                _this.error_code = error;
                console.error("ERROR while downloading IiiF", error);
            });
        }
    };
    DetailsController.prototype.clearDisplayData = function () {
        this.displayData = [];
    };
    DetailsController.prototype.setLoadingFinishedCallback = function (cb) {
        this.loadingFinishedCallback = cb;
    };
    DetailsController.prototype.loadDummyList = function () {
        console.log("Load dummy list");
        this.loadRecordList(this.dummy_records);
    };
    DetailsController = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [StorageService])
    ], DetailsController);
    return DetailsController;
}());
export { DetailsController };
var DetailsObject = /** @class */ (function () {
    function DetailsObject() {
        this.record = "";
        this.lidoObj = null;
        this.iiifObj = null;
        this.name = "";
        this.thumbnail = "";
        this.image_service = null;
        this.like = null;
        this.entries = [];
    }
    DetailsObject.prototype.load = function (lido, iiif, config, storageService, height) {
        this.name = iiif.label;
        if ((this.thumbnail = storageService.loadLocalImage(iiif.record_id, undefined, height)) == null) {
            this.thumbnail = iiif.getThumbnailForAttributes(undefined, height);
            storageService.saveLocalImage(iiif.record_id, this.thumbnail, undefined, height);
        }
        this.image_service = iiif.getImageService();
        this.record = iiif.record_id;
        this.lidoObj = lido;
        this.iiifObj = iiif;
        if (config != null) {
            for (var _i = 0, _a = config.reverse(); _i < _a.length; _i++) {
                var con = _a[_i];
                if (con.pattern != undefined && con.config != undefined && DetailsObject.testPattern(lido, iiif, con.pattern)) {
                    for (var _b = 0, _c = con.config; _b < _c.length; _b++) {
                        var s = _c[_b];
                        var x = { label: null, value: null };
                        x.label = DetailsObject.getVariable(lido, iiif, s.title);
                        x.value = DetailsObject.getVariable(lido, iiif, s.data);
                        if (s.pattern == undefined) {
                            this.entries.push({ label: DetailsObject.atos(x.label), value: DetailsObject.atos(x.value) });
                            continue;
                        }
                        var b = DetailsObject.testPattern(lido, iiif, s.pattern, x.label, x.value);
                        if (typeof b == 'number' && b != -1)
                            if (Array.isArray(x.value))
                                this.entries.push({ label: DetailsObject.atos(x.label), value: x.value[b] });
                            else if (Array.isArray(x.label))
                                this.entries.push({ label: x.label[b], value: DetailsObject.atos(x.value) });
                            else
                                this.entries.push({ label: DetailsObject.atos(x.label), value: DetailsObject.atos(x.value) });
                        else if (typeof b == 'boolean' && b)
                            this.entries.push({ label: DetailsObject.atos(x.label), value: DetailsObject.atos(x.value) });
                    }
                    break;
                }
            }
        }
    };
    DetailsObject.getVariable = function (lido, iiif, str) {
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
    DetailsObject.testPattern = function (lido, iiif, pattern, title, data) {
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
            variable = DetailsObject.getVariable(lido, iiif, "/" + _location + _variable);
        if (!Array.isArray(variable))
            return new RegExp(_regex, _flag).test(variable);
        for (var i = 0; i < variable.length; i++)
            if (new RegExp(_regex, _flag).test(variable[i]))
                return i;
        return false;
    };
    DetailsObject.atos = function (arr) {
        if (Array.isArray(arr))
            return String(arr[0]);
        else
            return String(arr);
    };
    return DetailsObject;
}());
export { DetailsObject };
//# sourceMappingURL=details.controller.service.js.map