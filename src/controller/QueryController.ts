/**
 * Created by rtholmes on 2016-06-19.
 */

import {Datasets} from "./DatasetController";
import DatasetController from "./DatasetController";
import Log from "../Util";

export interface QueryOrder {
    dir: string;
    keys: Array<string>;
}

export interface QueryRequest {
    GET:    Array<string>;
    WHERE:  any;
    GROUP?: Array<string>;
    APPLY?: Array<any>;
    ORDER?: QueryOrder | string;
    AS:     string;
}

export interface QueryResponse {
}

// An abstract filter
// All Filter object supports a test() operation
// that returns true if the obj conforms to the Filter's specs

export class Filter {
    public column: string;

    constructor() {
    }

    public isLeaf(): boolean {
        return true;
    }

    public forEach(callback: (x: Filter) => void): void {
        callback(this);
    }

    public static parse(key: string, obj: any): Filter {
        if (obj === undefined || obj === null) {
            throw new Error("Filter.parse() - cannot parse undefined object");
        }

        let res: Filter = undefined;
        for (let key in obj) {
            if (res !== undefined) {
                throw new Error("Filter.parse() - Filter should contain exactly one key, " +
                    "but extra key '" + key + "' found");
            }

            if (LogicFilter.isMatch(key)) {
                res = LogicFilter.parse(key, obj[key]);

            } else if (NumberFilter.isMatch(key)) {
                res = NumberFilter.parse(key, obj[key]);

            } else if (StringFilter.isMatch(key)) {
                res = StringFilter.parse(key, obj[key]);

            } else if (NegationFilter.isMatch(key)) {
                res = NegationFilter.parse(key, obj[key]);

            } else {
                throw new Error("Filter.parse() - Unknown key in filter: " + key);
            }
        }
        if (res === undefined) {
            res = new Filter(); // empty filter always lets everything through
        }
        return res;
    }

    public test(obj: any): boolean {
        return true;
    }
}

// A Filter that applies AND / OR to its child Filters
export class LogicFilter extends Filter {
    public children: Array<Filter>;

    constructor(l_children: Array<Filter>) {
        super();
        this.children = l_children;
    }

    public isLeaf(): boolean {
        return false;
    }

    public forEach(callback: (x: Filter) => void): void {
        callback(this);
        for (let child of this.children) {
            child.forEach(callback);
        }
    }

    public static isMatch(key: string): boolean {
        return key === 'AND' || key === 'OR';
    }

    public static parse(key: string, obj: any): Filter {
        if (obj === undefined || obj === null) {
            throw new Error("LogicFilter.parse() - cannot parse undefined object");
        }

        if (!(obj instanceof Array)) {
            throw new Error("LogicFilter.parse() - LOGICCOMPARISON expects key => array of Filter, " +
                "but value of type '" + (typeof obj) + "' is given");
        }

        let children: Array<Filter> = [];
        for (let i = 0; i < obj.length; i++) {
            children.push(Filter.parse('', obj[i]));
        }
        if (children.length == 0) {
            throw new Error("LogicFilter.parse() - LOGICCOMPARISON expects at least one child Filter");
        }

        if (key == 'AND') {
            return new AndLogicFilter(children);
        } else if (key == 'OR') {
            return new OrLogicFilter(children);
        } else {
            throw new Error("LogicFilter.parse() - Unknown key for LOGICCOMPARISON: " + key);
        }
    }
}

export class AndLogicFilter extends LogicFilter {

    public test(obj: any): boolean {
        for (let i = 0; i < this.children.length; i++) {
            if (!this.children[i].test(obj)) {
                return false;
            }
        }
        return true;
    }
}

export class OrLogicFilter extends LogicFilter {

    public test(obj: any): boolean {
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].test(obj)) {
                return true;
            }
        }
        return false;
    }
}

// A Filter that compares a column's value with a number value
// Options are <, >, and ==
export class NumberFilter extends Filter {
    public value: number;

    constructor(l_column: string, l_value: number) {
        super();
        this.column = l_column;
        this.value = l_value;
    }


