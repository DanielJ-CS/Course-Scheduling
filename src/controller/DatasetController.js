"use strict";
var Util_1 = require("../Util");
var JSZip = require('jszip');
var fs = require('fs');
var parse5 = require('parse5');
var http = require('http');
var DatasetController = (function () {
    function DatasetController() {
        this.isDatasetsLoaded = false;
        this.datasets = {};
        Util_1.default.trace('DatasetController::init()');
    }
    DatasetController.getKeyType = function (key) {
        if (!DatasetController.keyTypeMap) {
            DatasetController.keyTypeMap = {};
            for (var id in DatasetController.datasetSchema) {
                for (var key_1 in DatasetController.datasetSchema[id]) {
                    DatasetController.keyTypeMap[key_1] = DatasetController.datasetSchema[id][key_1]['type'];
                }
            }
        }
        return DatasetController.keyTypeMap[key];
    };
    DatasetController.prototype.getDatasets = function () {
        var that = this;
        return new Promise(function (fulfill, reject) {
            try {
                if (that.isDatasetsLoaded === true) {
                    Util_1.default.trace('DatasetController::getDatasets(..) - dataset already loaded in memory');
                    fulfill(that.datasets);
                }
                else {
                    var datasetPromises_1 = [];
                    var directory_1 = 'data/';
                    Util_1.default.trace('DatasetController::getDatasets(..) - reading files in directory: ' + directory_1);
                    fs.mkdir('data', function (err) {
                        if (err && err.code != 'EEXIST') {
                            reject(err);
                            return;
                        }
                        fs.readdir(directory_1, function (err, files) {
                            if (err) {
                                reject(err);
                                return;
                            }
                            Util_1.default.trace('DatasetController::getDatasets(..) - got list of files: ' + JSON.stringify(files));
                            files.forEach(function (file) {
                                if (file.length >= 5 && file.substring(file.length - 5, file.length) === ".json") {
                                    datasetPromises_1.push(new Promise(function (fulfill, reject) {
                                        fs.readFile(directory_1 + file, function (err, data) {
                                            if (err) {
                                                reject(err);
                                                return;
                                            }
                                            var datasetData = JSON.parse(data);
                                            var filename = file.replace('.json', '');
                                            that.datasets[filename] = datasetData;
                                            fulfill(true);
                                        });
                                    }));
                                }
                            });
                            Promise.all(datasetPromises_1).then(function (results) {
                                Util_1.default.trace('DatasetController::getDatasets(..) - successfully loaded ' + datasetPromises_1.length + ' datasets');
                                that.isDatasetsLoaded = true;
                                fulfill(that.datasets);
                            }).catch(function (err) {
                                reject(err);
                            });
                        });
                    });
                }
            }
            catch (err) {
                Util_1.default.trace('DatasetController::getDatasets() - ERROR: ' + err);
                reject(err);
            }
        });
    };
    DatasetController.prototype.processCoursesDatasetFromZip = function (id, zip) {
        return new Promise(function (fulfill, reject) {
            var filePromises = [];
            var numFiles = 0;
            var processedDataset = [];
            zip.forEach(function (relativePath, file) {
                var toks = file.name.split("/");
                if (toks.length > 1 && toks[0] === id && !file.dir) {
                    filePromises.push(new Promise(function (fulfill, reject) {
                        file.async("string").then(function (content) {
                            var obj = JSON.parse(content);
                            if (obj.result instanceof Array) {
                                for (var i = 0; i < obj.result.length; i++) {
                                    var entry = obj.result[i];
                                    var parsedEntry = {};
                                    for (var col in DatasetController.datasetSchema[id]) {
                                        var colType = DatasetController.datasetSchema[id][col]['type'];
                                        var rawColName = DatasetController.datasetSchema[id][col]['raw_col'];
                                        if (colType === 'number') {
                                            parsedEntry[col] = parseFloat(entry[rawColName]);
                                        }
                                        else {
                                            parsedEntry[col] = entry[rawColName];
                                        }
                                    }
                                    if (entry['Section'] === 'overall') {
                                        parsedEntry['courses_year'] = 1900;
                                    }
                                    processedDataset.push(parsedEntry);
                                }
                                numFiles++;
                            }
                            fulfill(true);
                        }).catch(function (err) {
                            Util_1.default.info("DatasetController::processCoursesFromZip(..) - error reading contents of file " + file.name + ": " + err);
                            reject(err);
                        });
                    }));
                }
            });
            Promise.all(filePromises).then(function (values) {
                Util_1.default.trace('DatasetController::processCoursesFromZip(..) - processed ' + processedDataset.length + ' entries from ' + numFiles + ' valid flies');
                if (numFiles === 0) {
                    reject(new Error("No valid files found in zip"));
                }
                else {
                    fulfill(processedDataset);
                }
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    DatasetController.prototype.processRoomsDatasetFromZip = function (id, zip) {
        return new Promise(function (fulfill, reject) {
            var shortNames = [];
            var fullNames = [];
            var buildingAddress = [];
            var latlonAddress = [];
            var latlong = [];
            var fileName = [];
            var roomNumber = [];
            var roomSeats = [];
            var roomFurniture = [];
            var roomType = [];
            var roomInfo = [];
            var roomFullName = [];
            var roomFileName = [];
            zip.file('index.htm').async('string').then(function (content) {
                var document = parse5.parse(content);
                function parseNodes(node, array) {
                    if (node.nodeName === 'td') {
                        if (node.attrs) {
                            node.attrs.forEach(function (att) {
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
                                                var c = childnode.value.trim();
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
                            node.attrs.forEach(function (att) {
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
                            node.attrs.forEach(function (att) {
                                if (att.name === 'href') {
                                    if (node.childNodes) {
                                        node.childNodes.forEach(function (child) {
                                            if (child.value === 'More info') {
                                                child.parentNode.attrs.forEach(function (att) {
                                                    var file = att.value.replace('.', '');
                                                    var file2 = file.substring(1, file.length);
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
                        node.childNodes.forEach(function (child) {
                            parseNodes(child, array);
                        });
                    }
                }
                parseNodes(document, fileName);
                Util_1.default.trace('DatasetController::processRoomsDatasetFromZip() - found ' + fileName.length + ' buildings in index.html');
                var latLongPromises = [];
                latlonAddress.forEach(function (addr) {
                    latLongPromises.push(new Promise(function (fulfill, reject) {
                        var options = {
                            host: 'skaha.cs.ubc.ca',
                            port: 8022,
                            path: '/api/v1/team70/' + addr
                        };
                        var callback = function (response) {
                            var str = '';
                            response.on('data', function (chunk) {
                                str += chunk;
                            });
                            response.on('end', function () {
                                var obj = JSON.parse(str);
                                for (var i = 0; i < latlonAddress.length; i++) {
                                    if (latlonAddress[i] == addr) {
                                        latlong[i] = obj;
                                        break;
                                    }
                                }
                                fulfill(true);
                            });
                            response.on('error', function (err) {
                                reject(err);
                            });
                        };
                        http.request(options, callback).end();
                    }));
                });
                Promise.all(latLongPromises).then(function (result) {
                    var filePromises = [];
                    fileName.forEach(function (file) {
                        if (!zip.file(file))
                            return;
                        filePromises.push(new Promise(function (fulfill, reject) {
                            zip.file(file).async('string').then(function (content) {
                                var document = parse5.parse(content);
                                var hasRoom = false;
                                function parseDatasetNodes(node) {
                                    if (node.nodeName && node.nodeName === 'th') {
                                        if (node.attrs) {
                                            node.attrs.forEach(function (att) {
                                                if (att.name === 'class' && att.value === 'views-field views-field-field-room-number') {
                                                    if (node.childNodes) {
                                                        node.childNodes.forEach(function (childnode) {
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
                                        node.childNodes.forEach(function (node) {
                                            parseDatasetNodes(node);
                                        });
                                    }
                                }
                                parseDatasetNodes(document);
                                if (!hasRoom) {
                                    fulfill(true);
                                    return;
                                }
                                function getKeys(node) {
                                    if (node.nodeName && node.nodeName === 'a') {
                                        if (node.attrs) {
                                            node.attrs.forEach(function (att) {
                                                if (att.name === 'title' && att.value === 'Room Details') {
                                                    if (node.childNodes) {
                                                        node.childNodes.forEach(function (child) {
                                                            roomNumber.push(child.value.trim());
                                                            roomFileName.push(file);
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    }
                                    if (node.nodeName && node.nodeName === 'span') {
                                        if (node.attrs) {
                                            node.attrs.forEach(function (att) {
                                                if (att.name === 'class' && att.value === 'field-content') {
                                                    if (node.childNodes) {
                                                        node.childNodes.forEach(function (child) {
                                                            roomFullName.push(child.value);
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    }
                                    if (node.nodeName && node.nodeName === 'td') {
                                        if (node.attrs) {
                                            node.attrs.forEach(function (att) {
                                                if (att.name === 'class') {
                                                    if (att.value === 'views-field views-field-field-room-capacity') {
                                                        if (node.childNodes) {
                                                            node.childNodes.forEach(function (child) {
                                                                roomSeats.push(child.value.trim());
                                                            });
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    }
                                    if (node.nodeName && node.nodeName === 'td') {
                                        if (node.attrs) {
                                            node.attrs.forEach(function (att) {
                                                if (att.name === 'class') {
                                                    if (att.value === 'views-field views-field-field-room-furniture') {
                                                        if (node.childNodes) {
                                                            node.childNodes.forEach(function (child) {
                                                                roomFurniture.push(child.value.trim());
                                                            });
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    }
                                    if (node.nodeName && node.nodeName === 'td') {
                                        if (node.attrs) {
                                            node.attrs.forEach(function (att) {
                                                if (att.name === 'class') {
                                                    if (att.value === 'views-field views-field-field-room-type') {
                                                        if (node.childNodes) {
                                                            node.childNodes.forEach(function (child) {
                                                                roomType.push(child.value.trim());
                                                            });
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    }
                                    if (node.nodeName && node.nodeName === 'a') {
                                        if (node.attrs) {
                                            node.attrs.forEach(function (att) {
                                                if (att.name === 'href') {
                                                    if (node.childNodes) {
                                                        node.childNodes.forEach(function (child) {
                                                            if (child.value === 'More info') {
                                                                child.parentNode.attrs.forEach(function (att) {
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
                    });
                    Promise.all(filePromises).then(function (result) {
                        var processedDataset = [];
                        var buildingID;
                        for (var i = 0; i < roomNumber.length; i++) {
                            for (var j = 0; j < fileName.length; j++) {
                                if (fileName[j] === roomFileName[i]) {
                                    buildingID = j;
                                }
                            }
                            var room = {};
                            room['rooms_fullname'] = fullNames[buildingID];
                            room['rooms_shortname'] = shortNames[buildingID];
                            room['rooms_number'] = roomNumber[i];
                            room['rooms_name'] = shortNames[buildingID] + "_" + roomNumber[i];
                            room['rooms_address'] = buildingAddress[buildingID];
                            room['rooms_lat'] = latlong[buildingID]['lat'];
                            room['rooms_lon'] = latlong[buildingID]['lon'];
                            room['rooms_seats'] = parseInt(roomSeats[i]);
                            room['rooms_type'] = roomType[i];
                            room['rooms_furniture'] = roomFurniture[i];
                            room['rooms_href'] = roomInfo[i];
                            processedDataset.push(room);
                        }
                        Util_1.default.trace('DatasetController::processRoomsDatasetFromZip() - successfully loaded ' + processedDataset.length + ' rooms from ' + fileName.length + ' buildings');
                        fulfill(processedDataset);
                    }).catch(function (err) {
                        Util_1.default.trace('ERROR: ' + err);
                        reject(err);
                    });
                }).catch(function (err) {
                    Util_1.default.trace('ERROR: ' + err);
                    reject(err);
                });
            });
        });
    };
    DatasetController.prototype.process = function (id, data) {
        Util_1.default.trace('DatasetController::process( ' + id + '... )');
        var that = this;
        return new Promise(function (fulfill, reject) {
            try {
                var myZip = new JSZip();
                myZip.loadAsync(data, { base64: true }).then(function (zip) {
                    Util_1.default.trace('DatasetController::process(..) - unzipped the file');
                    var resPromise = null;
                    if (id === 'courses') {
                        resPromise = that.processCoursesDatasetFromZip(id, zip);
                    }
                    else if (id === 'rooms') {
                        resPromise = that.processRoomsDatasetFromZip(id, zip);
                    }
                    else {
                        reject(new Error("unknown dataset id " + id));
                    }
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
                    Util_1.default.trace('DatasetController::process(..) - unzip ERROR: ' + err.message);
                    reject(err);
                });
            }
            catch (err) {
                Util_1.default.trace('DatasetController::process(..) - ERROR: ' + err);
                reject(err);
            }
        });
    };
    DatasetController.prototype.save = function (id, processedDataset) {
        var that = this;
        return new Promise(function (fulfill, reject) {
            var resCode = 204;
            if (that.datasets[id] !== undefined) {
                resCode = 201;
            }
            that.datasets[id] = processedDataset;
            Util_1.default.trace('DatasetController::save(..) - checking existence of data/');
            fs.mkdir('data', function (err) {
                if (err && err.code != 'EEXIST') {
                    reject(err);
                    return;
                }
                var dstFileName = 'data/' + id + '.json';
                Util_1.default.trace('DatasetController::save(..) - saving file to ' + dstFileName);
                var ws = fs.createWriteStream(dstFileName);
                ws.on('error', function (err) {
                    Util_1.default.trace('DatasetController::save(..) - ERROR: ' + err);
                    reject(err);
                }).on('finish', function () {
                    Util_1.default.trace('DatasetController::save(..) - finished saving file to ' + dstFileName);
                    fulfill(resCode);
                }).on('open', function (fd) {
                    ws.write(JSON.stringify(processedDataset), 'utf8');
                    ws.end();
                });
            });
        });
    };
    DatasetController.prototype.deleteDataset = function (id) {
        var that = this;
        return new Promise(function (fulfill, reject) {
            that.datasets[id] = undefined;
            var filename = 'data/' + id + '.json';
            Util_1.default.trace('DatasetController::deleteDataset(..) - deleting file ' + filename);
            fs.unlink(filename, function (err) {
                if (err) {
                    if (err.code != 'ENOENT') {
                        Util_1.default.trace('DatasetController::deleteDataset(..) - error deleting file: ' + err);
                        reject(err);
                    }
                    else {
                        Util_1.default.trace('DatasetController::deleteDataset(..) - file to delete was not present');
                        fulfill(404);
                    }
                }
                else {
                    Util_1.default.trace('DatasetController::deleteDataset(..) - file delete successful');
                    fulfill(204);
                }
            });
        });
    };
    DatasetController.datasetSchema = {
        courses: {
            courses_dept: { type: 'string', raw_col: 'Subject' },
            courses_id: { type: 'string', raw_col: 'Course' },
            courses_avg: { type: 'number', raw_col: 'Avg' },
            courses_instructor: { type: 'string', raw_col: 'Professor' },
            courses_title: { type: 'string', raw_col: 'Title' },
            courses_pass: { type: 'number', raw_col: 'Pass' },
            courses_fail: { type: 'number', raw_col: 'Fail' },
            courses_audit: { type: 'number', raw_col: 'Audit' },
            courses_uuid: { type: 'number', raw_col: 'id' },
            courses_year: { type: 'number', raw_col: 'Year' }
        },
        rooms: {
            rooms_fullname: { type: 'string' },
            rooms_shortname: { type: 'string' },
            rooms_number: { type: 'string' },
            rooms_name: { type: 'string' },
            rooms_address: { type: 'string' },
            rooms_lat: { type: 'number' },
            rooms_lon: { type: 'number' },
            rooms_seats: { type: 'number' },
            rooms_type: { type: 'string' },
            rooms_furniture: { type: 'string' },
            rooms_href: { type: 'string' }
        }
    };
    DatasetController.keyTypeMap = undefined;
    return DatasetController;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DatasetController;
//# sourceMappingURL=DatasetController.js.map