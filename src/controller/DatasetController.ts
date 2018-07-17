/**
 * Created by rtholmes on 2016-09-03.
 */

import Log from "../Util";
import JSZip = require('jszip');
import fs = require('fs');
import path = require('path');
import parse5 = require('parse5');
import {ASTNode} from "parse5";
import {ASTAttribute} from "parse5";
import http = require('http');


/**
 * In memory representation of all datasets.
 */
export interface Datasets {
    [id: string]: Array<any>;
}

export default class DatasetController {

    private static datasetSchema: any = {
        courses: {
            courses_dept: {type: 'string', raw_col: 'Subject'},
            courses_id: {type: 'string', raw_col: 'Course'},
            courses_avg: {type: 'number', raw_col: 'Avg'},
            courses_instructor: {type: 'string', raw_col: 'Professor'},
            courses_title: {type: 'string', raw_col: 'Title'},
            courses_pass: {type: 'number', raw_col: 'Pass'},
            courses_fail: {type: 'number', raw_col: 'Fail'},
            courses_audit: {type: 'number', raw_col: 'Audit'},
            courses_uuid: {type: 'number', raw_col: 'id'},
            courses_year: {type: 'number', raw_col: 'Year'}
        },
        rooms: {
            rooms_fullname: {type: 'string'},
            rooms_shortname: {type: 'string'},
            rooms_number: {type: 'string'},
            rooms_name: {type: 'string'},
            rooms_address: {type: 'string'},
            rooms_lat: {type: 'number'},
            rooms_lon: {type: 'number'},
            rooms_seats: {type: 'number'},
            rooms_type: {type: 'string'},
            rooms_furniture: {type: 'string'},
            rooms_href: {type: 'string'}
        }
    };


    private static keyTypeMap: any = undefined;

    private isDatasetsLoaded = false;
    private datasets: Datasets = {};

    constructor() {
        Log.trace('DatasetController::init()');
    }

    public static getKeyType(key: string) {
        if (!DatasetController.keyTypeMap) {
            // build key => type cache from schema
            DatasetController.keyTypeMap = {};
            for (let id in DatasetController.datasetSchema) {
                for (let key in DatasetController.datasetSchema[id]) {
                    DatasetController.keyTypeMap[key] = DatasetController.datasetSchema[id][key]['type'];
                }
            }
        }
        return DatasetController.keyTypeMap[key];
    }

    public getDatasets(): Promise<Datasets> {
        let that = this;
        return new Promise(function (fulfill, reject) {
            try {
                if (that.isDatasetsLoaded === true) {
                    Log.trace('DatasetController::getDatasets(..) - dataset already loaded in memory');

                    fulfill(that.datasets);

                } else {
                    let datasetPromises: Array<Promise<boolean>> = [];
                    let directory: string = 'data/';

                    Log.trace('DatasetController::getDatasets(..) - reading files in directory: ' + directory);

                    fs.mkdir('data', function (err: any) {
                        if (err && err.code != 'EEXIST') {
                            reject(err);
                            return;
                        }

                        fs.readdir(directory, (err: any, files: any) => {
                            if (err) {
                                reject(err);
                                return;
                            }

                            Log.trace('DatasetController::getDatasets(..) - got list of files: ' + JSON.stringify(files));

                            files.forEach(function (file: string) {
                                if (file.length >= 5 && file.substring(file.length - 5, file.length) === ".json") {
                                    datasetPromises.push(new Promise(function (fulfill, reject) {
                                        fs.readFile(directory + file, (err: any, data: any) => {
                                            if (err) {
                                                reject(err);
                                                return;
                                            }

                                            let datasetData = JSON.parse(data);
                                            let filename: string = file.replace('.json', '');
                                            that.datasets[filename] = datasetData;
                                            fulfill(true);
                                        });
                                    }));
                                }
                            });

                            Promise.all(datasetPromises).then(function (results) {
                                Log.trace('DatasetController::getDatasets(..) - successfully loaded ' + datasetPromises.length + ' datasets');

                                that.isDatasetsLoaded = true;
                                fulfill(that.datasets);

                            }).catch(function (err) {
                                reject(err);
                            });
                        });
                    });
                }

            } catch (err) {
                Log.trace('DatasetController::getDatasets() - ERROR: ' + err);
                reject(err);
            }
        });
    }

