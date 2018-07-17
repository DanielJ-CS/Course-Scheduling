"use strict";
var fs = require('fs');
var DatasetController_1 = require('../controller/DatasetController');
var QueryController_1 = require('../controller/QueryController');
var InsightFacade_1 = require("../controller/InsightFacade");
var Util_1 = require('../Util');
var RouteHandler = (function () {
    function RouteHandler() {
    }
    RouteHandler.getHomepage = function (req, res, next) {
        Util_1.default.trace('RoutHandler::getHomepage(..)');
        fs.readFile('./src/rest/views/index.html', 'utf8', function (err, file) {
            if (err) {
                res.send(500);
                Util_1.default.error(JSON.stringify(err));
                return next();
            }
            res.write(file);
            res.end();
            return next();
        });
    };
    RouteHandler.putDataset = function (req, res, next) {
        Util_1.default.trace('RouteHandler::postDataset(..) - params: ' + JSON.stringify(req.params));
        try {
            var id = req.params.id;
            var buffer_1 = [];
            req.on('data', function onRequestData(chunk) {
                Util_1.default.trace('RouteHandler::postDataset(..) on data; chunk length: ' + chunk.length);
                buffer_1.push(chunk);
            });
            req.once('end', function () {
                var concated = Buffer.concat(buffer_1);
                req.body = concated.toString('base64');
                Util_1.default.trace('RouteHandler::postDataset(..) on end; total length: ' + req.body.length);
                RouteHandler.insightFacade.addDataset(id, req.body).then(function (insightResponse) {
                    res.json(insightResponse.code, insightResponse.body);
                }).catch(function (err) {
                    res.json(err.code, err.body);
                });
            });
        }
        catch (err) {
            Util_1.default.error('RouteHandler::postDataset(..) - ERROR: ' + err.message);
            res.send(400, { error: err.message });
        }
        return next();
    };
    RouteHandler.deleteDataset = function (req, res, next) {
        Util_1.default.trace('RouteHandler::deleteDataset(..) - params: ' + JSON.stringify(req.params));
        try {
            var id = req.params.id;
            RouteHandler.insightFacade.removeDataset(id).then(function (insightResponse) {
                res.json(insightResponse.code, insightResponse.body);
            }).catch(function (err) {
                res.json(err.code, err.body);
            });
        }
        catch (err) {
            Util_1.default.error('RouteHandler::postDataset(..) - ERROR: ' + err.message);
            res.send(400, { error: err.message });
        }
        return next();
    };
    RouteHandler.postQuery = function (req, res, next) {
        Util_1.default.trace('RouteHandler::postQuery(..) - params: ' + JSON.stringify(req.params));
        try {
            var query = req.params;
            var isValid = QueryController_1.default.isValid(query);
            if (isValid === true) {
                RouteHandler.insightFacade.performQuery(query).then(function (insightResponse) {
                    res.json(insightResponse.code, insightResponse.body);
                }).catch(function (err) {
                    res.json(err.code, err.body);
                });
            }
            else {
                Util_1.default.error('RouteHandler::postQuery(..) - ERROR: invalid query');
                res.json(400, { error: 'invalid query' });
            }
        }
        catch (err) {
            Util_1.default.error('RouteHandler::postQuery(..) - ERROR: ' + err);
            res.send(400, { error: err.message });
        }
        return next();
    };
    RouteHandler.datasetController = new DatasetController_1.default();
    RouteHandler.insightFacade = new InsightFacade_1.default();
    return RouteHandler;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RouteHandler;
//# sourceMappingURL=RouteHandler.js.map