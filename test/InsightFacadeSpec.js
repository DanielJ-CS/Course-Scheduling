"use strict";
var Util_1 = require('../src/Util');
var DatasetController_1 = require('../src/controller//DatasetController');
var chai_1 = require('chai');
var InsightFacade_1 = require("../src/controller/InsightFacade");
describe('InsightFacade', function () {
    beforeEach(function () {
    });
    afterEach(function () {
    });
    it("removeDataset::Should delete datasets", function () {
        var datasetController = new DatasetController_1.default();
        var insightFacade = new InsightFacade_1.default;
        Util_1.default.test('InsightFacade.removeDataset tests');
        chai_1.expect(insightFacade.removeDataset('courses')) != null;
    });
    it("addDataset::('InsightFacade::removeDataset(..) - ERROR: ' + err.message", function () {
        try {
            var datasetController = new DatasetController_1.default();
            var insightFacade = new InsightFacade_1.default;
            insightFacade.addDataset(null, null);
        }
        catch (reject) {
            chai_1.expect(reject);
        }
    });
    it("performQuery::('InsightFacade::performQuery(..) - ERROR: ' + err.message", function () {
        var query = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": { "IS": { "class_id": "cpsc" } },
            "GROUP": ["courses_id"],
            "APPLY": [{ "courseAverage": { "MAX": "courses_avg" } }],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
            "AS": "TABLE" };
        try {
            var insightFacade = new InsightFacade_1.default;
            insightFacade.performQuery(query);
        }
        catch (reject) {
            chai_1.expect(reject);
        }
    });
    it("PerformQuery()::Should reject with 400 error", function () {
        try {
            var insightFacade = new InsightFacade_1.default;
            insightFacade.removeDataset('class');
        }
        catch (reject) {
            chai_1.expect(reject);
        }
    });
    it("deleteDataset()::Should reject with 400 error", function () {
        try {
            var query = {
                "GET": ["courses_id", "courseAverage, 'errorCase"],
                "WHERE": { "IS": { "courses_dept": "cpsc" } },
                "GROUP": ["courses_id"],
                "APPLY": [{ "courseAverage": { "AVG": "courses_avg" } }],
                "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
                "AS": "TABLE"
            };
            var insightFacade = new InsightFacade_1.default;
            insightFacade.performQuery(query);
        }
        catch (reject) {
            chai_1.expect(reject);
        }
    });
    it("deleteDataset()::Should reject with 400 error", function () {
        try {
            var query = {
                "GET": ["courses_id", "courseAverage, 'courses_nonsense"],
                "WHERE": { "IS": { "courses_nothere": "cpsc" } },
                "GROUP": ["courses_id"],
                "APPLY": [{ "courseAverage": { "AVG": "courses_avg" } }],
                "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
                "AS": "TABLE"
            };
            var insightFacade = new InsightFacade_1.default;
            insightFacade.performQuery(query);
        }
        catch (reject) {
            chai_1.expect(reject);
        }
    });
    it("deleteDataset()::Should reject with 400 error", function () {
        try {
            var query = {
                "GET": ["courses_id", "courseAverage, 'courses_nonsense"],
                "WHERE": { "IS": { "courses_id": "cpsc" } },
                "GROUP": ["courses_id"],
                "APPLY": [{ "courseAverage": { "AVG": "courses_avg" } }],
                "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
                "AS": "TABLE"
            };
            var insightFacade = new InsightFacade_1.default;
            insightFacade.performQuery(query);
        }
        catch (reject) {
            chai_1.expect(reject);
        }
    });
});
//# sourceMappingURL=InsightFacadeSpec.js.map