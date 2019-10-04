import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { StorageService } from '../../storage.service';
import { ActivatedRoute } from '@angular/router';
import { DataLoader } from '../../../data/DataLoader';
import { AlertController } from '@ionic/angular';
var MilestonePage = /** @class */ (function () {
    function MilestonePage(storageService, route, alertCtrl) {
        this.storageService = storageService;
        this.route = route;
        this.alertCtrl = alertCtrl;
        this.categoryName = "Objektgattung";
        this.categoryID = "";
        this.progress = 0;
        this.congrats = false;
        this.booh = false;
        this.askAgain = false;
        this.autoPost = false;
    }
    MilestonePage.prototype.ngOnInit = function () {
        var _this = this;
        this.categoryID = this.route.snapshot.paramMap.get('id');
        this.categoryName = this.storageService.getCategoryNameForType(this.categoryID);
        if (this.storageService.localState.homyPostHighscoreAsk != null)
            this.askAgain = this.storageService.localState.homyPostHighscoreAsk;
        if (this.storageService.localState.homyPostHighscore != null)
            this.autoPost = this.storageService.localState.homyPostHighscore;
        if (this.storageService.homyState.correct_records != [])
            for (var item in this.storageService.homyState.correct_records)
                this.storageService.localState.picyGallery.push(item);
        var target = 100;
        if (this.storageService.homyState && this.storageService.homyState.current_points != undefined) {
            target = this.storageService.homyState.current_points * 10;
            this.storageService.homyState.current_points = 0;
        }
        var interval = setInterval(function () {
            if (_this.progress >= target) {
                clearInterval(interval);
                if (target >= 100)
                    setTimeout(function () { return _this.congrats = true; }, 150);
                if (target == 0)
                    setTimeout(function () { return _this.booh = true; }, 150);
            }
            else
                _this.progress++;
        }, 25);
        var timeout = setTimeout(function () {
            if (_this.askAgain)
                _this.askPublishHighscore();
            else if (_this.autoPost)
                _this.publishHighscore(true);
        }, 2000);
    };
    MilestonePage.prototype.askPublishHighscore = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertCtrl.create({
                            header: "Highscore: " + this.storageService.homyState.total_points,
                            message: "<b>M\u00F6chtest du deinen neuen Highscore ver\u00F6ffentlichen?</b>",
                            inputs: [
                                {
                                    name: 'askItAgain',
                                    type: 'checkbox',
                                    label: 'Nicht wieder fragen',
                                    value: 'dontAskAgain',
                                    checked: !this.askAgain
                                }
                            ],
                            buttons: [
                                {
                                    text: "Ja",
                                    handler: function (data) {
                                        _this.askAgain = data.indexOf('dontAskAgain') == -1;
                                        _this.publishHighscore(true);
                                    }
                                },
                                {
                                    text: "Nein",
                                    handler: function (data) {
                                        _this.askAgain = data.indexOf('dontAskAgain') == -1;
                                        _this.publishHighscore(false);
                                    }
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
    MilestonePage.prototype.publishHighscore = function (should) {
        console.log("Ask Again: ", this.askAgain);
        if (should) {
            console.log("Publishing highscore...");
            if (this.storageService.homyState && this.storageService.homyState.total_points != undefined) {
                if (this.storageService.configuration && this.storageService.configuration.homy_highscore_url && this.storageService.configuration.homy_highscore_url != "")
                    DataLoader.publishHomyHighscore(this.storageService.configuration.homy_highscore_url, this.storageService.homyState.total_points)
                        .then(function () { return console.log("Published highscore"); })
                        .catch(function () { return console.log("Failed to publish highscore"); });
                else
                    console.log("Failed to find homys config or highscore_url");
            }
            else
                console.log("Failed to find homys state or total_points");
        }
        else {
            console.log("Don't publish highscore");
        }
        this.storageService.localState.homyPostHighscore = this.askAgain;
    };
    MilestonePage = tslib_1.__decorate([
        Component({
            selector: 'app-milstone',
            templateUrl: './milestone-page.component.html',
            styleUrls: ['./milestone-page.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [StorageService, ActivatedRoute, AlertController])
    ], MilestonePage);
    return MilestonePage;
}());
export { MilestonePage };
//# sourceMappingURL=milestone-page.component.js.map