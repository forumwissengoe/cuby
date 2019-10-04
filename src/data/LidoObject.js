"use strict";
exports.__esModule = true;
var xml = require("xml-js");
var ts_optchain_1 = require("ts-optchain");
var LidoObject = /** @class */ (function () {
    function LidoObject() {
        this.data = null;
        this.lidoString = null;
        // Currently supported elements
        this.lidoRecID = undefined;
        this.objectPublishedID = [];
        // Grunddaten
        this.title = undefined;
        // Zitieren und Nachnutzen
        this.handleLink = undefined;
        // Klassifikationen, Taxonomien und Schlagworte
        this.category = [];
        this.objectWorkType = [];
        this.classification = [];
        // Beschreibung
        this.inscriptions = [];
        this.repository = [];
        this.state = undefined;
        this.edition = undefined;
        this.description = [];
        this.measurements = [];
        // Events
        this.events = [];
        // Relations NOT FULLY SUPPORTED -> IRRELEVANT
        this.subjectRelations = [];
        this.relatedWorks = [];
    }
    LidoObject.prototype.loadLIDO = function (lidoData) {
        lidoData = lidoData.replace(/lido:/g, "");
        lidoData = lidoData.replace(/gml:/g, "");
        lidoData = lidoData.replace(/xml:/g, "");
        var tmp = undefined;
        var data = JSON.parse(xml.xml2json(lidoData, { compact: true, spaces: 4, alwaysArray: true }));
        // BASIS LIDO
        this.lidoRecID = ts_optchain_1.oc(data).lido[0].lidoRecID[0]._text[0]();
        for (var _i = 0, _a = ts_optchain_1.oc(data).lido[0].objectPublishedID([]); _i < _a.length; _i++) {
            var obj = _a[_i];
            this.objectPublishedID.push(ts_optchain_1.oc(obj)._text[0]());
        }
        this.handleLink = this.objectPublishedID.find(function (v) { return v.indexOf("handle") >= 0; });
        for (var _b = 0, _c = ts_optchain_1.oc(data).lido[0].category([]); _b < _c.length; _b++) {
            var obj = _c[_b];
            this.category.push(LidoConcept.concept(obj));
        }
        // DESCRIPTIVE METADATA
        // Object Classification
        for (var _d = 0, _e = ts_optchain_1.oc(data).lido[0].descriptiveMetadata[0].objectClassificationWrap[0].objectWorkTypeWrap([]); _d < _e.length; _d++) {
            var obj = _e[_d];
            this.objectWorkType.push(LidoConcept.concept(ts_optchain_1.oc(obj).objectWorkType[0]()));
        }
        for (var _f = 0, _g = ts_optchain_1.oc(data).lido[0].descriptiveMetadata[0].objectClassificationWrap[0].classificationWrap([]); _f < _g.length; _f++) {
            var obj = _g[_f];
            this.classification.push(LidoConcept.concept(ts_optchain_1.oc(obj).classification[0]()));
        }
        // Object Identification
        this.title = LidoAppellation.appellation(ts_optchain_1.oc(data).lido[0].descriptiveMetadata[0].objectIdentificationWrap[0].titleWrap[0].titleSet[0]([]));
        for (var _h = 0, _j = ts_optchain_1.oc(data).lido[0].descriptiveMetadata[0].objectIdentificationWrap[0].inscriptionsWrap[0].inscriptions([]); _h < _j.length; _h++) {
            var obj = _j[_h];
            this.inscriptions.push({ type: ts_optchain_1.oc(obj)._attributes[0].type[0](), transcription: ts_optchain_1.oc(obj).inscriptionTranscription[0](), descriptionNote: ts_optchain_1.oc(obj).inscriptionDescription[0].descriptiveNoteValue[0](), descriptionID: ts_optchain_1.oc(obj).inscriptionDescription[0].descriptiveID[0]() });
        }
        for (var _k = 0, _l = ts_optchain_1.oc(data).lido[0].descriptiveMetadata[0].objectIdentificationWrap[0].repositoryWrap([]); _k < _l.length; _k++) {
            var obj = _l[_k];
            this.repository.push({ legalBodyID: ts_optchain_1.oc(obj).repositorySet[0].repositoryName[0].legalBodyID[0]._text[0](), legalBodyName: ts_optchain_1.oc(obj).repositorySet[0].repositoryName[0].legalBodyName[0].appellationValue[0]._text[0](), legalBodyWeblink: ts_optchain_1.oc(obj).repositorySet[0].repositoryName[0].legalBodyWeblink[0]._text[0](), locationName: ts_optchain_1.oc(obj).repositorySet[0].repositoryLocation[0].namePlaceSet[0].appellationValue[0]._text[0](), position: ts_optchain_1.oc(obj).repositorySet[0].repositoryLocation[0].gml[0].Point[0].pos[0]._text[0]() });
        }
        this.state = ts_optchain_1.oc(data).lido[0].descriptiveMetadata[0].displayStateEditionWrap[0].displayState[0]._text[0]();
        this.edition = ts_optchain_1.oc(data).lido[0].descriptiveMetadata[0].displayStateEditionWrap[0].displayEdition[0]._text[0]();
        for (var _m = 0, _o = ts_optchain_1.oc(data).lido[0].descriptiveMetadata[0].objectIdentificationWrap[0].objectDescriptionWrap([]); _m < _o.length; _m++) {
            var obj = _o[_m];
            this.description.push({ type: ts_optchain_1.oc(obj).objectDescriptionSet[0]._attributes[0].type[0](), description: ts_optchain_1.oc(obj).objectDescriptionSet[0].descriptiveNoteValue[0]._text[0]() });
        }
        for (var _p = 0, _q = ts_optchain_1.oc(data).lido[0].descriptiveMetadata[0].objectIdentificationWrap[0].objectMeasurementsWrap[0].objectMeasurementsSet([]); _p < _q.length; _p++) {
            var obj = _q[_p];
            this.measurements.push(LidoMeasurement.measurement(obj));
        }
        // Events
        for (var _r = 0, _s = ts_optchain_1.oc(data).lido[0].descriptiveMetadata[0].eventWrap[0].eventSet(); _r < _s.length; _r++) {
            var obj = _s[_r];
            this.events.push(LidoEvent.event(obj));
        }
        // Object Relations
        for (var _t = 0, _u = ts_optchain_1.oc(data).lido[0].descriptiveMetadata[0].objectRelationWrap[0].subjectWrap[0].subjectSet([]); _t < _u.length; _t++) {
            var obj = _u[_t];
            this.subjectRelations.push({ display: ts_optchain_1.oc(obj).displaySubject[0]._text[0](), concept: LidoConcept.concept(ts_optchain_1.oc(obj).subject[0].subjectConcept[0]()), date: LidoDate.date(ts_optchain_1.oc(obj).subject[0].subjectDate[0]()), place: LidoPlace.place(ts_optchain_1.oc(obj).subject[0].subjectPlace[0]()), actor: LidoActor.actor(ts_optchain_1.oc(obj).subject[0].subjectActor[0]()) });
        }
        for (var _v = 0, _w = ts_optchain_1.oc(data).lido[0].descriptiveMetadata[0].objectRelationWrap[0].relatedWorksWrap[0].relatedWorkSet([]); _v < _w.length; _v++) {
            var obj = _w[_v];
            this.relatedWorks.push({ display: ts_optchain_1.oc(obj).relatedWork[0].displayObject[0]._text[0](), id: ts_optchain_1.oc(obj).relatedWork[0].object[0].objectID[0]._text[0](), note: ts_optchain_1.oc(obj).relatedWork[0].object[0].objectNote[0]._text[0](), webresouce: ts_optchain_1.oc(obj).relatedWork[0].object[0].objectWebResource[0]._text[0](), relTypeConcept: LidoConcept.concept(ts_optchain_1.oc(obj).relatedWorkRelType[0]()) });
        }
    };
    //@cache
    LidoObject.prototype.hasPlace = function () {
        for (var _i = 0, _a = this.events; _i < _a.length; _i++) {
            var element = _a[_i];
            if (element.eventPlace != undefined && !element.eventPlace.empty())
                return true;
        }
        for (var _b = 0, _c = this.subjectRelations; _b < _c.length; _b++) {
            var element = _c[_b];
            if (element.place != undefined && !element.place.empty())
                return true;
        }
        return false;
    };
    //@cache
    LidoObject.prototype.hasTime = function () {
        for (var _i = 0, _a = this.events; _i < _a.length; _i++) {
            var element = _a[_i];
            if (element.eventDate != undefined && !element.eventDate.empty())
                return true;
        }
        for (var _b = 0, _c = this.subjectRelations; _b < _c.length; _b++) {
            var element = _c[_b];
            if (element.date != undefined && !element.date.empty())
                return true;
        }
        return false;
    };
    return LidoObject;
}());
exports.LidoObject = LidoObject;
var LidoConcept = /** @class */ (function () {
    function LidoConcept() {
        this.conceptID = [];
        this.term = [];
    }
    LidoConcept.concept = function (obj) {
        var concept = new LidoConcept();
        if (obj != undefined) {
            for (var _i = 0, _a = ts_optchain_1.oc(obj).conceptID([]); _i < _a.length; _i++) {
                var c = _a[_i];
                concept.conceptID.push({ txt: ts_optchain_1.oc(c)._text[0](), attr: ts_optchain_1.oc(c)._attributes({}) });
            }
            for (var _b = 0, _c = ts_optchain_1.oc(obj).term([]); _b < _c.length; _b++) {
                var t = _c[_b];
                concept.term.push({ txt: ts_optchain_1.oc(t)._text[0](), attr: ts_optchain_1.oc(t)._attributes({}) });
            }
        }
        return concept;
    };
    LidoConcept.prototype.getTerm = function (attr, val) {
        if (this.term == undefined)
            return undefined;
        if (attr == undefined || val == undefined)
            for (var _i = 0, _a = this.term; _i < _a.length; _i++) {
                var obj = _a[_i];
                if (JSON.stringify(obj.attr === '{}'))
                    return obj.txt;
                else
                    for (var _b = 0, _c = this.term; _b < _c.length; _b++) {
                        var obj_1 = _c[_b];
                        if (obj_1.attr.hasOwnProperty(attr) && obj_1.attr[attr] === val)
                            return obj_1;
                    }
            }
        return undefined;
    };
    LidoConcept.prototype.getConceptID = function (attr, val) {
        if (this.conceptID == undefined)
            return undefined;
        if (attr == undefined || val == undefined)
            for (var _i = 0, _a = this.conceptID; _i < _a.length; _i++) {
                var obj = _a[_i];
                if (JSON.stringify(obj.attr === '{}'))
                    return obj.txt;
                else
                    for (var _b = 0, _c = this.conceptID; _b < _c.length; _b++) {
                        var obj_2 = _c[_b];
                        if (obj_2.attr.hasOwnProperty(attr) && obj_2.attr[attr] === val)
                            return obj_2;
                    }
            }
        return undefined;
    };
    return LidoConcept;
}());
exports.LidoConcept = LidoConcept;
var LidoAppellation = /** @class */ (function () {
    function LidoAppellation() {
        this.appellation = [];
    }
    LidoAppellation.appellation = function (obj) {
        var appellation = new LidoAppellation();
        if (obj != undefined) {
            for (var _i = 0, _a = ts_optchain_1.oc(obj).appellationValue([]); _i < _a.length; _i++) {
                var a = _a[_i];
                appellation.appellation.push({ txt: ts_optchain_1.oc(a)._text[0](), attr: ts_optchain_1.oc(a)._attributes({}) });
            }
        }
        return appellation;
    };
    LidoAppellation.prototype.get = function (attr, val) {
        if (this.appellation == [])
            return undefined;
        if (attr == undefined || val == undefined)
            for (var _i = 0, _a = this.appellation; _i < _a.length; _i++) {
                var obj = _a[_i];
                if (JSON.stringify(obj.attr === '{}'))
                    return obj.txt;
                else
                    for (var _b = 0, _c = this.appellation; _b < _c.length; _b++) {
                        var obj_3 = _c[_b];
                        if (obj_3.attr.hasOwnProperty(attr) && obj_3.attr[attr] === val)
                            return obj_3;
                    }
            }
        return undefined;
    };
    return LidoAppellation;
}());
exports.LidoAppellation = LidoAppellation;
var LidoMeasurement = /** @class */ (function () {
    function LidoMeasurement() {
        this.displayMeasurements = undefined;
        this.type = [];
        this.unit = [];
        this.value = [];
        this.extend = undefined;
        this.qualifier = undefined;
        this.format = undefined;
        this.shape = undefined;
        this.scale = undefined;
    }
    LidoMeasurement.measurement = function (obj) {
        var measurement = new LidoMeasurement();
        if (obj != undefined) {
            measurement.displayMeasurements = ts_optchain_1.oc(obj).displayObjectMeasurements[0]._text[0]();
            measurement.extend = ts_optchain_1.oc(obj).objectMeasurements[0].extentMeasurements[0]._text[0]();
            measurement.qualifier = ts_optchain_1.oc(obj).objectMeasurements[0].qualifierMeasurements[0]._text[0]();
            measurement.format = ts_optchain_1.oc(obj).objectMeasurements[0].formatMeasurements[0]._text[0]();
            measurement.shape = ts_optchain_1.oc(obj).objectMeasurements[0].shapeMeasurements[0]._text[0]();
            measurement.scale = ts_optchain_1.oc(obj).objectMeasurements[0].scaleMeasurements[0]._text[0]();
            for (var _i = 0, _a = ts_optchain_1.oc(obj).objectMeasurements[0].measurementsSet[0].measurementType([]); _i < _a.length; _i++) {
                var a = _a[_i];
                measurement.type.push({ txt: ts_optchain_1.oc(a)._text[0](), attr: ts_optchain_1.oc(a)._attributes({}) });
            }
            for (var _b = 0, _c = ts_optchain_1.oc(obj).objectMeasurements[0].measurementsSet[0].measurementUnit([]); _b < _c.length; _b++) {
                var a = _c[_b];
                measurement.unit.push({ txt: ts_optchain_1.oc(a)._text[0](), attr: ts_optchain_1.oc(a)._attributes({}) });
            }
            for (var _d = 0, _e = ts_optchain_1.oc(obj).objectMeasurements[0].measurementsSet[0].measurementValue([]); _d < _e.length; _d++) {
                var a = _e[_d];
                measurement.value.push({ txt: ts_optchain_1.oc(a)._text[0](), attr: ts_optchain_1.oc(a)._attributes({}) });
            }
        }
        return measurement;
    };
    LidoMeasurement.prototype.getType = function (attr, val) {
        if (this.type == undefined)
            return undefined;
        if (attr == undefined || val == undefined)
            for (var _i = 0, _a = this.type; _i < _a.length; _i++) {
                var obj = _a[_i];
                if (JSON.stringify(obj.attr === '{}'))
                    return obj.txt;
                else
                    for (var _b = 0, _c = this.type; _b < _c.length; _b++) {
                        var obj_4 = _c[_b];
                        if (obj_4.attr.hasOwnProperty(attr) && obj_4.attr[attr] === val)
                            return obj_4;
                    }
            }
        return undefined;
    };
    LidoMeasurement.prototype.getUnit = function (attr, val) {
        if (this.unit == undefined)
            return undefined;
        if (attr == undefined || val == undefined)
            for (var _i = 0, _a = this.unit; _i < _a.length; _i++) {
                var obj = _a[_i];
                if (JSON.stringify(obj.attr === '{}'))
                    return obj.txt;
                else
                    for (var _b = 0, _c = this.unit; _b < _c.length; _b++) {
                        var obj_5 = _c[_b];
                        if (obj_5.attr.hasOwnProperty(attr) && obj_5.attr[attr] === val)
                            return obj_5;
                    }
            }
        return undefined;
    };
    LidoMeasurement.prototype.getValue = function (attr, val) {
        if (this.value == undefined)
            return undefined;
        if (attr == undefined || val == undefined)
            for (var _i = 0, _a = this.value; _i < _a.length; _i++) {
                var obj = _a[_i];
                if (obj.attr === {})
                    return obj.txt;
                else
                    for (var _b = 0, _c = this.value; _b < _c.length; _b++) {
                        var obj_6 = _c[_b];
                        if (obj_6.attr.hasOwnProperty(attr) && obj_6.attr[attr] === val)
                            return obj_6;
                    }
            }
        return undefined;
    };
    return LidoMeasurement;
}());
exports.LidoMeasurement = LidoMeasurement;
var LidoDate = /** @class */ (function () {
    function LidoDate() {
        this.displayDate = undefined;
        this.earliest = undefined;
        this.latest = undefined;
    }
    LidoDate.date = function (obj) {
        var date = new LidoDate();
        if (obj != undefined) {
            date.displayDate = ts_optchain_1.oc(obj).displayDate[0]._text[0]();
            date.earliest = new Date(ts_optchain_1.oc(obj).date[0].earliestDate[0]._text[0]()).getTime();
            date.latest = new Date(ts_optchain_1.oc(obj).date[0].latestDate[0]._text[0]()).getTime();
        }
        return date;
    };
    LidoDate.prototype.empty = function () {
        return this.earliest === undefined && this.latest === undefined;
    };
    return LidoDate;
}());
exports.LidoDate = LidoDate;
var LidoPlace = /** @class */ (function () {
    function LidoPlace() {
        this.displayPlace = undefined;
        this.placeID = undefined;
        this.placeName = undefined;
        this.pos = [];
    }
    LidoPlace.place = function (obj) {
        var place = new LidoPlace();
        if (obj != undefined) {
            place.displayPlace = ts_optchain_1.oc(obj).displayPlace[0]._text[0]();
            place.placeID = ts_optchain_1.oc(obj).place[0].placeID[0]._text[0]();
            place.placeName = LidoAppellation.appellation(ts_optchain_1.oc(obj).place[0].namePlaceSet[0]());
            place.pos = (ts_optchain_1.oc(obj).place[0].gml[0].Point[0].pos[0]._text[0]() || "").split(" ").map(function (v) { return parseFloat(v); });
            if (place.pos == undefined || isNaN(place.pos[0]) || isNaN(place.pos[1]))
                place.pos = undefined;
        }
        return place;
    };
    LidoPlace.prototype.empty = function () {
        return this.pos === undefined;
    };
    return LidoPlace;
}());
exports.LidoPlace = LidoPlace;
var LidoActor = /** @class */ (function () {
    function LidoActor() {
        this.displayActor = undefined;
        this.actorID = undefined;
        this.actorName = undefined;
        this.actorNationality = undefined;
        this.actorVitalDates = undefined;
        this.actorGender = undefined;
        this.actorRole = undefined;
        this.actorExtend = undefined;
        this.actorAttribution = undefined;
    }
    LidoActor.actor = function (obj) {
        var actor = new LidoActor();
        if (obj != undefined) {
            actor.displayActor = LidoAppellation.appellation(ts_optchain_1.oc(obj).displayActor[0]()) || LidoAppellation.appellation(ts_optchain_1.oc(obj).displayActorInRole[0]());
            actor.actorID = ts_optchain_1.oc(obj).actor[0]._text[0]();
            actor.actorName = LidoAppellation.appellation(ts_optchain_1.oc(obj).actor[0].nameActorSet[0]());
            actor.actorNationality = LidoConcept.concept(ts_optchain_1.oc(obj).actor[0].nationalityActor[0]());
            actor.actorVitalDates = LidoDate.date(ts_optchain_1.oc(obj).actor[0].vitalDatesActor[0]());
            actor.actorGender = ts_optchain_1.oc(obj).actor[0].genderActor[0]._text[0]();
            actor.actorRole = LidoConcept.concept(ts_optchain_1.oc(obj).actorInRole[0].roleActor[0]());
            actor.actorExtend = ts_optchain_1.oc(obj).actorInRole[0].extendActor[0]._text[0]();
            actor.actorAttribution = ts_optchain_1.oc(obj).actorInRole[0].attributionQualifierActor[0]._text[0]();
        }
        return actor;
    };
    return LidoActor;
}());
exports.LidoActor = LidoActor;
var LidoEvent = /** @class */ (function () {
    function LidoEvent() {
        this.displayEvent = undefined;
        this.eventID = undefined;
        this.eventType = undefined;
        this.roleInEvent = undefined;
        this.eventName = undefined;
        this.eventActor = [];
        this.eventCulture = undefined;
        this.eventDate = undefined;
        this.eventPeriodName = undefined;
        this.eventPlace = undefined;
        this.eventMethod = undefined;
        this.eventDescriptiveNoteID = undefined;
        this.eventDescriptiveNoteValue = undefined;
    }
    // THING PRESENT AND MATERIALS TECH NOT SUPPORTED (REASON: IRRELEVANT, NOT DISPLAYED)
    // RELATED EVENTS NOT SUPPORTED, POSSIBILITY OF INFINITY LOOPS
    LidoEvent.event = function (obj) {
        var event = new LidoEvent();
        if (obj != undefined) {
            event.displayEvent = LidoAppellation.appellation(ts_optchain_1.oc(obj).displayEvent[0]());
            event.eventID = ts_optchain_1.oc(obj).event[0].eventID[0]._text[0]();
            event.eventType = LidoConcept.concept(ts_optchain_1.oc(obj).event[0].eventType[0]());
            event.roleInEvent = LidoConcept.concept(ts_optchain_1.oc(obj).event[0].roleInEvent[0]());
            event.eventName = LidoAppellation.appellation(ts_optchain_1.oc(obj).event[0].eventName[0]());
            event.eventCulture = LidoConcept.concept(ts_optchain_1.oc(obj).event[0].eventCulture[0]());
            event.eventDate = LidoDate.date(ts_optchain_1.oc(obj).event[0].eventDate[0]());
            event.eventPeriodName = LidoConcept.concept(ts_optchain_1.oc(obj).event[0].periodName[0]());
            event.eventPlace = LidoPlace.place(ts_optchain_1.oc(obj).event[0].eventPlace[0]());
            event.eventMethod = LidoConcept.concept(ts_optchain_1.oc(obj).event[0].eventMethod[0]());
            event.eventDescriptiveNoteID = ts_optchain_1.oc(obj).event[0].eventDescriptionSet[0].descriptiveNoteID[0]._text[0]();
            event.eventDescriptiveNoteValue = ts_optchain_1.oc(obj).event[0].eventDescriptionSet[0].descriptiveNoteID[0]._text[0]();
            for (var _i = 0, _a = ts_optchain_1.oc(obj).event[0].eventActor([]); _i < _a.length; _i++) {
                var o = _a[_i];
                event.eventActor.push(LidoActor.actor(o));
            }
        }
        return event;
    };
    return LidoEvent;
}());
exports.LidoEvent = LidoEvent;
