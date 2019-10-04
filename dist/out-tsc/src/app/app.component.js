import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Events, MenuController, ModalController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { NFC, Ndef } from '@ionic-native/nfc/ngx';
import { StorageService } from './storage.service';
import { FeedbackPageModal } from './modals/feedback/feedback-page-modal.component';
var AppComponent = /** @class */ (function () {
    function AppComponent(platform, splashScreen, statusBar, router, menuCtrl, events, nfc, ndef, storageService, modalCtrl) {
        this.platform = platform;
        this.splashScreen = splashScreen;
        this.statusBar = statusBar;
        this.router = router;
        this.menuCtrl = menuCtrl;
        this.events = events;
        this.nfc = nfc;
        this.ndef = ndef;
        this.storageService = storageService;
        this.modalCtrl = modalCtrl;
        this.data = [];
        this.secondMenu = false;
        this.type = "grid";
        this.initializeApp();
    }
    AppComponent.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.statusBar.overlaysWebView(false);
            // Uni Blau
            _this.statusBar.backgroundColorByHexString('#113e74');
            _this.splashScreen.hide();
        });
    };
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.router.events.subscribe(function (event) {
            _this.menuCtrl.enable(false);
        });
        this.events.subscribe('picy:MenuChanged', function (new_data) {
            _this.data = new_data;
            console.log("Menu changed");
        });
        this.platform.ready().then(function () { return _this.platformReady(); });
    };
    // Execute startup and load configurations
    AppComponent.prototype.platformReady = function () {
        var _this = this;
        console.log("Platform ready");
        if (this.platform.is('cordova')) {
            this.nfc.addNdefListener().subscribe(function (event) {
                console.log("Tag found");
                console.log("Event: ", event);
                _this.readTag(event.tag.ndefMessage);
            });
            this.storageService.cordovaAvailable = true;
        }
        this.storageService.startup();
        //this.storageService.loadConfig();
        //this.storageService.loadLocalState();
        this.platform.pause.subscribe(function (e) { return _this.storageService.saveLocalState(); });
        window.addEventListener('beforeunload', function () { return _this.storageService.saveLocalState(); });
    };
    AppComponent.prototype.menuEntrySelected = function (record) {
        this.events.publish("picy:MenuSelected", this.type + ":" + record);
    };
    AppComponent.prototype.readTag = function (messages) {
        var result = [];
        for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
            var msg = messages_1[_i];
            result.push(this.nfc.bytesToString(msg.payload.slice(3)));
        }
        console.log("Payloads: ", result);
        this.storageService.setNFCRecord(result);
        this.router.navigate(['/nfc-pick-page']);
    };
    AppComponent.prototype.presentFeedbackModal = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var modal;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalCtrl.create({
                            component: FeedbackPageModal
                        })];
                    case 1:
                        modal = _a.sent();
                        return [4 /*yield*/, modal.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppComponent = tslib_1.__decorate([
        Component({
            selector: 'app-root',
            templateUrl: 'app.component.html',
            styleUrls: ['app.component.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [Platform,
            SplashScreen,
            StatusBar,
            Router,
            MenuController,
            Events,
            NFC,
            Ndef,
            StorageService,
            ModalController])
    ], AppComponent);
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=app.component.js.map