import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { DataLoader } from '../../data/DataLoader';
import { StorageService } from '../storage.service';
var HomyPage = /** @class */ (function () {
    function HomyPage(storageService) {
        this.storageService = storageService;
        this.highscore = true;
        this.highscoreLoading = true;
        this.region = "100m";
        this.otherPlayers = [];
    }
    HomyPage.prototype.ngOnInit = function () { };
    HomyPage.prototype.ionViewWillEnter = function () {
        this.highscoreLoading = true;
        if (!this.storageService.homyFinished)
            this.storageService.homyCallback = this.requestOtherPlayers.bind(this);
        else
            this.requestOtherPlayers();
        console.log("After view init");
    };
    // TODO region when location services finished.
    HomyPage.prototype.requestOtherPlayers = function () {
        var _this = this;
        var region = "all";
        if (this.storageService && this.storageService.configuration && this.storageService.configuration.homy_highscore_url && this.storageService.configuration.homy_highscore_url != "") {
            console.log("Loading Other players");
            DataLoader.requestHomyHighscore(this.storageService.configuration.homy_highscore_url)
                .then(function (data) {
                if (data[region] && Array.isArray(data[region])) {
                    var arr = data[region];
                    arr.sort(function (a, b) { return parseInt(b) - parseInt(a); });
                    _this.otherPlayers = [];
                    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                        var a = arr_1[_i];
                        _this.otherPlayers.push({ highscore: a });
                    }
                    _this.highscore = true;
                    if (region == "all")
                        _this.region = "Global";
                    else
                        _this.region = region;
                }
                else if (data["all"] && Array.isArray(data["all"])) {
                    var arr = data["all"];
                    arr.sort(function (a, b) {
                        return parseInt(b) - parseInt(a);
                    });
                    _this.otherPlayers = [];
                    for (var _a = 0, arr_2 = arr; _a < arr_2.length; _a++) {
                        var a = arr_2[_a];
                        _this.otherPlayers.push({ highscore: a });
                    }
                    _this.highscore = true;
                    _this.region = "Global";
                }
                else
                    _this.highscore = false;
                _this.highscoreLoading = false;
            })
                .catch(function (error) {
                console.log("Highscore error: ", error);
                _this.highscoreLoading = false;
            });
        }
    };
    HomyPage = tslib_1.__decorate([
        Component({
            selector: 'app-homy',
            templateUrl: './homy.page.html',
            styleUrls: ['./homy.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [StorageService])
    ], HomyPage);
    return HomyPage;
}());
export { HomyPage };
//# sourceMappingURL=homy.page.js.map