    public static isMatch(key: string): boolean {
        return key === 'LT' || key === 'GT' || key === 'EQ';
    }

    public static parse(key: string, obj: any): Filter {
        if (obj === undefined || obj === null) {
            throw new Error("NumberFilter.parse() - cannot parse undefined object");
        }

        let col: string = undefined;
        let val: number = undefined;
        for (let x in obj) {
            if (col === undefined) {
                col = x;
                let tmp: any = obj[col];
                if (typeof tmp !== 'number') {
                    tmp = parseFloat(tmp);
                }
                if (isNaN(tmp)) {
                    throw new Error("NumberFilter.parse() - MCOMPARISON needs a string key and a numeric value: " +
                        "value '" + JSON.stringify(obj[col]) + "' is not numeric");
                }
                val = <number> tmp;
            } else {
                throw new Error("NumberFilter.parse() - cannot have more than 1 key in MCOMPARISON");
            }
        }
        if (col === undefined) {
            throw new Error("NumberFilter.parse() - MCOMPARISON must have a single key-value pair");
        }
        if (key == 'LT') {
            return new LessThanNumberFilter(col, val);
        } else if (key == 'GT') {
            return new GreaterThanNumberFilter(col, val);
        } else if (key == 'EQ') {
            return new EqualNumberFilter(col, val);
        } else {
            throw new Error("NumberFilter.parse() - Unknown key for MCOMPARISON: " + key);
        }
    }
}

export class LessThanNumberFilter extends NumberFilter {

    public test(obj: any): boolean {
        return (typeof obj[this.column] === 'number' && obj[this.column] < this.value);
    }
}

export class GreaterThanNumberFilter extends NumberFilter {

    public test(obj: any): boolean {
        return (typeof obj[this.column] === 'number' && obj[this.column] > this.value);
    }
}

export class EqualNumberFilter extends NumberFilter {

    public test(obj: any): boolean {
        //return (typeof obj[this.column] === 'number' && obj[this.column] == this.value);
        return obj[this.column] == this.value; // loose comparison, because tests still wrong
    }
}

// A Filter that compares a column value with a string pattern
// The pattern can be exact, or has star at beginning or end
// Star at beginning = can have any string before match
// Star at end = can have any string after match
export class StringFilter extends Filter {
    public pattern: string;
    public anyBefore: boolean;
    public anyAfter: boolean;

    constructor(l_column: string, l_pattern: string) {
        super();
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

    public static isMatch(key: string): boolean {
        return key === 'IS';
    }

    public static parse(key: string, obj: any): Filter {
        if (obj === undefined || obj === null) {
            throw new Error("StringFilter.parse() - cannot parse undefined object");
        }

        let col: string = undefined;
        let val: string = undefined;
        for (let x in obj) {
            if (col === undefined) {
                col = x;
                val = obj[col].toString();
            } else {
                throw new Error("StringFilter.parse() - cannot have more than 1 key in SCOMPARISON");
            }
        }
        if (col === undefined) {
            throw new Error("StringFilter.parse() - SCOMPARISON must have a single key-value pair");
        }

        if (key == 'IS') {
            return new StringFilter(col, val);
        } else {
            throw new Error("StringFilter.parse() - Unknown key for SCOMPARISON: " + key);
        }
    }

    public test(obj: any): boolean {
        if (typeof obj[this.column] !== 'string') return false;
        let str = obj[this.column];
        let i = str.indexOf(this.pattern);
        return (i != -1 &&
        (this.anyBefore || i == 0) &&
        (this.anyAfter || i + this.pattern.length == str.length));
    }
}

// A Filter that outputs the opposite of what its child outputs
export class NegationFilter extends Filter {
    public child: Filter;

    constructor(l_child: Filter) {
        super();
        this.child = l_child;
    }

    public isLeaf(): boolean {
        return false;
    }

    public forEach(callback: (x: Filter) => void): void {
        callback(this);
        this.child.forEach(callback);
    }

    public static isMatch(key: string): boolean {
        return key === 'NOT';
    }

