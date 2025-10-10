import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResult } from '../model/apiresult';


@Injectable({ providedIn: 'root' })
export class ApiService {

    readonly ROOT_URL = environment.apiUrl;

    constructor(
        private http: HttpClient
    ) {
    }

    private wrapper(
        action: (...args: any[]) => Observable<any>,
        path: string,
        options: any,
        payload?: any
    ): Observable<ApiResult> {
        if (options === undefined || options == null) {
            options = {};
        }
        options.observe = 'response';
        options.withCredentials = true;

        var actualConductedAction = payload === undefined
            ? action.call(this.http, path, options)
            : action.call(this.http, path, payload, options);

        return actualConductedAction.pipe(
            catchError((error) =>
                of<ApiResult>({
                    success: false,
                    status: error.status,
                    data: error,
                    errors: [error.error],
                    headers: error.headers
                })
            ),
            map((res) => {
                let body = res.body?.data ?? res.body;
                let success = res.status >= 200 && res.status < 300;

                return {
                    success,
                    status: res.status,
                    data: body,
                    headers: res.headers
                }
            })
        );
    }

    patch(endpoint: string, payload: any): Observable<any> {
        return this.wrapper(this.http.patch, this.ROOT_URL + endpoint, {}, payload);
    }

    post(endpoint: string, payload: any): Observable<any> {
        return this.wrapper(this.http.post, this.ROOT_URL + endpoint, {}, payload);
    }

    delete(endpoint: string, payload: any | undefined = undefined): Observable<any> {
        return this.wrapper(this.http.delete, this.ROOT_URL + endpoint, { body: payload });
    }

    get(endpoint: string, options?: any): Observable<any> {
        return this.wrapper(this.http.get, this.ROOT_URL + endpoint, options);
    }

    public healthCheck(): Observable<any> {
        return this.get('health');
    }

}
