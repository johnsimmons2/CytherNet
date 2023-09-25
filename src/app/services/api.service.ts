import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from '../model/user';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class ApiService {

  readonly ROOT_URL = '/api/';

  constructor(
      private router: Router,
      private http: HttpClient
  ) {}

  private getHeaders() {
    const token = localStorage.getItem('jwtToken')
    var headers = new HttpHeaders()
    if (token !== null) {
      headers = headers.append('Authorization', 'Bearer ' + token)
    }
    return headers;
  }

  post(endpoint: string, payload: any): Observable<any> {
    return this.http.post(this.ROOT_URL + endpoint, payload, { headers: this.getHeaders() });
  }

  get(endpoint: string): Observable<any> {
    return this.http.get(this.ROOT_URL + endpoint, { headers: this.getHeaders() });
  }

}
