/**
 * Created by Daniel on 2016-10-11.
 */
/*
 * This should be in the same namespace as your controllers
 */
import Log from '../Util';
import {IInsightFacade, InsightResponse} from "./IInsightFacade";
import RouteHandler from '../rest/RouteHandler';
import DatasetController from './DatasetController';
import QueryController from '../controller/QueryController';
import {QueryRequest} from "../controller/QueryController";


export default class InsightFacade implements IInsightFacade {

    private static datasetController = new DatasetController();

    /**
     * Add a dataset to UBCInsight.
     *
     * @param id  The id of the dataset being added. This is the same as the PUT id.
     * @param content  The base64 content of the dataset. This is the same as the PUT body.
     *
     * The promise should return an InsightResponse for both fulfill and reject.
     * fulfill should be for 2XX codes and reject for everything else.
     */
    addDataset(id: string, content: string): Promise<InsightResponse> {
        return new Promise(function (fulfill, reject) {
            InsightFacade.datasetController.process(id, content).then(function (resCode) {
                Log.trace('InsightFacade::addDataset(..) - processed with code ' + resCode);
                fulfill({code: resCode, body: {success: resCode}});

            }).catch(function (err: Error) {
                Log.trace('InsightFacade::addDataset(..) - ERROR: ' + err.message);
                reject({code: 400, body: {error: err.message}});
            });
        });
    }


    /**
     * Remove a dataset from UBCInsight.
     *
     * @param id  The id of the dataset to remove. This is the same as the DELETE id.
     *
     * The promise should return an InsightResponse for both fulfill and reject.
     * fulfill should be for 2XX codes and reject for everything else.
     */
    removeDataset(id: string): Promise<InsightResponse> {
        return new Promise(function (fulfill, reject) {
            InsightFacade.datasetController.deleteDataset(id).then(function (resCode) {
                Log.trace('InsightFacade::removeDataset(..) - processed with code ' + resCode);
                fulfill({code: resCode, body: {success: resCode}});

            }).catch(function (err: Error) {
                Log.trace('InsightFacade::removeDataset(..) - ERROR: ' + err.message);
                reject({code: 400, body: {error: err.message}});
            });
        });
    }

    /**
     * Perform a query on UBCInsight.
     *
     * @param query  The query to be performed. This is the same as the body of the POST message.
     * @return Promise <InsightResponse>
     * The promise should return an InsightResponse for both fulfill and reject.
     * fulfill should be for 2XX codes and reject for everything else.
     */
    performQuery(query: QueryRequest): Promise<InsightResponse> {
        return new Promise(function (fulfill, reject) {
            InsightFacade.datasetController.getDatasets().then(function (datasets) {
                let controller = new QueryController(datasets);
                let result = controller.query(query);

                if ('missing' in result) {
                    Log.error('InsightFacade::performQuery(..) - ERROR: ' + JSON.stringify(result));
                    reject({code: 424, body: result});

                } else {
                    fulfill({code: 200, body: result});
                }

            }).catch(function (err: Error) {
                Log.trace('InsightFacade::performQuery(..) - ERROR: ' + err.message);
                reject({code: 400, body: {error: err.message}});
            });
        });
    }
}
