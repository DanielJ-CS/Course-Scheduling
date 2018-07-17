"use strict";
var Util_1 = require("../src/Util");
var InsightFacade_1 = require("../src/controller/InsightFacade");
var Joi = require('joi');
var fs = require('fs');
var lodash = require('lodash');
var chai_1 = require('chai');
describe("Query Service", function () {
    var insightFacade;
    before(function () {
        return new Promise(function (fulfill, reject) {
            Util_1.default.test("QueryService::before() - loading dataset from zip");
            insightFacade = new InsightFacade_1.default();
            new Promise(function (fulfill, reject) {
                fs.readFile("./310courses.1.0.zip", function (err, data) {
                    if (err) {
                        Util_1.default.error("QueryService::before() - error reading zip " + JSON.stringify(err));
                        reject();
                    }
                    var zipContent = data.toString('base64');
                    insightFacade.addDataset('courses', zipContent).then(function (result) {
                        if (result.code == 201 || result.code == 204) {
                            Util_1.default.test("QueryService::before() - added dataset");
                            fulfill();
                        }
                        else {
                            Util_1.default.error("QueryService::before() - ERROR: " + JSON.stringify(result));
                            reject();
                        }
                    }).catch(function (result) {
                        Util_1.default.error("QueryService::before() - ERROR: " + JSON.stringify(result));
                        reject();
                    });
                });
            }).then(function (res) {
                fs.readFile("./310rooms.1.1.zip", function (err, data) {
                    if (err) {
                        Util_1.default.error("QueryService::before() - error reading zip " + JSON.stringify(err));
                        reject();
                    }
                    var zipContent = data.toString('base64');
                    insightFacade.addDataset('rooms', zipContent).then(function (result) {
                        if (result.code == 201 || result.code == 204) {
                            Util_1.default.test("QueryService::before() - added dataset");
                            fulfill();
                        }
                        else {
                            Util_1.default.error("QueryService::before() - ERROR: " + JSON.stringify(result));
                            reject();
                        }
                    }).catch(function (result) {
                        Util_1.default.error("QueryService::before() - ERROR: " + JSON.stringify(result));
                        reject();
                    });
                });
            }).catch(function (err) {
                reject(err);
            });
        });
    });
    beforeEach(function (done) {
        done();
    });
    afterEach(function (done) {
        done();
    });
    var file = fs.readFileSync("./test/queries.json");
    var tests = JSON.parse(file);
    for (var _i = 0, tests_1 = tests; _i < tests_1.length; _i++) {
        var ttt = tests_1[_i];
        var testRunner = function (test) {
            var types = getJSONTypes(JSON.parse(test["expected-json-types"]));
            var expectedResult = generateResultJSON(test["expected-json"]);
            it(test["title"], function () {
                return insightFacade.performQuery((test['query'])).then(function (result) {
                    chai_1.assert(test['expected-status'] == result.code, 'successful query: expect ' + test['expected-status'] + ' but got code ' + result.code);
                    chai_1.assert(test['expected-status'] < 400, 'expects 2xx code when promise fulfilled in IInsightFacade.performQuery()');
                    Joi.assert(result.body, types);
                    var json = result.body;
                    chai_1.expect(typeof json.result).not.to.equal('undefined');
                    var a = lodash.countBy(json["result"], JSON.stringify);
                    var b = lodash.countBy(expectedResult["result"], JSON.stringify);
                    var c = lodash.isEqual(a, b);
                    if (!c) {
                        Util_1.default.test("Expected:");
                        console.log(expectedResult["result"]);
                        Util_1.default.test("Received:");
                        console.log(json["result"]);
                        var zcnt = 1;
                        for (var z in b) {
                            if (a[z] != b[z]) {
                                console.log("Failure case " + zcnt + ": " + z);
                                console.log("Expected = " + b[z] + ", actual = " + a[z]);
                                zcnt++;
                                if (zcnt == 50) {
                                    break;
                                }
                            }
                        }
                        zcnt = 1;
                        for (var z in a) {
                            if (a[z] != b[z]) {
                                console.log("Failure case " + zcnt + ": " + z);
                                console.log("Expected = " + b[z] + ", actual = " + a[z]);
                                zcnt++;
                                if (zcnt == 50) {
                                    break;
                                }
                            }
                        }
                    }
                    chai_1.assert(c, 'results do not contain the same entries');
                    chai_1.expect(typeof json.render).not.to.equal('undefined');
                    chai_1.assert(lodash.isEqual(json["render"], expectedResult["render"]), 'render should be ' + expectedResult['render'] + ' but got ' + json['render']);
                    var order = test["query"]["ORDER"];
                    if (order != undefined) {
                        if (typeof order === 'string') {
                            var previous = -1;
                            var previousEntry = {};
                            for (var _i = 0, _a = json["result"]; _i < _a.length; _i++) {
                                var entry = _a[_i];
                                var current = entry[order];
                                chai_1.assert.isAtMost(previous, current, JSON.stringify(entry) + " should appear before " + JSON.stringify(previousEntry));
                                previous = current;
                                previousEntry = entry;
                            }
                        }
                        else {
                            var previous = {};
                            var previousEntry = {};
                            for (var z = 0; z < json["result"].length; z++) {
                                var entry = json["result"][z];
                                var current = {};
                                for (var _b = 0, _c = order.keys; _b < _c.length; _b++) {
                                    var k = _c[_b];
                                    current[k] = entry[k];
                                }
                                if (z > 0) {
                                    var comp = 0;
                                    for (var _d = 0, _e = order["keys"]; _d < _e.length; _d++) {
                                        var k = _e[_d];
                                        if (previous[k] < current[k]) {
                                            comp = -1;
                                            break;
                                        }
                                        else if (previous[k] > current[k]) {
                                            comp = 1;
                                            break;
                                        }
                                    }
                                    if (order["dir"] == 'UP') {
                                        chai_1.assert.isAtMost(comp, 0, JSON.stringify(entry) + " should appear before " + JSON.stringify(previousEntry));
                                    }
                                    else {
                                        chai_1.assert.isAtLeast(comp, 0, JSON.stringify(entry) + " should appear before " + JSON.stringify(previousEntry));
                                    }
                                }
                                previous = current;
                                previousEntry = entry;
                            }
                        }
                    }
                }).catch(function (result) {
                    if (result.code) {
                        Util_1.default.test('Got failure response: ');
                        console.log(JSON.stringify(result));
                        chai_1.assert(test['expected-status'] == result.code, 'failed query: expect ' + test['expected-status'] + ' but got code ' + result.code);
                        chai_1.assert(test['expected-status'] >= 400, 'expects 4xx code when promise rejected in IInsightFacade.performQuery()');
                        Joi.assert(result.body, types);
                    }
                    else {
                        throw result;
                    }
                });
            });
        };
        testRunner(ttt);
    }
    function getJSONTypes(json) {
        var types = {};
        for (var key in json) {
            var t = json[key];
            types[key] = eval(t);
        }
        return types;
    }
    function generateResultJSON(query) {
        var file = fs.readFileSync("./test/results/" + query);
        return JSON.parse(file);
    }
    it('Should not be able to submit an empty query', function () {
        var query = {};
        return insightFacade.performQuery(query).then(function (result) {
            chai_1.assert(false, 'query should not succeed');
        }).catch(function (result) {
            chai_1.assert(result.code == 400, 'expects 400 error');
        });
    });
    it('All underscore keys in GET must be in GROUP', function () {
        var query = {
            "GET": ["courses_id", "courses_uuid", "courseAverage"],
            "WHERE": { "IS": { "courses_dept": "cpsc" } },
            "GROUP": ["courses_id"],
            "APPLY": [{ "courseAverage": { "AVG": "courses_avg" } }],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
            "AS": "TABLE"
        };
        return insightFacade.performQuery(query).then(function (result) {
            chai_1.assert(false, 'query should not succeed');
        }).catch(function (result) {
            chai_1.assert(result.code == 400, 'expects 400 error');
        });
    });
    it('All extra keys in GET must be in APPLY', function () {
        var query = {
            "GET": ["courses_id", "abcde", "courseAverage"],
            "WHERE": { "IS": { "courses_dept": "cpsc" } },
            "GROUP": ["courses_id"],
            "APPLY": [{ "courseAverage": { "AVG": "courses_avg" } }],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
            "AS": "TABLE"
        };
        return insightFacade.performQuery(query).then(function (result) {
            chai_1.assert(false, 'query should not succeed');
        }).catch(function (result) {
            chai_1.assert(result.code == 400, 'expects 400 error');
        });
    });
    it('APPLY rules must be unique per extra key', function () {
        var query = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": { "IS": { "courses_dept": "cpsc" } },
            "GROUP": ["courses_id"],
            "APPLY": [{ "courseAverage": { "AVG": "courses_avg" } }, { "courseAverage": { "AVG": "courses_avg" } }],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
            "AS": "TABLE"
        };
        return insightFacade.performQuery(query).then(function (result) {
            chai_1.assert(false, 'query should not succeed');
        }).catch(function (result) {
            chai_1.assert(result.code == 400, 'expects 400 error');
        });
    });
    it('if key is in GROUP key must not be in APPLY', function () {
        var query = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": { "IS": { "courses_dept": "cpsc" } },
            "GROUP": ["courses_id"],
            "APPLY": [{ "courseAverage": { "AVG": "courses_id" } }],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
            "AS": "TABLE"
        };
        return insightFacade.performQuery(query).then(function (result) {
            chai_1.assert(false, 'query should not succeed');
        }).catch(function (result) {
            chai_1.assert(result.code == 400, 'expects 400 error');
        });
    });
    it('if key is in APPLY, key must not be in GROUP', function () {
        var query = {
            "GET": ["courses_id", "courses_avg", "courseAverage"],
            "WHERE": { "IS": { "courses_dept": "cpsc" } },
            "GROUP": ["courses_id"],
            "APPLY": [{ "courseAverage": { "AVG": "courses_avg" } }],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
            "AS": "TABLE"
        };
        return insightFacade.performQuery(query).then(function (result) {
            chai_1.assert(false, 'query should not succeed');
        }).catch(function (result) {
            chai_1.assert(result.code == 400, 'expects 400 error');
        });
    });
    it('no duplicate key in GROUP', function () {
        var query = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": { "IS": { "courses_dept": "cpsc" } },
            "GROUP": ["courses_id", "courses_id"],
            "APPLY": [{ "courseAverage": { "AVG": "courses_avg" } }],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
            "AS": "TABLE"
        };
        return insightFacade.performQuery(query).then(function (result) {
            chai_1.assert(false, 'query should not succeed');
        }).catch(function (result) {
            chai_1.assert(result.code == 400, 'expects 400 error');
        });
    });
    it('GROUP key not in GET is allowed', function () {
        var query = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": {},
            "GROUP": ["courses_id", "courses_dept"],
            "APPLY": [{ "courseAverage": { "AVG": "courses_avg" } }],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"] },
            "AS": "TABLE"
        };
        return insightFacade.performQuery(query).then(function (result) {
            chai_1.assert(result.code == 200, 'expects 200 success');
        }).catch(function (result) {
            chai_1.assert(false, 'query should not fail');
        });
    });
});
//# sourceMappingURL=ServerQuerySpec.js.map