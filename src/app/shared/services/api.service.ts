import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiResult } from '../model/apiresult';


@Injectable({ providedIn: 'root' })
export class ApiService {

  readonly ROOT_URL = '/api/';

  constructor(
      private router: Router,
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
                  headers: any,
                  payload?: any): any {

    return new Observable((observer) => {
      var actualConductedAction = payload === undefined ? action.call(this.http, path, headers) : action.call(this.http, path, payload, headers);

      /**
       * Try to subscribe to the action, and pass the result
       * as an ApiResult object to the observer.
       */
      actualConductedAction.subscribe({
        next: (res: any): void => {
          observer.next(res);
          observer.complete();
        },
        error: (err: any): void => {
          observer.error(err);
        }
      });
    });
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

  get(endpoint: string, headers?: any): Observable<ApiResult> {
    if (headers === undefined) {
      headers = { headers: this.getHeaders() };
    }
    return this.wrapper(this.http.get, this.ROOT_URL + endpoint, headers);
  }

  validateToken(substitutedToken: any) {
    return this.get(this.ROOT_URL + 'auth', { headers: this.getHeadersWithToken(substitutedToken) });
  }

}
