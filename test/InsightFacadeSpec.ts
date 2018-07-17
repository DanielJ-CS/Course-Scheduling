/**
 * Created by Daniel on 2016-10-18.
 */
import Log from '../src/Util';
import {IInsightFacade, InsightResponse} from "../src/controller/IInsightFacade";
import RouteHandler from '../src/rest/RouteHandler';
import DatasetController from '../src/controller//DatasetController';
import QueryController from '../src/controller//QueryController';
import {QueryRequest} from "../src/controller//QueryController";

import {expect, assert} from 'chai';
import InsightFacade from "../src/controller/InsightFacade";
import {error} from "util";

describe('InsightFacade', function () {

    beforeEach(function () {
    });

    afterEach(function () {
    });

    it("removeDataset::Should delete datasets", function () {

        let datasetController = new DatasetController();
        let insightFacade = new InsightFacade;
        Log.test('InsightFacade.removeDataset tests');
        expect(insightFacade.removeDataset('courses')) != null;

    });

    it("addDataset::('InsightFacade::removeDataset(..) - ERROR: ' + err.message", function () {

        try {

            let datasetController = new DatasetController();
            let insightFacade = new InsightFacade;
            insightFacade.addDataset(null, null);

        } catch(reject) {

            expect(reject);
        }


    });

    it("performQuery::('InsightFacade::performQuery(..) - ERROR: ' + err.message", function () {


        let query: any = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": {"IS": {"class_id": "cpsc"}},
            "GROUP": ["courses_id"],
            "APPLY": [{"courseAverage":{"MAX": "courses_avg"}}],
            "ORDER": {"dir": "UP", "keys": ["courseAverage", "courses_id"]},
            "AS": "TABLE"};

        try {

            let insightFacade = new InsightFacade;
            insightFacade.performQuery(query);


        } catch(reject) {

            expect(reject);
        }


    });




    it("PerformQuery()::Should reject with 400 error", function () {

        try {

            let insightFacade:any = new InsightFacade;
            insightFacade.removeDataset('class');

        } catch (reject) {

            expect(reject);

        }
    });

    it("deleteDataset()::Should reject with 400 error", function () {
        try {

            let query: QueryRequest = {
                "GET": ["courses_id", "courseAverage, 'errorCase"],
                "WHERE": {"IS": {"courses_dept": "cpsc"}},
                "GROUP": ["courses_id"],
                "APPLY": [{"courseAverage": {"AVG": "courses_avg"}}],
                "ORDER": {"dir": "UP", "keys": ["courseAverage", "courses_id"]},
                "AS": "TABLE"
            }
            let insightFacade = new InsightFacade;
            insightFacade.performQuery(query);
        } catch(reject) {

            expect(reject);
        }
    });

    it("deleteDataset()::Should reject with 400 error", function () {

            try {
                let query: QueryRequest = {
                    "GET": ["courses_id", "courseAverage, 'courses_nonsense"],
                    "WHERE": {"IS": {"courses_nothere": "cpsc"}},
                    "GROUP": ["courses_id"],
                    "APPLY": [{"courseAverage": {"AVG": "courses_avg"}}],
                    "ORDER": {"dir": "UP", "keys": ["courseAverage", "courses_id"]},
                    "AS": "TABLE"
                }
                let insightFacade = new InsightFacade;
                insightFacade.performQuery(query);
            } catch(reject){
                expect(reject);
            }

    });

    it("deleteDataset()::Should reject with 400 error", function () {

        try {
            let query: QueryRequest = {
                "GET": ["courses_id", "courseAverage, 'courses_nonsense"],
                "WHERE": {"IS": {"courses_id": "cpsc"}},
                "GROUP": ["courses_id"],
                "APPLY": [{"courseAverage": {"AVG": "courses_avg"}}],
                "ORDER": {"dir": "UP", "keys": ["courseAverage", "courses_id"]},
                "AS": "TABLE"
            }
            let insightFacade = new InsightFacade;
            insightFacade.performQuery(query);
        } catch(reject){
            expect(reject);
        }

    });



});
