import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
var ProgressBarComponent = /** @class */ (function () {
    function ProgressBarComponent() {
    }
    ProgressBarComponent.prototype.ngOnInit = function () { };
    tslib_1.__decorate([
        Input('progress'),
        tslib_1.__metadata("design:type", Object)
    ], ProgressBarComponent.prototype, "progress", void 0);
    ProgressBarComponent = tslib_1.__decorate([
        Component({
            selector: 'app-progress-bar',
            templateUrl: './progress-bar.component.html',
            styleUrls: ['./progress-bar.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], ProgressBarComponent);
    return ProgressBarComponent;
}());
export { ProgressBarComponent };
//# sourceMappingURL=progress-bar.component.js.map