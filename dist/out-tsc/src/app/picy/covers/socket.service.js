import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
var SocketService = /** @class */ (function () {
    function SocketService() {
    }
    SocketService.prototype.connect = function (url) {
        if (!this.subject) {
            this.subject = this.create(url);
            console.log("Successfully connected: " + url);
        }
        return this.subject;
    };
    SocketService.prototype.create = function (url) {
        var ws = new WebSocket(url);
        var observable = Observable.create(function (obs) {
            ws.onmessage = obs.next.bind(obs);
            ws.onerror = obs.error.bind(obs);
            ws.onclose = obs.complete.bind(obs);
            ws.onopen = function () {
                if (ws.readyState === WebSocket.OPEN)
                    ws.send("AUTH:CLIENT");
                else
                    console.log("Not open on open");
            };
            return ws.close.bind(ws);
        });
        var observer = {
            next: function (data) {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(data);
                }
            }
        };
        return Subject.create(observer, observable);
    };
    SocketService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], SocketService);
    return SocketService;
}());
export { SocketService };
//# sourceMappingURL=socket.service.js.map