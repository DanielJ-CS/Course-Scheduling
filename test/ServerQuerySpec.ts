/**
 * Created by rtholmes on 17-08-2016.
 */

import Log from "../src/Util";
import {IInsightFacade, InsightResponse} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
import {QueryRequest} from "../src/controller/QueryController";

var Joi = require('joi');
var fs = require('fs');
var lodash = require('lodash');
import {expect, assert} from 'chai';

describe("Query Service", function () {

    var insightFacade: IInsightFacade;

    before(function () {
        return new Promise(function (fulfill, reject) {
            Log.test("QueryService::before() - loading dataset from zip");

            insightFacade = new InsightFacade();
            new Promise<boolean>(function (fulfill, reject) {
                fs.readFile("./310courses.1.0.zip", function (err: any, data: any) {
                    if (err) {
                        Log.error("QueryService::before() - error reading zip " + JSON.stringify(err));
                        reject();
                    }

                    let zipContent = data.toString('base64');
                    insightFacade.addDataset('courses', zipContent).then(function (result: InsightResponse) {
                        if (result.code == 201 || result.code == 204) {
                            Log.test("QueryService::before() - added dataset");
                            fulfill();

                        } else {
                            Log.error("QueryService::before() - ERROR: " + JSON.stringify(result));
                            reject();
                        }

                    }).catch(function (result: InsightResponse) {
                        Log.error("QueryService::before() - ERROR: " + JSON.stringify(result));
                        reject();

                    });
                });
            }).then(function (res) {
                fs.readFile("./310rooms.1.1.zip", function (err: any, data: any) {
                    if (err) {
                        Log.error("QueryService::before() - error reading zip " + JSON.stringify(err));
                        reject();
                    }

                    let zipContent = data.toString('base64');
                    insightFacade.addDataset('rooms', zipContent).then(function (result: InsightResponse) {
                        if (result.code == 201 || result.code == 204) {
                            Log.test("QueryService::before() - added dataset");
                            fulfill();

                        } else {
                            Log.error("QueryService::before() - ERROR: " + JSON.stringify(result));
                            reject();
                        }

                    }).catch(function (result: InsightResponse) {
                        Log.error("QueryService::before() - ERROR: " + JSON.stringify(result));
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
    for (let ttt of tests) {
        let testRunner = function (test: any) {
            let types = getJSONTypes(JSON.parse(test["expected-json-types"]));
            let expectedResult: any = generateResultJSON(test["expected-json"]);

            it(test["title"], function() {
                return insightFacade.performQuery(<QueryRequest>(test['query'])).then(function (result: InsightResponse) {
                    assert(test['expected-status'] == result.code, 'successful query: expect ' + test['expected-status'] + ' but got code ' + result.code);
                    assert(test['expected-status'] < 400, 'expects 2xx code when promise fulfilled in IInsightFacade.performQuery()');
                    Joi.assert(result.body, types);

                    // grab result body
                    let json: any = result.body;
                    expect(typeof json.result).not.to.equal('undefined');

                    // Generates a count of objects in the result and in the expected result
                    let a = lodash.countBy(json["result"], JSON.stringify);
                    let b = lodash.countBy(expectedResult["result"], JSON.stringify);

                    // Compares the two counts to check that the result is equal to the expected result
                    let c = lodash.isEqual(a, b);
                    if (!c) {
                        Log.test("Expected:");
                        console.log(expectedResult["result"]);
                        Log.test("Received:");
                        console.log(json["result"]);

                        let zcnt = 1;
                        for (let z in b) {
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
                        for (let z in a) {
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
                    assert(c, 'results do not contain the same entries');

                    // check the render field
                    expect(typeof json.render).not.to.equal('undefined');
                    assert(lodash.isEqual(json["render"], expectedResult["render"]), 'render should be ' + expectedResult['render'] + ' but got ' + json['render']);

                    // check ordering
                    let order: any = test["query"]["ORDER"];
                    if(order != undefined) {
                        if (typeof order === 'string') {
                            // test D1 ORDER semantics
                            let previous = -1;
                            let previousEntry = {}
                            for(let entry of json["result"]) {
                                let current = entry[order]
                                assert.isAtMost(previous, current, JSON.stringify(entry) + " should appear before " + JSON.stringify(previousEntry));
                                previous = current;
                                previousEntry = entry;
                            }

                        } else {
                            // test D2 ORDER semantics
                            let previous: any = {}
                            let previousEntry: any = {}
                            for(let z = 0; z < json["result"].length; z++) {
                                let entry: any = json["result"][z];
                                let current: any = {}
                                for (let k of order.keys) {
                                    current[k] = entry[k];
                                }
                                if (z > 0) {
                                    let comp = 0;
                                    for (let k of order["keys"]) {
                                        if (previous[k] < current[k]) {
                                            comp = -1;
                                            break;
                                        } else if (previous[k] > current[k]) {
                                            comp = 1;
                                            break;
                                        }
                                    }
                                    if (order["dir"] == 'UP') {
                                        assert.isAtMost(comp, 0, JSON.stringify(entry) + " should appear before " + JSON.stringify(previousEntry));
                                    } else {
                                        assert.isAtLeast(comp, 0, JSON.stringify(entry) + " should appear before " + JSON.stringify(previousEntry));
                                    }
                                }
                                previous = current;
                                previousEntry = entry;
                            }
                        }
                    }

                }).catch(function (result: any) {
                    if (result.code) {
                        Log.test('Got failure response: ');
                        console.log(JSON.stringify(result));

                        assert(test['expected-status'] == result.code, 'failed query: expect ' + test['expected-status'] + ' but got code ' + result.code);
                        assert(test['expected-status'] >= 400, 'expects 4xx code when promise rejected in IInsightFacade.performQuery()');
                        Joi.assert(result.body, types);

                    } else {
                        throw result;
                    }

                });
            });

        }
        testRunner(ttt);
    }

    function getJSONTypes(json: any): {} {
        let types: any = {};
        for (let key in json) {
            let t = json[key]
            types[key] = eval(t)
        }
        return types;

    }

    function generateResultJSON(query: any): {} {
        let file = fs.readFileSync("./test/results/" + query)
        return JSON.parse(file);
    }


    it('Should not be able to submit an empty query', function() {
        let query: QueryRequest = (<QueryRequest>{});
        return insightFacade.performQuery(query).then(function (result: InsightResponse) {
            assert(false, 'query should not succeed');
        }).catch(function (result: InsightResponse) {
            assert(result.code == 400, 'expects 400 error');
        });
    });


    it('All underscore keys in GET must be in GROUP', function() {
        let query: QueryRequest = {
            "GET": ["courses_id", "courses_uuid", "courseAverage"],
            "WHERE": {"IS": {"courses_dept": "cpsc"}} ,
            "GROUP": [ "courses_id" ],
            "APPLY": [ {"courseAverage": {"AVG": "courses_avg"}} ],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"]},
            "AS":"TABLE"
        };
        return insightFacade.performQuery(query).then(function (result: InsightResponse) {
            assert(false, 'query should not succeed');
        }).catch(function (result: InsightResponse) {
            assert(result.code == 400, 'expects 400 error');
        });
    });

    it('All extra keys in GET must be in APPLY', function() {
        let query: QueryRequest = {
            "GET": ["courses_id", "abcde", "courseAverage"],
            "WHERE": {"IS": {"courses_dept": "cpsc"}} ,
            "GROUP": [ "courses_id" ],
            "APPLY": [ {"courseAverage": {"AVG": "courses_avg"}} ],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"]},
            "AS":"TABLE"
        };
        return insightFacade.performQuery(query).then(function (result: InsightResponse) {
            assert(false, 'query should not succeed');
        }).catch(function (result: InsightResponse) {
            assert(result.code == 400, 'expects 400 error');
        });
    });

    it('APPLY rules must be unique per extra key', function() {
        let query: QueryRequest = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": {"IS": {"courses_dept": "cpsc"}} ,
            "GROUP": [ "courses_id" ],
            "APPLY": [ {"courseAverage": {"AVG": "courses_avg"}}, {"courseAverage": {"AVG": "courses_avg"}} ],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"]},
            "AS":"TABLE"
        };
        return insightFacade.performQuery(query).then(function (result: InsightResponse) {
            assert(false, 'query should not succeed');
        }).catch(function (result: InsightResponse) {
            assert(result.code == 400, 'expects 400 error');
        });
    });

    it('if key is in GROUP key must not be in APPLY', function() {
        let query: QueryRequest = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": {"IS": {"courses_dept": "cpsc"}} ,
            "GROUP": [ "courses_id" ],
            "APPLY": [ {"courseAverage": {"AVG": "courses_id"}} ],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"]},
            "AS":"TABLE"
        };
        return insightFacade.performQuery(query).then(function (result: InsightResponse) {
            assert(false, 'query should not succeed');
        }).catch(function (result: InsightResponse) {
            assert(result.code == 400, 'expects 400 error');
        });
    });

    it('if key is in APPLY, key must not be in GROUP', function() {
        let query: QueryRequest = {
            "GET": ["courses_id", "courses_avg", "courseAverage"],
            "WHERE": {"IS": {"courses_dept": "cpsc"}} ,
            "GROUP": [ "courses_id" ],
            "APPLY": [ {"courseAverage": {"AVG": "courses_avg"}} ],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"]},
            "AS":"TABLE"
        };
        return insightFacade.performQuery(query).then(function (result: InsightResponse) {
            assert(false, 'query should not succeed');
        }).catch(function (result: InsightResponse) {
            assert(result.code == 400, 'expects 400 error');
        });
    });

    it('no duplicate key in GROUP', function() {
        let query: QueryRequest = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": {"IS": {"courses_dept": "cpsc"}} ,
            "GROUP": [ "courses_id", "courses_id" ],
            "APPLY": [ {"courseAverage": {"AVG": "courses_avg"}} ],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"]},
            "AS":"TABLE"
        };
        return insightFacade.performQuery(query).then(function (result: InsightResponse) {
            assert(false, 'query should not succeed');
        }).catch(function (result: InsightResponse) {
            assert(result.code == 400, 'expects 400 error');
        });
    });

    it('GROUP key not in GET is allowed', function() {
        let query: QueryRequest = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": {} ,
            "GROUP": [ "courses_id", "courses_dept" ],
            "APPLY": [ {"courseAverage": {"AVG": "courses_avg"}} ],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"]},
            "AS":"TABLE"
        };
        return insightFacade.performQuery(query).then(function (result: InsightResponse) {
            assert(result.code == 200, 'expects 200 success');
        }).catch(function (result: InsightResponse) {
            assert(false, 'query should not fail');
        });
    });
});
