import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from '../model/user';
import { ApiService } from './api.service';
import jwtDecode from 'jwt-decode';


@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
      private router: Router,
      private http: HttpClient,
      private apiService: ApiService
  ) {}

  login(user: User) {
    this.apiService.post('auth/token', user).subscribe((res: any) => {
      if (res.success && res.data.token) {
        localStorage.setItem('jwtToken', res.data.token);
        localStorage.setItem('username', user.username);
        this.router.navigate(['']);
      }
    });
  }

  register(user: User) {
    this.apiService.post('auth/register', user).subscribe((res: any) => {
      if (res.success && res.data.token) {
        localStorage.setItem('jwtToken', res.data.token);
        localStorage.setItem('username', user.username);
      }
    });
  }

  getJwt() {
    const user = localStorage.getItem('jwtToken');
    if (user) {
        return user;
    }
    return null;
  }

  isAuthenticated() {
    const user = localStorage.getItem('jwtToken');
    console.log(user);
    if (user) {
      const decoded: any = jwtDecode(user);
      if (decoded.exp * 1000 < Date.now()) {
        return false;
      }
      return true;
    }
    return false;
  }

  refreshToken() {
    const user = localStorage.getItem('jwtToken');
    if (user) {
      const decoded: any = jwtDecode(user);
      if (decoded.exp * 1000 < Date.now()) {
        this.apiService.post('auth/token', user).subscribe((res: any) => {
          if (res.success && res.data.token) {
            localStorage.setItem('jwtToken', res.data.token);
            console.log('token has expired and was successfully refreshed.');
          }
        });
      } else {
        console.log('token is still valid.');
      }
    }
  }

  logout() {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/login']);
  }
}