    private processCoursesDatasetFromZip(id: string, zip: JSZip): Promise<Array<any>> {
        return new Promise<Array<any>>(function (fulfill, reject) {
            // for each file in the zip in the folder id/
            // process it in async way
            let filePromises: Array<Promise<boolean>> = [];
            let numFiles = 0;
            let processedDataset: Array<any> = [];

            zip.forEach(function (relativePath, file) {
                let toks = file.name.split("/");

                if (toks.length > 1 && toks[0] === id && !file.dir) {

                    filePromises.push(new Promise(function (fulfill, reject) {

                        // read the content, and parse it as JSON object
                        // it should have an array named 'result'
                        file.async("string").then(function (content: string) {

                            let obj = JSON.parse(content);
                            if (obj.result instanceof Array) {
                                for (let i = 0; i < obj.result.length; i++) {
                                    let entry: any = obj.result[i];
                                    let parsedEntry: any = {};

                                    // extract relevant columns
                                    for (let col in DatasetController.datasetSchema[id]) {
                                        let colType = DatasetController.datasetSchema[id][col]['type'];
                                        let rawColName = DatasetController.datasetSchema[id][col]['raw_col'];
                                        if (colType === 'number') {
                                            // Note: parseFloat is safe for parsing integers
                                            parsedEntry[col] = parseFloat(entry[rawColName]);
                                        } else {
                                            // Note: assume colType === 'string'
                                            parsedEntry[col] = entry[rawColName];
                                        }
                                    }

                                    // set year to 1900 if "Section":"overall" is set
                                    if (entry['Section'] === 'overall') {
                                        parsedEntry['courses_year'] = 1900;
                                    }

                                    processedDataset.push(parsedEntry);
                                }
                                numFiles++;
                            }
                            fulfill(true);

                        }).catch(function (err) {
                            Log.info("DatasetController::processCoursesFromZip(..) - error reading contents of file " + file.name + ": " + err);
                            reject(err);
                        });
                    }));
                }
            });

            // when all the files have been read and processed into the array, we save the array to memory and file
            Promise.all(filePromises).then(function (values) {
                Log.trace('DatasetController::processCoursesFromZip(..) - processed ' + processedDataset.length + ' entries from ' + numFiles + ' valid flies');
                if (numFiles === 0) {
                    reject(new Error("No valid files found in zip"));
                } else {
                    fulfill(processedDataset);
                }
            }).catch(function (err) {
                reject(err);
            });
        });
    }

