import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
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

        const method = (action === this.http.post ? 'POST' :
                action === this.http.patch ? 'PATCH' :
                action === this.http.delete ? 'DELETE' : 'GET');
        if (this.isUnsafe(method)) {
            const csrf = this.getCookie('csrftoken');
            options.headers = new HttpHeaders({ ...(options.headers || {}), ...(csrf ? { 'X-CSRFToken': csrf } : {}) });
        }
        const doCall = () => (payload === undefined
            ? action.call(this.http, path, options)
            : action.call(this.http, path, payload, options));

        return doCall().pipe(
            catchError((error) =>
                of<ApiResult>({
                    success: false,
                    status: error.status,
                    data: error,
                    errors: [error.error],
                    headers: error.headers
                })
            ),
            // CSRF one-shot retry on 403
            switchMap((res: any) => {
                if (res?.success === false && res.status === 403 && this.isUnsafe(method)) {
                    // One retry: prime CSRF then repeat original call
                    return this.asyncCsrfPrime().then(() => doCall().pipe(
                        catchError((error) =>
                            of<ApiResult>({
                                success: false,
                                status: error.status,
                                data: error,
                                errors: [error.error],
                                headers: error.headers
                            })
                        )
                    )).then(obs => obs);
                }
                return of(res);
            }),
            map((res) => {
                const body = res.body?.data ?? res.body;
                const success = res.status >= 200 && res.status < 300;
                return {
                    success,
                    status: res.status,
                    data: body,
                    headers: res.headers };
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

    getCookie(name: string): string | null {
        const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([$?*|{}\]\\^])/g, '\\$1') + '=([^;]*)'));
        return m ? decodeURIComponent(m[1]) : null;
    }

    isUnsafe(method: string) {
        return ['POST','PUT','PATCH','DELETE'].includes(method.toUpperCase());
    }

    asyncCsrfPrime(): Promise<void> {
        // hit your existing endpoint that has @ensure_csrf_cookie
        return fetch(this.ROOT_URL + 'auth/check/', { credentials: 'include' }).then(() => {});
    }

}
