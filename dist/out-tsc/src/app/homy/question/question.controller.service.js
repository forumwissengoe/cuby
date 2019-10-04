import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { DataLoader } from '../../../data/DataLoader';
import { StorageService } from '../../storage.service';
var QuestionController = /** @class */ (function () {
    function QuestionController(storageService) {
        this.storageService = storageService;
        this.dummyQuestion = new QuestionType1();
        this.categoryName = "";
        this.categoryID = "";
        this.categoryURL = "";
        this.categoryType = 0;
        this.allQuestions = [];
        this.currentQuestion = null;
        this.questionIndex = 0;
        this.available = 0;
        this.loadingFinishedCallback = null;
    }
    QuestionController.prototype.loadDummyQuestion = function () {
        var _this = this;
        this.dummyQuestion.loadDummy(this.storageService).then(function () {
            _this.currentQuestion = _this.dummyQuestion;
            if (_this.loadingFinishedCallback != null)
                _this.loadingFinishedCallback();
        });
    };
    QuestionController.prototype.loadAllQuestions = function () {
        var _this = this;
        this.questionIndex = 0;
        this.allQuestions = [];
        this.currentQuestion = null;
        this.categoryType = 0;
        if (!this.categoryID) // TODO Error
         {
            return;
        }
        this.available = 0;
        this.categoryURL = this.storageService.getCategoryUrlForType(this.categoryID);
        this.categoryName = this.storageService.getCategoryNameForType(this.categoryID);
        if (this.categoryURL == "") // TODO Error
         {
            return;
        }
        console.log("URL: ", this.categoryURL, "  ID: ", this.categoryID);
        DataLoader.loadHomyQuestions(this.categoryURL, this.categoryID).then(function (questions) {
            // TODO change back to return
            if (!questions.questions || !questions.type)
                //questions.type = "break";
                return;
            if (questions.type.startsWith("qtype_01")) {
                _this.categoryType = 1;
                var first_1 = true;
                var _loop_1 = function (q) {
                    var obj = new QuestionType1();
                    obj.loadQData(_this.storageService, new QDataType1(q.question, q.records, q.answers, q.correct)).then(function () {
                        _this.allQuestions.push(obj);
                        _this.available++;
                        if (first_1) {
                            first_1 = false;
                            _this.currentQuestion = _this.allQuestions[_this.questionIndex];
                        }
                        if (_this.loadingFinishedCallback != null)
                            _this.loadingFinishedCallback();
                    });
                };
                for (var _i = 0, _a = questions.questions; _i < _a.length; _i++) {
                    var q = _a[_i];
                    _loop_1(q);
                }
            }
            else if (questions.type.startsWith("qtype_02")) {
                _this.categoryType = 2;
                var first_2 = true;
                var _loop_2 = function (q) {
                    var obj = new QuestionType2();
                    obj.loadQData(_this.storageService, new QDataType2(q.question, q.record, q.answers, q.correct)).then(function () {
                        _this.allQuestions.push(obj);
                        _this.available++;
                        if (first_2) {
                            first_2 = false;
                            _this.currentQuestion = _this.allQuestions[_this.questionIndex];
                        }
                        if (_this.loadingFinishedCallback != null)
                            _this.loadingFinishedCallback();
                    });
                };
                for (var _b = 0, _c = questions.questions; _b < _c.length; _b++) {
                    var q = _c[_b];
                    _loop_2(q);
                }
            }
            else if (questions.type.startsWith("qtype_03")) {
                _this.categoryType = 3;
                var first = true;
                for (var _d = 0, _e = questions.questions; _d < _e.length; _d++) {
                    var q = _e[_d];
                    var obj = new QuestionType3();
                    obj.loadQData(q.question, q.position, q.answers, q.correct);
                    _this.allQuestions.push(obj);
                    _this.available++;
                    if (first) {
                        first = false;
                        _this.currentQuestion = _this.allQuestions[_this.questionIndex];
                    }
                    if (_this.loadingFinishedCallback != null)
                        _this.loadingFinishedCallback();
                }
            }
            else if (questions.type.startsWith("qtype_04")) {
                _this.categoryType = 4;
                var first = true;
                for (var _f = 0, _g = questions.questions; _f < _g.length; _f++) {
                    var q = _g[_f];
                    var obj = new QuestionType4();
                    obj.loadQData(q.question, q.timeframe, q.timestamp, q.answers, q.correct);
                    _this.allQuestions.push(obj);
                    _this.available++;
                    if (first) {
                        first = false;
                        _this.currentQuestion = _this.allQuestions[_this.questionIndex];
                    }
                    if (_this.loadingFinishedCallback != null)
                        _this.loadingFinishedCallback();
                }
            }
            /*// TODO change to questions.type
            else if(this.categoryID.startsWith("qtype_03"))
            {
                this.categoryType = 3;
                this.allQuestions.push(new QuestionType3().loadQData());
                this.currentQuestion = this.allQuestions[this.questionIndex];
                this.available = 1;
                if(this.loadingFinishedCallback != null)
                    this.loadingFinishedCallback();
            }
            
            else if(this.categoryID.startsWith("qtype_04"))
            {
                this.categoryType = 4;
                this.allQuestions.push(new QuestionType4().loadQData());
                this.currentQuestion = this.allQuestions[this.questionIndex];
                this.available = 1;
                if(this.loadingFinishedCallback != null)
                    this.loadingFinishedCallback();
            }*/
        });
    };
    QuestionController.prototype.setLoadingFinishedCallback = function (cb) {
        this.loadingFinishedCallback = cb;
    };
    QuestionController.prototype.next = function () {
        if (this.questionIndex + 1 > this.allQuestions.length - 1)
            return -1;
        else
            return ++this.questionIndex;
    };
    QuestionController.prototype.getCurrentQuestion = function () {
        /*if(this.categoryType === 3)
        {
        
        }
        else if(this.categoryType === 4)
        {
            let tmp = this.allQuestions[this.questionIndex];
            for(let i = 0; i < tmp)
        }*/
        this.currentQuestion = this.allQuestions[this.questionIndex];
        if (this.currentQuestion.hasImages) {
            var tmp = {
                question: this.currentQuestion.question,
                images: [],
                answers: [],
                record_id: this.currentQuestion.record_id,
                correct: this.currentQuestion.correct
            };
            for (var i = 0; i < this.currentQuestion.answers.length; i++)
                tmp.answers[i] = { answer: this.currentQuestion.answers[i], selected: false, correct: false, wrong: false };
            var x = null;
            var w = this.storageService.configuration.viewWidth * (this.categoryType == 1 ? 0.5 : 0.9);
            for (var i = 0; i < this.currentQuestion.images.length; i++) {
                if (x == null)
                    x = { img: this.currentQuestion.images[i].getThumbnailForAttributes(w), service: this.currentQuestion.images[i].getImageService(), id: this.currentQuestion.images[i].record_id };
                else {
                    tmp.images.push({ a: x, b: { img: this.currentQuestion.images[i].getThumbnailForAttributes(w), service: this.currentQuestion.images[i].getImageService(), id: this.currentQuestion.images[i].record_id } });
                    x = null;
                }
            }
            if (x != null)
                tmp.images.push({ a: x, b: { img: "", service: [], id: "" } });
            return tmp;
        }
        else {
            var tmp = this.allQuestions[this.questionIndex];
            for (var i = 0; i < tmp.answers.length; i++)
                tmp.answers[i] = { answer: tmp.answers[i], selected: false, correct: false, wrong: false };
            return tmp;
        }
    };
    QuestionController = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [StorageService])
    ], QuestionController);
    return QuestionController;
}());
export { QuestionController };
var QuestionType1 = /** @class */ (function () {
    function QuestionType1() {
        this.records = ["record_kuniweb_946619", "record_kuniweb_937611", "record_kuniweb_948640", "record_kuniweb_675781"];
        this.question = "";
        this.images = [];
        this.answers = [];
        this.correct = 0;
        this.record_id = "";
        this.hasImages = true;
    }
    QuestionType1.prototype.loadDummy = function (storageService) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.question = "Finden Sie die Sammlung";
            _this.correct = 2;
            _this.answers = ["Botanik", "Kunst", "Ethnologie", "Geologie"];
            _this.record_id = "record_kuniweb_946619";
            DataLoader.loadGallery(storageService, _this.records).then(function (_a) {
                var iiif = _a.iiif, error = _a.error;
                for (var _i = 0, iiif_1 = iiif; _i < iiif_1.length; _i++) {
                    var i = iiif_1[_i];
                    _this.images.push(i);
                }
                resolve();
            }).catch(function () { return reject(); });
        });
    };
    QuestionType1.prototype.loadQData = function (storageService, qdata) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.question = qdata.question;
            _this.correct = qdata.correct;
            _this.record_id = qdata.records[Math.random() * Math.floor(qdata.records.length)];
            for (var _i = 0, _a = qdata.answers; _i < _a.length; _i++) {
                var a = _a[_i];
                if (a && a.replace(" ", "") != "")
                    _this.answers.push(a);
            }
            DataLoader.loadGallery(storageService, qdata.records).then(function (_a) {
                var iiif = _a.iiif, error = _a.error;
                for (var _i = 0, iiif_2 = iiif; _i < iiif_2.length; _i++) {
                    var i = iiif_2[_i];
                    _this.images.push(i);
                }
                resolve();
            }).catch(function () { return reject(); });
        });
    };
    return QuestionType1;
}());
export { QuestionType1 };
var QDataType1 = /** @class */ (function () {
    function QDataType1(question, records, answers, correct) {
        this.question = question;
        this.records = records;
        this.answers = answers;
        this.correct = correct;
    }
    return QDataType1;
}());
export { QDataType1 };
var QuestionType2 = /** @class */ (function () {
    function QuestionType2() {
        this.record = "record_kuniweb_946619";
        this.question = "";
        this.images = [];
        this.answers = [];
        this.correct = 0;
        this.record_id = "";
        this.hasImages = true;
    }
    QuestionType2.prototype.loadQData = function (storageService, qdata) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.question = qdata.question;
            _this.correct = qdata.correct;
            _this.record_id = _this.record;
            for (var _i = 0, _a = qdata.answers; _i < _a.length; _i++) {
                var a = _a[_i];
                if (a !== "")
                    _this.answers.push(a);
            }
            DataLoader.downloadManifest(storageService, qdata.record).then(function (iiif) {
                _this.images.push(iiif);
                resolve();
            }).catch(function () { return reject(); });
        });
    };
    return QuestionType2;
}());
export { QuestionType2 };
var QDataType2 = /** @class */ (function () {
    function QDataType2(question, record, answers, correct) {
        this.question = question;
        this.record = record;
        this.answers = answers;
        this.correct = correct;
    }
    return QDataType2;
}());
export { QDataType2 };
var QuestionType3 = /** @class */ (function () {
    function QuestionType3() {
        this.question = "";
        this.position = [];
        this.answers = [];
        this.correct = 0;
        this.hasImages = false;
    }
    QuestionType3.prototype.loadQData = function (question, position, answers, correct) {
        this.question = "Wer ist hier geboren?";
        this.position = [51.534399, 9.934757];
        this.answers = ["Hans Zimmer", "Frauke Ludowig", "Herbert Grönemeyer", "Bully Herbig"];
        this.correct = 2;
        this.question = question;
        this.position = position;
        this.answers = answers;
        this.correct = correct;
        return this;
    };
    return QuestionType3;
}());
export { QuestionType3 };
var QuestionType4 = /** @class */ (function () {
    function QuestionType4() {
        this.question = "";
        this.timeframe = [];
        this.timestamp = 0;
        this.answers = [];
        this.correct = 0;
        this.hasImages = false;
    }
    QuestionType4.prototype.loadQData = function (question, timeframe, timestamp, answers, correct) {
        this.question = "Wer wurde hier geboren?";
        this.timeframe = [1700, 1900];
        this.timestamp = 1769;
        this.answers = ["Napoleon Bonaparte", "Kleopatra VII. Philopator", "Otto von Bismarck", "Christoph Kolumbus"];
        this.correct = 0;
        this.question = question;
        this.timeframe = timeframe;
        this.timestamp = timestamp;
        this.answers = answers;
        this.correct = correct;
        return this;
    };
    return QuestionType4;
}());
export { QuestionType4 };
//# sourceMappingURL=question.controller.service.js.map