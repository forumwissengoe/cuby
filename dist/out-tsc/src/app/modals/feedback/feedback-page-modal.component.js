import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataLoader } from '../../../data/DataLoader';
var FeedbackPageModal = /** @class */ (function () {
    function FeedbackPageModal(modalCtrl) {
        this.modalCtrl = modalCtrl;
        this.feedbackdata = "";
    }
    FeedbackPageModal.prototype.ngOnInit = function () {
    };
    FeedbackPageModal.prototype.send = function () {
        // Data
        // SecureToken: "66DE25A7DF509B692D968EF8A71FAB53C3CF0C97E66073787B8A7FF6B62292D2C07B840A0D6088F39B95BE2AA9FADC34",
        // Password: "PtT}Nv+?qY}@jN#n",
        // Host: "firemail.de",
        // Username: "cubyBetaTest@firemail.de",
        //console.log("EMAIL: ", Email);
        /*Email.send({
            Host: "smtp.elasticemail.com",
            Username: "niname408@googlemail.com",
            Password: "84e9165f-9367-4724-94df-1467f48024e1",
            To: "kustodie@gwdg.de",
            From: "cubyBetaTest@firemail.de",
            Subject: "Beta-Test Feedback",
            Body: "Feedback-Nachricht: \n" + this.feedbackdata
        }).then(message => console.log(message));*/
        console.log("FEEDBACK: " + this.feedbackdata);
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://wissenskiosk.uni-goettingen.de/cuby/cubymailer.php?auth=" + DataLoader.emailTOKEN + "&data=" + this.feedbackdata);
        xhr.onload = function (ev) {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    if (xhr.responseText.indexOf("SUCCESS") == -1)
                        console.log("Email sending error");
                    else
                        console.log("Email sending success");
                }
                else {
                    console.log("Email error status: " + xhr.status);
                }
            }
        };
        xhr.send();
        this.modalCtrl.dismiss();
    };
    FeedbackPageModal.prototype.close = function () {
        this.modalCtrl.dismiss();
    };
    FeedbackPageModal = tslib_1.__decorate([
        Component({
            selector: 'app-feedback',
            templateUrl: './feedback-page-modal.component.html',
            styleUrls: ['./feedback-page-modal.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [ModalController])
    ], FeedbackPageModal);
    return FeedbackPageModal;
}());
export { FeedbackPageModal };
//# sourceMappingURL=feedback-page-modal.component.js.map