import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
var EvaluateService = /** @class */ (function () {
    function EvaluateService() {
        this.level1 = [];
        this.currentLevel1 = [];
        this.level2 = [];
        this.currentLevel2 = [];
        this.level3 = [];
    }
    EvaluateService_1 = EvaluateService;
    EvaluateService.prototype.publishLikabilityLevel1 = function (record) {
        console.log("Publish Level 1", record);
        this.level1.push(record);
        this.currentLevel1.push(record);
    };
    EvaluateService.prototype.publishLikabilityLevel2 = function (record) {
        console.log("Publish Level 2", record);
        this.level2.push(record);
        this.currentLevel2.push(record);
    };
    EvaluateService.prototype.publishLikabilityLevel3 = function (record) {
        console.log("Publish Level 3");
        this.level3.push(record);
    };
    EvaluateService.prototype.getLikabilityLevel1 = function () {
        return this.level1;
    };
    EvaluateService.prototype.getCurrentLikabilityLevel1 = function () {
        console.log("Get current Level 1", this.currentLevel1);
        return this.currentLevel1;
    };
    EvaluateService.prototype.getLikabilityLevel2 = function () {
        return this.level2;
    };
    EvaluateService.prototype.getCurrentLikabilityLevel2 = function () {
        console.log("Get current Level 2", this.currentLevel2);
        return this.currentLevel2;
    };
    EvaluateService.prototype.getLikabilityLevel3 = function () {
        return this.level3;
    };
    EvaluateService.prototype.removeCurrentLevel1 = function (record) {
        EvaluateService_1.removeObj(this.currentLevel1, record);
    };
    EvaluateService.prototype.removeCurrentLevel2 = function (record) {
        EvaluateService_1.removeObj(this.currentLevel2, record);
    };
    EvaluateService.prototype.stringify = function () {
        var data = { level1: this.level1, currentLevel1: this.currentLevel1, level2: this.currentLevel2, level3: this.level3 };
        return JSON.stringify(data);
    };
    EvaluateService.prototype.parseFromString = function (str) {
        var data = JSON.parse(str);
        this.level1 = data.level1;
        this.level2 = data.level2;
        this.level3 = data.level3;
        this.currentLevel1 = data.currentLevel1;
        this.currentLevel2 = data.currentLevel2;
    };
    EvaluateService.removeObj = function (arr, obj) {
        var index = arr.indexOf(obj);
        if (index != -1)
            arr.splice(index, 1);
    };
    var EvaluateService_1;
    EvaluateService = EvaluateService_1 = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], EvaluateService);
    return EvaluateService;
}());
export { EvaluateService };
var Level3Likability = /** @class */ (function () {
    function Level3Likability() {
        this.recordID = "";
        this.likedFields = [];
        this.comment = "";
    }
    return Level3Likability;
}());
export { Level3Likability };
//# sourceMappingURL=evaluate.service.js.map