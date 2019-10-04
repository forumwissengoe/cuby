import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IiiFObject } from '../data/IiiFObject';
import { LidoObject } from '../data/LidoObject';
import { DataLoader } from '../data/DataLoader';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
var StorageService = /** @class */ (function () {
    function StorageService(storage, file, filePath, webview, fileTransfer) {
        this.storage = storage;
        this.file = file;
        this.filePath = filePath;
        this.webview = webview;
        this.fileTransfer = fileTransfer;
        this.cordovaAvailable = false;
        this.config = {
            viewWidth: 0, viewHeight: 0, message_nonce: 0,
            cury_url: "http://wissenskiosk.uni-goettingen.de/cuby/cury/cury.php",
            cury_config: "http://wissenskiosk.uni-goettingen.de/cuby/cury/config.json",
            cury_feedback: "http://wissenskiosk.uni-goettingen.de/cuby/cury/feedback.php",
            homy_config: "http://wissenskiosk.uni-goettingen.de/cuby/homy/config.json",
            display_config_picy: [], display_config_cury_details: [], display_config_cury_feedback: [],
            iiif_url: "http://sammlungen.uni-goettingen.de/rest/iiif/manifests/",
            lido_url: "http://sammlungen.uni-goettingen.de/lidoresolver?id="
        };
        this.wipeStorage = false; // TODO CAUTION!!!!
        this.homyConfig = {
            highscore_url: "http://wissenskiosk.uni-goettingen.de/cuby/questions/highscore.php",
            categories: [
                {
                    name: "Objektgattungen",
                    cover: "",
                    type: "qtype_01_01",
                    url: "http://wissenskiosk.uni-goettingen.de/cuby/questions/index.php"
                }
            ]
        };
        this.homyState = { current_points: 0, total_points: 0, index: 0, correct_records: [] };
        this.homyCallback = null;
        this.homyFinished = false;
        // Local state
        this.localState = { picyGallery: [], curyStack: [], detailsList: [], feedbackList: [], locallySavedObjectsIiiF: [], locallySavedObjectsLido: [], locallySavedImages: [], homyPostHighscore: null, homyPostHighscoreAsk: true, likedLevel1: [], likedLevel2: [], likedLevel3: [] };
        this.dummyState = { picyGallery: ["record_kuniweb_592553", "record_kuniweb_675675", "record_kuniweb_592566", "record_kuniweb_945664", "record_kuniweb_666297", "record_kuniweb_943917", "record_kuniweb_681925", "record_kuniweb_854325"], curyStack: ["record_kuniweb_592553", "record_kuniweb_675675", "record_kuniweb_592566", "record_kuniweb_945664", "record_kuniweb_666297", "record_kuniweb_943917", "record_kuniweb_681925", "record_kuniweb_854325"], detailsList: [], feedbackList: [], locallySavedObjectsIiiF: [], locallySavedObjectsLido: [], locallySavedImages: [], homyPostHighscore: null, homyPostHighscoreAsk: true, likedLevel1: [], likedLevel2: [], likedLevel3: [] };
        this.nfc_record = [];
    }
    StorageService_1 = StorageService;
    StorageService.prototype.loadConfig = function () {
        var _this = this;
        if (this.wipeStorage) {
            this.storage.clear().then(function () {
                _this.storage.get('configuration').then(function (config) {
                    _this._loadConfig(config);
                });
            });
        }
        else {
            this.storage.get('configuration').then(function (config) {
                _this._loadConfig(config);
            });
        }
    };
    StorageService.prototype._loadConfig = function (config) {
        var _this = this;
        console.log("configuration", config);
        this.config.viewHeight = window.innerHeight;
        this.config.viewWidth = window.innerWidth;
        if (config) {
            if (config.iiif_url)
                this.config.iiif_url = config.iiif_url;
            if (config.lido_url)
                this.config.lido_url = config.lido_url;
            if (config.cury_url)
                this.config.cury_url = config.cury_url;
            if (config.cury_feedback)
                this.config.cury_feedback = config.cury_feedback;
            if (config.homy_config)
                this.config.homy_config = config.homy_config;
            if (config.display_config_cury_feedback)
                this.config.display_config_cury_feedback = config.display_config_cury_feedback;
            if (config.display_config_cury_details)
                this.config.display_config_cury_details = config.display_config_cury_details;
            if (config.display_config_picy)
                this.config.display_config_picy = config.display_config_picy;
        }
        DataLoader.loadPrimeConfig(StorageService_1.primeconfig).then(function (conf) {
            if (conf.iiif_url)
                _this.config.iiif_url = conf.iiif_url;
            if (conf.lido_url)
                _this.config.lido_url = conf.lido_url;
            if (conf.cury_url)
                _this.config.cury_url = conf.cury_url;
            if (conf.cury_feedback)
                _this.config.cury_feedback = conf.cury_feedback;
            if (conf.homy_config)
                _this.config.homy_config = conf.homy_config;
            if (conf.display_config && conf.display_config.cury_feedback)
                _this.config.display_config_cury_feedback = conf.display_config.cury_feedback;
            if (conf.display_config && conf.display_config.cury_details)
                _this.config.display_config_cury_details = conf.display_config.cury_details;
            if (conf.display_config && conf.display_config.picy)
                _this.config.display_config_picy = conf.display_config.picy;
        }).catch(function () { });
    };
    StorageService.prototype.loadHomyConfig = function () {
        var _this = this;
        console.log("Load homy config");
        Promise.all([
            DataLoader.loadHomyConfig(this.config.homy_config).then(function (config) {
                if (config.highscore_url)
                    _this.homyConfig.highscore_url = config.highscore_url;
                if (config.categories)
                    _this.homyConfig.categories = config.categories;
                // Insert hyphens in category names
                for (var _i = 0, _a = _this.homyConfig.categories; _i < _a.length; _i++) {
                    var cat = _a[_i];
                    if (cat.name.indexOf("Objekt") != -1)
                        cat.name = cat.name.replace("Objekt", "Objekt\u00AD");
                    if (cat.name.indexOf("objekt") != -1)
                        cat.name = cat.name.replace("objekt", "\u00ADobjekt\u00AD");
                }
            }),
            this.storage.get('homyState').then(function (state) {
                if (state)
                    _this.homyState = state;
            })
        ]).then(function () {
            if (_this.homyCallback)
                _this.homyCallback();
            _this.homyFinished = true;
        });
    };
    StorageService.prototype.getCategoryNameForType = function (type) {
        for (var _i = 0, _a = this.homyConfig.categories; _i < _a.length; _i++) {
            var cat = _a[_i];
            if (cat.type === type)
                return cat.name;
        }
        return "";
    };
    StorageService.prototype.getCategoryUrlForType = function (type) {
        for (var _i = 0, _a = this.homyConfig.categories; _i < _a.length; _i++) {
            var cat = _a[_i];
            if (cat.type === type)
                return cat.url;
        }
        return "";
    };
    StorageService.prototype.loadLocalState = function () {
        var _this = this;
        var dummy = false;
        if (this.wipeStorage) {
            this.storage.clear().then(function (str) {
                _this.storage.get('localState').then(function (str) {
                    if (dummy)
                        _this.localState = _this.dummyState;
                    else if (str && str != "") {
                        _this.localState = JSON.parse(str);
                        console.log("Local state: ", _this.localState);
                    }
                    else
                        console.log("Local state clean");
                    if (_this.cordovaAvailable)
                        _this.imagesAvailable().then(function (result) { return console.log("Saved Images: ", result); });
                });
            });
        }
        else {
            this.storage.get('localState').then(function (str) {
                if (dummy)
                    _this.localState = _this.dummyState;
                else if (str && str != "") {
                    _this.localState = JSON.parse(str);
                    console.log("Local state: ", _this.localState);
                }
                else
                    console.log("Local state clean");
                if (_this.cordovaAvailable)
                    _this.imagesAvailable().then(function (result) { return console.log("Saved Images: ", result); });
            });
        }
    };
    StorageService.prototype.startup = function () {
        this.loadLocalState();
        this.loadConfig();
        this.loadHomyConfig();
    };
    StorageService.prototype.loadLocalIiiF = function (record) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.cordovaAvailable) {
                _this.storage.keys().then(function (keys) {
                    console.log("keys:", keys.indexOf('iiif:' + record));
                    if (keys.indexOf('iiif:' + record) > -1) {
                        _this.storage.get('iiif:' + record).then(function (img) {
                            console.log("img: ", img);
                            var obj = new IiiFObject();
                            obj.loadManifest(img);
                            resolve(obj);
                        });
                    }
                    else
                        reject();
                });
            }
            else {
                reject();
            }
        });
    };
    StorageService.prototype.saveIiiFLocal = function (iiif) {
        var _this = this;
        if (this.cordovaAvailable)
            this.storage.set('iiif:' + iiif.record_id, iiif.manifest)
                .then(function () { return _this.localState.locallySavedObjectsIiiF.push(iiif.record_id); });
    };
    StorageService.prototype.loadLocalLido = function (record) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.cordovaAvailable) {
                _this.storage.keys().then(function (keys) {
                    if (keys.indexOf('lido:' + record) > -1) {
                        _this.storage.get('lido:' + record).then(function (img) {
                            var obj = new LidoObject();
                            obj.loadLIDO(img, function () {
                                resolve(obj);
                            });
                        }).catch(function () { return reject(); });
                    }
                    else
                        reject();
                });
            }
            else
                reject();
        });
    };
    StorageService.prototype.saveLidoLocal = function (lido) {
        var _this = this;
        if (this.cordovaAvailable)
            this.storage.set('lido:' + lido.recordID, lido.lidoString)
                .then(function () { return _this.localState.locallySavedObjectsLido.push(lido.recordID); });
    };
    StorageService.prototype.imagesAvailable = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.cordovaAvailable) {
                var result_1 = [];
                _this.file.listDir(_this.file.dataDirectory, '').then(function (entries) {
                    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                        var entry = entries_1[_i];
                        if (entry.fullPath.substring(entry.fullPath.lastIndexOf('.')) == '.jpg')
                            result_1.push(entry.fullPath);
                    }
                    resolve(result_1);
                }).catch(function () { return reject(); });
            }
            else
                reject();
        });
    };
    StorageService.prototype.loadLocalImage = function (recordID, width, height, rotation, type, region) {
        var _this = this;
        if (this.cordovaAvailable) {
            var _size = '';
            if (width == undefined && height == undefined)
                _size = 'max';
            else if (width == undefined)
                _size = 'o' + Math.ceil(height);
            else if (height == undefined)
                _size = Math.ceil(width) + 'o';
            else
                _size = Math.ceil(width) + 'o' + Math.ceil(height);
            if (rotation == undefined)
                rotation = 0;
            else
                rotation = Math.ceil(rotation);
            if (type == undefined)
                type = 'default';
            if (region == undefined)
                region = 'full';
            var fileName_1 = recordID + '-' + _size + '-' + rotation + '-' + type + '-' + region + '.jpg';
            if (this.file.dataDirectory && this.webview) {
                console.log("File name: ", this.webview.convertFileSrc(this.file.dataDirectory + fileName_1));
                this.file.checkFile(this.webview.convertFileSrc(this.file.dataDirectory + fileName_1), "").then(function (b) {
                    if (b)
                        return _this.webview.convertFileSrc(_this.file.dataDirectory + fileName_1);
                    else
                        return null;
                });
            }
            else
                return null;
        }
    };
    StorageService.prototype.saveLocalImage = function (recordID, url, width, height, rotation, type, region) {
        if (this.cordovaAvailable) {
            var _size = '';
            if (width == undefined && height == undefined)
                _size = 'max';
            else if (width == undefined)
                _size = 'o' + Math.ceil(height);
            else if (height == undefined)
                _size = Math.ceil(width) + 'o';
            else
                _size = Math.ceil(width) + 'o' + Math.ceil(height);
            if (rotation == undefined)
                rotation = 0;
            else
                rotation = Math.ceil(rotation);
            if (type == undefined)
                type = 'default';
            if (region == undefined)
                region = 'full';
            var fileName = recordID + '-' + _size + '-' + rotation + '-' + type + '-' + region + '.jpg';
            var filePath = this.file.dataDirectory + this.webview.convertFileSrc(fileName);
            var path = void 0;
            if ((path = this.loadLocalImage(recordID, width, height, rotation, type, region)) != null)
                this.fileTransfer.create().download(url, path).then(function (entry) { return console.log("Download complete: ", entry.toUrl()); });
        }
    };
    StorageService.prototype.saveLocalState = function () {
        if (this.storage) {
            this.storage.set('localState', JSON.stringify(this.localState));
            this.storage.set('configuration', JSON.stringify(this.config));
            this.storage.set('homyState', JSON.stringify(this.homyState));
        }
        else
            console.log("Tried to save state. Failure");
    };
    StorageService.prototype.setNFCRecord = function (records) {
        this.nfc_record = records;
    };
    StorageService.prototype.getNFCRecord = function () {
        var tmp = this.nfc_record;
        this.nfc_record = [];
        return tmp;
    };
    var StorageService_1;
    // Configuration (primeconfig.json)
    StorageService.primeconfig = "http://wissenskiosk.uni-goettingen.de/cuby/primeconfig.json";
    StorageService.testconfig = "http://wissenskiosk.uni-goettingen.de/cuby/testconfig.json";
    StorageService = StorageService_1 = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [Storage, File, FilePath, WebView, FileTransfer])
    ], StorageService);
    return StorageService;
}());
export { StorageService };
var Level3Like = /** @class */ (function () {
    function Level3Like() {
        this.recordID = "";
        this.likedFields = [];
        this.comment = "";
    }
    return Level3Like;
}());
export { Level3Like };
//# sourceMappingURL=storage_old.service.js.map