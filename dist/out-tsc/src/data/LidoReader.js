import * as xml from "xml2js";
import { Promise } from 'es6-promise';
var LidoReader = /** @class */ (function () {
    function LidoReader() {
        this.data = {};
    }
    LidoReader.prototype.readLido = function (data) {
        data = data.replace(/lido:/g, "");
        var s = new mb(data);
        return new Promise(function (resolve) {
            new xml.Parser().parseString(s, function (error, result) {
                resolve(result);
            });
        });
    };
    LidoReader.prototype.getRecordID = function () {
        if (this.data.hasOwnProperty("lido") &&
            this.data.lido.hasOwnProperty("lidoRecID") &&
            this.data.lido.lidoRecID instanceof Array &&
            this.data.lido.lidoRecID[0].hasOwnProperty("_"))
            return this.data.lido.lidoRecID[0]._;
        else
            return null;
    };
    LidoReader.prototype.getObjectPublishedIDs = function () {
        var result = [];
        if (this.data.hasOwnProperty("lido") && this.data.lido.hasOwnProperty("objectPublishedID")) {
            for (var _i = 0, _a = this.data.lido.objectPublishedID; _i < _a.length; _i++) {
                var link = _a[_i];
                if (link.hasOwnProperty("_"))
                    result.push({ link: link["_"] });
            }
        }
    };
    LidoReader.prototype.getCategories = function () {
        if (this.data.hasOwnProperty("lido") &&
            this.data.lido.hasOwnProperty("category")) {
            if (this.data.lido.category instanceof Array) {
                var result = [];
                for (var _i = 0, _a = this.data.lido.category; _i < _a.length; _i++) {
                    var cat = _a[_i];
                    if (cat.hasOwnProperty("term") && cat.term instanceof Array) {
                        var res = [];
                        for (var _b = 0, _c = cat.term; _b < _c.length; _b++) {
                            var t = _c[_b];
                            var tmp = { category: "", language: "" };
                            if (t.hasOwnProperty("_"))
                                tmp.category = t._;
                            if (t.hasOwnProperty("$") && t.$.hasOwnProperty("xml:lang"))
                                tmp.language = t.$["xml:lang"];
                            res.push(tmp);
                        }
                        result.push(res);
                    }
                }
                return result;
            }
        }
        return null;
    };
    LidoReader.prototype.loadMetadata = function () {
        if (this.data.hasOwnProperty("lido") && this.data.lido.hasOwnProperty("descriptiveMetadata")) {
            var meta = [];
            for (var _i = 0, _a = this.data.lido.descriptiveMetadata; _i < _a.length; _i++) {
                var descr = _a[_i];
                var tmp_meta = { language: "", classification: null, identification: null, relation: null };
                if (descr.hasOwnProperty("$") && descr.$.hasOwnProperty("xml:lang")) {
                    tmp_meta.language = descr.$["xml:lang"];
                    // Object Classification Wrap
                    var classific = [];
                    for (var _b = 0, _c = descr.objectClassificationWrap[0].objectWorkTypeWrap; _b < _c.length; _b++) {
                        var workType = _c[_b];
                        if (workType.objectWorkType == undefined)
                            continue;
                        var tmp_wType = { conceptID: "", type: "", term: "", obj: true };
                        if (workType.objectWorkType[0].hasOwnProperty("$") && workType.objectWorkType[0].$.hasOwnProperty("type"))
                            tmp_wType.type = workType.objectWorkType[0].$.type;
                        if (workType.objectWorkType[0].hasOwnProperty("conceptID"))
                            tmp_wType.conceptID = workType.objectWorkType[0].conceptID[0]._;
                        if (workType.objectWorkType[0].hasOwnProperty("term"))
                            tmp_wType.term = workType.objectWorkType[0].term[0];
                        classific.push(tmp_wType);
                    }
                    for (var _d = 0, _e = descr.objectClassificationWrap[0].classificationWrap; _d < _e.length; _d++) {
                        var c = _e[_d];
                        if (c.classification == undefined)
                            continue;
                        var tmp_classific = { conceptID: "", type: "", term: "", obj: false };
                        if (c.classification[0].hasOwnProperty("$") && c.classification[0].$.hasOwnProperty("type"))
                            tmp_classific.type = c.classification[0].$.type;
                        if (c.classification[0].hasOwnProperty("conceptID"))
                            tmp_classific.conceptID = c.classification[0].conceptID[0]._;
                        if (c.classification[0].hasOwnProperty("term"))
                            tmp_classific.term = c.classification[0].term;
                        classific.push(tmp_classific);
                    }
                    tmp_meta.classification = classific;
                    // Object Identification Wrap
                    var ident = [];
                    for (var _f = 0, _g = descr.objectIdentificationWrap[0].titleWrap; _f < _g.length; _f++) {
                        var title = _g[_f];
                        if (title.titleSet == undefined)
                            continue;
                        var tmp_title = { value: "", source: "", type: "TITLE" };
                        console.log("T", title.titleSet);
                        if (title.titleSet[0].hasOwnProperty("appellationValue"))
                            if (title.titleSet[0].appelationValue instanceof Array)
                                tmp_title.value = title.titleSet[0].appelationValue[0]; // TODO multiple languages missing
                            else
                                tmp_title.value = title.titleSet[0].appelationValue;
                        if (title.titleSet[0].hasOwnProperty("sourceAppellation"))
                            tmp_title.source = title.titleSet[0].sourceAppellation;
                        ident.push(tmp_title);
                    }
                }
                meta.push(tmp_meta);
            }
            //this.metadata = meta;
        }
    };
    return LidoReader;
}());
export { LidoReader };
var mb = /** @class */ (function () {
    function mb(data) {
        this.data = "";
        this.data = data;
    }
    mb.prototype.toString = function () { return this.data; };
    return mb;
}());
//# sourceMappingURL=LidoReader.js.map