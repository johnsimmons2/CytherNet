import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Role, UserDto } from '../model/user';
import { ApiService } from './api.service';
import jwtDecode from 'jwt-decode';
import { catchError, map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { ApiResult } from '../model/apiresult';


@Injectable({ providedIn: 'root' })
export class UserService {

  private adjustmentPeriod: number = 1000 * 60; // 30 seconds
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkAuthentication());

  constructor(
      private router: Router,
      private apiService: ApiService,
      private httpClient: HttpClient
  ) {}

  public get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  public login(user: UserDto): Observable<ApiResult> {
    return this.apiService.post('auth/token', user).pipe(
      map((res: ApiResult) => {
        if (res.success && res.data) {
          localStorage.clear();
          localStorage.setItem('jwtToken', res.data.token);
          const decoded: any = jwtDecode(res.data.token);
          // Use the username we received from the server, not the one the user entered.
          localStorage.setItem('username', decoded.username);
          localStorage.setItem('rolesLastUpdate', Date.now().toString());
          localStorage.setItem('roles', JSON.stringify(decoded.roles));
          this.isAuthenticatedSubject.next(true);
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 0);
        } else {
          this.isAuthenticatedSubject.next(false);
        }
        return res;
      }));
  }

  public register(user: UserDto): Observable<boolean> {
    return this.apiService.post('auth/register', user).pipe(
      map((res: any) => {
        if (res.success && res.data) {
          localStorage.setItem('jwtToken', res.data);
          localStorage.setItem('username', user.username!);
        }
        return res;
      }));
  }

  public logout(): void {
    localStorage.clear();
    this.isAuthenticatedSubject.next(false)
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 0);
  }

  public async isNameRegistered(username: string): Promise<Subscription> {
    return this.apiService.get('users/' + username).subscribe((res: any) => {
      if (res.success && res.data) {
        return true;
      }
      return false;
    });
  }

  public refreshToken(): void {
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

  public getPasswordResetToken(email: string): Observable<any> {
    return this.apiService.post('auth/email-password-request', {
      email: email
    });
  }

  public updateUserPassword(user: UserDto, resetToken: string): Observable<any> {
    return this.httpClient.post('/api/auth/reset-password?', user, {params: {resetToken: resetToken}});
  }

  // PLAYER :-> 1
  public hasRolePlayer(): boolean {
    return this.hasRoleLevel(1);
  }

  // ADMIN :-> 0
  public hasRoleAdmin(): boolean {
    return this.hasRoleLevel(0);
  }

  public hasRoleLevel(roleLevel: number): boolean {
    if (this.validateUserRolesInStorage()) {
      return this.doesRoleContain({ level: roleLevel });
    }

    return false;
  }

  public deleteUser(userId: number): Observable<any> {
    return this.apiService.delete('users/' + userId);
  }

  public getRolesForUser(userId: number): Observable<any> {
    return this.apiService.get('users/' + userId + '/roles');
  }

  public updateUserRoles(userId: number, roles: Role[]): Observable<any> {
    return this.apiService.post('users/' + userId + '/roles', roles);
  }

  public getAllRoles(): Observable<any> {
    return this.apiService.get('roles').pipe(map((res: any) => {
      if (res.success && res.data) {
        return res.data;
      }
      return [];
    }));
  }

  public updateUser(user: UserDto): Observable<any> {
    return this.apiService.post(`users/${user.id}`, user);
  }

  public getUsers(): Observable<any> {
    return this.apiService.get('users');
  }

  public getUser(userId: number): Observable<any> {
    return this.apiService.get(`users/${userId}`);
  }

  public getCurrentUsername(): string | null {
    const user = localStorage.getItem('username');
    if (user) {
      return user;
    }
    // Blah blah something wrong do something
    return null;
  }

  public getJwt(): string | null {
    const user = localStorage.getItem('jwtToken');
    if (user) {
        return user;
    }
    return null;
  }

  private checkAuthentication(): boolean {
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

  /**
   * @returns True if the user has roles and were validated - checking server only ocassionally, false otherwise.
  */
  private validateUserRolesInStorage(): boolean {
    const jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken && this.checkAuthentication()) {
      const lastUpdate = localStorage.getItem('rolesLastUpdate');
      const roles = localStorage.getItem('roles');

      if (lastUpdate && roles) {
        if (Date.now() - Number.parseInt(lastUpdate) > this.adjustmentPeriod) {
          console.log('validating user roles, the period is outside acceptable period: ' + this.adjustmentPeriod + 'ms, it is: ' + (Date.now() - Number.parseInt(lastUpdate)) + 'ms');

          localStorage.setItem('rolesLastUpdate', Date.now().toString());
          return this.getUserRoles();
        } else {
          return true;
        }
      } else {
        localStorage.setItem('rolesLastUpdate', Date.now().toString());
        return this.getUserRoles();
      }
    }

    return false;
  }

  private doesRoleContain({level}: Role): boolean {
    var contains = false;
    const roleString = localStorage.getItem('roles');
    const roles = JSON.parse(roleString!);

    roles.forEach((role: any) => {
      if (role.level <= level && role.level >= 0) {
        contains = true;
        return;
      }
    });

    return contains;
  }

  /**
   * Authenticates based on current JWT token and refreshes the roles in local storage.
   * @returns True if the user has roles and were validated, false otherwise.
   */
  private getUserRoles(): boolean {
    var success = false;

    this.apiService.get('auth').subscribe((res: any) => {
      // Seeing as we use the current JWT Token to get the roles, we can assume that the user is logged in.
      if (res.success && res.data) {
        localStorage.setItem('roles', JSON.stringify(res.data));
        success = true;
      }
    }),

    // We know that the authentication must have failed; or the server could not be reached.
    (error: any) => {
      if (error.status === 401) {
        this.logout();
      } else {
        console.error('Error getting user roles: ' + error);
        console.error('Please contact System Administrator.')
        this.logout();
      }
    };

    return success;
  }

}
