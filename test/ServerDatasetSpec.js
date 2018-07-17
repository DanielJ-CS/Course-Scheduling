"use strict";
var InsightFacade_1 = require("../src/controller/InsightFacade");
var chai_1 = require('chai');
describe("Dataset Service", function () {
    var insightFacade;
    beforeEach(function (done) {
        insightFacade = new InsightFacade_1.default();
        done();
    });
    afterEach(function (done) {
        done();
    });
    it('Should not be able to set a valid zip that does not contain a valid dataset', function () {
        var zipContent = 'UEsDBAoAAAAIAAEiJEm/nBg/EQAAAA8AAAALAAAAY29udGVudC5vYmqrVspOrVSyUipLzClNVaoFAFBLAQIUAAoAAAAIAAEiJEm/nBg/EQAAAA8AAAALAAAAAAAAAAAAAAAAAAAAAABjb250ZW50Lm9ialBLBQYAAAAAAQABADkAAAA6AAAAAAA=';
        return insightFacade.addDataset('courses', zipContent).then(function (result) {
            chai_1.assert(false, 'should get an error but got success: ' + JSON.stringify(result));
        }).catch(function (result) {
            chai_1.assert(result.code == 400, 'expect 400 error');
            chai_1.assert(typeof result.body['error'] == 'string', 'expect error field in body with error message string');
        });
    });
    it('Should not be able to set a dataset that is not a zip file', function () {
        var zipContent = 'adfadsfad';
        return insightFacade.addDataset('courses', zipContent).then(function (result) {
            chai_1.assert(false, 'should get an error but got success: ' + JSON.stringify(result));
        }).catch(function (result) {
            chai_1.assert(result.code == 400, 'expect 400 error');
            chai_1.assert(typeof result.body['error'] == 'string', 'expect error field in body with error message string');
        });
    });
});
//# sourceMappingURL=ServerDatasetSpec.js.map