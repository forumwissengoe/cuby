import * as tslib_1 from "tslib";
import { LidoObject } from './LidoObject';
import { IiiFObject } from './IiiFObject';
var DataLoader = /** @class */ (function () {
    function DataLoader() {
    }
    DataLoader.loadPrimeConfig = function (primeConfig) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", primeConfig);
            xhr.onload = function (ev) {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.responseText));
                    }
                    else {
                        console.log("ERROR. Prime config could not be loaded");
                        reject(xhr.status);
                    }
                }
            };
            xhr.send();
        });
    };
    DataLoader.loadHomyConfig = function (configURL) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", configURL);
            xhr.onload = function (ev) {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.responseText));
                    }
                    else {
                        console.log("ERROR. Questions config could not be loaded");
                        reject(xhr.status);
                    }
                }
            };
            xhr.send();
        });
    };
    DataLoader.loadHomyQuestions = function (url, type) {
        url = url + "?type=" + encodeURIComponent(type);
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.onload = function (ev) {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        var obj = JSON.parse(xhr.responseText);
                        if (obj != [])
                            resolve(obj);
                        else
                            reject(xhr.responseText);
                    }
                    else {
                        console.log("ERROR. Questions config could not be loaded");
                        reject(xhr.status);
                    }
                }
            };
            xhr.send();
        });
    };
    DataLoader.publishHomyHighscore = function (url, highscore) {
        // TODO Dummy location
        var location = "all";
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.onload = function (ev) {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve();
                    }
                    else {
                        reject(xhr.status);
                    }
                }
            };
            xhr.send("score=" + highscore + "&location=" + location);
        });
    };
    DataLoader.requestHomyHighscore = function (url) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.onload = function (ev) {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200)
                        resolve(JSON.parse(xhr.responseText));
                    else
                        reject(xhr.status);
                }
            };
            xhr.send();
        });
    };
    DataLoader.requestCuryImages = function (storageService, url, number) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var base, e_1, result, images, index, i, arr, a, _a, _b, e_2;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        base = null;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                var xhr = new XMLHttpRequest();
                                xhr.open("GET", url);
                                xhr.onload = function (ev) {
                                    if (xhr.readyState == 4) {
                                        if (xhr.status == 200)
                                            resolve(JSON.parse(xhr.responseText));
                                        else {
                                            console.log("ERROR. Config could not be loaded");
                                            reject(xhr.status);
                                        }
                                    }
                                };
                                xhr.send();
                            })];
                    case 2:
                        base = _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _c.sent();
                        return [2 /*return*/, null];
                    case 4:
                        if (!Array.isArray(base) || base.length < 2)
                            return [2 /*return*/, null];
                        result = Array(number);
                        images = Array(number);
                        index = -1;
                        i = 0;
                        _c.label = 5;
                    case 5:
                        if (!(i < number)) return [3 /*break*/, 10];
                        index++;
                        if (index >= base.length)
                            index = 0;
                        arr = base[index];
                        if (arr.length == 0 || Math.random() < 0.3) // Discard empty arrays and discard some randomly
                         {
                            i--;
                            return [3 /*break*/, 9];
                        }
                        for (a = 0; a < arr.length; a++) {
                            if (images.indexOf(arr[a]) == -1 || storageService.localState.curyStack.indexOf(arr[a]) == -1 && arr[a]) {
                                images[i] = arr[a];
                                storageService.localState.curyStack.push(arr[a]);
                                break;
                            }
                        }
                        if (!images[i]) {
                            i--;
                            return [3 /*break*/, 9];
                        }
                        _c.label = 6;
                    case 6:
                        _c.trys.push([6, 8, , 9]);
                        _a = result;
                        _b = i;
                        return [4 /*yield*/, DataLoader.downloadManifest(storageService, images[i])];
                    case 7:
                        _a[_b] = _c.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        e_2 = _c.sent();
                        result[i] = null;
                        return [3 /*break*/, 9];
                    case 9:
                        i++;
                        return [3 /*break*/, 5];
                    case 10: return [2 /*return*/, result];
                }
            });
        });
    };
    DataLoader.loadPicyConfigFile = function (storageService) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var urls, _i, _a, u, result, _loop_1, _b, urls_1, u;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        urls = ["../assets/config/picy-card-config-fallback.json"];
                        for (_i = 0, _a = storageService.configuration.display_config_picy; _i < _a.length; _i++) {
                            u = _a[_i];
                            if (DataLoader.validURL(u))
                                urls.push(u);
                        }
                        result = [];
                        _loop_1 = function (u) {
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, new Promise((function (resolve) {
                                            var xhr = new XMLHttpRequest();
                                            xhr.open("GET", u);
                                            xhr.onload = function (ev) {
                                                if (xhr.readyState == 4) {
                                                    if (xhr.status == 200) {
                                                        var obj = JSON.parse(xhr.responseText);
                                                        result = result.concat(obj);
                                                        resolve();
                                                    }
                                                    else {
                                                        console.log("ERROR. Config could not be loaded");
                                                    }
                                                }
                                            };
                                            xhr.send();
                                        }))];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _b = 0, urls_1 = urls;
                        _c.label = 1;
                    case 1:
                        if (!(_b < urls_1.length)) return [3 /*break*/, 4];
                        u = urls_1[_b];
                        return [5 /*yield**/, _loop_1(u)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _b++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, result];
                }
            });
        });
    };
    DataLoader.loadDetailsConfigFile = function (storageService) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var urls, _i, _a, u, result, _loop_2, _b, urls_2, u;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        urls = ["../assets/config/details-card-config-fallback.json"];
                        for (_i = 0, _a = storageService.configuration.display_config_cury_details; _i < _a.length; _i++) {
                            u = _a[_i];
                            if (DataLoader.validURL(u))
                                urls.push(u);
                        }
                        result = [];
                        _loop_2 = function (u) {
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        console.log("Load url: ", u);
                                        return [4 /*yield*/, new Promise((function (resolve) {
                                                var xhr = new XMLHttpRequest();
                                                xhr.open("GET", u);
                                                xhr.onload = function (ev) {
                                                    if (xhr.readyState == 4) {
                                                        if (xhr.status == 200) {
                                                            var obj = JSON.parse(xhr.responseText);
                                                            result = result.concat(obj);
                                                            resolve();
                                                        }
                                                        else {
                                                            console.log("ERROR. Config could not be loaded");
                                                        }
                                                    }
                                                };
                                                xhr.send();
                                            }))];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _b = 0, urls_2 = urls;
                        _c.label = 1;
                    case 1:
                        if (!(_b < urls_2.length)) return [3 /*break*/, 4];
                        u = urls_2[_b];
                        return [5 /*yield**/, _loop_2(u)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _b++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, result];
                }
            });
        });
    };
    DataLoader.loadFeedbackConfigFile = function (storageService) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var urls, _i, _a, u, result, _loop_3, _b, urls_3, u;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        urls = ["../assets/config/feedback-card-config-fallback.json"];
                        for (_i = 0, _a = storageService.configuration.display_config_cury_feedback; _i < _a.length; _i++) {
                            u = _a[_i];
                            if (DataLoader.validURL(u))
                                urls.push(u);
                        }
                        result = [];
                        _loop_3 = function (u) {
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, new Promise((function (resolve) {
                                            var xhr = new XMLHttpRequest();
                                            xhr.open("GET", u);
                                            xhr.onload = function (ev) {
                                                if (xhr.readyState == 4) {
                                                    if (xhr.status == 200) {
                                                        var obj = JSON.parse(xhr.responseText);
                                                        result = result.concat(obj);
                                                        resolve();
                                                    }
                                                    else {
                                                        console.log("ERROR. Config could not be loaded");
                                                    }
                                                }
                                            };
                                            xhr.send();
                                        }))];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _b = 0, urls_3 = urls;
                        _c.label = 1;
                    case 1:
                        if (!(_b < urls_3.length)) return [3 /*break*/, 4];
                        u = urls_3[_b];
                        return [5 /*yield**/, _loop_3(u)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _b++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, result];
                }
            });
        });
    };
    DataLoader.downloadManifest = function (storageService, recordID) {
        return new Promise(function (resolve, reject) {
            if (storageService.localState.locallySavedObjectsIiiF.indexOf(recordID) != -1)
                storageService.loadLocalIiiF(recordID).then(function (iiif) { return resolve(iiif); });
            else {
                var xhr_1 = new XMLHttpRequest();
                // TODO change url
                xhr_1.open("GET", DataLoader.manifestBaseUrl + recordID + "/manifest/");
                xhr_1.onload = function (ev) {
                    if (xhr_1.readyState == 4) {
                        if (xhr_1.status == 200) {
                            var obj = new IiiFObject();
                            obj.loadManifest(xhr_1.responseText);
                            storageService.saveIiiFLocal(obj);
                            resolve(obj);
                        }
                        else {
                            reject(xhr_1.status);
                        }
                    }
                };
                xhr_1.send();
            }
        });
    };
    DataLoader.downloadLIDO = function (storageService, recordID) {
        return new Promise(function (resolve, reject) {
            if (recordID == undefined || recordID == "")
                reject();
            else {
                if (storageService.localState.locallySavedObjectsLido.indexOf(recordID) != -1)
                    storageService.loadLocalLido(recordID).then(function (lido) { return resolve(lido); });
                else {
                    // TODO Change url
                    var str = DataLoader.lidoBaseUrl + recordID;
                    var xhr_2 = new XMLHttpRequest();
                    xhr_2.open("GET", str);
                    xhr_2.onload = function (ev) {
                        if (xhr_2.readyState == 4) {
                            if (xhr_2.status == 200) {
                                var obj_1 = new LidoObject();
                                obj_1.loadLIDO(xhr_2.responseText, function () {
                                    storageService.saveLidoLocal(obj_1);
                                    resolve(obj_1);
                                });
                            }
                            else {
                                reject(xhr_2.status);
                            }
                        }
                    };
                    xhr_2.send();
                }
            }
        });
    };
    DataLoader.loadGallery = function (storageService, galleryRecords) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var iiif, error, i, gal, _a, _b, e_3;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        iiif = Array(galleryRecords.length);
                        error = Array(galleryRecords.length);
                        i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(i < galleryRecords.length)) return [3 /*break*/, 6];
                        gal = galleryRecords[i];
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        _a = iiif;
                        _b = i;
                        return [4 /*yield*/, DataLoader.downloadManifest(storageService, gal)];
                    case 3:
                        _a[_b] = _c.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_3 = _c.sent();
                        error[i] = e_3.message;
                        console.log("Error: ", e_3);
                        return [3 /*break*/, 5];
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, { iiif: iiif, error: error }];
                }
            });
        });
    };
    // Helper
    DataLoader.validURL = function (str) {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(str);
    };
    DataLoader.manifestBaseUrl = "https://sammlungen.uni-goettingen.de/rest/iiif/manifests/";
    DataLoader.lidoBaseUrl = "https://sammlungen.uni-goettingen.de/lidoresolver?id=";
    DataLoader.gallery = ["record_kuniweb_592553", "record_kuniweb_675675", "record_kuniweb_592566", "record_kuniweb_945664", "record_kuniweb_666297", "record_kuniweb_943917", "record_kuniweb_681925", "record_kuniweb_854325"];
    DataLoader.primeConfig = "http://wissenskiosk.uni-goettingen.de/cuby/cuby-config/primeconfig.json";
    DataLoader.testConfig = "";
    DataLoader.emailTOKEN = "rRHMHNX7HY8LRYSuS462Fv9mFe8cPrywq8aQJrNp5S3JYh3bfPBTkmuJs9VWw7XM";
    return DataLoader;
}());
export { DataLoader };
//# sourceMappingURL=DataLoader.js.map