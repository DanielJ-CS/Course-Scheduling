/**
 * Created by rtholmes on 2016-09-03.
 */

import DatasetController from "../src/controller/DatasetController";
import Log from "../src/Util";

import JSZip = require('jszip');
import {expect, assert} from 'chai';
var fs = require('fs');

describe("DatasetController", function () {

    beforeEach(function () {
    });

    afterEach(function () {
    });

    it("Should throw error on zip without any valid data file under courses", function () {
        Log.test('Creating dataset');
        let content = {key: 'value'};
        let zip = new JSZip();
        zip.file('content.obj', JSON.stringify(content));
        const opts = {
            compression: 'deflate', compressionOptions: {level: 2}, type: 'base64'
        };
        return zip.generateAsync(opts).then(function (data) {
            Log.test('Dataset created ');
            Log.test(data);
            let controller = new DatasetController();
            controller.process('courses', data).then(function (result) {
                assert(false, "should throw error on zip without any valid data file under courses/");
            }).catch(function (err) {
                throw err;
            });
        }).then(function (result) {
            assert(false, "should throw error on zip without any valid data file under courses/");
        }).catch(function (err) {
            assert(true);
        });
    });

    it("Should be able to process a rooms zip", function () {
        let expectedObj = [
            { rooms_fullname: 'Earth Sciences Building', rooms_shortname: 'ESB',
              rooms_number: '1012', rooms_name: 'ESB_1012',
              rooms_address: '2207 Main Mall',
              rooms_lat: 49.26274, rooms_lon: -123.25224, rooms_seats: 150,
              rooms_type: 'Tiered Large Group', rooms_furniture: 'Classroom-Hybrid Furniture',
              rooms_href: 'http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ESB-1012' },

            { rooms_fullname: 'Earth Sciences Building', rooms_shortname: 'ESB',
              rooms_number: '1013', rooms_name: 'ESB_1013',
              rooms_address: '2207 Main Mall',
              rooms_lat: 49.26274, rooms_lon: -123.25224, rooms_seats: 350,
              rooms_type: 'Tiered Large Group', rooms_furniture: 'Classroom-Fixed Tablets',
              rooms_href: 'http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ESB-1013' },

            { rooms_fullname: 'Earth Sciences Building', rooms_shortname: 'ESB',
              rooms_number: '2012', rooms_name: 'ESB_2012',
              rooms_address: '2207 Main Mall',
              rooms_lat: 49.26274, rooms_lon: -123.25224, rooms_seats: 80,
              rooms_type: 'Tiered Large Group', rooms_furniture: 'Classroom-Fixed Tables/Movable Chairs',
              rooms_href: 'http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ESB-2012' },

            { rooms_fullname: 'Hugh Dempster Pavilion', rooms_shortname: 'DMP',
              rooms_number: '101', rooms_name: 'DMP_101',
              rooms_address: '6245 Agronomy Road V6T 1Z4',
              rooms_lat: 49.26125, rooms_lon: -123.24807, rooms_seats: 40,
              rooms_type: 'Small Group', rooms_furniture: 'Classroom-Movable Tables & Chairs',
              rooms_href: 'http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-101' },

            { rooms_fullname: 'Hugh Dempster Pavilion', rooms_shortname: 'DMP',
              rooms_number: '110', rooms_name: 'DMP_110',
              rooms_address: '6245 Agronomy Road V6T 1Z4',
              rooms_lat: 49.26125, rooms_lon: -123.24807, rooms_seats: 120,
              rooms_type: 'Tiered Large Group', rooms_furniture: 'Classroom-Fixed Tables/Movable Chairs',
              rooms_href: 'http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-110' },

            { rooms_fullname: 'Hugh Dempster Pavilion', rooms_shortname: 'DMP',
              rooms_number: '201', rooms_name: 'DMP_201',
              rooms_address: '6245 Agronomy Road V6T 1Z4',
              rooms_lat: 49.26125, rooms_lon: -123.24807, rooms_seats: 40,
              rooms_type: 'Small Group', rooms_furniture: 'Classroom-Movable Tables & Chairs',
              rooms_href: 'http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-201' },

            { rooms_fullname: 'Hugh Dempster Pavilion', rooms_shortname: 'DMP',
              rooms_number: '301', rooms_name: 'DMP_301',
              rooms_address: '6245 Agronomy Road V6T 1Z4',
              rooms_lat: 49.26125, rooms_lon: -123.24807, rooms_seats: 80,
              rooms_type: 'Tiered Large Group', rooms_furniture: 'Classroom-Fixed Tables/Movable Chairs',
              rooms_href: 'http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-301' },

            { rooms_fullname: 'Hugh Dempster Pavilion', rooms_shortname: 'DMP',
              rooms_number: '310', rooms_name: 'DMP_310',
              rooms_address: '6245 Agronomy Road V6T 1Z4',
              rooms_lat: 49.26125, rooms_lon: -123.24807, rooms_seats: 160,
              rooms_type: 'Tiered Large Group', rooms_furniture: 'Classroom-Fixed Tables/Movable Chairs',
              rooms_href: 'http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-310' },

            { rooms_fullname: 'Mathematics', rooms_shortname: 'MATH',
              rooms_number: '100', rooms_name: 'MATH_100',
              rooms_address: '1984 Mathematics Road',
              rooms_lat: 49.28273, rooms_lon: -123.12074, rooms_seats: 224,
              rooms_type: 'Tiered Large Group', rooms_furniture: 'Classroom-Fixed Tablets',
              rooms_href: 'http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MATH-100' },

            { rooms_fullname: 'Mathematics', rooms_shortname: 'MATH',
              rooms_number: '102', rooms_name: 'MATH_102',
              rooms_address: '1984 Mathematics Road',
              rooms_lat: 49.28273, rooms_lon: -123.12074, rooms_seats: 60,
              rooms_type: 'Small Group', rooms_furniture: 'Classroom-Movable Tables & Chairs',
              rooms_href: 'http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MATH-102' },

            { rooms_fullname: 'Mathematics', rooms_shortname: 'MATH',
              rooms_number: '104', rooms_name: 'MATH_104',
              rooms_address: '1984 Mathematics Road',
              rooms_lat: 49.28273, rooms_lon: -123.12074, rooms_seats: 48,
              rooms_type: 'Open Design General Purpose', rooms_furniture: 'Classroom-Movable Tables & Chairs',
              rooms_href: 'http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MATH-104' },

            { rooms_fullname: 'Mathematics', rooms_shortname: 'MATH',
              rooms_number: '105', rooms_name: 'MATH_105',
              rooms_address: '1984 Mathematics Road',
              rooms_lat: 49.28273, rooms_lon: -123.12074, rooms_seats: 30,
              rooms_type: 'Open Design General Purpose', rooms_furniture: 'Classroom-Movable Tablets',
              rooms_href: 'http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MATH-105' },

            { rooms_fullname: 'Mathematics', rooms_shortname: 'MATH',
              rooms_number: '202', rooms_name: 'MATH_202',
              rooms_address: '1984 Mathematics Road',
              rooms_lat: 49.28273, rooms_lon: -123.12074, rooms_seats: 30,
              rooms_type: 'Small Group', rooms_furniture: 'Classroom-Movable Tablets',
              rooms_href: 'http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MATH-202' },

            { rooms_fullname: 'Mathematics', rooms_shortname: 'MATH',
              rooms_number: '203', rooms_name: 'MATH_203',
              rooms_address: '1984 Mathematics Road',
              rooms_lat: 49.28273, rooms_lon: -123.12074, rooms_seats: 48,
              rooms_type: 'Open Design General Purpose', rooms_furniture: 'Classroom-Movable Tables & Chairs',
              rooms_href: 'http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MATH-203' },

            { rooms_fullname: 'Mathematics', rooms_shortname: 'MATH',
              rooms_number: '204', rooms_name: 'MATH_204',
              rooms_address: '1984 Mathematics Road',
              rooms_lat: 49.28273, rooms_lon: -123.12074, rooms_seats: 30,
              rooms_type: 'Open Design General Purpose', rooms_furniture: 'Classroom-Movable Tablets',
              rooms_href: 'http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MATH-204' },

            { rooms_fullname: 'Mathematics', rooms_shortname: 'MATH',
              rooms_number: '225', rooms_name: 'MATH_225',
              rooms_address: '1984 Mathematics Road',
              rooms_lat: 49.28273, rooms_lon: -123.12074, rooms_seats: 25,
              rooms_type: 'Small Group', rooms_furniture: 'Classroom-Movable Tablets',
              rooms_href: 'http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MATH-225' },
        ];

        Log.test("Reading test zip file");

        let id = 'rooms';
        let content = fs.readFileSync("./rooms-small.zip").toString('base64');
        let controller = new DatasetController();

        Log.test("Finished reading test zip file, parsing zip...");

        return controller.process(id, content).then(function (resCode) {
            return controller.getDatasets().then(function (datasets) {
                expect(datasets[id]).to.deep.equal(expectedObj);
            });
        });
    });
});
