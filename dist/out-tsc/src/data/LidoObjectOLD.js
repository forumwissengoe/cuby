import * as xml from 'xml2js';
var LidoObject = /** @class */ (function () {
    function LidoObject() {
        this.data = null;
        this.lidoString = null;
        // Currently supported elements
        this.recordID = "";
        this.objectPublishedID = [""];
        // Grunddaten
        this.title = "";
        this.location = "";
        this.collection = "";
        // Zitieren und Nachnutzen
        this.handleLink = "";
        // Klassifikationen, Taxonomien und Schlagworte
        this.category = [{ conceptID: "", term: "" }];
        this.objectWorkType = [{ conceptID: "", term: "" }];
        this.classification = [{ type: "", term: "" }];
        // Beschreibung
        this.inscriptions = [{ type: "", transcription: "", descriptionID: "", descriptionNote: "" }];
        this.repository = [{ legalBodyID: "", legalBodyName: "", legalBodyWeblink: "", locationName: "", position: "", }];
        this.state = "";
        this.edition = "";
        this.description = [{ type: "", description: "" }];
        this.measurements = [{ display: "", measure: [] }];
        // Events
        this.events = [{ display: "", conceptID: "", object: null }];
        // Relations TODO not fully supported
        this.subjectRelations = [{ display: "", conceptID: "", term: "" }];
        this.relatedWorks = [{ display: "", reltypeID: "", reltypeTerm: "", id: "", note: "", webresouce: "" }];
    }
    LidoObject.prototype.loadLIDO = function (lidoData, cb) {
        var _this = this;
        this.lidoString = lidoData;
        lidoData = lidoData.replace(/lido:/g, "");
        lidoData = lidoData.replace(/gml:/g, "");
        new xml.Parser().parseString(lidoData, function (error, result) {
            _this.data = result;
            _this.loadData();
            for (var _i = 0, _a = _this.objectPublishedID; _i < _a.length; _i++) {
                var id = _a[_i];
                if (id.includes("handle"))
                    _this.handleLink = id;
            }
            //console.log("DATA", this.data);
            cb();
        });
    };
    LidoObject.prototype.loadData = function () {
        var x = null;
        try {
            if ((this.recordID = this.data.lido.lidoRecID[0]._) == undefined)
                this.recordID = '';
        }
        catch (e) { }
        //console.log("Record ID", this.recordID);
        try {
            for (var _i = 0, _a = this.data.lido.objectPublishedID; _i < _a.length; _i++) {
                var obj = _a[_i];
                try {
                    if (obj._ != undefined)
                        this.objectPublishedID.push(obj._);
                }
                catch (e) { }
            }
        }
        catch (e) { }
        if (this.objectPublishedID.length > 1)
            this.objectPublishedID.shift();
        //console.log("ObjectPublishedID", this.objectPublishedID);
        try {
            for (var _b = 0, _c = this.data.lido.category; _b < _c.length; _b++) {
                var obj = _c[_b];
                try {
                    if (obj.conceptID[0]._ != undefined && obj.term[0]._ != undefined)
                        this.category.push({ conceptID: obj.conceptID[0]._, term: obj.term[0]._ });
                }
                catch (e) { }
            }
        }
        catch (e) { }
        if (this.category.length > 1)
            this.category.shift();
        //console.log("Category", this.category);
        try {
            for (var _d = 0, _e = this.data.lido.descriptiveMetadata[0].objectClassificationWrap[0].objectWorkTypeWrap; _d < _e.length; _d++) {
                var obj = _e[_d];
                try {
                    if (obj.objectWorkType[0].conceptID[0]._ != undefined && obj.objectWorkType[0].term[0] != undefined)
                        this.objectWorkType.push({ conceptID: obj.objectWorkType[0].conceptID[0]._, term: obj.objectWorkType[0].term[0] });
                }
                catch (e) { }
            }
        }
        catch (e) { }
        if (this.objectWorkType.length > 1)
            this.objectWorkType.shift();
        //console.log("ObjectWorkType", this.objectWorkType);
        try {
            for (var _f = 0, _g = this.data.lido.descriptiveMetadata[0].objectClassificationWrap[0].classificationWrap; _f < _g.length; _f++) {
                var obj = _g[_f];
                try {
                    if (obj.classification[0].$.type != undefined && obj.classification[0].term[0] != undefined)
                        this.classification.push({ type: obj.classification[0].$.type, term: obj.classification[0].term[0] });
                }
                catch (e) { }
            }
        }
        catch (e) { }
        if (this.classification.length > 1)
            this.classification.shift();
        //console.log("Classification", this.classification);
        try {
            if ((this.title = this.data.lido.descriptiveMetadata[0].objectIdentificationWrap[0].titleWrap[0].titleSet[0].appellationValue[0]) == undefined)
                this.title = '';
            if (typeof this.title == "object" && !(this.title = this.data.lido.descriptiveMetadata[0].objectIdentificationWrap[0].titleWrap[0].titleSet[0].appellationValue[0]._))
                this.title = '';
        }
        catch (e) { }
        //console.log("Title", this.title);
        try {
            for (var _h = 0, _j = this.data.lido.descriptiveMetadata[0].objectIdentificationWrap[0].inscriptionsWrap[0].inscriptions; _h < _j.length; _h++) {
                var obj = _j[_h];
                x = { type: '', transcription: '', descriptionNote: '', descriptionID: '' };
                try {
                    if (obj.$.type != undefined)
                        x.type = obj.$.type;
                }
                catch (e) { }
                try {
                    if (obj.inscriptionTranscription[0] != undefined)
                        x.transcription = obj.inscriptionTranscription[0];
                }
                catch (e) { }
                try {
                    if (obj.inscriptionDescription[0].descriptiveNoteValue != undefined)
                        x.descriptionNote = obj.inscriptionDescription[0].descriptiveNoteValue;
                }
                catch (e) { }
                try {
                    if (obj.inscriptionDescription[0].descriptiveID != undefined)
                        x.descriptionID = obj.inscriptionDescription[0].descriptiveID;
                }
                catch (e) { }
                this.inscriptions.push(x);
            }
        }
        catch (e) { }
        if (this.inscriptions.length > 1)
            this.inscriptions.shift();
        //console.log("Inscriptions", this.inscriptions);
        try {
            for (var _k = 0, _l = this.data.lido.descriptiveMetadata[0].objectIdentificationWrap[0].repositoryWrap; _k < _l.length; _k++) {
                var obj = _l[_k];
                x = { legalBodyID: '', legalBodyName: '', legalBodyWeblink: '', locationName: '', position: '' };
                try {
                    if (obj.repositorySet[0].repositoryName[0].legalBodyID[0]._ != undefined)
                        x.legalBodyID = obj.repositorySet[0].repositoryName[0].legalBodyID[0]._;
                }
                catch (e) { }
                try {
                    if (obj.repositorySet[0].repositoryName[0].legalBodyName[0].appellationValue[0] != undefined)
                        x.legalBodyName = obj.repositorySet[0].repositoryName[0].legalBodyName[0].appellationValue[0];
                }
                catch (e) { }
                try {
                    if (obj.repositorySet[0].repositoryName[0].legalBodyWeblink[0] != undefined)
                        x.legalBodyWeblink = obj.repositorySet[0].repositoryName[0].legalBodyWeblink[0];
                }
                catch (e) { }
                try {
                    if (obj.repositorySet[0].repositoryLocation[0].namePlaceSet[0].appellationValue[0] != undefined)
                        x.locationName = obj.repositorySet[0].repositoryLocation[0].namePlaceSet[0].appellationValue[0];
                }
                catch (e) { }
                try {
                    if (obj.repositorySet[0].repositoryLocation[0].gml[0].Point[0].pos[0] != undefined)
                        x.position = obj.repositorySet[0].repositoryLocation[0].gml[0].Point[0].pos[0];
                }
                catch (e) {
                    console.log("e4", e);
                }
                this.repository.push(x);
            }
        }
        catch (e) {
        }
        if (this.repository.length > 1)
            this.repository.shift();
        //console.log("Repository", this.repository);
        try {
            if ((this.state = this.data.lido.descriptiveMetadata[0].displayStateEditionWrap[0].displayState[0]) == undefined)
                this.state = '';
        }
        catch (e) {
        }
        try {
            if ((this.edition = this.data.lido.descriptiveMetadata[0].displayStateEditionWrap[0].displayEdition[0]) == undefined)
                this.edition = '';
        }
        catch (e) {
        }
        try {
            for (var _m = 0, _o = this.data.lido.descriptiveMetadata[0].objectIdentificationWrap[0].objectDescriptionWrap[0].objectDescriptionSet; _m < _o.length; _m++) {
                var obj = _o[_m];
                x = { type: '', description: '' };
                try {
                    if (obj.$.type != undefined)
                        x.type = obj.$.type;
                }
                catch (e) { }
                try {
                    if (obj.descriptiveNoteValue[0] != undefined)
                        x.description = obj.descriptiveNoteValue[0];
                }
                catch (e) { }
                this.description.push(x);
            }
        }
        catch (e) { }
        if (this.description.length > 1)
            this.description.shift();
        //console.log("Description", this.description);
        try {
            for (var _p = 0, _q = this.data.lido.descriptiveMetadata[0].objectIdentificationWrap[0].objectMeasurementsWrap[0].objectMeasurementsSet; _p < _q.length; _p++) {
                var obj = _q[_p];
                x = { display: '', measure: [] };
                try {
                    if (obj.displayObjectMeasurements[0] != undefined)
                        x.display = obj.displayObjectMeasurements[0];
                }
                catch (e) { }
                try {
                    if (obj.objectMeasurements[0] != undefined) {
                        x.measure = LidoMeasuringObject.loadData(obj.objectMeasurements[0], 'de');
                    }
                }
                catch (e) { }
                this.measurements.push(x);
            }
        }
        catch (e) { }
        if (this.measurements.length > 1)
            this.measurements.shift();
        //console.log("Measurements", this.measurements);
        try {
            for (var _r = 0, _s = this.data.lido.descriptiveMetadata[0].eventWrap[0].eventSet; _r < _s.length; _r++) {
                var obj = _s[_r];
                x = { display: '', conceptID: '', object: null };
                try {
                    if (obj.event[0] != undefined) {
                        x.object = LidoEventObject.loadData(LidoEventObject.compactify(obj.event[0]));
                        x.conceptID = x.object.conceptID;
                    }
                }
                catch (e) {
                }
                try {
                    if (obj.displayEvent[0] != undefined)
                        x.display = obj.displayEvent[0];
                }
                catch (e) {
                }
                this.events.push(x);
            }
        }
        catch (e) {
        }
        if (this.events.length > 1)
            this.events.shift();
        //console.log("Events", this.events);
        try {
            for (var _t = 0, _u = this.data.lido.descriptiveMetadata[0].objectRelationWrap[0].subjectWrap[0].subjectSet; _t < _u.length; _t++) {
                var obj = _u[_t];
                var x_1 = { display: '', conceptID: '', term: '' };
                try {
                    if (obj.displaySubject[0] != undefined)
                        x_1.display = obj.displaySubject[0];
                }
                catch (e) {
                }
                try {
                    if (obj.subject[0].subjectConcept[0].conceptID[0] != undefined)
                        x_1.conceptID = obj.subject[0].subjectConcept[0].conceptID[0];
                }
                catch (e) {
                }
                try {
                    if (obj.subject[0].subjectConcept[0].term[0] != undefined)
                        x_1.term = obj.subject[0].subjectConcept[0].term[0];
                }
                catch (e) {
                }
                this.subjectRelations.push(x_1);
            }
        }
        catch (e) {
        }
        if (this.subjectRelations.length > 1)
            this.subjectRelations.shift();
        //console.log("Subject", this.subjectRelations);
        try {
            for (var _v = 0, _w = this.data.lido.descriptiveMetadata[0].objectRelationWrap[0].relatedWorksWrap[0].relatedWorkSet; _v < _w.length; _v++) {
                var obj = _w[_v];
                var x_2 = { display: '', reltypeID: '', reltypeTerm: '', id: '', note: '', webresouce: '' };
                try {
                    if (obj.relatedWork[0].displayObject[0] != undefined)
                        x_2.display = obj.relatedWork[0].displayObject[0];
                }
                catch (e) {
                }
                try {
                    if (obj.relatedWork[0].object[0].objectWebResource[0]._ != undefined)
                        x_2.webresouce = obj.relatedWork[0].object[0].objectWebResource[0]._;
                    else if (obj.relatedWork[0].object[0].objectWebResource[0] != undefined)
                        x_2.webresouce = obj.relatedWork[0].object[0].objectWebResource[0];
                }
                catch (e) {
                }
                try {
                    if (obj.relatedWork[0].object[0].objectID[0]._ != undefined)
                        x_2.id = obj.relatedWork[0].object[0].objectID[0]._;
                    else if (obj.relatedWork[0].object[0].objectID[0] != undefined)
                        x_2.id = obj.relatedWork[0].object[0].objectID[0];
                }
                catch (e) {
                }
                try {
                    if (obj.relatedWork[0].object[0].objectNote[0]._ != undefined)
                        x_2.note = obj.relatedWork[0].object[0].objectNote[0]._;
                    else if (obj.relatedWork[0].object[0].objectNote[0] != undefined)
                        x_2.note = obj.relatedWork[0].object[0].objectNote[0];
                }
                catch (e) {
                }
                try {
                    if (obj.relatedWorkRelType[0].conceptID[0]._ != undefined)
                        x_2.reltypeID = obj.relatedWorkRelType[0].conceptID[0]._;
                    else if (obj.relatedWorkRelType[0].conceptID[0] != undefined)
                        x_2.reltypeID = obj.relatedWorkRelType[0].conceptID[0];
                }
                catch (e) {
                }
                try {
                    if (obj.relatedWorkRelType[0].term[0]._ != undefined)
                        x_2.reltypeTerm = obj.relatedWorkRelType[0].term[0]._;
                    else if (obj.relatedWorkRelType[0].term[0] != undefined)
                        x_2.reltypeTerm = obj.relatedWorkRelType[0].term[0];
                }
                catch (e) {
                }
                this.relatedWorks.push(x_2);
            }
        }
        catch (e) {
        }
        if (this.relatedWorks.length > 1)
            this.relatedWorks.shift();
        //console.log("Related", this.relatedWorks);
    };
    return LidoObject;
}());
export { LidoObject };
var LidoMeasuringObject = /** @class */ (function () {
    function LidoMeasuringObject() {
        this.language = "";
        this.type = "";
        this.unit = "";
        this.value = "";
        this.extend = "";
        this.qualifier = "";
        this.format = "";
        this.shape = "";
        this.scale = "";
    }
    LidoMeasuringObject.loadData = function (dataset, language) {
        var obj = new LidoMeasuringObject();
        obj.language = language;
        var second = new LidoMeasuringObject();
        var tmp = null;
        try {
            if ((tmp = dataset.measurementsSet[0].measurementType) != undefined) {
                for (var _i = 0, tmp_1 = tmp; _i < tmp_1.length; _i++) {
                    var type = tmp_1[_i];
                    try {
                        if (type.$ == undefined || type.$['xml:lang'] == undefined)
                            obj.type = type;
                        else {
                            if (second.language == type.$['xml:lang'] || second.language == '') {
                                second.type = type._;
                                second.language = type.$['xml:lang'];
                            }
                        }
                    }
                    catch (e) { }
                }
            }
        }
        catch (e) { }
        try {
            if ((tmp = dataset.measurementsSet[0].measurementUnit) != undefined) {
                for (var _a = 0, tmp_2 = tmp; _a < tmp_2.length; _a++) {
                    var unit = tmp_2[_a];
                    try {
                        if (unit.$ == undefined || unit.$['xml:lang'] == undefined)
                            obj.unit = unit;
                        else {
                            if (second.language == unit.$['xml:lang'] || second.language == '') {
                                second.unit = unit._;
                                second.language = unit.$['xml:lang'];
                            }
                        }
                    }
                    catch (e) { }
                }
            }
        }
        catch (e) { }
        try {
            if ((tmp = dataset.measurementsSet[0].measurementValue) != undefined) {
                for (var _b = 0, tmp_3 = tmp; _b < tmp_3.length; _b++) {
                    var value = tmp_3[_b];
                    try {
                        if (value.$ == undefined || value.$['xml:lang'] == undefined)
                            obj.value = value;
                        else {
                            if (second.language == value.$['xml:lang'] || second.language == '') {
                                second.value = value._;
                                second.language = value.$['xml:lang'];
                            }
                        }
                    }
                    catch (e) {
                    }
                }
            }
        }
        catch (e) {
        }
        try {
            if (dataset.measurementsSet[0].extendMeasurements[0] != undefined)
                obj.extend = dataset.measurementsSet[0].extendMeasurements[0];
        }
        catch (e) {
        }
        try {
            if (dataset.measurementsSet[0].qualifierMeasurements[0] != undefined)
                obj.qualifier = dataset.measurementsSet[0].qualifierMeasurements[0];
        }
        catch (e) {
        }
        try {
            if (dataset.measurementsSet[0].formatMeasurements[0] != undefined)
                obj.format = dataset.measurementsSet[0].formatMeasurements[0];
        }
        catch (e) {
        }
        try {
            if (dataset.measurementsSet[0].shapeMeasurements[0] != undefined)
                obj.shape = dataset.measurementsSet[0].shapeMeasurements[0];
        }
        catch (e) {
        }
        try {
            if (dataset.measurementsSet[0].scaleMeasurements[0] != undefined)
                obj.scale = dataset.measurementsSet[0].scaleMeasurements[0];
        }
        catch (e) {
        }
        return [obj, second];
    };
    return LidoMeasuringObject;
}());
export { LidoMeasuringObject };
var LidoEventObject = /** @class */ (function () {
    function LidoEventObject() {
        this.conceptID = "";
        this.eventID = "";
        this.eventTerm = "";
        this.roleInEvent_ID = "";
        this.roleInEvent_term = "";
        this.eventName = "";
        this.eventActor = [{ displayActor: "", actorInRole: { actorID: "", actorName: "", actorNationality: "", actorVitalDates: "", actorGender: "", actorRoleID: "", actorRoleName: "" }, extend: "", attribution: "" }];
        this.cultureID = "";
        this.cultureTerm = "";
        this.eventDateDisplay = "";
        this.eventDateEarlies = "";
        this.eventDateLatest = "";
        this.periodID = "";
        this.periodTerm = "";
        this.placeDisplay = "";
        this.placeName = "";
        this.placePoint = "";
        this.placeClassificationID = "";
        this.placeClassificationName = "";
        this.methodID = "";
        this.methodName = "";
        this.materials = [{ display: "", conceptID: "", term: "", extend: "" }];
        this.thingPresent = [{ display: "", webresource: "", id: "", note: "" }];
        // NOTE:  NOT SUPPORTED, POSSIBILITY OF INFINITE LOOPS
        this.relatedEvent = [];
        this.description = [];
    }
    LidoEventObject.loadData = function (dataset) {
        var obj = new LidoEventObject();
        try {
            if (dataset.eventID[0] != undefined)
                obj.eventID = dataset.eventID[0];
        }
        catch (e) {
        }
        try {
            if (dataset.eventType[0].conceptID[0] != undefined)
                obj.conceptID = dataset.eventType[0].conceptID[0];
        }
        catch (e) {
        }
        try {
            for (var _i = 0, _a = dataset.eventType[0].term; _i < _a.length; _i++) {
                var tmp = _a[_i];
                if (tmp.$ == undefined || tmp.$['xml:lang'] == undefined)
                    obj.eventTerm = tmp;
            }
        }
        catch (e) { }
        try {
            if (dataset.roleInEvent[0].conceptID[0] != undefined)
                obj.roleInEvent_ID = dataset.roleInEvent[0].conceptID[0];
        }
        catch (e) {
        }
        try {
            if (dataset.roleInEvent[0].term[0] != undefined)
                obj.roleInEvent_term = dataset.roleInEvent[0].term[0];
        }
        catch (e) {
        }
        try {
            if (dataset.eventName[0].appellationValue[0] != undefined)
                obj.eventName = dataset.eventName[0].appellationValue[0];
        }
        catch (e) {
        }
        try {
            for (var _b = 0, _c = dataset.eventActor; _b < _c.length; _b++) {
                var tmp = _c[_b];
                var x = { displayActor: '',
                    actorInRole: {
                        actorID: '',
                        actorName: '',
                        actorNationality: '',
                        actorVitalDates: '',
                        actorGender: '',
                        actorRoleID: '',
                        actorRoleName: ''
                    },
                    extend: '',
                    attribution: ''
                };
                try {
                    if (tmp.displayActorInRole[0] != undefined)
                        x.displayActor = tmp.displayActorInRole[0];
                }
                catch (e) {
                }
                try {
                    if (tmp.actorInRole[0].actor[0].actorID[0] != undefined)
                        x.actorInRole.actorID = tmp.actorInRole[0].actor[0].actorID[0];
                }
                catch (e) {
                }
                try {
                    if (tmp.actorInRole[0].actor[0].nameActorSet[0].appellationValue[0] != undefined)
                        x.actorInRole.actorName = tmp.actorInRole[0].actor[0].nameActorSet[0].appellationValue[0];
                }
                catch (e) {
                }
                try {
                    if (tmp.actorInRole[0].actor[0].nationalityActor[0].term[0] != undefined)
                        x.actorInRole.actorNationality = tmp.actorInRole[0].actor[0].nationalityActor[0].term[0];
                }
                catch (e) {
                }
                try {
                    if (tmp.actorInRole[0].actor[0].genderActor[0] != undefined)
                        x.actorInRole.actorGender = tmp.actorInRole[0].actor[0].genderActor[0];
                }
                catch (e) {
                }
                try {
                    if (tmp.actorInRole[0].actor[0].vitalDatesActor[0] != undefined)
                        x.actorInRole.actorVitalDates = tmp.actorInRole[0].actor[0].vitalDatesActor[0];
                }
                catch (e) {
                }
                try {
                    if (tmp.actorInRole[0].roleActor[0].conceptID[0] != undefined)
                        x.actorInRole.actorRoleID = tmp.actorInRole[0].roleActor[0].conceptID[0];
                }
                catch (e) {
                }
                try {
                    if (tmp.actorInRole[0].roleActor[0].term[0] != undefined)
                        x.actorInRole.actorRoleName = tmp.actorRole[0].roleActor[0].term[0];
                }
                catch (e) {
                }
                try {
                    if (tmp.extentActor[0] != undefined)
                        x.extend = tmp.extentActor[0];
                }
                catch (e) {
                }
                try {
                    if (tmp.attributionQualifierActor[0] != undefined)
                        x.attribution = tmp.attributionQualifierActor[0];
                }
                catch (e) {
                }
                obj.eventActor.push(x);
            }
        }
        catch (e) {
        }
        if (obj.eventActor.length > 1)
            obj.eventActor.shift();
        try {
            if (dataset.culture[0].conceptID[0] != undefined)
                obj.cultureID = dataset.culture[0].conceptID[0];
        }
        catch (e) {
        }
        try {
            if (dataset.culture[0].term[0] != undefined)
                obj.cultureTerm = dataset.culture[0].term[0];
        }
        catch (e) {
        }
        try {
            if (dataset.eventDate[0].displayDate[0] != undefined)
                obj.eventDateDisplay = dataset.eventDate[0].displayDate[0];
        }
        catch (e) {
        }
        try {
            if (dataset.date[0].earliestDate[0] != undefined)
                obj.eventDateEarlies = dataset.date[0].earliestDate[0];
        }
        catch (e) {
        }
        try {
            if (dataset.date[0].latestDate[0] != undefined)
                obj.eventDateLatest = dataset.date[0].latestDate[0];
        }
        catch (e) {
        }
        try {
            if (dataset.periodName[0].conceptID[0] != undefined)
                obj.periodID = dataset.periodName[0].conceptID[0];
        }
        catch (e) {
        }
        try {
            if (dataset.periodName[0].term[0] != undefined)
                obj.periodTerm = dataset.periodName[0].term[0];
        }
        catch (e) {
        }
        try {
            if (dataset.eventPlace[0].displayPlace[0] != undefined)
                obj.placeDisplay = dataset.eventPlace[0].displayPlace[0];
        }
        catch (e) {
        }
        try {
            if (dataset.eventPlace[0].place[0].namePlaceSet[0].appellationValue[0] != undefined)
                obj.placeName = dataset.eventPlace[0].place[0].namePlaceSet[0].appellationValue[0];
        }
        catch (e) {
        }
        try {
            if (dataset.eventPlace[0].placeClassification[0].conceptID[0] != undefined)
                obj.placeClassificationID = dataset.eventPlace[0].placeClassification[0].conceptID[0];
        }
        catch (e) {
        }
        try {
            if (dataset.eventPlace[0].placeClassification[0].term[0] != undefined)
                obj.placeClassificationName = dataset.eventPlace[0].placeClassification[0].term[0];
        }
        catch (e) {
        }
        try {
            if (dataset.eventPlace[0].gml[0].Point[0].pos[0] != undefined)
                obj.placePoint = dataset.eventPlace[0].gml[0].Point[0].pos[0];
        }
        catch (e) {
        }
        try {
            if (dataset.eventMethod[0].conceptID[0] != undefined)
                obj.methodID = dataset.eventMethod[0].conceptID[0];
        }
        catch (e) {
        }
        try {
            if (dataset.eventMethod[0].term[0] != undefined)
                obj.methodName = dataset.eventMethod[0].term[0];
        }
        catch (e) {
        }
        try {
            for (var _d = 0, _e = dataset.eventMaterialsTech; _d < _e.length; _d++) {
                var tmp = _e[_d];
                var x = { display: '', conceptID: '', term: '', extend: '' };
                try {
                    if (tmp.displayMaterialsTech[0] != undefined)
                        x.display = tmp.displayMaterialsTech[0];
                }
                catch (e) {
                }
                try {
                    if (tmp.materialsTech[0].termMaterialsTech[0].conceptID[0] != undefined)
                        x.conceptID = tmp.materialsTech[0].termMaterialsTech[0].conceptID[0];
                }
                catch (e) {
                }
                try {
                    if (tmp.materialsTech[0].termMaterialsTech[0].term[0] != undefined)
                        x.term = tmp.materialsTech[0].termMaterialsTech[0].term[0];
                }
                catch (e) {
                }
                try {
                    if (tmp.materialsTech[0].extentMaterialsTech[0] != undefined)
                        x.extend = tmp.materialsTech[0].extentMaterialsTech[0];
                }
                catch (e) {
                }
                obj.materials.push(x);
            }
        }
        catch (e) {
        }
        if (obj.materials.length > 1)
            obj.materials.shift();
        try {
            for (var _f = 0, _g = dataset.thingPresent; _f < _g.length; _f++) {
                var tmp = _g[_f];
                var x = { display: '', webresource: '', id: '', note: '' };
                try {
                    if (tmp.displayObject[0] != undefined)
                        x.display = tmp.displayObject[0];
                }
                catch (e) {
                }
                try {
                    if (tmp.object[0].objectWebResource[0] != undefined)
                        x.webresource = tmp.object[0].objectWebResource[0];
                }
                catch (e) {
                }
                try {
                    if (tmp.object[0].objectID[0] != undefined)
                        x.id = tmp.object[0].objectID[0];
                }
                catch (e) {
                }
                try {
                    if (tmp.object[0].objectNote[0] != undefined)
                        x.note = tmp.object[0].objectNote[0];
                }
                catch (e) {
                }
                obj.thingPresent.push(x);
            }
        }
        catch (e) {
        }
        if (obj.thingPresent.length > 1)
            obj.thingPresent.shift();
        try {
            for (var _h = 0, _j = dataset.eventDescriptionSet; _h < _j.length; _h++) {
                var tmp = _j[_h];
                try {
                    if (tmp.descriptiveNoteValue[0] != undefined)
                        obj.description.push(tmp.descriptiveNoteValue[0]);
                }
                catch (e) {
                }
            }
        }
        catch (e) {
        }
        if (obj.description.length > 1)
            obj.description.shift();
        return obj;
    };
    LidoEventObject.compactify = function (dataset) {
        var keys = Object.keys(dataset);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (typeof dataset[key] === 'object') {
                if (!Array.isArray(dataset[key])) {
                    dataset[key] = [dataset[key]];
                }
                for (var i = 0; i < dataset[key].length; i++) {
                    if (dataset[key][i].hasOwnProperty("_")) {
                        dataset[key][i] = dataset[key][i]["_"];
                    }
                    if (typeof dataset[key][i] === 'object')
                        dataset[key][i] = this.compactify(dataset[key][i]);
                }
            }
        }
        return dataset;
    };
    return LidoEventObject;
}());
export { LidoEventObject };
//# sourceMappingURL=LidoObjectOLD.js.map