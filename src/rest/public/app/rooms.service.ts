/**
 * Created by Daniel on 2016-11-20.
 */
import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import {QueryRequest} from "../../../controller/QueryController";
import { Headers, RequestOptions,RequestMethod,Request } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class RoomService {


    constructor (private http: Http) {}

    public roomsQuery(query: QueryRequest): Promise<any>{
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post("http://localhost:4321/query", query, options).toPromise();
    }
}
