import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataLoader } from '../../../data/DataLoader';
import { StorageService } from '../../storage.service';
import * as OtpCrypto from 'otp-crypto';
import * as Base64 from 'base-64';
var NfcPickPagePage = /** @class */ (function () {
    function NfcPickPagePage(router, storageService) {
        this.router = router;
        this.storageService = storageService;
        this.secret = 'LXKR7AM5XnnqCfOGksmeY+ETTzPcC1EYePrlX9YHfIoZDMCfjkQYLz9uh/7u47hqoCo=';
        this.prefix = '000';
        this.dummyRecord = "record_kuniweb_1290372";
        this.loading = true;
        // Record
        this.image = "https://sammlungen.uni-goettingen.de/rest/image/record_kuniweb_1290372/record_kuniweb_1290372_509821.jpg/full/520,/0/default.jpg";
        this.title_header = "Objektbezeichnung";
        this.title_data = "Title";
        this.recordID = "";
        var records = this.storageService.getNFCRecord();
        console.log("Records", records);
        if (records.length == 0)
            this.loadObjekt(this.dummyRecord);
        else
            this.decryptRecords(records);
        //this.decryptRecords("HUKhnmZaMQuOVpjz/KDpBoNMeQTqMmAu");
    }
    NfcPickPagePage.prototype.ngOnInit = function () {
    };
    NfcPickPagePage.prototype.decryptRecords = function (data) {
        var result = "";
        for (var i = 0; i < data.length; i++) {
            var encrypted = data[i];
            console.log("Enc:", encrypted);
            var raw = Base64.decode(this.secret);
            var key = new Uint8Array(new ArrayBuffer(raw.length));
            for (var i_1 = 0; i_1 < raw.length; i_1++) {
                key[i_1] = raw.charCodeAt(i_1);
            }
            var otpDecrypted = OtpCrypto.decrypt(encrypted, key);
            var str = otpDecrypted.plaintextDecrypted;
            var strings = str.split("|");
            if (strings.length > 1)
                str = strings[Math.floor(Math.random() * strings.length - 1)];
            console.log("Str ", str);
            if (str.indexOf("record_") != -1 && str.startsWith(this.prefix)) {
                str = str.replace(this.prefix, "");
                console.log("Load", str);
                this.loadObjekt(str);
            }
            else if (!str.startsWith(this.prefix)) {
                // TODO Nice try
                str = "";
            }
        }
        if (result == "") {
            console.log("Could not read record. Maybe wrong format?");
        }
        else
            console.log("Res", result);
    };
    NfcPickPagePage.prototype.loadObjekt = function (record) {
        var _this = this;
        DataLoader.downloadManifest(this.storageService, record).then(function (iiif) {
            _this.image = iiif.getThumbnailForAttributes(undefined, _this.storageService.configuration.viewHeight * 0.3);
            _this.title_data = iiif.label;
            _this.loading = false;
            _this.recordID = record;
        });
    };
    NfcPickPagePage.prototype.addToSelection = function () {
        if (this.recordID != "") {
            var already = false;
            for (var _i = 0, _a = this.storageService.localState.picyGallery; _i < _a.length; _i++) {
                var rec = _a[_i];
                if (rec === this.recordID)
                    already = true;
            }
            if (!already)
                this.storageService.localState.picyGallery.push(this.recordID);
        }
        else
            alert("Fehler beim Speichern des Objektes. Versuchen Sie es nochmal");
        this.router.navigate(['/home']);
    };
    NfcPickPagePage = tslib_1.__decorate([
        Component({
            selector: 'app-nfc-pick-page',
            templateUrl: './nfc-pick-page.page.html',
            styleUrls: ['./nfc-pick-page.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [Router, StorageService])
    ], NfcPickPagePage);
    return NfcPickPagePage;
}());
export { NfcPickPagePage };
//# sourceMappingURL=nfc-pick-page.page.js.map