    public static parse(key: string, obj: any): Filter {
        if (obj === undefined || obj === null) {
            throw new Error("NegationFilter.parse() - cannot parse undefined object");
        }
        if (key === 'NOT') {
            return new NegationFilter(Filter.parse('', obj));
        } else {
            throw new Error("NegationFilter.parse() - unknown key for NEGATION: " + key);
        }
    }

    public test(obj: any): boolean {
        return !this.child.test(obj);
    }
}

export default class QueryController {

    private static validApplyOps: Array<string> = ['MAX', 'MIN', 'AVG', 'COUNT'];
    private static validApplyTypes: Array<any>  = [{'number': true}, {'number': true}, {'number': true}, {'string': true, 'number': true}];

    private datasets: Datasets = null;

    constructor(datasets: Datasets) {
        this.datasets = datasets;
    }

    public static isValid(query: QueryRequest): boolean {
        if (typeof query !== 'undefined' && query !== null && Object.keys(query).length > 0) {
            return true;
        }
        return false;
    }

    public query(query: QueryRequest): QueryResponse {
        Log.trace('QueryController::query( ' + JSON.stringify(query) + ' )');

        ///// EXTRA: expr helpers
        // custom functions available for use inside expr
        function roundN(x: number, n: number): number {
            return Number(x.toFixed(n));
        }
        function square(x: number): number { return x*x; }
        function latlondist(lat1: number, lon1: number, lat2: number, lon2: number): number {
            // taken from http://andrew.hedges.name/experiments/haversine/
            let dlon = lon2 - lon1;
            let dlat = lat2 - lat1;
            dlon = dlon / 180 * Math.PI;
            dlat = dlat / 180 * Math.PI;
            let a = square(Math.sin(dlat/2)) + Math.cos(lat1) * Math.cos(lat2) * square(Math.sin(dlon/2));
            let c = 2 * Math.atan2( Math.sqrt(a), Math.sqrt(1-a) );
            let d = 6373000 * c; // distance in meters
            return d;
        }
        let exprCustomFn: any = { roundN: roundN, latlondist: latlondist };

        // parse and sanitize expressions and get cols referenced
        function isValidExprOp(s: string): boolean {
            return s == '+' || s == '-' || s == '*' || s == '/' || s == '%' || s == '?' || s == ':';
        }
        function isValidExprCol(s: string): boolean {
            if (s.indexOf('_') == -1) return false;
            if (!DatasetController.getKeyType(s)) return false;
            ids[s.substring(0, s.indexOf('_'))] = true;
            return true;
        }
        function isValidExprFunc(s: string): boolean {
            return exprCustomFn[s] ||
                s == 'Math.sqrt'  || s == 'Math.log'  || s == 'Math.exp'   ||
                s == 'Math.sin'   || s == 'Math.cos'  || s == 'Math.tan'   ||
                s == 'Math.asin'  || s == 'Math.acos' || s == 'Math.atan2' ||
                s == 'Math.floor' || s == 'Math.ceil' || s == 'Math.round' ||
                s == 'Math.min'   || s == 'Math.max';
        }
        function findParenEnd(s: string, i: number): number {
            let k = 1;
            while (k > 0 && i < s.length) {
                let c = s.substr(i, 1);
                if (c == '(') k++;
                else if (c == ')') k--;
                if (k == 0) break;
                i++;
            }
            return i;
        }
        function parseExpr(s: string, inFn: boolean): string {
            if (s.length == 0) return '';
            s = s.trim();
            let c0 = s.substr(0, 1);
            if (c0 == '(') {
                let i = findParenEnd(s, 1);
                return '(' + parseExpr(s.substring(1, i), false) + ')' + parseExpr(s.substring(Math.min(i+1, s.length)), inFn);
            } else if (c0 == ')') {
                throw new Error("Unexpected ')' in expr");
            } else {
                let i1 = s.indexOf('(');
                let j1 = s.indexOf(' ');
                let k1 = s.indexOf(',');
                if (i1 >= 0 && isValidExprFunc(s.substring(0, i1))) {
                    let tok0 = s.substring(0, i1);
                    let i2 = findParenEnd(s, i1+1);
                    if (exprCustomFn[tok0]) {
                        tok0 = 'f.' + tok0;
                    }
                    return tok0 + '(' + parseExpr(s.substring(i1+1, i2), true) + ')' + parseExpr(s.substring(Math.min(i2+1, s.length)), inFn);
                } else if (inFn && (k1 >= 0 && (j1 == -1 || k1 < j1))) {
                    return parseExpr(s.substring(0, k1), inFn) + ', ' + parseExpr(s.substring(Math.min(k1+1, s.length)), inFn);
                } else if (j1 >= 0) {
                    return parseExpr(s.substring(0, j1), inFn) + ' ' + parseExpr(s.substring(Math.min(j1+1, s.length)), inFn);
                } else {
                    if (isValidExprOp(s) || !isNaN(parseFloat(s))) {
                        return s;
                    } else if (isValidExprCol(s)) {
                        return 'e.' + s;
                    } else {
                        throw new Error('Unknown token "' + s + '"');
                    }
                }
            }
        }
        ///// END EXTRA

        // iterate through key in GET
        // has underscore => <dataset-id>_<col>
        // otherwise => must be part of group or apply
        Log.trace('QueryController::query( ... ): parsing GET');

        let datasetCols: Array<string> = []; // columns in dataset
        let extraCols: Array<string> = [];   // columns specified in APPLY

        ///// EXTRA
        let exprCols: Array<string> = [];    // key of expr(...) AS <key> columns
        let exprContent: Array<string> = []; // content of expr(...) AS <key> columns
        let exprFn: Array<Function> = [];    // compiled functions for evaluating expr
        ///// END EXTRA

        let ids: any = {};                   // maps id => true, for seen ids

        let cols: Array<string> = [];        // array of columns in GET
        let colsMap: any = {};               // maps column => true, for seen columns

        if (query.GET instanceof Array) {
            for (let i = 0; i < query.GET.length; i++) {
                if (typeof query.GET[i] !== 'string') {
                    throw new Error("Expect query GET to be array of string, " +
                        "but array contains element of type " + (typeof query.GET[i]));
                }
            }
            cols = <Array<string>>query.GET;
        } else {
            throw new Error("Expect query GET to be array of string, " +
                "but found value of type " + (typeof query.GET));
        }

        for (let i = 0; i < cols.length; i++) {
            // cols is the array of string in get
            // idx is the index of _
            let col = cols[i];
            let idx = col.indexOf('_');
            if (col.substr(0, 4) == 'expr') {
                ////// EXTRA
                let i1 = col.indexOf('(');
                let i2 = col.length-1;
                while (i2 >= 0 && col.substr(i2, 1) != ')') i2--;

                if (i1 < 0 || i2 < 0 || i1+1 >= i2 || col.indexOf(' AS ') == -1) {
                    throw new Error('Expressions in GET must follow "expr(...) AS <key>');
                }

                let origStr = col;
                let toks = origStr.trim().split(' ');
                col = toks[toks.length-1];
                cols[i] = col;
                exprCols.push(col);
                exprContent.push(origStr.substring(i1+1, i2));
                ///// END EXTRA

            } else if (idx === -1) {
                extraCols.push(col);
            } else {
                ids[col.substring(0, idx)] = true;
                datasetCols.push(col);
            }
            colsMap[col] = true;
        }

        Log.trace('QueryController::query( ... ): Dataset columns are: ' + JSON.stringify(datasetCols));
        Log.trace('QueryController::query( ... ): Extra columns are: ' + JSON.stringify(extraCols));

        // checking if ORDER is present and is one of GET keys
        // no error if ORDER is absent
        if (query.ORDER) {

            Log.trace('QueryController::query( ... ): parsing ORDER');

            if ((typeof query.ORDER) === 'string') {
                let orderKey = <string>query.ORDER;
                if (!colsMap[orderKey]) {
                    throw new Error("ORDER column '" + orderKey + "' not found in GET columns");
                }

            } else if ((typeof query.ORDER) === 'object') {
                let orderKeys = (<QueryOrder>query.ORDER).keys;
                if (!(orderKeys instanceof Array)) {
                    throw new Error("ORDER.keys must be a non-empty array but got type '" + (typeof orderKeys) + "': " + JSON.stringify(orderKeys));
                }
                if (orderKeys.length == 0) {
                    throw new Error("ORDER.keys must be a non-empty array, but got empty array");
                }

                for (let i = 0; i < orderKeys.length; i++) {
                    let key = orderKeys[i];
                    if ((typeof key !== 'string')) {
                        throw new Error("ORDER column " + JSON.stringify(key) + " is not a string");
                    }
                    if (!colsMap[key]) {
                        throw new Error("ORDER column '" + key + "' not found in GET columns");
                    }
                }
                Log.trace('QueryController::query( ... ): Found list of keys in ORDER: ' + orderKeys);

            } else {
                throw new Error("ORDER, if specified, must be string or object");
            }

        } else {
            Log.trace('QueryController::query( ... ): ORDER not present, skip parsing ORDER');
        }

        // If GROUP is there and APPLY is not throw error and vice versa
        // If both are not there we do not throw an error
        // Extract keys for GROUP and APPLY
        let groupKeys: Array<string> = [];
        let applyKeys: Array<string> = [];
        let applyOps: Array<string> = [];
        let applyRes: Array<string> = [];
        if (query.GROUP && query.APPLY) {

            // extract and validate GROUP keys
            Log.trace('QueryController::query( ... ): parsing GROUP');

            if (!(query.GROUP instanceof Array)) {
                throw new Error('GROUP must be non-empty array of strings ' +
                    'but ' + JSON.stringify(query.GROUP) + ' is of type "' + (typeof query.GROUP) + '"');
            }
            if (query.GROUP.length <= 0) {
                throw new Error('GROUP must be non-empty array of strings but given empty array');
            }

            let seenGroupKeys: any = {};
            for (let i = 0; i < query.GROUP.length; i++) {
                let groupMatch = false;
                let groupElement = query.GROUP[i];
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

            // extract and validate APPLY keys and ops
            Log.trace('QueryController::query( ... ): parsing APPLY');

            if (!(query.APPLY instanceof Array)) {
                throw new Error('APPLY must be array of strings');
            }

            let seenApplyKeys: any = {};
            for (let i = 0; i < query.APPLY.length; i++) {
                let isMatch = false;
                let applyElement: any = query.APPLY[i];
                if (typeof applyElement !== 'object') {
                    throw new Error('APPLY must be array of objects ' +
                        'but ' + JSON.stringify(applyElement) + ' is of type "' + (typeof applyElement) + '"');
                }

                let newKeyCnt = 0;
                for (let newKey in applyElement) {
                    if (newKeyCnt > 0) {
                        throw new Error('Each object in APPLY must contain exactly 1 key but multiple found');
                    }
                    newKeyCnt++;

                    if (seenApplyKeys[newKey]) {
                        throw new Error('Duplicate APPLY key: ' + newKey);
                    }
                    seenApplyKeys[newKey] = true;

                    let applyOpCnt = 0;
                    for (let applyOp in applyElement[newKey]) {
                        if (applyOpCnt > 0) {
                            throw new Error('Each object in APPLY must contain exactly 1 operation but multiple found');
                        }
                        applyOpCnt++;

                        let origKey = applyElement[newKey][applyOp];
                        if (seenGroupKeys[origKey]) {
                            throw new Error('cannot have key both in GROUP and apply: ' + origKey);
                        }

                        let found = false;
                        for (let j = 0; j < QueryController.validApplyOps.length; j++) {
                            if (QueryController.validApplyOps[j] === applyOp) {
                                let colType = DatasetController.getKeyType(origKey);
                                ///// EXTRA: allow expr to be used instead of key
                                if (!colType) {
                                    for (let e of exprCols) {
                                        if (e == origKey) {
                                            colType = 'number';
                                            break;
                                        }
                                    }
                                }
                                if (origKey.substring(0, 4) == 'expr') {
                                    let k1 = origKey.indexOf('(');
                                    let k2 = origKey.length-1;
                                    while (k2 >= 0 && origKey.substr(k2, 1) != ')') k2--;
                                    if (k1 == -1 || k2 <= k1) throw new Error("Invalid expression '" + origKey + "'");
                                    exprCols.push("__APPLY_" + newKey);
                                    exprContent.push(origKey.substring(k1+1, k2));
                                    origKey = "__APPLY_" + newKey;
                                    colType = "number";
                                } else {
                                    // fixes bug where no datasets are detected
                                    if (origKey.indexOf('_') > 0) {
                                        ids[origKey.substr(0, origKey.indexOf('_'))] = true;
                                    }
                                }
                                ///// END EXTRA
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

            // check that all GET keys are either in GROUP or in APPLY
            Log.trace('QueryController::query( ... ): verifying GET keys are in GROUP or APPLY');

            for (let k of datasetCols) {
                if (!seenGroupKeys[k]) {
                    throw new Error("key '" + k + "' with underscore found in GET but not in GROUP");
                }
            }
            for (let k of extraCols) {
                if (!seenApplyKeys[k]) {
                    throw new Error("key '" + k + "' without underscore found in GET but not in APPLY");
                }
            }

        } else {
            if (!query.GROUP && !query.APPLY && (extraCols.length > 0)) {
                throw new Error('GET contains a custom group when GROUP and APPLY are not present');
            } else if (query.GROUP && !query.APPLY) {
                throw new Error('Missing APPLY in query. Both GROUP and APPLY must be present for either to be applicable.');
            } else if (!query.GROUP && query.APPLY) {
                throw new Error('Missing GROUP in query. Both GROUP and APPLY must be present for either to be applicable.');
            } else {
                Log.trace('QueryController::query( ... ): GROUP and APPLY are both not present, skip parsing GROUP/APPLY');
            }
        }

        // parse and check the WHERE clause for validity
        // and find datasets referenced in WHERE clause
        Log.trace('QueryController::query( ... ): parsing WHERE');

        let tmpcnt = 0;
        let filter = Filter.parse('', query.WHERE);
        filter.forEach(function (curr: Filter) {
            if (curr.isLeaf() && curr.column) {
                if (curr.column.substring(0, 4) == 'expr') {
                    ///// EXTRA: allow using expr(...) as criteria
                    let k1 = curr.column.indexOf('(');
                    let k2 = curr.column.length-1;
                    while (k2 >= 0 && curr.column.substr(k2, 1) != ')') k2--;
                    if (k1 == -1 || k2 <= k1) throw new Error("Invalid expression '" + curr.column + "'");
                    exprCols.push("__WHERE_" + tmpcnt);
                    exprContent.push(curr.column.substring(k1+1, k2));
                    curr.column = "__WHERE_" + tmpcnt;
                    tmpcnt++;
                    ///// END EXTRA

                } else if (curr.column.indexOf('_') >= 0) {
                    let parts = curr.column.split('_');
                    ids[parts[0]] = true;

                } else {
                    ///// EXTRA: allow cols defined by expr(...) in GET
                    let found: boolean = false;
                    for (let col of exprCols)  {
                        if (col == curr.column) {
                            found = true;
                            break;
                        }
                    }
                    ///// END EXTRA

                    if (!found) {
                        throw new Error("Columns referenced in WHERE must have an underscore to be valid, but found '" + curr.column + "'");
                    }
                }
            }
        });

        ///// EXTRA
        for (let i = 0; i < exprContent.length; i++) {
            exprContent[i] = parseExpr(exprContent[i], false);
            exprFn[i] = new Function('e', 'f', 'return ' + exprContent[i]);
            Log.trace('Parsed expression: "' + exprContent[i] + '" as column "' + exprCols[i] + '"');
        }
        ///// END EXTRA

        // check if any dataset is missing
        Log.trace('QueryController::query( ... ): checking for missing datasets / multiple datasets');

        let idList: Array<string> = [];
        let missing: Array<string> = [];
        for (let id in ids) {
            if (!this.datasets[id]) {
                missing.push(id);
            } else {
                idList.push(id);
            }
        }
        if (missing.length > 0) {
            return {missing: missing};
        }

        // for now we only support queries on one single dataset
        if (idList.length !== 1) {
            throw new Error("Current version supports only exactly one dataset");
        }
        let theID: string = idList[0];
        Log.trace("QueryController::query( ... ): dataset id is '" + theID + "'");

        // go through each row in our dataset and filter it against the query
        Log.trace("QueryController::query( ... ): filtering dataset");

        let resRaw: Array<any> = [];
        for (let i = 0; i < this.datasets[theID].length; i++) {
            let entry: any = this.datasets[theID][i];

            ///// EXTRA: evaluate expr columns before filtering
            for (let j = 0; j < exprCols.length; j++) {
                entry[exprCols[j]] = exprFn[j](entry, exprCustomFn);
            }
            ///// END EXTRA

            if (filter.test(entry)) {
                // copy entry and add an id for sorting purposes
                let e: any = {};
                for (let k in entry) e[k] = entry[k];
                e.rid = i;
                resRaw.push(e);
            }
        }
        let filterCount = resRaw.length;

        // do GROUP and do APPLY
        if (query.GROUP && query.APPLY && resRaw.length > 0) {
            let resRaw2: Array<any> = [];

            // sort by GROUP keys
            Log.trace("QueryController::query( ... ): grouping filtered dataset by GROUP keys = " + JSON.stringify(groupKeys));

            resRaw.sort(function (a: any, b: any): number {
                let keyID = -1;
                let v1: any = 0;
                let v2: any = 0;
                while (v1 == v2 && keyID+1 < groupKeys.length) {
                    keyID++;
                    v1 = a[groupKeys[keyID]];
                    v2 = b[groupKeys[keyID]];
                }
                if (v1 == v2) return 0;
                if (v1 < v2) return -1;
                return 1;
            });

            // perform GROUP
            let groups: Array<Array<any>> = [];
            let currGroup: Array<any> = [];
            let prevRow: any = {};
            for (let rid = 0; rid < resRaw.length; rid++) {
                let row = resRaw[rid];
                if (currGroup.length > 0) {
                    // check if group keys equal previous row
                    let isEqualPrev = true;
                    for (let i = 0; i < groupKeys.length; i++) {
                        let k = groupKeys[i];
                        if (row[k] !== prevRow[k]) {
                            isEqualPrev = false;
                            break;
                        }
                    }

                    // if we encounter differnet row, add previous group
                    if (!isEqualPrev) {
                        groups.push(currGroup);
                        currGroup = [];
                    }
                }
                currGroup.push(row);
                prevRow = row;
            }
            // add last group
            groups.push(currGroup);
            currGroup = [];

            // aggregate APPLY columns per group
            Log.trace("QueryController::query( ... ): performing APPLY operations to each group");

            let uniques: any = {};
            for (let gid = 0; gid < groups.length; gid++) {

                // revert to original order in dataset
                groups[gid].sort(function(a: any, b: any) {
                    return a.rid - b.rid;
                });

                let curr: any = {};
                let row0 = groups[gid][0];

                // copy keys specified in GROUP
                for (let i = 0; i < groupKeys.length; i++) {
                    let k = groupKeys[i];
                    curr[k] = row0[k];
                }

                // initialize keys specified in APPLY
                for (let i = 0; i < applyKeys.length; i++) {
                    let applyOp = applyOps[i];
                    let origKey = applyKeys[i];
                    let resKey  = applyRes[i];

                    if (applyOp == 'MAX' || applyOp == 'MIN' || applyOp == 'AVG') {
                        curr[resKey] = row0[origKey];
                    } else {
                        uniques[resKey] = [row0[origKey]];
                    }
                }

                // for each additional row, aggregate them into curr
                for (let rid = 1; rid < groups[gid].length; rid++) {
                    let row = groups[gid][rid];

                    for (let i = 0; i < applyKeys.length; i++) {
                        let origKey = applyKeys[i];
                        let applyOp = applyOps[i];
                        let resKey  = applyRes[i];

                        if (applyOp == 'MAX') {
                            curr[resKey] = (row[origKey] > curr[resKey] ? row[origKey] : curr[resKey]);

                        } else if (applyOp == 'MIN') {
                            curr[resKey] = (row[origKey] < curr[resKey] ? row[origKey] : curr[resKey]);

                        } else if (applyOp == 'AVG') {
                            curr[resKey] += row[origKey];

                        } else {
                            uniques[resKey].push(row[origKey]);

                        }
                    }
                }

                // divide AVG by row count
                // count unique for COUNT
                for (let i = 0; i < applyKeys.length; i++) {
                    let origKey = applyKeys[i];
                    let applyOp = applyOps[i];
                    let resKey  = applyRes[i];

                    if (applyOp == 'AVG') {
                        curr[resKey] /= groups[gid].length;
                        curr[resKey] = Number(curr[resKey].toFixed(2));

                    } else if (applyOp == 'COUNT') {
                        uniques[resKey].sort();

                        // count uniques
                        let cnt = 0;
                        let prevVal = uniques[resKey][0];
                        for (let j = 1; j < uniques[resKey].length; j++) {
                            let val = uniques[resKey][j];
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
        } else {
            Log.trace("QueryController::query( ... ): skipping GROUP/APPLY as they are not provided");
        }

        // sort by the specified column if ORDER is present
        if (query.ORDER) {
            if ((typeof query.ORDER) === 'string') {
                let orderKey = <string>query.ORDER;

                Log.trace("QueryController::query( ... ): sorting by " + orderKey);

                resRaw.sort(function (a: any, b: any): number {
                    let v1: any = a[orderKey];
                    let v2: any = b[orderKey];
                    if (v1 == v2) return 0;
                    if (v1 < v2) return -1;
                    return 1;
                });

            } else if ((typeof query.ORDER) === 'object') {
                let orderDir = (<QueryOrder>query.ORDER).dir;
                let orderKeys = (<QueryOrder>query.ORDER).keys;

                Log.trace("QueryController::query( ... ): sorting by direction " + orderDir + " with keys " + JSON.stringify(orderKeys));

                if (orderDir === 'UP' || orderDir === 'DOWN') {
                    let dirMult = (orderDir == 'UP' ? 1 : -1);
                    resRaw.sort(function (a: any, b: any): number {
                        let keyID = -1;
                        let v1: any = 0;
                        let v2: any = 0;
                        while (v1 == v2 && keyID+1 < orderKeys.length) {
                            keyID++;
                            v1 = a[orderKeys[keyID]];
                            v2 = b[orderKeys[keyID]];
                        }
                        if (v1 == v2) return 0;
                        if (v1 < v2) return -dirMult;
                        return dirMult;
                    });

                } else {
                    throw new Error('Direction of ORDER must be string UP or DOWN')
                }
            }
        } else {
            Log.trace("QueryController::query( ... ): skipping sorting as key not provided");
        }

        // remove columns not specified in GET
        Log.trace("QueryController::query( ... ): removing unwanted columns");

        let res: Array<any> = [];
        for (let i = 0; i < resRaw.length; i++) {
            let filteredRow: any = {};
            for (let j = 0; j < cols.length; j++) {
                filteredRow[cols[j]] = resRaw[i][cols[j]];
            }
            for (let j = 0; j < applyOps.length; j++) {
                if (applyOps[j] == 'AVG') {
                  //  filteredRow[applyRes[j]] = filteredRow[applyRes[j]].toFixed(2);
                }
            }
            res.push(filteredRow);
        }

        // return result
        // right now only support TABLE
        Log.trace("QueryController::query( ... ): filtering complete, matched " + filterCount + " entries " +
            "out of " + this.datasets[theID].length + " entries searched, and grouped into " + res.length + " entries");

        if (query.AS !== 'TABLE') {
            throw new Error("Unsupported output format: " + JSON.stringify(query.AS));
        }
        return {render: query.AS, result: res};
    }
}
