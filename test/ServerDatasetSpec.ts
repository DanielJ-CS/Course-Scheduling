/**
 * Created by rtholmes on 17-08-2016.
 */

import Log from "../src/Util";
import {IInsightFacade, InsightResponse} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";

import JSZip = require('jszip');
import {expect, assert} from 'chai';

describe("Dataset Service", function () {

    var insightFacade: IInsightFacade;

    beforeEach(function (done) {
        insightFacade = new InsightFacade();
        done();
    });

    afterEach(function (done) {
        done();
    });

    it('Should not be able to set a valid zip that does not contain a valid dataset', function() {
        var zipContent = 'UEsDBAoAAAAIAAEiJEm/nBg/EQAAAA8AAAALAAAAY29udGVudC5vYmqrVspOrVSyUipLzClNVaoFAFBLAQIUAAoAAAAIAAEiJEm/nBg/EQAAAA8AAAALAAAAAAAAAAAAAAAAAAAAAABjb250ZW50Lm9ialBLBQYAAAAAAQABADkAAAA6AAAAAAA=';

        return insightFacade.addDataset('courses', zipContent).then(function (result: InsightResponse) {
            assert(false, 'should get an error but got success: ' + JSON.stringify(result));
        }).catch(function (result: InsightResponse) {
            assert(result.code == 400, 'expect 400 error');
            assert(typeof (<any>result.body)['error'] == 'string', 'expect error field in body with error message string');
        });
    });

    it('Should not be able to set a dataset that is not a zip file', function() {
        var zipContent = 'adfadsfad';

        return insightFacade.addDataset('courses', zipContent).then(function (result: InsightResponse) {
            assert(false, 'should get an error but got success: ' + JSON.stringify(result));
        }).catch(function (result: InsightResponse) {
            assert(result.code == 400, 'expect 400 error');
            assert(typeof (<any>result.body)['error'] == 'string', 'expect error field in body with error message string');
        });
    });

});


