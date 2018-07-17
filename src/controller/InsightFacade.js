"use strict";
var Util_1 = require('../Util');
var DatasetController_1 = require('./DatasetController');
var QueryController_1 = require('../controller/QueryController');
var InsightFacade = (function () {
    function InsightFacade() {
    }
    InsightFacade.prototype.addDataset = function (id, content) {
        return new Promise(function (fulfill, reject) {
            InsightFacade.datasetController.process(id, content).then(function (resCode) {
                Util_1.default.trace('InsightFacade::addDataset(..) - processed with code ' + resCode);
                fulfill({ code: resCode, body: { success: resCode } });
            }).catch(function (err) {
                Util_1.default.trace('InsightFacade::addDataset(..) - ERROR: ' + err.message);
                reject({ code: 400, body: { error: err.message } });
            });
        });
    };
    InsightFacade.prototype.removeDataset = function (id) {
        return new Promise(function (fulfill, reject) {
            InsightFacade.datasetController.deleteDataset(id).then(function (resCode) {
                Util_1.default.trace('InsightFacade::removeDataset(..) - processed with code ' + resCode);
                fulfill({ code: resCode, body: { success: resCode } });
            }).catch(function (err) {
                Util_1.default.trace('InsightFacade::removeDataset(..) - ERROR: ' + err.message);
                reject({ code: 400, body: { error: err.message } });
            });
        });
    };
    InsightFacade.prototype.performQuery = function (query) {
        return new Promise(function (fulfill, reject) {
            InsightFacade.datasetController.getDatasets().then(function (datasets) {
                var controller = new QueryController_1.default(datasets);
                var result = controller.query(query);
                if ('missing' in result) {
                    Util_1.default.error('InsightFacade::performQuery(..) - ERROR: ' + JSON.stringify(result));
                    reject({ code: 424, body: result });
                }
                else {
                    fulfill({ code: 200, body: result });
                }
            }).catch(function (err) {
                Util_1.default.trace('InsightFacade::performQuery(..) - ERROR: ' + err.message);
                reject({ code: 400, body: { error: err.message } });
            });
        });
    };
    InsightFacade.datasetController = new DatasetController_1.default();
    return InsightFacade;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InsightFacade;
//# sourceMappingURL=InsightFacade.js.map