    private processRoomsDatasetFromZip(id: string, zip: JSZip): Promise<Array<any>> {
        return new Promise<Array<any>>(function (fulfill, reject) {
            // extracted info for buildings
            let shortNames: any = [];
            let fullNames: any = [];
            let buildingAddress: any = [];
            let latlonAddress: any = [];
            let latlong: any = [];
            let fileName: any = [];

            // extracted info for rooms
            let roomNumber: any = [];
            let roomSeats: any = [];
            let roomFurniture: any = [];
            let roomType: any = [];
            let roomInfo: any = [];
            let roomFullName: any = [];
            let roomFileName: any = [];

            zip.file('index.htm').async('string').then(function (content: any) {

                // parse building information from index.html
                let document = parse5.parse(content);

                function parseNodes(node: ASTNode, array: Array<string>) {
                    if (node.nodeName === 'td') {
                        if (node.attrs) {
                            node.attrs.forEach(function (att: ASTAttribute) {
                                if (att.name === 'class' && att.value === 'views-field views-field-field-building-code') {
                                    if (node.childNodes) {
                                        node.childNodes.forEach(function (childnode) {
                                            if (childnode.nodeName === '#text') {
                                                shortNames.push(childnode.value.trim());
                                            }
                                        });
                                    }
                                }
                                if (att.name === 'class' && att.value === 'views-field views-field-field-building-address') {
                                    if (node.childNodes) {
                                        node.childNodes.forEach(function (childnode) {
                                            if (childnode.nodeName === '#text') {
                                                buildingAddress.push(childnode.value.trim());
                                                let c = childnode.value.trim();
                                                latlonAddress.push(encodeURI(c));
                                            }
                                        });
                                    }
                                }

                            });
                        }
                    }
                    if (node.nodeName === 'a') {
                        if (node.attrs) {
                            node.attrs.forEach(function (att: ASTAttribute) {
                                if (att.name === 'title' && att.value === 'Building Details and Map') {
                                    if (node.childNodes) {
                                        node.childNodes.forEach(function (childnode) {
                                            if (childnode.nodeName === '#text') {
                                                fullNames.push(childnode.value.trim());
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                    if (node.nodeName && node.nodeName === 'a') {
                        if (node.attrs) {
                            node.attrs.forEach(function (att: ASTAttribute) {
                                if (att.name === 'href') {
                                    if (node.childNodes) {
                                        node.childNodes.forEach(function (child: ASTNode) {
                                            if (child.value === 'More info') {
                                                child.parentNode.attrs.forEach(function (att: ASTAttribute) {
                                                    let file = att.value.replace('.', '');
                                                    let file2 = file.substring(1, file.length);
                                                    array.push(file2);


                                                });
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }

                    if (node.childNodes) {
                        node.childNodes.forEach(function (child: any) {
                            parseNodes(child, array);
                        });
                    }
                }

                parseNodes(document, fileName);
                Log.trace('DatasetController::processRoomsDatasetFromZip() - found ' + fileName.length + ' buildings in index.html');

                // get lat long from geolocation service
                let latLongPromises: Array<Promise<Boolean>> = [];
                latlonAddress.forEach(function (addr: string) {
                    latLongPromises.push(new Promise<Boolean>(function (fulfill, reject) {
                        var options = {
                            host: 'skaha.cs.ubc.ca',
                            port: 8022,
                            path: '/api/v1/team70/' + addr
                        };

                        let callback: any = function(response: any) {
                            var str = '';

                            response.on('data', function (chunk: any) {
                                str += chunk;
                            });

                            response.on('end', function () {
                                let obj: any = JSON.parse(str);
                                for (let i = 0; i < latlonAddress.length; i++) {
                                    if (latlonAddress[i] == addr) {
                                        latlong[i] = obj;
                                        break;
                                    }
                                }
                                fulfill(true);
                            });

                            response.on('error', function (err: any) {
                                reject(err);
                            });
                        }

                        http.request(options, callback).end();
                    }));
                });

                // when we finish getting lat-long for all buildings
                Promise.all(latLongPromises).then(function (result: any) {

                    // iterate over files linked from index.html
                    let filePromises: Array<Promise<boolean>> = [];
                    fileName.forEach(function (file: string) {
                        if (!zip.file(file)) return;

                        filePromises.push(new Promise(function (fulfill, reject) {

                            zip.file(file).async('string').then(function (content: any) {
                                let document = parse5.parse(content);
                                let hasRoom: boolean = false;

                                //Check if there is a room and the building is one of index.html
                                function parseDatasetNodes(node: ASTNode) {
                                    if (node.nodeName && node.nodeName === 'th') {
                                        if (node.attrs) {
                                            node.attrs.forEach(function (att: ASTAttribute) {
                                                if (att.name === 'class' && att.value === 'views-field views-field-field-room-number') {
                                                    if (node.childNodes) {
                                                        node.childNodes.forEach(function (childnode: ASTNode) {
                                                            if (childnode.value.trim() === 'Room') {
                                                                hasRoom = true;
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    }
                                    if (node.childNodes) {
                                        node.childNodes.forEach(function (node: ASTNode) {
                                            parseDatasetNodes(node);
                                        });
                                    }

                                }

                                parseDatasetNodes(document);

                                if (!hasRoom) {
                                    fulfill(true);
                                    return;
                                }

                                // parse room details if there is room
                                function getKeys(node: ASTNode) {
                                    if (node.nodeName && node.nodeName === 'a') {
                                        if (node.attrs) {
                                            node.attrs.forEach(function (att: ASTAttribute) {

                                                if (att.name === 'title' && att.value === 'Room Details') {
                                                    if (node.childNodes) {
                                                        node.childNodes.forEach(function (child: ASTNode) {
                                                            roomNumber.push(child.value.trim());
                                                            roomFileName.push(file);
                                                        });
                                                    }

                                                }

                                            });
                                        }
                                    }
                                    //room_fullname
                                    if (node.nodeName && node.nodeName === 'span') {
                                        if (node.attrs) {
                                            node.attrs.forEach(function (att: ASTAttribute) {
                                                if (att.name === 'class' && att.value === 'field-content') {
                                                    if (node.childNodes) {
                                                        node.childNodes.forEach(function (child: ASTNode) {
                                                            roomFullName.push(child.value);
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    }
                                    //seats
                                    if (node.nodeName && node.nodeName === 'td') {
                                        if (node.attrs) {
                                            node.attrs.forEach(function (att: ASTAttribute) {
                                                if (att.name === 'class') {
                                                    if (att.value === 'views-field views-field-field-room-capacity') {
                                                        if (node.childNodes) {
                                                            node.childNodes.forEach(function (child: ASTNode) {
                                                                roomSeats.push(child.value.trim());
                                                            });
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    }
                                    // room furniture
                                    if (node.nodeName && node.nodeName === 'td') {
                                        if (node.attrs) {
                                            node.attrs.forEach(function (att: ASTAttribute) {
                                                if (att.name === 'class') {
                                                    if (att.value === 'views-field views-field-field-room-furniture') {
                                                        if (node.childNodes) {
                                                            node.childNodes.forEach(function (child: ASTNode) {
                                                                roomFurniture.push(child.value.trim());
                                                            });
                                                        }

                                                    }
                                                }
                                            });
                                        }
                                    }
                                    // room type
                                    if (node.nodeName && node.nodeName === 'td') {
                                        if (node.attrs) {
                                            node.attrs.forEach(function (att: ASTAttribute) {
                                                if (att.name === 'class') {
                                                    if (att.value === 'views-field views-field-field-room-type') {
                                                        if (node.childNodes) {
                                                            node.childNodes.forEach(function (child: ASTNode) {
                                                                roomType.push(child.value.trim());
                                                            });
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    }
                                    // Room more info
                                    if (node.nodeName && node.nodeName === 'a') {
                                        if (node.attrs) {
                                            node.attrs.forEach(function (att: ASTAttribute) {
                                                if (att.name === 'href') {
                                                    if (node.childNodes) {
                                                        node.childNodes.forEach(function (child: ASTNode) {
                                                            if (child.value === 'More info') {
                                                                child.parentNode.attrs.forEach(function (att: ASTAttribute) {
                                                                    roomInfo.push(att.value.trim());
                                                                });
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    }


                                    if (node.childNodes) {
                                        node.childNodes.forEach(getKeys);
                                    }
                                }

                                getKeys(document);
                                fulfill(true);
                            });
                        }));
                    }); // end fileName.foreach()

                    // when we finish reading all rooms
                    Promise.all(filePromises).then(function (result: any) {
                        let processedDataset: Array<any> = [];
                        let buildingID: number;

                        // for each room
                        for (let i = 0; i < roomNumber.length; i++) {

                            // find the building it's in
                            for (let j = 0; j < fileName.length; j++) {
                                if (fileName[j] === roomFileName[i]) {
                                    buildingID = j;
                                }
                            }

                            // fill in the fields for each room
                            let room: any = {};
                            room['rooms_fullname']  = fullNames[buildingID];
                            room['rooms_shortname'] = shortNames[buildingID];
                            room['rooms_number']    = roomNumber[i];
                            room['rooms_name']      = shortNames[buildingID] + "_" + roomNumber[i];
                            room['rooms_address']   = buildingAddress[buildingID];
                            room['rooms_lat']       = latlong[buildingID]['lat'];
                            room['rooms_lon']       = latlong[buildingID]['lon'];
                            room['rooms_seats']     = parseInt(roomSeats[i]);
                            room['rooms_type']      = roomType[i];
                            room['rooms_furniture'] = roomFurniture[i];
                            room['rooms_href']      = roomInfo[i];

                            // add to dataset
                            processedDataset.push(room);
                        }

                        // we are done
                        Log.trace('DatasetController::processRoomsDatasetFromZip() - successfully loaded ' + processedDataset.length + ' rooms from ' + fileName.length + ' buildings');
                        fulfill(processedDataset);

                    }).catch(function (err: any) {
                        Log.trace('ERROR: ' + err);
                        reject(err);
                    }); // end Promise.all(filePromises, ...)

                }).catch(function (err: any) {
                    Log.trace('ERROR: ' + err);
                    reject(err);
                }); // end Promise.all(latLongPromises, ...)

            }); // end zip.file('index.html').then(...)
        }); // end new Promise(...)
    }

    /**
     * Process the dataset; save it to disk when complete.
     *
     * @param id
     * @param data base64 representation of a zip file
     * @returns {Promise<boolean>} returns true if successful; false if the dataset was invalid (for whatever reason)
     */
    public process(id: string, data: any): Promise<number> {
        Log.trace('DatasetController::process( ' + id + '... )');

        let that = this;
        return new Promise(function (fulfill, reject) {

            try {
                let myZip = new JSZip();
                myZip.loadAsync(data, {base64: true}).then(function (zip: JSZip) {
                    Log.trace('DatasetController::process(..) - unzipped the file');

                    // figure out which specialized function to call for parsing the dataset
                    let resPromise: Promise<any> = null;
                    if (id === 'courses') {
                        resPromise = that.processCoursesDatasetFromZip(id, zip);
                    } else if (id === 'rooms') {
                        resPromise = that.processRoomsDatasetFromZip(id, zip);
                    } else {
                        reject(new Error("unknown dataset id " + id));
                    }

                    // after parsing, read all datasets into memory so we know
                    // if this dataset is new or not, then save the dataset
                    resPromise.then(function (processedDataset) {
                        that.getDatasets().then(function (datasets) {
                            that.save(id, processedDataset).then(function (resCode) {
                                fulfill(resCode);
                            }).catch(function (err) {
                                reject(err);
                            });
                        }).catch(function (err) {
                            reject(err);
                        });
                    }).catch(function (err) {
                        reject(err);
                    });

                }).catch(function (err) {
                    Log.trace('DatasetController::process(..) - unzip ERROR: ' + err.message);
                    reject(err);
                });
            } catch (err) {
                Log.trace('DatasetController::process(..) - ERROR: ' + err);
                reject(err);
            }
        });

    }


    /**
     * Writes the processed dataset to disk as 'id.json'. The function should overwrite
     * any existing dataset with the same name.
     *
     * @param id
     * @param processedDataset
     */

    private save(id: string, processedDataset: any): Promise<number> {
        let that = this;
        return new Promise(function (fulfill, reject) {
            // add it to the memory model
            let resCode = 204;
            if (that.datasets[id] !== undefined) {
                resCode = 201;
            }
            that.datasets[id] = processedDataset;

            // save it to disk, make sure we make the data/ dir first
            Log.trace('DatasetController::save(..) - checking existence of data/');
            fs.mkdir('data', function (err) {
                if (err && err.code != 'EEXIST') {
                    reject(err);
                    return;
                }

                let dstFileName = 'data/' + id + '.json';
                Log.trace('DatasetController::save(..) - saving file to ' + dstFileName);

                let ws = fs.createWriteStream(dstFileName);
                ws.on('error', function (err: any) {
                    Log.trace('DatasetController::save(..) - ERROR: ' + err);
                    reject(err);
                }).on('finish', function () {
                    Log.trace('DatasetController::save(..) - finished saving file to ' + dstFileName);
                    fulfill(resCode);
                }).on('open', function (fd: any) {
                    ws.write(JSON.stringify(processedDataset), 'utf8');
                    ws.end();
                });
            });
        });

    }

    public deleteDataset(id: string): Promise<number> {
        let that = this;
        return new Promise(function (fulfill, reject) {
            that.datasets[id] = undefined;

            let filename = 'data/' + id + '.json';
            Log.trace('DatasetController::deleteDataset(..) - deleting file ' + filename);
            fs.unlink(filename, function (err) {
                if (err) {
                    if (err.code != 'ENOENT') {
                        Log.trace('DatasetController::deleteDataset(..) - error deleting file: ' + err);
                        reject(err);
                    } else {
                        Log.trace('DatasetController::deleteDataset(..) - file to delete was not present');
                        fulfill(404);
                    }
                } else {
                    Log.trace('DatasetController::deleteDataset(..) - file delete successful');
                    fulfill(204);
                }
            });
        });
    }

}
