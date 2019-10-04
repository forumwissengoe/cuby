import * as tslib_1 from "tslib";
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
var ImageOverlay = /** @class */ (function () {
    function ImageOverlay(renderer) {
        this.renderer = renderer;
        this.image_service = null;
        this.map = null;
        this.rebuild = true;
        this.closeCallback = null;
    }
    ImageOverlay.prototype.ngOnInit = function () { };
    ImageOverlay.prototype.close = function () {
        this.renderer.removeClass(this.overlay.nativeElement, "shown");
        if (this.closeCallback != null)
            this.closeCallback();
    };
    ImageOverlay.prototype.open = function () {
        this.renderer.addClass(this.overlay.nativeElement, "shown");
        if (this.rebuild && this.image_service != null) {
            var sequenceControl = false;
            if (this.image_service instanceof Array)
                sequenceControl = this.image_service.length > 1;
            if (this.map != null) {
                this.map.open(this.image_service);
                return;
            }
            this.map = OpenSeadragon({
                id: "mapid",
                prefixUrl: '../../../assets/js/openseadragon/images/',
                preserveViewport: true,
                visibilityRatio: 1,
                minZoomLevel: 1,
                defaultZoomLevel: 1,
                sequenceMode: true,
                navigationControlAnchor: OpenSeadragon.ControlAnchor.BOTTOM_LEFT,
                showSequenceControl: sequenceControl,
                showFullPageControl: false,
                showRotationControl: true,
                tileSources: this.image_service
            });
            this.rebuild = false;
        }
    };
    ImageOverlay.prototype.setImageService = function (image_service) {
        this.image_service = image_service;
        this.rebuild = true;
    };
    ImageOverlay.prototype.setCloseCallback = function (cb) {
        this.closeCallback = cb;
    };
    tslib_1.__decorate([
        ViewChild('overlay'),
        tslib_1.__metadata("design:type", ElementRef)
    ], ImageOverlay.prototype, "overlay", void 0);
    tslib_1.__decorate([
        ViewChild('container'),
        tslib_1.__metadata("design:type", ElementRef)
    ], ImageOverlay.prototype, "container", void 0);
    ImageOverlay = tslib_1.__decorate([
        Component({
            selector: "image-overlay",
            template: "<div #overlay class=\"overlay\">\n\t\t\t       <div class=\"close_container\">\n\t\t\t           <ion-icon name=\"close-circle-outline\" (click)=\"close()\"></ion-icon>\n\t\t\t       </div>\n\t\t\t\t   <div #container id=\"mapid\"></div>\n\t\t\t   </div>",
            styleUrls: ['./image-overlay.component.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [Renderer2])
    ], ImageOverlay);
    return ImageOverlay;
}());
export { ImageOverlay };
//# sourceMappingURL=image-overlay.component.js.map