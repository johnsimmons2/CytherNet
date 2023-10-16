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

  getCurrentUsername() {
    const user = localStorage.getItem('username');
    if (user) {
      return user;
    }
    // Blah blah something wrong do something
    return null;
  }

  login(user: User) {
    this.apiService.post('auth/token', user).subscribe((res: any) => {
      if (res.success && res.data.token) {
        localStorage.setItem('jwtToken', res.data.token);
        localStorage.setItem('username', user.username);
        this.getUserRoles();
        this.router.navigate(['']);
      }
    });
  }

  isAdmin() {
    if (!localStorage.getItem('roles')) {
      this.getUserRoles();
      if (localStorage.getItem('roles') === null) {
        return false;
      }
    }

    const roleString = localStorage.getItem('roles');
    const roles = JSON.parse(roleString!);
    let isAdmin = false;
    roles.forEach((role: any) => {
      if (role.level === 0) {
        isAdmin = true;
      }
    });
    return isAdmin;
  }

  isPlayer() {
    if (!localStorage.getItem('roles')) {
      this.getUserRoles();
      if (localStorage.getItem('roles') === null) {
        return false;
      }
    }

    const roleString = localStorage.getItem('roles');
    const roles = JSON.parse(roleString!);
    let isPlayer = false;
    roles.forEach((role: any) => {
      if (role.level <= 1) {
        isPlayer = true;
      }
    });
    return isPlayer;
  }

  getUserRoles() {
    this.apiService.get('auth').subscribe((res: any) => {
      if (res.success && res.data && localStorage.getItem('jwtToken') !== null) {
        localStorage.setItem('roles', JSON.stringify(res.data));
      }
    });
  }

  async isNameRegistered(username: string) {
    return this.apiService.get('users/' + username).subscribe((res: any) => {
      if (res.success && res.data) {
        return true;
      }
      return false;
    });
  }

  async register(user: User): Promise<boolean> {
    try {
      const res: any = await this.apiService.post('auth/register', user).toPromise();
      if (res.success && res.data.token) {
        localStorage.setItem('jwtToken', res.data.token);
        localStorage.setItem('username', user.username);
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
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
    this.router.navigate(['/login']);
    localStorage.clear();

    console.log("logged out user");
  }
}
