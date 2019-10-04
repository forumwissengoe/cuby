import * as tslib_1 from "tslib";
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
var VoteIconGroup = /** @class */ (function () {
    function VoteIconGroup() {
        this.move_a = false;
        this.move_d = false;
        this.offset_a = 0;
        this.offset_d = 0;
        this.origin_a = 0;
        this.origin_d = 0;
        this.original_a = 0;
        this.original_d = 0;
        this.decline_x_base = 0;
        this.distance = null;
        this.voted = new EventEmitter();
    }
    VoteIconGroup.prototype.vote = function (like) {
        this.voted.emit(like);
    };
    VoteIconGroup.prototype.ngAfterViewInit = function () {
        var _this = this;
        var document = window.document;
        this.setUpAccept(document, function () { _this.vote(true); });
        this.setUpDecline(document, function () { _this.vote(false); });
        setTimeout(function () {
            _this.origin_a = _this.acceptIcon.nativeElement.offsetLeft;
            _this.origin_d = _this.declineIcon.nativeElement.offsetLeft;
            _this.original_a = _this.acceptIcon.nativeElement.offsetLeft;
            _this.original_d = _this.declineIcon.nativeElement.offsetLeft;
        }, 2000);
    };
    VoteIconGroup.prototype.reset = function () {
        var _this = this;
        this.acceptIcon.nativeElement.style.left = "";
        this.declineIcon.nativeElement.style.left = "";
        this.acceptIcon.nativeElement.style.opacity = 1.0;
        this.declineIcon.nativeElement.style.opacity = 1.0;
        this.moveLeftIcons.nativeElement.style.opacity = 1.0;
        this.moveRightIcons.nativeElement.style.opacity = 1.0;
        this.move_a = false;
        this.move_d = false;
        this.offset_a = 0;
        this.offset_d = 0;
        this.origin_a = this.original_a;
        this.origin_d = this.original_d;
        this.decline_x_base = 0;
        this.distance = null;
        this.setUpAccept(document, function () { _this.vote(true); });
        this.setUpDecline(document, function () { _this.vote(false); });
    };
    VoteIconGroup.prototype.setUpAccept = function (document, clicked) {
        var self = this;
        this.acceptIcon.nativeElement.addEventListener('click', function funcClick(event) {
            if (event.cancelable) {
                event.stopPropagation();
                if (self.distance == null)
                    self.distance = self.declineIcon.nativeElement.offsetLeft - self.acceptIcon.nativeElement.offsetLeft;
                var pos_1 = self.acceptIcon.nativeElement.offsetLeft;
                var id_1 = setInterval(function () {
                    if (parseInt(self.acceptIcon.nativeElement.style.left, 10) >= self.distance / 2)
                        clearInterval(id_1);
                    else {
                        pos_1 += 2;
                        self.acceptIcon.nativeElement.style.left = pos_1 + "px";
                    }
                }, 5);
                self.moveLeftIcons.nativeElement.style.opacity = 0;
                self.moveRightIcons.nativeElement.style.opacity = 0;
                self.declineIcon.nativeElement.style.opacity = 0;
                self.removeAllListeners();
                clicked();
            }
        }, { passive: true });
        this.acceptIcon.nativeElement.addEventListener('mousedown', function funcDown(event) {
            if (event.cancelable) {
                event.stopPropagation();
                if (self.distance == null)
                    self.distance = self.declineIcon.nativeElement.offsetLeft - self.acceptIcon.nativeElement.offsetLeft;
                self.move_a = true;
                self.origin_a = self.acceptIcon.nativeElement.style.left;
                self.offset_a = self.acceptIcon.nativeElement.offsetLeft - event.clientX;
            }
        }, { passive: true });
        this.acceptIcon.nativeElement.addEventListener('touchstart', function funcDown(event) {
            if (event.cancelable) {
                event.stopPropagation();
                if (self.distance == null)
                    self.distance = self.declineIcon.nativeElement.offsetLeft - self.acceptIcon.nativeElement.offsetLeft;
                self.move_a = true;
                self.origin_a = self.acceptIcon.nativeElement.style.left;
                self.offset_a = self.acceptIcon.nativeElement.offsetLeft - event.touches[0].clientX;
            }
        }, { passive: true });
        document.addEventListener('mouseup', function funcUP_A(event) {
            if (self.move_a && event.cancelable) {
                event.stopPropagation();
                self.move_a = false;
                if (self.acceptIcon.nativeElement.offsetLeft / self.distance > 0.7) {
                    self.acceptIcon.nativeElement.style.left = self.origin_d;
                    var pos_2 = parseInt(self.acceptIcon.nativeElement.style.left, 10);
                    var id_2 = setInterval(function () {
                        if (parseInt(self.acceptIcon.nativeElement.style.left, 10) <= self.distance / 2)
                            clearInterval(id_2);
                        else {
                            pos_2 -= 2;
                            self.acceptIcon.nativeElement.style.left = pos_2 + "px";
                        }
                    }, 5);
                    self.declineIcon.nativeElement.style.opacity = 0;
                    self.removeAllListeners();
                    clicked();
                }
                else {
                    self.acceptIcon.nativeElement.style.left = self.origin_a;
                    self.declineIcon.nativeElement.style.opacity = 1;
                    self.moveRightIcons.nativeElement.style.opacity = 1;
                    self.moveLeftIcons.nativeElement.style.opacity = 1;
                }
            }
        }, { passive: true, capture: true });
        document.addEventListener('touchend', function funcUP_A(event) {
            if (self.move_a && event.cancelable) {
                event.stopPropagation();
                self.move_a = false;
                if (self.acceptIcon.nativeElement.offsetLeft / self.distance > 0.7) {
                    self.acceptIcon.nativeElement.style.left = self.origin_d;
                    var pos_3 = parseInt(self.acceptIcon.nativeElement.style.left, 10);
                    var id_3 = setInterval(function () {
                        if (parseInt(self.acceptIcon.nativeElement.style.left, 10) <= self.distance / 2)
                            clearInterval(id_3);
                        else {
                            pos_3 -= 2;
                            self.acceptIcon.nativeElement.style.left = pos_3 + "px";
                        }
                    }, 5);
                    self.declineIcon.nativeElement.style.opacity = 0;
                    self.removeAllListeners();
                    clicked();
                }
                else {
                    self.acceptIcon.nativeElement.style.left = self.origin_a;
                    self.declineIcon.nativeElement.style.opacity = 1;
                    self.moveRightIcons.nativeElement.style.opacity = 1;
                    self.moveLeftIcons.nativeElement.style.opacity = 1;
                }
            }
        }, { passive: true, capture: true });
        document.addEventListener('mousemove', function funcMOVE_A(event) {
            if (self.move_a && event.cancelable) {
                event.stopPropagation();
                self.acceptIcon.nativeElement.style.left = (event.clientX + self.offset_a) + 'px';
                var op = event.clientX / self.distance;
                self.declineIcon.nativeElement.style.opacity = 1 - (4 / 3 * op);
                if (op > 0.25) {
                    self.moveRightIcons.nativeElement.style.opacity = 0;
                    self.moveLeftIcons.nativeElement.style.opacity = 0;
                }
            }
        }, { passive: true, capture: true });
        document.addEventListener('touchmove', function funcMOVE_A(event) {
            if (self.move_a && event.cancelable) {
                event.stopPropagation();
                self.acceptIcon.nativeElement.style.left = (event.touches[0].clientX + self.offset_a) + 'px';
                var op = event.touches[0].clientX / self.distance;
                self.declineIcon.nativeElement.style.opacity = 1 - (4 / 3 * op);
                if (op > 0.25) {
                    self.moveRightIcons.nativeElement.style.opacity = 0;
                    self.moveLeftIcons.nativeElement.style.opacity = 0;
                }
            }
        }, { passive: true, capture: true });
        document.addEventListener('touchcancel', function (event) {
            if (self.move_a && event.cancelable) {
                event.stopPropagation();
                self.acceptIcon.nativeElement.style.left = self.origin_a;
                self.declineIcon.nativeElement.style.opacity = 1;
            }
        }, { passive: true });
    };
    VoteIconGroup.prototype.setUpDecline = function (document, clicked) {
        var self = this;
        this.declineIcon.nativeElement.addEventListener('click', function funcClick(event) {
            if (event.cancelable) {
                event.stopPropagation();
                if (self.distance == null)
                    self.distance = self.declineIcon.nativeElement.offsetLeft - self.acceptIcon.nativeElement.offsetLeft;
                var pos_4 = self.declineIcon.nativeElement.offsetLeft;
                var id_4 = setInterval(function () {
                    if (parseInt(self.declineIcon.nativeElement.style.left, 10) <= self.distance / 2)
                        clearInterval(id_4);
                    else {
                        pos_4 -= 2;
                        self.declineIcon.nativeElement.style.left = pos_4 + "px";
                    }
                }, 5);
                self.moveLeftIcons.nativeElement.style.opacity = 0;
                self.moveRightIcons.nativeElement.style.opacity = 0;
                self.acceptIcon.nativeElement.style.opacity = 0;
                self.removeAllListeners();
                clicked();
            }
        }, { passive: true });
        this.declineIcon.nativeElement.addEventListener('mousedown', function funcDOWN(event) {
            if (event.cancelable) {
                event.stopPropagation();
                if (self.distance == null)
                    self.distance = self.declineIcon.nativeElement.offsetLeft - self.acceptIcon.nativeElement.offsetLeft;
                self.move_d = true;
                self.origin_d = self.declineIcon.nativeElement.style.left;
                self.offset_d = self.declineIcon.nativeElement.offsetLeft - event.clientX;
                self.decline_x_base = event.clientX - self.distance;
            }
        }, { passive: true });
        this.declineIcon.nativeElement.addEventListener('touchstart', function funcDOWN(event) {
            if (event.cancelable) {
                event.stopPropagation();
                if (self.distance == null)
                    self.distance = self.declineIcon.nativeElement.offsetLeft - self.acceptIcon.nativeElement.offsetLeft;
                self.move_d = true;
                self.origin_d = self.declineIcon.nativeElement.style.left;
                self.offset_d = self.declineIcon.nativeElement.offsetLeft - event.touches[0].clientX;
            }
        }, { passive: true });
        document.addEventListener('mouseup', function funcUP_D(event) {
            if (self.move_d && event.cancelable) {
                event.stopPropagation();
                self.move_d = false;
                if (self.declineIcon.nativeElement.offsetLeft / self.distance < 0.30) {
                    self.declineIcon.nativeElement.style.left = self.origin_a;
                    var pos_5 = parseInt(self.declineIcon.nativeElement.style.left, 10);
                    var id_5 = setInterval(function () {
                        if (parseInt(self.declineIcon.nativeElement.style.left, 10) >= self.distance / 2)
                            clearInterval(id_5);
                        else {
                            pos_5 += 2;
                            self.declineIcon.nativeElement.style.left = pos_5 + "px";
                        }
                    }, 5);
                    self.acceptIcon.nativeElement.style.opacity = 0;
                    self.removeAllListeners();
                    clicked();
                }
                else {
                    self.declineIcon.nativeElement.style.left = self.origin_d;
                    self.acceptIcon.nativeElement.style.opacity = 1;
                    self.moveRightIcons.nativeElement.style.opacity = 1;
                    self.moveLeftIcons.nativeElement.style.opacity = 1;
                }
            }
        }, { passive: true, capture: true });
        document.addEventListener('touchend', function funcUP_D(event) {
            if (self.move_d && event.cancelable) {
                event.stopPropagation();
                self.move_d = false;
                if (self.declineIcon.nativeElement.offsetLeft / self.distance < 0.3) {
                    self.declineIcon.nativeElement.style.left = self.origin_a;
                    var pos_6 = parseInt(self.declineIcon.nativeElement.style.left, 10);
                    var id_6 = setInterval(function () {
                        if (parseInt(self.declineIcon.nativeElement.style.left, 10) >= self.distance / 2)
                            clearInterval(id_6);
                        else {
                            pos_6 += 2;
                            self.declineIcon.nativeElement.style.left = pos_6 + "px";
                        }
                    }, 5);
                    self.acceptIcon.nativeElement.style.opacity = 0;
                    self.removeAllListeners();
                    clicked();
                }
                else {
                    self.declineIcon.nativeElement.style.left = self.origin_d;
                    self.acceptIcon.nativeElement.style.opacity = 1;
                    self.moveRightIcons.nativeElement.style.opacity = 1;
                    self.moveLeftIcons.nativeElement.style.opacity = 1;
                }
            }
        }, { passive: true, capture: true });
        document.addEventListener('mousemove', function funcMOVE_D(event) {
            if (self.move_d && event.cancelable) {
                event.stopPropagation();
                self.declineIcon.nativeElement.style.left = (event.clientX + self.offset_d + 'px');
                var op = 1 - (event.clientX - self.decline_x_base) / self.distance;
                self.acceptIcon.nativeElement.style.opacity = 1 - (6 / 3 * op);
                if (op > 0.05) {
                    self.moveRightIcons.nativeElement.style.opacity = 0;
                    self.moveLeftIcons.nativeElement.style.opacity = 0;
                }
            }
        }, { passive: true, capture: true });
        document.addEventListener('touchmove', function funcMOVE_D(event) {
            if (self.move_d && event.cancelable) {
                event.stopPropagation();
                self.declineIcon.nativeElement.style.left = (event.touches[0].clientX + self.offset_d + 'px');
                var op = 1 - (event.touches[0].clientX - self.decline_x_base) / self.distance;
                self.acceptIcon.nativeElement.style.opacity = 1 - (6 / 3 * op);
                if (op > 0.05) {
                    self.moveRightIcons.nativeElement.style.opacity = 0;
                    self.moveLeftIcons.nativeElement.style.opacity = 0;
                }
            }
        }, { passive: true, capture: true });
        document.addEventListener('touchcancel', function (event) {
            if (self.move_d && event.cancelable) {
                event.stopPropagation();
                self.declineIcon.nativeElement.style.left = self.origin_d;
                self.acceptIcon.nativeElement.style.opacity = 1;
            }
        }, { passive: true });
    };
    VoteIconGroup.prototype.removeAllListeners = function () {
        var tmp = this.acceptIcon.nativeElement.cloneNode(true);
        this.acceptIcon.nativeElement.parentElement.replaceChild(tmp, this.acceptIcon.nativeElement);
        this.acceptIcon.nativeElement = tmp;
        tmp = this.declineIcon.nativeElement.cloneNode(true);
        this.declineIcon.nativeElement.parentElement.replaceChild(tmp, this.declineIcon.nativeElement);
        this.declineIcon.nativeElement = tmp;
    };
    tslib_1.__decorate([
        ViewChild('acceptIcon'),
        tslib_1.__metadata("design:type", ElementRef)
    ], VoteIconGroup.prototype, "acceptIcon", void 0);
    tslib_1.__decorate([
        ViewChild('declineIcon'),
        tslib_1.__metadata("design:type", ElementRef)
    ], VoteIconGroup.prototype, "declineIcon", void 0);
    tslib_1.__decorate([
        ViewChild('moveRightIcons'),
        tslib_1.__metadata("design:type", ElementRef)
    ], VoteIconGroup.prototype, "moveRightIcons", void 0);
    tslib_1.__decorate([
        ViewChild('moveLeftIcons'),
        tslib_1.__metadata("design:type", ElementRef)
    ], VoteIconGroup.prototype, "moveLeftIcons", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], VoteIconGroup.prototype, "voted", void 0);
    VoteIconGroup = tslib_1.__decorate([
        Component({
            selector: 'vote-icon-group',
            template: "<div class=\"main\">\n\t\t<div #acceptIcon class=\"accepted\">\n\t\t\t<ion-icon name=\"checkmark-circle-outline\" color=\"success\"></ion-icon>\n\t\t</div>\n\t\t<div #moveRightIcons class=\"moveRightIcons\">\n\t\t\t<ion-icon name=\"md-arrow-dropright\" color=\"light\"></ion-icon>\n\t\t\t<ion-icon name=\"md-arrow-dropright\" color=\"light\"></ion-icon>\n\t\t</div>\n\t\t<div #moveLeftIcons class=\"moveLeftIcons\">\n\t\t\t<ion-icon name=\"md-arrow-dropleft\" color=\"light\"></ion-icon>\n\t\t\t<ion-icon name=\"md-arrow-dropleft\" color=\"light\"></ion-icon>\n\t\t</div>\n\t\t<div #declineIcon class=\"declined\">\n\t\t\t<ion-icon name=\"close-circle-outline\" color=\"danger\"></ion-icon>\n\t\t</div>\n\t</div>",
            styleUrls: ["./VoteIconGroup.scss"]
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], VoteIconGroup);
    return VoteIconGroup;
}());
export { VoteIconGroup };
//# sourceMappingURL=VoteIconGroup.js.map