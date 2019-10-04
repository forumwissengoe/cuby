import * as tslib_1 from "tslib";
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
var FeedbackResponseOverlay = /** @class */ (function () {
    function FeedbackResponseOverlay(renderer, storage) {
        this.renderer = renderer;
        this.storage = storage;
        this.current_message = "";
        this.messages = [];
        this.latest_nonce = 0;
    }
    FeedbackResponseOverlay.prototype.ngOnInit = function () {
        var _this = this;
        this.storage.get("FEEDBACK_MESSAGES_NONCE").then(function (nonce) {
            _this.latest_nonce = nonce;
            if (_this.latest_nonce == undefined || _this.latest_nonce == null)
                _this.latest_nonce = 0;
            console.log("Latest nonce: ", _this.latest_nonce);
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "http://wissenskiosk.uni-goettingen.de/cuby/messages.json");
            xhr.onload = function (ev) {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        var arr = JSON.parse(xhr.responseText);
                        if (arr !== undefined && Array.isArray(arr)) {
                            if (arr.length > 0) {
                                for (var i = 0; i < arr.length; i++)
                                    if (arr[i].nonce > _this.latest_nonce)
                                        _this.messages.push(arr[i].message);
                                _this.latest_nonce = arr[arr.length - 1].nonce;
                                _this.storage.set("FEEDBACK_MESSAGES_NONCE", _this.latest_nonce);
                                _this.messages = _this.messages.reverse();
                                if (_this.messages.length > 0) {
                                    _this.current_message = _this.messages.pop();
                                    _this.open();
                                }
                            } // else: no new messages
                        }
                        else {
                            console.log("ERROR. Messages transmission error.");
                        }
                    }
                    else {
                        console.log("ERROR. Messages could not be loaded.");
                        return;
                    }
                }
            };
            xhr.send();
        });
    };
    FeedbackResponseOverlay.prototype.close = function () {
        if (this.messages.length > 0)
            this.current_message = this.messages.pop();
        else
            this.renderer.removeClass(this.overlay.nativeElement, "shown");
    };
    FeedbackResponseOverlay.prototype.open = function () {
        this.renderer.addClass(this.overlay.nativeElement, "shown");
    };
    tslib_1.__decorate([
        ViewChild('feedbackOverlay'),
        tslib_1.__metadata("design:type", ElementRef)
    ], FeedbackResponseOverlay.prototype, "overlay", void 0);
    FeedbackResponseOverlay = tslib_1.__decorate([
        Component({
            selector: "feedback-response-overlay",
            template: "<div #feedbackOverlay class=\"feedback-overlay\">\n\t\t\t\t\t<div class=\"text\">\n\t\t\t\t\t\t{{current_message}}\n\t\t\t\t\t</div>\n\t\t\t   <ion-icon name=\"close-circle-outline\" (click)=\"close()\"></ion-icon>\n\t\t\t   </div>",
            styleUrls: ['./feedback-response-overlay.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [Renderer2, Storage])
    ], FeedbackResponseOverlay);
    return FeedbackResponseOverlay;
}());
export { FeedbackResponseOverlay };
//# sourceMappingURL=feedback-response-overlay.js.map