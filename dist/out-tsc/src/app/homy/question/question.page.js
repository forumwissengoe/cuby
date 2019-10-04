import * as tslib_1 from "tslib";
import { Component, ViewChild } from '@angular/core';
import { ImageOverlay } from '../../additions/overlay/image-overlay.component';
import { QuestionController } from './question.controller.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../storage.service';
import { Map, marker, tileLayer } from 'leaflet';
var QuestionPage = /** @class */ (function () {
    function QuestionPage(questionController, storageService, router, route) {
        this.questionController = questionController;
        this.storageService = storageService;
        this.router = router;
        this.route = route;
        //title:string = "Frage 1 / 1";
        this.title = "";
        this.current = 0;
        this.total = 0;
        this.first = true;
        this.type = -1;
        this.map = null;
        this.currentMarker = null;
        this.question = {
            question: "",
            images: [],
            position: [],
            timeframe: [],
            timestamp: 0,
            answers: [],
            record_id: "",
            correct: 0
        };
        this.dummy = { question: "Finden Sie die Gemeinsamkeit",
            images: [{
                    a: { img: "https://sammlungen.uni-goettingen.de/rest/image/record_kuniweb_946619/record_kuniweb_946619_444796.jpg/full/600,400/0/default.jpg", service: [], id: "record_kuniweb_946619" },
                    b: { img: "https://sammlungen.uni-goettingen.de/rest/image/record_kuniweb_937611/record_kuniweb_937611_391502.jpg/full/600,400/0/default.jpg", service: [], id: "record_kuniweb_937611" }
                }, {
                    a: { img: "https://sammlungen.uni-goettingen.de/rest/image/record_kuniweb_948640/record_kuniweb_948640_444883.jpg/full/600,400/0/default.jpg", service: [], id: "record_kuniweb_948640" },
                    b: { img: "https://sammlungen.uni-goettingen.de/rest/image/record_kuniweb_675781/record_kuniweb_675781_433888.jpg/full/600,400/0/default.jpg", service: [], id: "record_kuniweb_675781" }
                }],
            answers: [{ answer: "Botanik", selected: false, correct: false, wrong: false }, { answer: "Kunst", selected: false, correct: false, wrong: false },
                { answer: "Ethnologie", selected: false, correct: false, wrong: false }, { answer: "Geologie", selected: false, correct: false, wrong: false }],
            correct: 2 };
        this.selectedIndex = -1;
        this.selectIntervalID = null;
    }
    QuestionPage.prototype.ngOnInit = function () { };
    QuestionPage.prototype.ionViewWillEnter = function () {
        // Setup
        this.first = true;
        this.type = -1; // Loading
        this.title = "";
        this.total = 0;
        this.current = 0;
        this.question = { question: "", images: [], position: [], timeframe: [], timestamp: 0, answers: [], record_id: "", correct: 0 };
        this.questionController.categoryID = this.route.snapshot.paramMap.get('id');
        this.questionController.setLoadingFinishedCallback(this.loadingFinishedCallback.bind(this));
        this.questionController.loadAllQuestions();
    };
    QuestionPage.prototype.loadingFinishedCallback = function () {
        this.total = this.questionController.available;
        this.title = this.questionController.categoryName;
        this.type = this.questionController.categoryType;
        if (this.first) {
            this.first = false;
            this.setQuestion();
            console.log("Loading finished");
        }
    };
    QuestionPage.prototype.ionViewDidEnter = function () {
        if (this.questionController.categoryID === "qtype_03_01")
            this.initMap();
    };
    QuestionPage.prototype.openImage = function (image) {
        this.overlay.setImageService(image.service);
        this.overlay.open();
    };
    QuestionPage.prototype.selectAnswer = function (answer, index) {
        var _this = this;
        if (this.selectIntervalID != null)
            clearInterval(this.selectIntervalID);
        for (var i = 0; i < this.question.answers.length; i++)
            this.question.answers[i].selected = false;
        var _self = this;
        this.selectedIndex = index;
        answer.selected = true;
        this.selectIntervalID = setTimeout(function () {
            var dex = 0;
            for (; dex < _this.question.answers.length; dex++)
                if (answer === _this.question.answers[dex])
                    break;
            if (_this.storageService.homyState.index)
                _this.storageService.homyState.index++;
            answer.selected = false;
            if (dex == _this.question.correct) {
                answer.correct = true;
                if (_this.storageService.homyState.current_points != undefined)
                    _this.storageService.homyState.current_points++;
                if (_this.storageService.homyState.total_points != undefined)
                    _this.storageService.homyState.total_points++;
                if (_this.storageService.homyState.correct_records != undefined)
                    _this.storageService.homyState.correct_records.push(_this.question.record_id);
                console.log("Current points: ", _this.storageService.homyState.current_points);
            }
            else {
                answer.wrong = true;
                if (_this.question.answers[_this.question.correct])
                    _this.question.answers[_this.question.correct].correct = true;
            }
            setTimeout(function () { return _this.quizFinished(); }, 500);
        }, 1000);
    };
    QuestionPage.prototype.initMap = function () {
        try {
            this.map = new Map('map').setView([51.534399, 9.934757], 12);
            tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map);
        }
        catch (e) {
            console.log("Map creation error: ", e);
        }
        if (this.type == 3 && !this.currentMarker) {
            this.currentMarker = marker([this.question.position[0], this.question.position[1]]);
            this.currentMarker.addTo(this.map);
        }
    };
    QuestionPage.prototype.quizFinished = function () {
        if (this.questionController.next() != -1) {
            if (this.questionController.questionIndex % 10 == 0) {
                this.router.navigate(['/milestone', this.questionController.categoryID]);
            }
            else
                this.setQuestion();
        }
        else
            this.router.navigate(['/milestone', this.questionController.categoryID]);
    };
    QuestionPage.prototype.setQuestion = function () {
        if (this.currentMarker != null)
            this.currentMarker.remove();
        this.currentMarker = null;
        for (var i = 0; i < this.question.answers.length; i++) {
            this.question.answers[i].correct = false;
            this.question.answers[i].selected = false;
            this.question.answers[i].wrong = false;
        }
        this.question = this.questionController.getCurrentQuestion();
        this.current = this.questionController.available != 0 ? this.questionController.questionIndex + 1 : 0;
        if (this.type == 3 && this.map != null) {
            this.currentMarker = marker([this.question.position[0], this.question.position[1]]);
            this.currentMarker.addTo(this.map);
            this.map.flyTo(this.question.position, 12);
        }
        if (this.type == 4) {
            this.question.timestamp = (this.question.timestamp - this.question.timeframe[0]) / (this.question.timeframe[1] - this.question.timeframe[0]);
        }
    };
    QuestionPage.prototype.setAnswerStyle = function (answer) {
        var tmp = {};
        if (answer.selected)
            tmp = { 'background-color': '#ffd500' };
        else if (answer.correct)
            tmp = { 'background-color': '#00cc00' };
        else if (answer.wrong)
            tmp = { 'background-color': '#ff4000' };
        return tmp;
    };
    tslib_1.__decorate([
        ViewChild('questionOverlay'),
        tslib_1.__metadata("design:type", ImageOverlay)
    ], QuestionPage.prototype, "overlay", void 0);
    QuestionPage = tslib_1.__decorate([
        Component({
            selector: 'app-question',
            templateUrl: './question.page.html',
            styleUrls: ['./question.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [QuestionController, StorageService, Router, ActivatedRoute])
    ], QuestionPage);
    return QuestionPage;
}());
export { QuestionPage };
//# sourceMappingURL=question.page.js.map