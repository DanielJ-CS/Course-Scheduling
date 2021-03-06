"use strict";
var DatasetController_1 = require("../src/controller/DatasetController");
var QueryController_1 = require("../src/controller/QueryController");
var Util_1 = require("../src/Util");
var QueryController_2 = require("../src/controller/QueryController");
var chai_1 = require('chai');
describe("QueryController", function () {
    beforeEach(function () {
    });
    afterEach(function () {
    });
    var datasetCont = new DatasetController_1.default;
    var dataset = { "courses": [{ courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 86.17,
                courses_instructor: 'smulders, dave',
                courses_title: 'teach adult',
                courses_pass: 23,
                courses_fail: 0,
                courses_audit: 0,
                courses_uuid: 234 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 84.52,
                courses_instructor: 'smulders, dave',
                courses_title: 'teach adult',
                courses_pass: 27,
                courses_fail: 0,
                courses_audit: 0,
                courses_uuid: 235 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 84,
                courses_instructor: 'walker, judith',
                courses_title: 'teach adult',
                courses_pass: 21,
                courses_fail: 0,
                courses_audit: 0,
                courses_uuid: 236 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 84.9,
                courses_instructor: '',
                courses_title: 'teach adult',
                courses_pass: 71,
                courses_fail: 0,
                courses_audit: 0,
                courses_uuid: 237 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 86.65,
                courses_instructor: 'smulders, dave',
                courses_title: 'teach adult',
                courses_pass: 23,
                courses_fail: 0,
                courses_audit: 0,
                courses_uuid: 15001 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 85.6,
                courses_instructor: 'smulders, dave',
                courses_title: 'teach adult',
                courses_pass: 20,
                courses_fail: 0,
                courses_audit: 0,
                courses_uuid: 15002 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 86.16,
                courses_instructor: '',
                courses_title: 'teach adult',
                courses_pass: 43,
                courses_fail: 0,
                courses_audit: 0,
                courses_uuid: 15003 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 85.81,
                courses_instructor: 'smulders, dave',
                courses_title: 'teach adult',
                courses_pass: 21,
                courses_fail: 0,
                courses_audit: 0,
                courses_uuid: 25636 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 85.81,
                courses_instructor: '',
                courses_title: 'teach adult',
                courses_pass: 21,
                courses_fail: 0,
                courses_audit: 0,
                courses_uuid: 25637 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 84.14,
                courses_instructor: 'crisfield, erin',
                courses_title: 'teach adult',
                courses_pass: 21,
                courses_fail: 0,
                courses_audit: 0,
                courses_uuid: 28431 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 79.19,
                courses_instructor: 'crisfield, erin',
                courses_title: 'teach adult',
                courses_pass: 19,
                courses_fail: 2,
                courses_audit: 0,
                courses_uuid: 28432 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 81.67,
                courses_instructor: '',
                courses_title: 'teach adult',
                courses_pass: 40,
                courses_fail: 2,
                courses_audit: 0,
                courses_uuid: 28433 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 78.41,
                courses_instructor: 'palacios, carolina',
                courses_title: 'teach adult',
                courses_pass: 32,
                courses_fail: 0,
                courses_audit: 0,
                courses_uuid: 39616 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 79.47,
                courses_instructor: 'smulders, dave',
                courses_title: 'teach adult',
                courses_pass: 34,
                courses_fail: 0,
                courses_audit: 0,
                courses_uuid: 39617 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 81.45,
                courses_instructor: 'smulders, dave',
                courses_title: 'teach adult',
                courses_pass: 31,
                courses_fail: 0,
                courses_audit: 0,
                courses_uuid: 39618 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 76.59,
                courses_instructor: 'palacios, carolina',
                courses_title: 'teach adult',
                courses_pass: 31,
                courses_fail: 1,
                courses_audit: 0,
                courses_uuid: 39619 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 88.23,
                courses_instructor: 'regmi, kapil',
                courses_title: 'teach adult',
                courses_pass: 31,
                courses_fail: 0,
                courses_audit: 0,
                courses_uuid: 39620 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 80.76,
                courses_instructor: '',
                courses_title: 'teach adult',
                courses_pass: 159,
                courses_fail: 1,
                courses_audit: 0,
                courses_uuid: 39621 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 84.3,
                courses_instructor: 'walker, judith',
                courses_title: 'teach adult',
                courses_pass: 30,
                courses_fail: 0,
                courses_audit: 0,
                courses_uuid: 43244 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 83.41,
                courses_instructor: 'smulders, dave',
                courses_title: 'teach adult',
                courses_pass: 32,
                courses_fail: 0,
                courses_audit: 0,
                courses_uuid: 43245 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 81.45,
                courses_instructor: 'smulders, dave',
                courses_title: 'teach adult',
                courses_pass: 33,
                courses_fail: 0,
                courses_audit: 0,
                courses_uuid: 43246 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 85.04,
                courses_instructor: 'walker, judith',
                courses_title: 'teach adult',
                courses_pass: 28,
                courses_fail: 0,
                courses_audit: 0,
                courses_uuid: 43247 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 83.47,
                courses_instructor: '',
                courses_title: 'teach adult',
                courses_pass: 123,
                courses_fail: 0,
                courses_audit: 0,
                courses_uuid: 43248 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 83.57,
                courses_instructor: 'smulders, dave',
                courses_title: 'teach adult',
                courses_pass: 21,
                courses_fail: 0,
                courses_audit: 0,
                courses_uuid: 54921 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 86.59,
                courses_instructor: 'walker, judith',
                courses_title: 'teach adult',
                courses_pass: 22,
                courses_fail: 0,
                courses_audit: 0,
                courses_uuid: 54922 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 85.12,
                courses_instructor: '',
                courses_title: 'teach adult',
                courses_pass: 43,
                courses_fail: 0,
                courses_audit: 0,
                courses_uuid: 54923 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 83.71,
                courses_instructor: 'walker, judith',
                courses_title: 'teach adult',
                courses_pass: 24,
                courses_fail: 0,
                courses_audit: 0,
                courses_uuid: 56420 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 81.89,
                courses_instructor: 'smulders, dave',
                courses_title: 'teach adult',
                courses_pass: 27,
                courses_fail: 1,
                courses_audit: 0,
                courses_uuid: 56421 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 81.62,
                courses_instructor: 'smulders, dave',
                courses_title: 'teach adult',
                courses_pass: 28,
                courses_fail: 1,
                courses_audit: 0,
                courses_uuid: 56422 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 83.83,
                courses_instructor: 'walker, judith',
                courses_title: 'teach adult',
                courses_pass: 29,
                courses_fail: 0,
                courses_audit: 0,
                courses_uuid: 56423 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 82.73,
                courses_instructor: '',
                courses_title: 'teach adult',
                courses_pass: 108,
                courses_fail: 2,
                courses_audit: 0,
                courses_uuid: 56424 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 78.21,
                courses_instructor: 'smulders, dave',
                courses_title: 'teach adult',
                courses_pass: 22,
                courses_fail: 2,
                courses_audit: 0,
                courses_uuid: 58367 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 76.63,
                courses_instructor: 'walker, judith',
                courses_title: 'teach adult',
                courses_pass: 22,
                courses_fail: 2,
                courses_audit: 0,
                courses_uuid: 58368 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 77.42,
                courses_instructor: '',
                courses_title: 'teach adult',
                courses_pass: 44,
                courses_fail: 4,
                courses_audit: 0,
                courses_uuid: 58369 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 84.87,
                courses_instructor: 'smulders, dave',
                courses_title: 'teach adult',
                courses_pass: 23,
                courses_fail: 0,
                courses_audit: 0,
                courses_uuid: 66428 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 83.07,
                courses_instructor: 'walker, judith',
                courses_title: 'teach adult',
                courses_pass: 27,
                courses_fail: 0,
                courses_audit: 0,
                courses_uuid: 66429 },
            { courses_dept: 'adhe',
                courses_id: '327',
                courses_avg: 83.9,
                courses_instructor: '',
                courses_title: 'teach adult',
                courses_pass: 50,
                courses_fail: 0,
                courses_audit: 0,
                courses_uuid: 66430 },
            { courses_dept: 'adhe',
                courses_id: '328',
                courses_avg: 78.91,
                courses_instructor: 'chan, jennifer',
                courses_title: 'inst adul educ',
                courses_pass: 32,
                courses_fail: 0,
                courses_audit: 0,
                courses_uuid: 39622 },
            { courses_dept: 'adhe',
                courses_id: '328',
                courses_avg: 78.91,
                courses_instructor: '',
                courses_title: 'inst adul educ',
                courses_pass: 32,
                courses_fail: 0,
                courses_audit: 0,
                courses_uuid: 39623 },
            { courses_dept: 'adhe',
                courses_id: '329',
                courses_avg: 84.57,
                courses_instructor: 'smulders, dave',
                courses_title: 'dev wkshp/sem',
                courses_pass: 20,
                courses_fail: 1,
                courses_audit: 0,
                courses_uuid: 238 },
            { courses_dept: 'adhe',
                courses_id: '329',
                courses_avg: 82.78,
                courses_instructor: 'smulders, dave',
                courses_title: 'dev wkshp/sem',
                courses_pass: 27,
                courses_fail: 0,
                courses_audit: 0,
                courses_uuid: 239 }] };
    it('Should return a StringFilter parsed object', function () {
        var whereObject = { "IS": { "courses_dept": "cpsc" } };
        var filter = QueryController_2.Filter.parse('', whereObject);
        Util_1.default.test('Parsed filter: ' + JSON.stringify(filter));
        chai_1.expect(filter.column).to.equal('courses_dept');
        chai_1.expect(filter['pattern']).to.equal("cpsc");
        var row1 = { courses_dept: 'adhe' };
        var row2 = { courses_dept: 'cpsc' };
        var row3 = { courses_dept: 1234 };
        chai_1.assert(filter.test(row1) === false, 'should return false for adhe == cpsc');
        chai_1.assert(filter.test(row2) === true, 'should return true for cpsc == cpsc');
        chai_1.assert(filter.test(row3) === false, 'should return false for 1234 == cpsc');
    });
    it('Should return a NumberFilter::GT parsed object', function () {
        var whereObject = { "GT": { "courses_avg": 90 } };
        var filter = QueryController_2.Filter.parse('', whereObject);
        Util_1.default.test('Parsed filter: ' + JSON.stringify(filter));
        chai_1.expect(filter.column).to.equal('courses_avg');
        chai_1.expect(filter['value']).to.equal(90);
        var row1 = { courses_avg: 89.99 };
        var row2 = { courses_avg: 90.00 };
        var row3 = { courses_avg: 90.01 };
        var row4 = { courses_avg: 'asdf' };
        chai_1.assert(filter.test(row1) === false, 'should return false for 89.99 > 90');
        chai_1.assert(filter.test(row2) === false, 'should return false for 90.00 > 90');
        chai_1.assert(filter.test(row3) === true, 'should return false for 90.01 > 90');
        chai_1.assert(filter.test(row4) === false, 'should return false for asdf > 90');
    });
    it('Should return a NumberFilter::EQ parsed object', function () {
        var whereObject = { "EQ": { "courses_avg": 90 } };
        var filter = QueryController_2.Filter.parse('', whereObject);
        Util_1.default.test('Parsed filter: ' + JSON.stringify(filter));
        chai_1.expect(filter.column).to.equal('courses_avg');
        chai_1.expect(filter['value']).to.equal(90);
        var row1 = { courses_avg: 89.99 };
        var row2 = { courses_avg: 90.00 };
        var row3 = { courses_avg: 90.01 };
        var row4 = { courses_avg: 'asdf' };
        chai_1.assert(filter.test(row1) === false, 'should return false for 89.99 == 90');
        chai_1.assert(filter.test(row2) === true, 'should return true for 90.00 == 90');
        chai_1.assert(filter.test(row3) === false, 'should return false for 90.01 == 90');
        chai_1.assert(filter.test(row4) === false, 'should return false for asdf == 90');
    });
    it('Should return a NumberFilter::LT parsed object', function () {
        var whereObject = { "LT": { "courses_avg": 90 } };
        var filter = QueryController_2.Filter.parse('', whereObject);
        Util_1.default.test('Parsed filter: ' + JSON.stringify(filter));
        chai_1.expect(filter.column).to.equal('courses_avg');
        chai_1.expect(filter['value']).to.equal(90);
        var row1 = { courses_avg: 89.99 };
        var row2 = { courses_avg: 90.00 };
        var row3 = { courses_avg: 90.01 };
        var row4 = { courses_avg: 'asdf' };
        chai_1.assert(filter.test(row1) === true, 'should return true for 89.99 < 90');
        chai_1.assert(filter.test(row2) === false, 'should return false for 90.00 < 90');
        chai_1.assert(filter.test(row3) === false, 'should return false for 90.01 < 90');
        chai_1.assert(filter.test(row4) === false, 'should return false for asdf < 90');
    });
    it('Should return a LogicFilter::AND parsed object', function () {
        var whereObject = {
            "AND": [
                { "GT": { "courses_avg": 70 } },
                { "IS": { "courses_dept": "cpsc" } }]
        };
        var filter = QueryController_2.Filter.parse('', whereObject);
        Util_1.default.test('Parsed filter: ' + JSON.stringify(filter));
        chai_1.expect(filter['children'][0]['column']).to.equal('courses_avg');
        chai_1.expect(filter['children'][0]['value']).to.equal(70);
        chai_1.expect(filter['children'][1]['column']).to.equal('courses_dept');
        chai_1.expect(filter['children'][1]['pattern']).to.equal('cpsc');
        var row1 = { courses_avg: 58, courses_dept: "adhe" };
        var row2 = { courses_avg: 71, courses_dept: "adhe" };
        var row3 = { courses_avg: 58, courses_dept: "cpsc" };
        var row4 = { courses_avg: 72, courses_dept: "cpsc" };
        var row5 = { courses_avg: 'asdf', courses_dept: "asdf" };
        chai_1.assert(filter.test(row1) === false, 'should return false because 58 > 70 and adhe == cpsc are not both true');
        chai_1.assert(filter.test(row2) === false, 'should return false because 71 > 70 and adhe == cpsc are not both true');
        chai_1.assert(filter.test(row3) === false, 'should return false because 58 > 70 and cpsc == cpsc are not both true');
        chai_1.assert(filter.test(row4) === true, 'should return true because 71 > 70 and cpsc == cpsc are both true');
        chai_1.assert(filter.test(row5) === false, 'should return false because asdf > 70 and asdf == cpsc are not both true');
    });
    it('Should return a StringFilter::OR parsed object', function () {
        var whereObject = {
            "OR": [
                { "GT": { "courses_avg": 70 } },
                { "IS": { "courses_dept": "cpsc" } }]
        };
        var filter = QueryController_2.Filter.parse('', whereObject);
        Util_1.default.test('Parsed filter: ' + JSON.stringify(filter));
        chai_1.expect(filter['children'][0]['column']).to.equal('courses_avg');
        chai_1.expect(filter['children'][0]['value']).to.equal(70);
        chai_1.expect(filter['children'][1]['column']).to.equal('courses_dept');
        chai_1.expect(filter['children'][1]['pattern']).to.equal('cpsc');
        var row1 = { courses_avg: 58, courses_dept: "adhe" };
        var row2 = { courses_avg: 71, courses_dept: "adhe" };
        var row3 = { courses_avg: 58, courses_dept: "cpsc" };
        var row4 = { courses_avg: 72, courses_dept: "cpsc" };
        var row5 = { courses_avg: 'asdf', courses_dept: "asdf" };
        chai_1.assert(filter.test(row1) === false, 'should return false because 58 > 70 and adhe == cpsc are both false');
        chai_1.assert(filter.test(row2) === true, 'should return true because 71 > 70 and adhe == cpsc are not both false');
        chai_1.assert(filter.test(row3) === true, 'should return true because 58 > 70 and cpsc == cpsc are not both false');
        chai_1.assert(filter.test(row4) === true, 'should return true because 72 > 70 and cpsc == cpsc are not both false');
        chai_1.assert(filter.test(row5) === false, 'should return false because asdf > 70 and asdf == cpsc are both false');
    });
    it('Should return a NegationFilter parsed object', function () {
        var whereObject = { "NOT": { "LT": { "courses_avg": 90 } } };
        var filter = QueryController_2.Filter.parse('', whereObject);
        Util_1.default.test('Parsed filter: ' + JSON.stringify(filter));
        chai_1.expect(filter['child']['column']).to.equal('courses_avg');
        chai_1.expect(filter['child']['value']).to.equal(90);
        var row1 = { courses_avg: 89.99 };
        var row2 = { courses_avg: 90.00 };
        var row3 = { courses_avg: 90.01 };
        var row4 = { courses_avg: 'asdf' };
        chai_1.assert(filter.test(row1) === false, 'should return false for !(89.99 < 90)');
        chai_1.assert(filter.test(row2) === true, 'should return true for !(90.00 < 90)');
        chai_1.assert(filter.test(row3) === true, 'should return true for !(90.01 < 90)');
        chai_1.assert(filter.test(row4) === true, 'should return true for !(asdf < 90)');
    });
    it('Should return error for null WHERE Object', function () {
        var success = false;
        try {
            var whereObject = null;
            var filter = QueryController_2.Filter.parse('', whereObject);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'Filter.parse() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'Filter.parse() should not be successful');
    });
    it('Should return error for multiple keys in WHERE', function () {
        var success = false;
        try {
            var whereObject = { "IS": { "courses_dept": "cpsc" }, "NOT": { "courses_dept": "cpsc" } };
            var filter = QueryController_2.Filter.parse('', whereObject);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'Filter.parse() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'Filter.parse() should not be successful');
    });
    it('Should return error for unknown key in WHERE', function () {
        var success = false;
        try {
            var whereObject = { "HOW": { "courses_dept": "cpsc" } };
            var filter = QueryController_2.Filter.parse('', whereObject);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'Filter.parse() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'Filter.parse() should not be successful');
    });
    it('Should return error for undefined WHERE Object', function () {
        var success = false;
        try {
            var whereObject = undefined;
            var filter = QueryController_2.LogicFilter.parse('AND', whereObject);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'Filter.parse() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'Filter.parse() should not be successful');
    });
    it('LogicFilter should return error if not given array', function () {
        var success = false;
        try {
            var whereObject = { 'IS': { "courses_dept": "cpsc" } };
            var filter = QueryController_2.LogicFilter.parse('AND', whereObject);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'LogicFilter.parse() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'LogicFilter.parse() should not be successful');
    });
    it('LogicFilter should return error if given empty array', function () {
        var success = false;
        try {
            var whereObject = [];
            var filter = QueryController_2.LogicFilter.parse('AND', whereObject);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'LogicFilter.parse() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'LogicFilter.parse() should not be successful');
    });
    it('LogicFilter should return error for unknown key', function () {
        var success = false;
        try {
            var whereObject = [{ "GT": { "courses_avg": 70 } }];
            var filter = QueryController_2.LogicFilter.parse('XOR', whereObject);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'LogicFilter.parse() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'LogicFilter.parse() should not be successful');
    });
    it('Should return error if leaf filter has no key-value pairs', function () {
        var success = false;
        try {
            var whereObject = [{ "GT": {} }, { "IS": {} }];
            var filter = QueryController_2.LogicFilter.parse('AND', whereObject);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'LogicFilter.parse() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'LogicFilter.parse() should not be successful');
    });
    it('Should return error if LogicFilter.parse() given invalid key', function () {
        var success = false;
        try {
            var whereObject = [{ "GT": { "courses_avg": 70 } }, { "NOT": { "IS": { "courses_dept": "adhe" } } }];
            var filter = QueryController_2.LogicFilter.parse('notValid', whereObject);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'LogicFilter.parse() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'LogicFilter.parse() should not be successful');
    });
    it('NumberFilter:: Should return error for empty key', function () {
        var success = false;
        try {
            var whereObject = { "courses_avg": "90" };
            var filter = QueryController_2.NumberFilter.parse('', whereObject);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'LogicFilter.parse() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'LogicFilter.parse() should not be successful');
    });
    it('NumberFilter:: Should return error for undefined Object', function () {
        var success = false;
        try {
            var whereObject = null;
            var filter = QueryController_2.NumberFilter.parse('LT', whereObject);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'LogicFilter.parse() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'LogicFilter.parse() should not be successful');
    });
    it('NumberFilter:: Should return error for NaN', function () {
        var success = false;
        try {
            var whereObject = { "courses_avg": "abc" };
            var filter = QueryController_2.NumberFilter.parse('LT', whereObject);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'NumberFilter.parse() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'NumberFilter.parse() should not be successful');
    });
    it('NumberFilter:: Should return error for having more than one key', function () {
        var success = false;
        try {
            var whereObject = { "courses_avg": 90, "courses_audit": 10 };
            var filter = QueryController_2.NumberFilter.parse('LT', whereObject);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'NumberFilter.parse() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'NumberFilter.parse() should not be successful');
    });
    it('NumberFilter:: Should return error for undefined value', function () {
        var success = false;
        try {
            var whereObject = { "courses_avg": undefined };
            var filter = QueryController_2.NumberFilter.parse('LT', whereObject);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'NumberFilter.parse() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'NumberFilter.parse() should not be successful');
    });
    it('NumberFilter:: Should return error for unknown key', function () {
        var success = false;
        try {
            var whereObject = { "courses_avg": 90 };
            var filter = QueryController_2.NumberFilter.parse('unknownKey', whereObject);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'NumberFilter.parse() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'NumberFilter.parse() should not be successful');
    });
    it('StringFilter:: Should return error for undefined Object', function () {
        var success = false;
        try {
            var whereObject = null;
            var filter = QueryController_2.StringFilter.parse('LT', whereObject);
        }
        catch (err) {
            chai_1.assert(err, 'StringFilter.parse() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'NumberFilter.parse() should not be successful');
    });
    it('StringFilter:: Should return error for more than one key', function () {
        var success = false;
        try {
            var whereObject = { "courses_dept": "cpsc", "courses_avg": "90" };
            var filter = QueryController_2.StringFilter.parse('IS', whereObject);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'StringFilter.parse() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'StringFilter.parse() should not be successful');
    });
    it('StringFilter:: Should return error if no key-value pair given', function () {
        var success = false;
        try {
            var whereObject = {};
            var filter = QueryController_2.StringFilter.parse('IS', whereObject);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'StringFilter.parse() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'StringFilter.parse() should not be successful');
    });
    it('StringFilter:: Should return error for unknown key', function () {
        var success = false;
        try {
            var whereObject = { "courses_key": "" };
            var filter = QueryController_2.StringFilter.parse('NO', whereObject);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'StringFilter.parse() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'StringFilter.parse() should not be successful');
    });
    it('NegationFilter:: Should return error for null', function () {
        var success = false;
        try {
            var whereObject = null;
            var filter = QueryController_2.NegationFilter.parse('NOT', whereObject);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'NegationFilter.parse() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'NegationFilter.parse() should not be successful');
    });
    it('NegationFilter:: Should return error for unknown key', function () {
        var success = false;
        try {
            var whereObject = { "courses_dept": "cpsc" };
            var filter = QueryController_2.NegationFilter.parse('WHO', whereObject);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'NegationFilter.parse() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'NegationFilter.parse() should not be successful');
    });
    it('QueryController::query.GET should be an array of string', function () {
        var success = false;
        var controller = new QueryController_1.default(dataset);
        success = false;
        try {
            var query = {
                "GET": [78, 99],
                "WHERE": { "IS": { "courses_dept": "cpsc" } },
                "GROUP": ["courses_id"],
                "APPLY": [{ "courseAverage": { "AVG": "courses_avg" } }],
                "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
                "AS": "TABLE"
            };
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
        success = false;
        try {
            var query = {
                "GET": 'notArray',
                "WHERE": { "IS": { "courses_dept": "cpsc" } },
                "GROUP": ["courses_id"],
                "APPLY": [{ "courseAverage": { "AVG": "courses_avg" } }],
                "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
                "AS": "TABLE"
            };
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
    });
    it('QueryController::query.ORDER should be string or object and have key(s) in GET', function () {
        var success = false;
        var controller = new QueryController_1.default(dataset);
        success = false;
        try {
            var query = {
                "GET": ["courses_id"],
                "WHERE": { "IS": { "courses_dept": "cpsc" } },
                "ORDER": 'courses_audit',
                "AS": "TABLE"
            };
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
        success = false;
        try {
            var query = {
                "GET": ["courses_id", "courseAverage"],
                "WHERE": { "IS": { "courses_dept": "cpsc" } },
                "GROUP": ["courses_id"],
                "APPLY": [{ "courseAverage": { "AVG": "courses_avg" } }],
                "ORDER": { "dir": "UP", "keys": ["notInGET", "courses_id"] },
                "AS": "TABLE"
            };
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
        success = false;
        try {
            var query = {
                "GET": ["courses_id", "courseAverage"],
                "WHERE": { "IS": { "courses_dept": "cpsc" } },
                "GROUP": ["courses_id"],
                "APPLY": [{ "courseAverage": { "AVG": "courses_avg" } }],
                "ORDER": 98,
                "AS": "TABLE"
            };
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
    });
    it('QueryController::GROUP should be array not object', function () {
        var success = false;
        var controller = new QueryController_1.default(dataset);
        try {
            var query = {
                "GET": ["courses_id", "courses_dept", "courseAverage"],
                "WHERE": { "IS": { "courses_dept": "cpsc" } },
                "GROUP": { 'GROUP': 768 },
                "APPLY": [{ "courseAverage": { "AVG": "courses_avg" } }],
                "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
                "AS": "TABLE"
            };
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
    });
    it('QueryController::GROUP array should not be empty', function () {
        var success = false;
        var controller = new QueryController_1.default(dataset);
        try {
            var query = {
                "GET": ["courses_id", "courseAverage"],
                "WHERE": { "IS": { "courses_dept": "cpsc" } },
                "GROUP": [],
                "APPLY": [{ "courseAverage": { "AVG": "courses_avg" } }],
                "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
                "AS": "TABLE"
            };
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
    });
    it('QueryController::GROUP should be array of string not array of object', function () {
        var success = false;
        var controller = new QueryController_1.default(dataset);
        try {
            var query = {
                "GET": ["courses_id", "courseAverage"],
                "WHERE": { "IS": { "courses_dept": "cpsc" } },
                "GROUP": [{ "okay": 789 }],
                "APPLY": [{ "courseAverage": { "AVG": "courses_avg" } }],
                "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
                "AS": "TABLE"
            };
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
    });
    it('QueryController:: GROUP should be array of string not array of number', function () {
        var success = false;
        var controller = new QueryController_1.default(dataset);
        var query = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": { "IS": { "courses_dept": "cpsc" } },
            "GROUP": [76, 77],
            "APPLY": [{ "courseAverage": { "AVG": "courses_avg" } }],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
            "AS": "TABLE" };
        try {
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
    });
    it('QueryController::GET keys should be in GROUP or APPLY', function () {
        var success = false;
        var controller = new QueryController_1.default(dataset);
        try {
            var query = {
                "GET": ["courses_id", "courseAverage"],
                "WHERE": { "IS": { "courses_dept": "cpsc" } },
                "GROUP": ["courses_audit"],
                "APPLY": [{ "courseAverage": { "AVG": "courses_avg" } }],
                "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
                "AS": "TABLE"
            };
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
    });
    it('QueryController::APPLY should be array not object', function () {
        var success = false;
        try {
            var controller = new QueryController_1.default(dataset);
            var query = {
                "GET": ["courses_id", "courseAverage"],
                "WHERE": { "IS": { "courses_dept": "cpsc" } },
                "GROUP": ["courses_id"],
                "APPLY": {},
                "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
                "AS": "TABLE"
            };
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
    });
    it('QueryController:: APPLY should be array not number', function () {
        var success = false;
        var controller = new QueryController_1.default(dataset);
        var query = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": { "IS": { "courses_dept": "cpsc" } },
            "GROUP": ["courses_id"],
            "APPLY": 76,
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
            "AS": "TABLE" };
        try {
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
    });
    it('QueryController::APPLY should be array of object not array of string', function () {
        var success = false;
        try {
            var controller = new QueryController_1.default(dataset);
            var query = {
                "GET": ["courses_id", "courseAverage"],
                "WHERE": { "IS": { "courses_dept": "cpsc" } },
                "GROUP": ["courses_id"],
                "APPLY": ['notObject'],
                "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
                "AS": "TABLE"
            };
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
    });
    it('QueryController:: APPLY should be array of object not array of number', function () {
        var success = false;
        var controller = new QueryController_1.default(dataset);
        var query = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": { "IS": { "courses_dept": "cpsc" } },
            "GROUP": ["courses_id"],
            "APPLY": [76, 88],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
            "AS": "TABLE" };
        try {
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
    });
    it('QueryController::GROUP and APPLY should be present if extra columns provided in GET', function () {
        var success = false;
        try {
            var controller = new QueryController_1.default(dataset);
            var query = {
                "GET": ["courses_id", "courseAverage"],
                "WHERE": { "IS": { "courses_dept": "cpsc" } },
                "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
                "AS": "TABLE"
            };
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
    });
    it('QueryController::APPLY should be present if GROUP is present', function () {
        var success = false;
        try {
            var controller = new QueryController_1.default(dataset);
            var query = {
                "GET": ["courses_id", "courseAverage"],
                "WHERE": { "IS": { "courses_dept": "cpsc" } },
                "GROUP": ["courses_id"],
                "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
                "AS": "TABLE"
            };
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
    });
    it('QueryController::GROUP should be present if APPLY is present', function () {
        var success = false;
        try {
            var controller = new QueryController_1.default(dataset);
            var query = {
                "GET": ["courses_id", "courseAverage"],
                "WHERE": { "IS": { "courses_dept": "cpsc" } },
                "APPLY": [{ "courseAverage": { "AVG": "courses_avg" } }],
                "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
                "AS": "TABLE"
            };
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
    });
    it('QueryController:: isValid expected to be false when null', function () {
        var query = null;
        chai_1.expect(QueryController_1.default.isValid(query)).to.be.false;
    });
    it('QueryController:: isValid expected to be true when not null', function () {
        var query = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": { "IS": { "courses_dept": "cpsc" } },
            "GROUP": ["courses_id"],
            "APPLY": [{ "courseAverage": { "AVG": "courses_avg" } }],
            "ORDER": { "dir": "UP", "keys": ["notInGET", "courses_id"] },
            "AS": "TABLE"
        };
        chai_1.expect(QueryController_1.default.isValid(query)).to.be.true;
    });
    it('QueryController:: ORDER keys should be array', function () {
        var success = false;
        var controller = new QueryController_1.default(dataset);
        var query = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": { "IS": { "courses_dept": "cpsc" } },
            "GROUP": ["courses_id"],
            "APPLY": [{ "courseAverage": { "AVG": "courses_avg" } }],
            "ORDER": { "dir": "UP", "keys": "notInGET" },
            "AS": "TABLE" };
        try {
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
    });
    it('QueryController:: ORDER keys array should not be empty', function () {
        var success = false;
        var controller = new QueryController_1.default(dataset);
        var query = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": { "IS": { "courses_dept": "cpsc" } },
            "GROUP": ["courses_id"],
            "APPLY": [{ "courseAverage": { "AVG": "courses_avg" } }],
            "ORDER": { "dir": "UP", "keys": [] },
            "AS": "TABLE" };
        try {
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
    });
    it('QueryController:: ORDER keys should be in GET', function () {
        var success = false;
        var controller = new QueryController_1.default(dataset);
        var query = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": { "IS": { "courses_dept": "cpsc" } },
            "GROUP": ["courses_id"],
            "APPLY": [{ "courseAverage": { "AVG": "courses_avg" } }],
            "ORDER": { "dir": "UP", "keys": ['asdf'] },
            "AS": "TABLE" };
        try {
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
    });
    it('QueryController:: ORDER keys should be array of string', function () {
        var success = false;
        var controller = new QueryController_1.default(dataset);
        var query = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": { "IS": { "courses_dept": "cpsc" } },
            "GROUP": ["courses_id"],
            "APPLY": [{ "courseAverage": { "AVG": "courses_avg" } }],
            "ORDER": { "dir": "UP", "keys": [123, 456] },
            "AS": "TABLE" };
        try {
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
    });
    it('QueryController:: ORDER direction should be UP or DOWN', function () {
        var success = false;
        var controller = new QueryController_1.default(dataset);
        var query = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": { "IS": { "courses_dept": "cpsc" } },
            "GROUP": ["courses_id"],
            "APPLY": [{ "courseAverage": { "AVG": "courses_avg" } }],
            "ORDER": { "dir": "asdf", "keys": ['courses_id'] },
            "AS": "TABLE" };
        try {
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
    });
    it('QueryController:: APPLY should not have duplicate key', function () {
        var success = false;
        var controller = new QueryController_1.default(dataset);
        var query = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": { "IS": { "courses_dept": "cpsc" } },
            "GROUP": ["courses_id"],
            "APPLY": [{ "courseAverage": { "AVG": "courses_avg" } }, { "courseAverage": { "AVG": "courses_avg" } }],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
            "AS": "TABLE" };
        try {
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
    });
    it('QueryController:: APPLY should not have duplicate key', function () {
        var success = false;
        var controller = new QueryController_1.default(dataset);
        var query = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": { "IS": { "courses_dept": "cpsc" } },
            "GROUP": ["courses_id"],
            "APPLY": [{ "courseAverage": { "AVG": "courses_avg" } }, { "courseAverage": { "MAX": "courses_avg" } }],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
            "AS": "TABLE" };
        try {
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
    });
    it('QueryController:: APPLY should be present if non-underscore key in GET', function () {
        var success = false;
        var controller = new QueryController_1.default(dataset);
        var query = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": { "IS": { "courses_dept": "cpsc" } },
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
            "AS": "TABLE" };
        try {
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
    });
    it('QueryController:: APPLY should be present if GROUP is present', function () {
        var success = false;
        var controller = new QueryController_1.default(dataset);
        var query = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": { "IS": { "courses_dept": "cpsc" } },
            "GROUP": ["courses_id"],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
            "AS": "TABLE" };
        try {
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
    });
    it('QueryController::APPLY should not be present without GROUP', function () {
        var success = false;
        var controller = new QueryController_1.default(dataset);
        var query = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": { "IS": { "courses_dept": "cpsc" } },
            "APPLY": [{ "courseAverage": { "AVG": "courses_avg" } }],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
            "AS": "TABLE" };
        try {
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
    });
    it('QueryController:: each object in APPLY must have exactly one key', function () {
        var success = false;
        var controller = new QueryController_1.default(dataset);
        var query = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": { "IS": { "coursesdept": "cpsc" } },
            "GROUP": ["courses_id"],
            "APPLY": [{ "courseAverage": { "AVG": "courses_avg" }, "courseBlah": { "AVG": "courses_id" } }],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
            "AS": "TABLE" };
        try {
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
    });
    it('QueryController:: each object in APPLY must have exactly one operation', function () {
        var success = false;
        var controller = new QueryController_1.default(dataset);
        var query = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": { "IS": { "courses_dept": "cpsc" } },
            "GROUP": ["courses_id"],
            "APPLY": [{ "courseAverage": { "AVG": "courses_avg", "MAX": "courses_audit" } }],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
            "AS": "TABLE" };
        try {
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
    });
    it('QueryController:: cannot apply MAX to string column', function () {
        var success = false;
        var controller = new QueryController_1.default(dataset);
        var query = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": { "IS": { "courses_dept": "cpsc" } },
            "GROUP": ["courses_id"],
            "APPLY": [{ "courseAverage": { "MAX": "courses_instructor" } }],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
            "AS": "TABLE" };
        try {
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
    });
    it('QueryController:: cannot apply operation that is not MAX/MIN/AVG/COUNT', function () {
        var success = false;
        var controller = new QueryController_1.default(dataset);
        var query = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": { "IS": { "courses_dept": "cpsc" } },
            "GROUP": ["courses_id"],
            "APPLY": [{ "courseAverage": { "LOL": "courses_uuid" } }],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
            "AS": "TABLE" };
        try {
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
    });
    it('QueryController:: WHERE clause must reference columns in dataset', function () {
        var success = false;
        var controller = new QueryController_1.default(dataset);
        var query = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": { "IS": { "abcde": "cpsc" } },
            "GROUP": ["courses_id"],
            "APPLY": [{ "courseAverage": { "AVG": "courses_avg" } }],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
            "AS": "TABLE" };
        try {
            controller.query(query);
            success = true;
        }
        catch (err) {
            chai_1.assert(err, 'QueryController::query() should throw error object');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.assert(!success, 'QueryController::query() should not be successful');
    });
    it('QueryController:: when dataset missing, should return 424 with list of missing dataset', function () {
        var controller = new QueryController_1.default({ 'test': [] });
        var query = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": { "IS": { "courses_dept": "cpsc" } },
            "GROUP": ["courses_id"],
            "APPLY": [{ "courseAverage": { "AVG": "courses_avg" } }],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
            "AS": "TABLE" };
        var result = undefined;
        try {
            result = controller.query(query);
        }
        catch (err) {
            chai_1.assert(false, 'QueryController::query() should not throw error');
            Util_1.default.test("Caught error: " + err.message);
        }
        chai_1.expect(result).to.deep.equal({ missing: ['courses'] });
    });
});
//# sourceMappingURL=QueryControllerSpec.js.map