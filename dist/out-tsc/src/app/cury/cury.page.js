import * as tslib_1 from "tslib";
import { Component, ViewChild } from '@angular/core';
import { Direction } from 'angular2-swing';
import { CuryControllerService } from './cury.controller.service';
import { Router } from '@angular/router';
import { ImageOverlay } from '../additions/overlay/image-overlay.component';
import { StorageService } from '../storage.service';
var CuryPage = /** @class */ (function () {
    function CuryPage(curyController, router, storageService) {
        this.curyController = curyController;
        this.router = router;
        this.storageService = storageService;
        this.loading = true;
        this.loading = true;
        this.curyController.setLoadingFinishedCallback(this.onElementsLoaded.bind(this));
        this.curyController.initialLoad();
        this.stackConfig = {
            allowedDirections: [Direction.LEFT, Direction.RIGHT],
            throwOutConfidence: function (offsetX, offsetY, element) {
                return Math.min(Math.max(Math.abs(offsetX) / (element.offsetWidth / 1.7), Math.abs(offsetY) / (element.offsetHeight / 2)), 1);
            },
            transform: function (element, x, y, r) { return CuryPage_1.onItemMove(element, x, y, r); },
            throwOutDistance: function (d) {
                return 600;
            }
        };
        this.cards = [];
        this.likedCards = [];
        this.dislikedCards = [];
    }
    CuryPage_1 = CuryPage;
    CuryPage.prototype.ngOnInit = function () { };
    CuryPage.prototype.ionViewWillEnter = function () {
        if (!this.curyController.currentlyLoading && this.size < CuryControllerService.NUMBER_ELEMENTS)
            this.curyController.loadNewImages(CuryControllerService.NUMBER_ELEMENTS - this.size);
    };
    CuryPage.onItemMove = function (element, x, y, r) {
        var hex = Math.trunc(Math.min(16 * 16 - Math.abs(x), 16 * 16)).toString(16);
        if (Math.abs(x) < 0.5)
            element.style['background-color'] = ('#FFFFFFFF');
        else
            element.style['background-color'] = x > 0 ? ('#FF' + hex + hex) : ('#' + hex + "FF" + hex);
        element.style['transform'] = "translate3d(0, 0, 0) translate(" + x + "px, " + y + "px) rotate(" + r + "deg)";
    };
    CuryPage.prototype.onElementsLoaded = function () {
        for (var i = 0; i < this.curyController.images.length; i++)
            this.cards.push({ image: this.curyController.images[i].getThumbnailImageUrl(), image_service: this.curyController.images[i].getImageService(),
                record: this.curyController.images[i].record_id });
        this.size = this.cards.length;
        this.loading = false;
    };
    CuryPage.prototype.onThrowOut = function (like) {
        var card = this.cards.pop();
        var index = this.storageService.localState.curyStack.indexOf(card.record);
        if (index != -1 && index <= this.storageService.localState.curyStack.length)
            this.storageService.localState.curyStack.splice(index, 1);
        if (like) {
            this.likedCards.push(card);
            //this.evaluateService.publishLikabilityLevel1(card.record);
            this.storageService.localState.likedLevel1.push(card.record);
            this.storageService.localState.detailsList.push(card.record);
        }
        else
            this.dislikedCards.push(card);
        if (this.likedCards.length + this.dislikedCards.length >= this.size && this.likedCards.length > 0) {
            this.storageService.saveLocalState();
            this.router.navigate(['/details']);
        }
        else if (this.likedCards.length + this.dislikedCards.length >= this.size) {
            this.storageService.saveLocalState();
            this.router.navigate(['/home']);
        }
    };
    CuryPage.prototype.imageClicked = function (ev, img) {
        console.log("Image service", img.image_service);
        console.log("Event", ev);
        this.image.setImageService(img.image_service);
        this.image.open();
    };
    var CuryPage_1;
    tslib_1.__decorate([
        ViewChild('overlay'),
        tslib_1.__metadata("design:type", ImageOverlay)
    ], CuryPage.prototype, "image", void 0);
    CuryPage = CuryPage_1 = tslib_1.__decorate([
        Component({
            selector: 'app-cury',
            templateUrl: './cury.page.html',
            styleUrls: ['./cury.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [CuryControllerService, Router, StorageService])
    ], CuryPage);
    return CuryPage;
}());
export { CuryPage };
//# sourceMappingURL=cury.page.js.map