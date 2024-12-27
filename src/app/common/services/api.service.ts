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

  private getHeaders() {
    const token = localStorage.getItem('jwtToken')
    var headers = new HttpHeaders()
    if (token !== null) {
      headers = headers.append('Authorization', 'Bearer ' + token)
    }
    return headers;
  }

  private getHeadersWithToken(token: string) {
    var headers = new HttpHeaders()
    if (token !== null) {
      headers = headers.append('Authorization', 'Bearer ' + token)
    }
    return headers;
  }

  private wrapper(action: (...args: any[]) => Observable<any>,
                  path: string,
                  options: any,
                  payload?: any): any {
    options.observe = 'response';
    var actualConductedAction = payload === undefined ? action.call(this.http, path, options) : action.call(this.http, path, payload, options);

      /**
       * Try to subscribe to the action, and pass the result
       * as an ApiResult object to the observer.
       */
    return actualConductedAction.pipe(
      catchError((error) => {
        return of<ApiResult>({
          success: false,
          status: error.status,
          data: error,
          errors: [error.error],
          headers: error.headers
        });
      }),
      map((res) => {
        let body = res.body;
        let success = res.status >= 200 && res.status < 300;
        if (body?.data !== undefined) {
          body = body.data;
          if (body?.data?.success !== undefined) {
            success = body.data.success;
          }
        }

        let result: ApiResult = {
          success: success,
          status: res.status,
          data: body,
          headers: res.headers
        }
        return result;
      })
    );
  }

  patch(endpoint: string, payload: any): Observable<any> {
    return this.wrapper(this.http.patch, this.ROOT_URL + endpoint, { headers: this.getHeaders() }, payload);
  }

  post(endpoint: string, payload: any): Observable<any> {
    return this.wrapper(this.http.post, this.ROOT_URL + endpoint, { headers: this.getHeaders() }, payload);
  }

  delete(endpoint: string): Observable<any> {
    return this.wrapper(this.http.delete, this.ROOT_URL + endpoint, { headers: this.getHeaders() });
  }

  get(endpoint: string, options?: any, headers?: any): Observable<any> {
    if (headers === undefined && options === undefined) {
      options = { headers: this.getHeaders() };
    } else if (headers !== undefined && options === undefined) {
      options = { headers: headers };
    } else if (headers !== undefined && options !== undefined) {
      options.headers = headers;
    } else if (headers === undefined && options !== undefined) {
      options.headers = this.getHeaders();
    }
    return this.wrapper(this.http.get, this.ROOT_URL + endpoint, options);
  }

  validateToken(substitutedToken: any) {
    return this.get(this.ROOT_URL + 'auth', { headers: this.getHeadersWithToken(substitutedToken) });
  }

  public healthCheck(): Observable<any> {
    return this.get('health');
  }

}
