"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DatasetController_1 = require("./DatasetController");
var Util_1 = require("../Util");
var Filter = (function () {
    function Filter() {
    }
    Filter.prototype.isLeaf = function () {
        return true;
    };
    Filter.prototype.forEach = function (callback) {
        callback(this);
    };
    Filter.parse = function (key, obj) {
        if (obj === undefined || obj === null) {
            throw new Error("Filter.parse() - cannot parse undefined object");
        }
        var res = undefined;
        for (var key_1 in obj) {
            if (res !== undefined) {
                throw new Error("Filter.parse() - Filter should contain exactly one key, " +
                    "but extra key '" + key_1 + "' found");
            }
            if (LogicFilter.isMatch(key_1)) {
                res = LogicFilter.parse(key_1, obj[key_1]);
            }
            else if (NumberFilter.isMatch(key_1)) {
                res = NumberFilter.parse(key_1, obj[key_1]);
            }
            else if (StringFilter.isMatch(key_1)) {
                res = StringFilter.parse(key_1, obj[key_1]);
            }
            else if (NegationFilter.isMatch(key_1)) {
                res = NegationFilter.parse(key_1, obj[key_1]);
            }
            else {
                throw new Error("Filter.parse() - Unknown key in filter: " + key_1);
            }
        }
        if (res === undefined) {
            res = new Filter();
        }
        return res;
    };
    Filter.prototype.test = function (obj) {
        return true;
    };
    return Filter;
}());
exports.Filter = Filter;
var LogicFilter = (function (_super) {
    __extends(LogicFilter, _super);
    function LogicFilter(l_children) {
        _super.call(this);
        this.children = l_children;
    }
    LogicFilter.prototype.isLeaf = function () {
        return false;
    };
    LogicFilter.prototype.forEach = function (callback) {
        callback(this);
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.forEach(callback);
        }
    };
    LogicFilter.isMatch = function (key) {
        return key === 'AND' || key === 'OR';
    };
    LogicFilter.parse = function (key, obj) {
        if (obj === undefined || obj === null) {
            throw new Error("LogicFilter.parse() - cannot parse undefined object");
        }
        if (!(obj instanceof Array)) {
            throw new Error("LogicFilter.parse() - LOGICCOMPARISON expects key => array of Filter, " +
                "but value of type '" + (typeof obj) + "' is given");
        }
        var children = [];
        for (var i = 0; i < obj.length; i++) {
            children.push(Filter.parse('', obj[i]));
        }
        if (children.length == 0) {
            throw new Error("LogicFilter.parse() - LOGICCOMPARISON expects at least one child Filter");
        }
        if (key == 'AND') {
            return new AndLogicFilter(children);
        }
        else if (key == 'OR') {
            return new OrLogicFilter(children);
        }
        else {
            throw new Error("LogicFilter.parse() - Unknown key for LOGICCOMPARISON: " + key);
        }
    };
    return LogicFilter;
}(Filter));
exports.LogicFilter = LogicFilter;
var AndLogicFilter = (function (_super) {
    __extends(AndLogicFilter, _super);
    function AndLogicFilter() {
        _super.apply(this, arguments);
    }
    AndLogicFilter.prototype.test = function (obj) {
        for (var i = 0; i < this.children.length; i++) {
            if (!this.children[i].test(obj)) {
                return false;
            }
        }
        return true;
    };
    return AndLogicFilter;
}(LogicFilter));
exports.AndLogicFilter = AndLogicFilter;
var OrLogicFilter = (function (_super) {
    __extends(OrLogicFilter, _super);
    function OrLogicFilter() {
        _super.apply(this, arguments);
    }
    OrLogicFilter.prototype.test = function (obj) {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].test(obj)) {
                return true;
            }
        }
        return false;
    };
    return OrLogicFilter;
}(LogicFilter));
exports.OrLogicFilter = OrLogicFilter;
var NumberFilter = (function (_super) {
    __extends(NumberFilter, _super);
    function NumberFilter(l_column, l_value) {
        _super.call(this);
        this.column = l_column;
        this.value = l_value;
    }
    NumberFilter.isMatch = function (key) {
        return key === 'LT' || key === 'GT' || key === 'EQ';
    };
    NumberFilter.parse = function (key, obj) {
        if (obj === undefined || obj === null) {
            throw new Error("NumberFilter.parse() - cannot parse undefined object");
        }
        var col = undefined;
        var val = undefined;
        for (var x in obj) {
            if (col === undefined) {
                col = x;
                var tmp = obj[col];
                if (typeof tmp !== 'number') {
                    tmp = parseFloat(tmp);
                }
                if (isNaN(tmp)) {
                    throw new Error("NumberFilter.parse() - MCOMPARISON needs a string key and a numeric value: " +
                        "value '" + JSON.stringify(obj[col]) + "' is not numeric");
                }
                val = tmp;
            }
            else {
                throw new Error("NumberFilter.parse() - cannot have more than 1 key in MCOMPARISON");
            }
        }
        if (col === undefined) {
            throw new Error("NumberFilter.parse() - MCOMPARISON must have a single key-value pair");
        }
        if (key == 'LT') {
            return new LessThanNumberFilter(col, val);
        }
        else if (key == 'GT') {
            return new GreaterThanNumberFilter(col, val);
        }
        else if (key == 'EQ') {
            return new EqualNumberFilter(col, val);
        }
        else {
            throw new Error("NumberFilter.parse() - Unknown key for MCOMPARISON: " + key);
        }
    };
    return NumberFilter;
}(Filter));
exports.NumberFilter = NumberFilter;
var LessThanNumberFilter = (function (_super) {
    __extends(LessThanNumberFilter, _super);
    function LessThanNumberFilter() {
        _super.apply(this, arguments);
    }
    LessThanNumberFilter.prototype.test = function (obj) {
        return (typeof obj[this.column] === 'number' && obj[this.column] < this.value);
    };
    return LessThanNumberFilter;
}(NumberFilter));
exports.LessThanNumberFilter = LessThanNumberFilter;
var GreaterThanNumberFilter = (function (_super) {
    __extends(GreaterThanNumberFilter, _super);
    function GreaterThanNumberFilter() {
        _super.apply(this, arguments);
    }
    GreaterThanNumberFilter.prototype.test = function (obj) {
        return (typeof obj[this.column] === 'number' && obj[this.column] > this.value);
    };
    return GreaterThanNumberFilter;
}(NumberFilter));
exports.GreaterThanNumberFilter = GreaterThanNumberFilter;
var EqualNumberFilter = (function (_super) {
    __extends(EqualNumberFilter, _super);
    function EqualNumberFilter() {
        _super.apply(this, arguments);
    }
    EqualNumberFilter.prototype.test = function (obj) {
        return obj[this.column] == this.value;
    };
    return EqualNumberFilter;
}(NumberFilter));
exports.EqualNumberFilter = EqualNumberFilter;
var StringFilter = (function (_super) {
    __extends(StringFilter, _super);
    function StringFilter(l_column, l_pattern) {
        _super.call(this);
        this.column = l_column;
        this.pattern = l_pattern;
        if (this.pattern.length > 0 && this.pattern[0] == '*') {
            this.pattern = this.pattern.substring(1, this.pattern.length);
            this.anyBefore = true;
        }
        if (this.pattern.length > 0 && this.pattern[this.pattern.length - 1] == '*') {
            this.pattern = this.pattern.substring(0, this.pattern.length - 1);
            this.anyAfter = true;
        }
    }
    StringFilter.isMatch = function (key) {
        return key === 'IS';
    };
    StringFilter.parse = function (key, obj) {
        if (obj === undefined || obj === null) {
            throw new Error("StringFilter.parse() - cannot parse undefined object");
        }
        var col = undefined;
        var val = undefined;
        for (var x in obj) {
            if (col === undefined) {
                col = x;
                val = obj[col].toString();
            }
            else {
                throw new Error("StringFilter.parse() - cannot have more than 1 key in SCOMPARISON");
            }
        }
        if (col === undefined) {
            throw new Error("StringFilter.parse() - SCOMPARISON must have a single key-value pair");
        }
        if (key == 'IS') {
            return new StringFilter(col, val);
        }
        else {
            throw new Error("StringFilter.parse() - Unknown key for SCOMPARISON: " + key);
        }
    };
    StringFilter.prototype.test = function (obj) {
        if (typeof obj[this.column] !== 'string')
            return false;
        var str = obj[this.column];
        var i = str.indexOf(this.pattern);
        return (i != -1 &&
            (this.anyBefore || i == 0) &&
            (this.anyAfter || i + this.pattern.length == str.length));
    };
    return StringFilter;
}(Filter));
exports.StringFilter = StringFilter;
var NegationFilter = (function (_super) {
    __extends(NegationFilter, _super);
    function NegationFilter(l_child) {
        _super.call(this);
        this.child = l_child;
    }
    NegationFilter.prototype.isLeaf = function () {
        return false;
    };
    NegationFilter.prototype.forEach = function (callback) {
        callback(this);
        this.child.forEach(callback);
    };
    NegationFilter.isMatch = function (key) {
        return key === 'NOT';
    };
    NegationFilter.parse = function (key, obj) {
        if (obj === undefined || obj === null) {
            throw new Error("NegationFilter.parse() - cannot parse undefined object");
        }
        if (key === 'NOT') {
            return new NegationFilter(Filter.parse('', obj));
        }
        else {
            throw new Error("NegationFilter.parse() - unknown key for NEGATION: " + key);
        }
    };
    NegationFilter.prototype.test = function (obj) {
        return !this.child.test(obj);
    };
    return NegationFilter;
}(Filter));
exports.NegationFilter = NegationFilter;
var QueryController = (function () {
    function QueryController(datasets) {
        this.datasets = null;
        this.datasets = datasets;
    }
    QueryController.isValid = function (query) {
        if (typeof query !== 'undefined' && query !== null && Object.keys(query).length > 0) {
            return true;
        }
        return false;
    };
    QueryController.prototype.query = function (query) {
        Util_1.default.trace('QueryController::query( ' + JSON.stringify(query) + ' )');
        function roundN(x, n) {
            return Number(x.toFixed(n));
        }
        function square(x) { return x * x; }
        function latlondist(lat1, lon1, lat2, lon2) {
            var dlon = lon2 - lon1;
            var dlat = lat2 - lat1;
            dlon = dlon / 180 * Math.PI;
            dlat = dlat / 180 * Math.PI;
            var a = square(Math.sin(dlat / 2)) + Math.cos(lat1) * Math.cos(lat2) * square(Math.sin(dlon / 2));
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = 6373000 * c;
            return d;
        }
        var exprCustomFn = { roundN: roundN, latlondist: latlondist };
        function isValidExprOp(s) {
            return s == '+' || s == '-' || s == '*' || s == '/' || s == '%' || s == '?' || s == ':';
        }
        function isValidExprCol(s) {
            if (s.indexOf('_') == -1)
                return false;
            if (!DatasetController_1.default.getKeyType(s))
                return false;
            ids[s.substring(0, s.indexOf('_'))] = true;
            return true;
        }
        function isValidExprFunc(s) {
            return exprCustomFn[s] ||
                s == 'Math.sqrt' || s == 'Math.log' || s == 'Math.exp' ||
                s == 'Math.sin' || s == 'Math.cos' || s == 'Math.tan' ||
                s == 'Math.asin' || s == 'Math.acos' || s == 'Math.atan2' ||
                s == 'Math.floor' || s == 'Math.ceil' || s == 'Math.round' ||
                s == 'Math.min' || s == 'Math.max';
        }
        function findParenEnd(s, i) {
            var k = 1;
            while (k > 0 && i < s.length) {
                var c = s.substr(i, 1);
                if (c == '(')
                    k++;
                else if (c == ')')
                    k--;
                if (k == 0)
                    break;
                i++;
            }
            return i;
        }
        function parseExpr(s, inFn) {
            if (s.length == 0)
                return '';
            s = s.trim();
            var c0 = s.substr(0, 1);
            if (c0 == '(') {
                var i = findParenEnd(s, 1);
                return '(' + parseExpr(s.substring(1, i), false) + ')' + parseExpr(s.substring(Math.min(i + 1, s.length)), inFn);
            }
            else if (c0 == ')') {
                throw new Error("Unexpected ')' in expr");
            }
            else {
                var i1 = s.indexOf('(');
                var j1 = s.indexOf(' ');
                var k1 = s.indexOf(',');
                if (i1 >= 0 && isValidExprFunc(s.substring(0, i1))) {
                    var tok0 = s.substring(0, i1);
                    var i2 = findParenEnd(s, i1 + 1);
                    if (exprCustomFn[tok0]) {
                        tok0 = 'f.' + tok0;
                    }
                    return tok0 + '(' + parseExpr(s.substring(i1 + 1, i2), true) + ')' + parseExpr(s.substring(Math.min(i2 + 1, s.length)), inFn);
                }
                else if (inFn && (k1 >= 0 && (j1 == -1 || k1 < j1))) {
                    return parseExpr(s.substring(0, k1), inFn) + ', ' + parseExpr(s.substring(Math.min(k1 + 1, s.length)), inFn);
                }
                else if (j1 >= 0) {
                    return parseExpr(s.substring(0, j1), inFn) + ' ' + parseExpr(s.substring(Math.min(j1 + 1, s.length)), inFn);
                }
                else {
                    if (isValidExprOp(s) || !isNaN(parseFloat(s))) {
                        return s;
                    }
                    else if (isValidExprCol(s)) {
                        return 'e.' + s;
                    }
                    else {
                        throw new Error('Unknown token "' + s + '"');
                    }
                }
            }
        }
        Util_1.default.trace('QueryController::query( ... ): parsing GET');
        var datasetCols = [];
        var extraCols = [];
        var exprCols = [];
        var exprContent = [];
        var exprFn = [];
        var ids = {};
        var cols = [];
        var colsMap = {};
        if (query.GET instanceof Array) {
            for (var i = 0; i < query.GET.length; i++) {
                if (typeof query.GET[i] !== 'string') {
                    throw new Error("Expect query GET to be array of string, " +
                        "but array contains element of type " + (typeof query.GET[i]));
                }
            }
            cols = query.GET;
        }
        else {
            throw new Error("Expect query GET to be array of string, " +
                "but found value of type " + (typeof query.GET));
        }
        for (var i = 0; i < cols.length; i++) {
            var col = cols[i];
            var idx = col.indexOf('_');
            if (col.substr(0, 4) == 'expr') {
                var i1 = col.indexOf('(');
                var i2 = col.length - 1;
                while (i2 >= 0 && col.substr(i2, 1) != ')')
                    i2--;
                if (i1 < 0 || i2 < 0 || i1 + 1 >= i2 || col.indexOf(' AS ') == -1) {
                    throw new Error('Expressions in GET must follow "expr(...) AS <key>');
                }
                var origStr = col;
                var toks = origStr.trim().split(' ');
                col = toks[toks.length - 1];
                cols[i] = col;
                exprCols.push(col);
                exprContent.push(origStr.substring(i1 + 1, i2));
            }
            else if (idx === -1) {
                extraCols.push(col);
            }
            else {
                ids[col.substring(0, idx)] = true;
                datasetCols.push(col);
            }
            colsMap[col] = true;
        }
        Util_1.default.trace('QueryController::query( ... ): Dataset columns are: ' + JSON.stringify(datasetCols));
        Util_1.default.trace('QueryController::query( ... ): Extra columns are: ' + JSON.stringify(extraCols));
        if (query.ORDER) {
            Util_1.default.trace('QueryController::query( ... ): parsing ORDER');
            if ((typeof query.ORDER) === 'string') {
                var orderKey = query.ORDER;
                if (!colsMap[orderKey]) {
                    throw new Error("ORDER column '" + orderKey + "' not found in GET columns");
                }
            }
            else if ((typeof query.ORDER) === 'object') {
                var orderKeys = query.ORDER.keys;
                if (!(orderKeys instanceof Array)) {
                    throw new Error("ORDER.keys must be a non-empty array but got type '" + (typeof orderKeys) + "': " + JSON.stringify(orderKeys));
                }
                if (orderKeys.length == 0) {
                    throw new Error("ORDER.keys must be a non-empty array, but got empty array");
                }
                for (var i = 0; i < orderKeys.length; i++) {
                    var key = orderKeys[i];
                    if ((typeof key !== 'string')) {
                        throw new Error("ORDER column " + JSON.stringify(key) + " is not a string");
                    }
                    if (!colsMap[key]) {
                        throw new Error("ORDER column '" + key + "' not found in GET columns");
                    }
                }
                Util_1.default.trace('QueryController::query( ... ): Found list of keys in ORDER: ' + orderKeys);
            }
            else {
                throw new Error("ORDER, if specified, must be string or object");
            }
        }
        else {
            Util_1.default.trace('QueryController::query( ... ): ORDER not present, skip parsing ORDER');
        }
        var groupKeys = [];
        var applyKeys = [];
        var applyOps = [];
        var applyRes = [];
        if (query.GROUP && query.APPLY) {
            Util_1.default.trace('QueryController::query( ... ): parsing GROUP');
            if (!(query.GROUP instanceof Array)) {
                throw new Error('GROUP must be non-empty array of strings ' +
                    'but ' + JSON.stringify(query.GROUP) + ' is of type "' + (typeof query.GROUP) + '"');
            }
            if (query.GROUP.length <= 0) {
                throw new Error('GROUP must be non-empty array of strings but given empty array');
            }
            var seenGroupKeys = {};
            for (var i = 0; i < query.GROUP.length; i++) {
                var groupMatch = false;
                var groupElement = query.GROUP[i];
                if (typeof groupElement !== 'string') {
                    throw new Error('GROUP must be non-empty array of string ' +
                        'but ' + JSON.stringify(groupElement) + ' is of type "' + (typeof groupElement) + '"');
                }
                if (seenGroupKeys[groupElement]) {
                    throw new Error('Duplicate GROUP key: ' + groupElement);
                }
                seenGroupKeys[groupElement] = true;
                groupKeys.push(groupElement);
            }
            Util_1.default.trace('QueryController::query( ... ): parsing APPLY');
            if (!(query.APPLY instanceof Array)) {
                throw new Error('APPLY must be array of strings');
            }
            var seenApplyKeys = {};
            for (var i = 0; i < query.APPLY.length; i++) {
                var isMatch = false;
                var applyElement = query.APPLY[i];
                if (typeof applyElement !== 'object') {
                    throw new Error('APPLY must be array of objects ' +
                        'but ' + JSON.stringify(applyElement) + ' is of type "' + (typeof applyElement) + '"');
                }
                var newKeyCnt = 0;
                for (var newKey in applyElement) {
                    if (newKeyCnt > 0) {
                        throw new Error('Each object in APPLY must contain exactly 1 key but multiple found');
                    }
                    newKeyCnt++;
                    if (seenApplyKeys[newKey]) {
                        throw new Error('Duplicate APPLY key: ' + newKey);
                    }
                    seenApplyKeys[newKey] = true;
                    var applyOpCnt = 0;
                    for (var applyOp in applyElement[newKey]) {
                        if (applyOpCnt > 0) {
                            throw new Error('Each object in APPLY must contain exactly 1 operation but multiple found');
                        }
                        applyOpCnt++;
                        var origKey = applyElement[newKey][applyOp];
                        if (seenGroupKeys[origKey]) {
                            throw new Error('cannot have key both in GROUP and apply: ' + origKey);
                        }
                        var found = false;
                        for (var j = 0; j < QueryController.validApplyOps.length; j++) {
                            if (QueryController.validApplyOps[j] === applyOp) {
                                var colType = DatasetController_1.default.getKeyType(origKey);
                                if (!colType) {
                                    for (var _i = 0, exprCols_1 = exprCols; _i < exprCols_1.length; _i++) {
                                        var e = exprCols_1[_i];
                                        if (e == origKey) {
                                            colType = 'number';
                                            break;
                                        }
                                    }
                                }
                                if (origKey.substring(0, 4) == 'expr') {
                                    var k1 = origKey.indexOf('(');
                                    var k2 = origKey.length - 1;
                                    while (k2 >= 0 && origKey.substr(k2, 1) != ')')
                                        k2--;
                                    if (k1 == -1 || k2 <= k1)
                                        throw new Error("Invalid expression '" + origKey + "'");
                                    exprCols.push("__APPLY_" + newKey);
                                    exprContent.push(origKey.substring(k1 + 1, k2));
                                    origKey = "__APPLY_" + newKey;
                                    colType = "number";
                                }
                                else {
                                    if (origKey.indexOf('_') > 0) {
                                        ids[origKey.substr(0, origKey.indexOf('_'))] = true;
                                    }
                                }
                                if (!QueryController.validApplyTypes[j][colType]) {
                                    throw new Error(applyOp + ' cannot take key of type "' + colType + '" which is the type of column "' + origKey + '"');
                                }
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            throw new Error('Unknown APPLY operation: ' + applyOp);
                        }
                        applyKeys.push(origKey);
                        applyOps.push(applyOp);
                        applyRes.push(newKey);
                    }
                }
            }
            Util_1.default.trace('QueryController::query( ... ): verifying GET keys are in GROUP or APPLY');
            for (var _a = 0, datasetCols_1 = datasetCols; _a < datasetCols_1.length; _a++) {
                var k = datasetCols_1[_a];
                if (!seenGroupKeys[k]) {
                    throw new Error("key '" + k + "' with underscore found in GET but not in GROUP");
                }
            }
            for (var _b = 0, extraCols_1 = extraCols; _b < extraCols_1.length; _b++) {
                var k = extraCols_1[_b];
                if (!seenApplyKeys[k]) {
                    throw new Error("key '" + k + "' without underscore found in GET but not in APPLY");
                }
            }
        }
        else {
            if (!query.GROUP && !query.APPLY && (extraCols.length > 0)) {
                throw new Error('GET contains a custom group when GROUP and APPLY are not present');
            }
            else if (query.GROUP && !query.APPLY) {
                throw new Error('Missing APPLY in query. Both GROUP and APPLY must be present for either to be applicable.');
            }
            else if (!query.GROUP && query.APPLY) {
                throw new Error('Missing GROUP in query. Both GROUP and APPLY must be present for either to be applicable.');
            }
            else {
                Util_1.default.trace('QueryController::query( ... ): GROUP and APPLY are both not present, skip parsing GROUP/APPLY');
            }
        }
        Util_1.default.trace('QueryController::query( ... ): parsing WHERE');
        var tmpcnt = 0;
        var filter = Filter.parse('', query.WHERE);
        filter.forEach(function (curr) {
            if (curr.isLeaf() && curr.column) {
                if (curr.column.substring(0, 4) == 'expr') {
                    var k1 = curr.column.indexOf('(');
                    var k2 = curr.column.length - 1;
                    while (k2 >= 0 && curr.column.substr(k2, 1) != ')')
                        k2--;
                    if (k1 == -1 || k2 <= k1)
                        throw new Error("Invalid expression '" + curr.column + "'");
                    exprCols.push("__WHERE_" + tmpcnt);
                    exprContent.push(curr.column.substring(k1 + 1, k2));
                    curr.column = "__WHERE_" + tmpcnt;
                    tmpcnt++;
                }
                else if (curr.column.indexOf('_') >= 0) {
                    var parts = curr.column.split('_');
                    ids[parts[0]] = true;
                }
                else {
                    var found = false;
                    for (var _i = 0, exprCols_2 = exprCols; _i < exprCols_2.length; _i++) {
                        var col = exprCols_2[_i];
                        if (col == curr.column) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        throw new Error("Columns referenced in WHERE must have an underscore to be valid, but found '" + curr.column + "'");
                    }
                }
            }
        });
        for (var i = 0; i < exprContent.length; i++) {
            exprContent[i] = parseExpr(exprContent[i], false);
            exprFn[i] = new Function('e', 'f', 'return ' + exprContent[i]);
            Util_1.default.trace('Parsed expression: "' + exprContent[i] + '" as column "' + exprCols[i] + '"');
        }
        Util_1.default.trace('QueryController::query( ... ): checking for missing datasets / multiple datasets');
        var idList = [];
        var missing = [];
        for (var id in ids) {
            if (!this.datasets[id]) {
                missing.push(id);
            }
            else {
                idList.push(id);
            }
        }
        if (missing.length > 0) {
            return { missing: missing };
        }
        if (idList.length !== 1) {
            throw new Error("Current version supports only exactly one dataset");
        }
        var theID = idList[0];
        Util_1.default.trace("QueryController::query( ... ): dataset id is '" + theID + "'");
        Util_1.default.trace("QueryController::query( ... ): filtering dataset");
        var resRaw = [];
        for (var i = 0; i < this.datasets[theID].length; i++) {
            var entry = this.datasets[theID][i];
            for (var j = 0; j < exprCols.length; j++) {
                entry[exprCols[j]] = exprFn[j](entry, exprCustomFn);
            }
            if (filter.test(entry)) {
                var e = {};
                for (var k in entry)
                    e[k] = entry[k];
                e.rid = i;
                resRaw.push(e);
            }
        }
        var filterCount = resRaw.length;
        if (query.GROUP && query.APPLY && resRaw.length > 0) {
            var resRaw2 = [];
            Util_1.default.trace("QueryController::query( ... ): grouping filtered dataset by GROUP keys = " + JSON.stringify(groupKeys));
            resRaw.sort(function (a, b) {
                var keyID = -1;
                var v1 = 0;
                var v2 = 0;
                while (v1 == v2 && keyID + 1 < groupKeys.length) {
                    keyID++;
                    v1 = a[groupKeys[keyID]];
                    v2 = b[groupKeys[keyID]];
                }
                if (v1 == v2)
                    return 0;
                if (v1 < v2)
                    return -1;
                return 1;
            });
            var groups = [];
            var currGroup = [];
            var prevRow = {};
            for (var rid = 0; rid < resRaw.length; rid++) {
                var row = resRaw[rid];
                if (currGroup.length > 0) {
                    var isEqualPrev = true;
                    for (var i = 0; i < groupKeys.length; i++) {
                        var k = groupKeys[i];
                        if (row[k] !== prevRow[k]) {
                            isEqualPrev = false;
                            break;
                        }
                    }
                    if (!isEqualPrev) {
                        groups.push(currGroup);
                        currGroup = [];
                    }
                }
                currGroup.push(row);
                prevRow = row;
            }
            groups.push(currGroup);
            currGroup = [];
            Util_1.default.trace("QueryController::query( ... ): performing APPLY operations to each group");
            var uniques = {};
            for (var gid = 0; gid < groups.length; gid++) {
                groups[gid].sort(function (a, b) {
                    return a.rid - b.rid;
                });
                var curr = {};
                var row0 = groups[gid][0];
                for (var i = 0; i < groupKeys.length; i++) {
                    var k = groupKeys[i];
                    curr[k] = row0[k];
                }
                for (var i = 0; i < applyKeys.length; i++) {
                    var applyOp = applyOps[i];
                    var origKey = applyKeys[i];
                    var resKey = applyRes[i];
                    if (applyOp == 'MAX' || applyOp == 'MIN' || applyOp == 'AVG') {
                        curr[resKey] = row0[origKey];
                    }
                    else {
                        uniques[resKey] = [row0[origKey]];
                    }
                }
                for (var rid = 1; rid < groups[gid].length; rid++) {
                    var row = groups[gid][rid];
                    for (var i = 0; i < applyKeys.length; i++) {
                        var origKey = applyKeys[i];
                        var applyOp = applyOps[i];
                        var resKey = applyRes[i];
                        if (applyOp == 'MAX') {
                            curr[resKey] = (row[origKey] > curr[resKey] ? row[origKey] : curr[resKey]);
                        }
                        else if (applyOp == 'MIN') {
                            curr[resKey] = (row[origKey] < curr[resKey] ? row[origKey] : curr[resKey]);
                        }
                        else if (applyOp == 'AVG') {
                            curr[resKey] += row[origKey];
                        }
                        else {
                            uniques[resKey].push(row[origKey]);
                        }
                    }
                }
                for (var i = 0; i < applyKeys.length; i++) {
                    var origKey = applyKeys[i];
                    var applyOp = applyOps[i];
                    var resKey = applyRes[i];
                    if (applyOp == 'AVG') {
                        curr[resKey] /= groups[gid].length;
                        curr[resKey] = Number(curr[resKey].toFixed(2));
                    }
                    else if (applyOp == 'COUNT') {
                        uniques[resKey].sort();
                        var cnt = 0;
                        var prevVal = uniques[resKey][0];
                        for (var j = 1; j < uniques[resKey].length; j++) {
                            var val = uniques[resKey][j];
                            if (val != prevVal) {
                                cnt++;
                            }
                            prevVal = val;
                        }
                        cnt++;
                        curr[resKey] = cnt;
                    }
                }
                resRaw2.push(curr);
            }
            resRaw = resRaw2;
        }
        else {
            Util_1.default.trace("QueryController::query( ... ): skipping GROUP/APPLY as they are not provided");
        }
        if (query.ORDER) {
            if ((typeof query.ORDER) === 'string') {
                var orderKey_1 = query.ORDER;
                Util_1.default.trace("QueryController::query( ... ): sorting by " + orderKey_1);
                resRaw.sort(function (a, b) {
                    var v1 = a[orderKey_1];
                    var v2 = b[orderKey_1];
                    if (v1 == v2)
                        return 0;
                    if (v1 < v2)
                        return -1;
                    return 1;
                });
            }
            else if ((typeof query.ORDER) === 'object') {
                var orderDir = query.ORDER.dir;
                var orderKeys_1 = query.ORDER.keys;
                Util_1.default.trace("QueryController::query( ... ): sorting by direction " + orderDir + " with keys " + JSON.stringify(orderKeys_1));
                if (orderDir === 'UP' || orderDir === 'DOWN') {
                    var dirMult_1 = (orderDir == 'UP' ? 1 : -1);
                    resRaw.sort(function (a, b) {
                        var keyID = -1;
                        var v1 = 0;
                        var v2 = 0;
                        while (v1 == v2 && keyID + 1 < orderKeys_1.length) {
                            keyID++;
                            v1 = a[orderKeys_1[keyID]];
                            v2 = b[orderKeys_1[keyID]];
                        }
                        if (v1 == v2)
                            return 0;
                        if (v1 < v2)
                            return -dirMult_1;
                        return dirMult_1;
                    });
                }
                else {
                    throw new Error('Direction of ORDER must be string UP or DOWN');
                }
            }
        }
        else {
            Util_1.default.trace("QueryController::query( ... ): skipping sorting as key not provided");
        }
        Util_1.default.trace("QueryController::query( ... ): removing unwanted columns");
        var res = [];
        for (var i = 0; i < resRaw.length; i++) {
            var filteredRow = {};
            for (var j = 0; j < cols.length; j++) {
                filteredRow[cols[j]] = resRaw[i][cols[j]];
            }
            for (var j = 0; j < applyOps.length; j++) {
                if (applyOps[j] == 'AVG') {
                }
            }
            res.push(filteredRow);
        }
        Util_1.default.trace("QueryController::query( ... ): filtering complete, matched " + filterCount + " entries " +
            "out of " + this.datasets[theID].length + " entries searched, and grouped into " + res.length + " entries");
        if (query.AS !== 'TABLE') {
            throw new Error("Unsupported output format: " + JSON.stringify(query.AS));
        }
        return { render: query.AS, result: res };
    };
    QueryController.validApplyOps = ['MAX', 'MIN', 'AVG', 'COUNT'];
    QueryController.validApplyTypes = [{ 'number': true }, { 'number': true }, { 'number': true }, { 'string': true, 'number': true }];
    return QueryController;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = QueryController;
//# sourceMappingURL=QueryController.js.map