/**
 * Created by rtholmes on 2016-06-14.
 */
import restify = require('restify');
import fs = require('fs');

import DatasetController from '../controller/DatasetController';
import {Datasets} from '../controller/DatasetController';
import QueryController from '../controller/QueryController';
import {IInsightFacade, InsightResponse} from "../controller/IInsightFacade";
import InsightFacade from "../controller/InsightFacade";
import {QueryRequest} from "../controller/QueryController";
import Log from '../Util';

export default class RouteHandler {

    private static datasetController = new DatasetController();
    private static insightFacade: IInsightFacade = new InsightFacade();

    public static getHomepage(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('RoutHandler::getHomepage(..)');
        fs.readFile('./src/rest/views/index.html', 'utf8', function (err: Error, file: Buffer) {
            if (err) {
                res.send(500);
                Log.error(JSON.stringify(err));
                return next();
            }
            res.write(file);
            res.end();
            return next();
        });
    }

    public static  putDataset(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('RouteHandler::postDataset(..) - params: ' + JSON.stringify(req.params));
        try {
            var id: string = req.params.id;

            // stream bytes from request into buffer and convert to base64
            // adapted from: https://github.com/restify/node-restify/issues/880#issuecomment-133485821
            let buffer: any = [];
            req.on('data', function onRequestData(chunk: any) {
                Log.trace('RouteHandler::postDataset(..) on data; chunk length: ' + chunk.length);
                buffer.push(chunk);
            });

            req.once('end', function () {
                let concated = Buffer.concat(buffer);
                req.body = concated.toString('base64');
                Log.trace('RouteHandler::postDataset(..) on end; total length: ' + req.body.length);

                RouteHandler.insightFacade.addDataset(id,req.body).then(function(insightResponse: InsightResponse) {
                    res.json(insightResponse.code, insightResponse.body);

                }).catch(function(err: InsightResponse) {
                    res.json(err.code, err.body);
                });
            });

        } catch (err) {
            Log.error('RouteHandler::postDataset(..) - ERROR: ' + err.message);
            res.send(400, {error: err.message});
        }
        return next();
    }

    public static  deleteDataset(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('RouteHandler::deleteDataset(..) - params: ' + JSON.stringify(req.params));
        try {
            var id: string = req.params.id;

            RouteHandler.insightFacade.removeDataset(id).then(function(insightResponse: InsightResponse) {
                res.json(insightResponse.code, insightResponse.body);

            }).catch(function(err: InsightResponse) {
                res.json(err.code, err.body);
            });

        } catch (err) {
            Log.error('RouteHandler::postDataset(..) - ERROR: ' + err.message);
            res.send(400, {error: err.message});
        }
        return next();
    }

    public static postQuery(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('RouteHandler::postQuery(..) - params: ' + JSON.stringify(req.params));
        try {
            let query: QueryRequest = req.params;
            let isValid = QueryController.isValid(query);

            if (isValid === true) {
                RouteHandler.insightFacade.performQuery(query).then(function(insightResponse: InsightResponse) {
                    res.json(insightResponse.code,insightResponse.body);

                }).catch(function(err: InsightResponse) {
                    res.json(err.code, err.body);
                });

            } else {
                Log.error('RouteHandler::postQuery(..) - ERROR: invalid query');
                res.json(400, {error: 'invalid query'});
            }

        } catch (err) {
            Log.error('RouteHandler::postQuery(..) - ERROR: ' + err);
            res.send(400, {error: err.message});
        }
        return next();
    }
}
