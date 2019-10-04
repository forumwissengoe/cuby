import * as tslib_1 from "tslib";
import { Component, ViewChild } from '@angular/core';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { Router } from '@angular/router';
import { SocketService } from './socket.service';
import { VoteIconGroup } from '../../cury/details/VoteIconGroup';
import { map } from 'rxjs/operators';
import { StorageService } from '../../storage.service';
var CoversPage = /** @class */ (function () {
    function CoversPage(qrScanner, router, wsService, storageService) {
        this.qrScanner = qrScanner;
        this.router = router;
        this.wsService = wsService;
        this.storageService = storageService;
        this.firstOpening = true;
        this.sotd = "pqmwpn";
        this.image = "../../assets/images/ripple-loading.svg";
        this.chat_host = "localhost";
        this.chat_port = "6389";
        this.subject = null;
        this.record = null;
        this.connected = false;
        this.picUpBox = false;
    }
    CoversPage_1 = CoversPage;
    CoversPage.prototype.ngOnInit = function () {
        if (this.firstOpening) {
            this.openScanner();
            this.firstOpening = false;
        }
        this.connect();
    };
    CoversPage.prototype.openScanner = function () {
        var _this = this;
        this.qrScanner.prepare()
            .then(function (status) {
            if (status.authorized) {
                var scanSub_1 = _this.qrScanner.scan().subscribe(function (text) {
                    _this.qrScanner.hide();
                    scanSub_1.unsubscribe();
                    var url = new URL(text);
                    _this.chat_host = url.hostname;
                    _this.sotd = url.pathname.replace("/vote/", "").replace(/\/[\s\S]*/, ""); // RegExp deletes everything after the first /
                    _this.connect();
                });
            }
        })
            .catch(function (e) { return console.log("Scan error: ", e); });
    };
    CoversPage.prototype.connect = function () {
        var _this = this;
        console.log("Connecting....");
        this.subject = this.wsService.connect("ws://" + this.chat_host + ":" + this.chat_port + "/")
            .pipe(map(function (msgEvent) { return msgEvent.data; }));
        this.subject.subscribe(function (msg) {
            //console.log("Msg: ", msg);
            if (msg.substring(0, 5) === "IMAG:") {
                msg = msg.substring(5);
                if (CoversPage_1.isURLvalid(msg)) {
                    _this.image = msg;
                    if (msg.match(/(\/record_([a-z-_])*_([a-z0-9-_])*\/)/gi) != null)
                        _this.record = msg.match(/(\/record_([a-z-_])*_([a-z0-9-_])*\/)/gi)[0].replace(/\//g, "");
                    if (_this.votegroup)
                        _this.votegroup.reset();
                    _this.connected = true;
                    _this.picUpBox = false;
                }
                else
                    console.log("Invalid: ", msg);
            }
            else if (msg.substring(0, 4) === "INCO") {
                alert("Diese Verbindung ist abgelaufen.");
                if (_this.votegroup)
                    _this.votegroup.reset();
                _this.connected = false;
            }
        });
    };
    CoversPage.prototype.voted = function (liked) {
        if (this.connected) {
            if (liked) {
                this.subject.next("VOTE:+:" + this.sotd);
                this.picUpBox = true;
            }
            else
                this.subject.next("VOTE:-:" + this.sotd);
        }
    };
    CoversPage.prototype.addToPicy = function () {
        if (this.record != "") {
            var already = false;
            for (var _i = 0, _a = this.storageService.localState.picyGallery; _i < _a.length; _i++) {
                var rec = _a[_i];
                if (rec === this.record)
                    already = true;
            }
            if (!already)
                this.storageService.localState.picyGallery.push(this.record);
        }
        console.log("Collected: ", this.record);
        this.picUpBox = false;
    };
    CoversPage.prototype.decline = function () {
        this.picUpBox = false;
    };
    CoversPage.isURLvalid = function (str) {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_,!.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(str);
    };
    var CoversPage_1;
    tslib_1.__decorate([
        ViewChild('votegroup'),
        tslib_1.__metadata("design:type", VoteIconGroup)
    ], CoversPage.prototype, "votegroup", void 0);
    CoversPage = CoversPage_1 = tslib_1.__decorate([
        Component({
            selector: 'app-covers',
            templateUrl: './covers.page.html',
            styleUrls: ['./covers.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [QRScanner, Router, SocketService, StorageService])
    ], CoversPage);
    return CoversPage;
}());
export { CoversPage };
//# sourceMappingURL=covers.page.js.map