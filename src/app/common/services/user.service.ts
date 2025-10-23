import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Role, User } from '../model/user';
import { ApiService } from './api.service';
import jwtDecode from 'jwt-decode';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subscription, from, interval, of } from 'rxjs';
import { ApiResult } from '../model/apiresult';
import { BaseService } from './base.service';
import { DatabaseService } from './database.service';


@Injectable({ providedIn: 'root' })
export class UserService extends BaseService<User> {

    private adjustmentPeriod: number = 1000 * 60; // 30 seconds
    private isAuthenticatedSubject = new BehaviorSubject<boolean | null>(null);
    private readonly DEFAULT_ROLES = ["admin", "gamemaster", "player", "guest"]

    constructor(
        private router: Router,
        private httpClient: HttpClient,
        protected override database: DatabaseService,
        protected override apiService: ApiService
    ) {
        super(database, apiService); // Pass required arguments to the BaseService constructor
    }

    protected override getTableName(): string {
        return "users";
    }

    get isAuthenticated$(): Observable<boolean> {
        return this.isAuthenticatedSubject.asObservable().pipe(
            filter((val): val is boolean => val !== null)
        );
    }

    get currentUsername(): string | null {
        const user = localStorage.getItem('username');
        if (user) {
            return user;
        }
        return null;
    }

    get currentUserId(): string | null {
        return localStorage.getItem('uid') ?? null;
    }

    public userHasRoles(roleNames: Array<string>): Observable<boolean> {
        const rolesJson = localStorage.getItem('groups') ?? '[]';
        const roles = JSON.parse(rolesJson) as Array<string>;
        const queryRoles = (roleNames).map(x => x.toLowerCase()) ?? [];

        const hasRole = roles.some(role => queryRoles.includes(role.toLowerCase()));
        return this.isAuthenticated$.pipe(
            take(1),
            map(isAuth => isAuth === true && hasRole)
        );
    }

    /**
     * Default role check functions for current session user.
     */
    public isAdmin(): Observable<boolean> {
        return this.userHasRoles(["admin"]);
    }

    public isGameMaster(): Observable<boolean> {
        return this.userHasRoles(["admin", "gamemaster"]);
    }

    public isPlayer(): Observable<boolean> {
        return this.userHasRoles(["admin", "gamemaster", "player"]);
    }

    public isGuest(): Observable<boolean> {
        return this.userHasRoles(["admin", "gamemaster", "player", "guest"]);
    }
    /**
     * End of default role functions
     */

    public saveUserToLocalStorage(data: any) {
        console.log(`User data received: ${JSON.stringify(data)}`);
        console.log(`Test 1: ${data.user.username}`);
        const validateString = (val: any) => `${val}`;

        localStorage.setItem('username', validateString(data.user.username));
        localStorage.setItem('uid', validateString(data.user.id));
        localStorage.setItem('email', validateString(data.user.email));
        localStorage.setItem('first_name', validateString(data.user.first_name));
        localStorage.setItem('last_name', validateString(data.user.last_name));
        localStorage.setItem('date_joined', validateString(data.user.date_joined));

        localStorage.setItem('groups', JSON.stringify(data.user.groups));
    }

    public login(user: User): Observable<ApiResult> {
        return this.apiService.post('auth/login/', user).pipe(
            catchError((error: any) => {
                this.isAuthenticatedSubject.next(false);
                return of({ success: false, status: error.status });
            }),
            map((res: ApiResult) => {
                if (res.success && res.data) {

                    setTimeout(() => {
                        this.saveUserToLocalStorage(res.data);
                        this.isAuthenticatedSubject.next(true);
                        this.router.navigate(['/']).then();
                    }, 0);
                } else {
                    this.isAuthenticatedSubject.next(false);
                }
                return res;
            })
        );
    }

    public checkAuthentication(): Observable<boolean> {
        return this.apiService.get('auth/check/').pipe(
            map((res: ApiResult) => {
                if (res.success && res.data) {
                    console.log(res);
                    this.saveUserToLocalStorage(res.data);
                    this.isAuthenticatedSubject.next(true);
                    return true;
                } else {
                    this.clearSessionAndRedirect();
                    return false;
                }
            }),
            catchError(() => {
                this.clearSessionAndRedirect();
                return of(false);
            })
        );
    }

    public register(user: User): Observable<boolean> {
        return this.apiService.post('auth/register/', user).pipe(
            map((res: any) => {
                if (res.success && res.data) {
                    console.log('Registration successful:', res.data);

                    this.saveUserToLocalStorage(res.data);
                    this.isAuthenticatedSubject.next(true);
                }
                return res;
            })
        );
    }

    public logout(): Observable<void> {
        return this.apiService.post('auth/logout/', {}).pipe(
            tap(() => {
                this.clearSessionAndRedirect();
            })
        );
    }

    private clearSessionAndRedirect(): void {
        localStorage.clear();
        sessionStorage.clear();

        this.isAuthenticatedSubject.next(false);

        setTimeout(() => {
            this.router.navigate(['/login']).then();
        }, 0);
    }

    public isNameAvailable(username: string): Observable<boolean> {
        let username_param = new HttpParams().set('u', username);

        return this.apiService.get('users/account_available/', { params: username_param }).pipe(
            map((res: any) => {
                if (res.success && res.data) {
                    return res.data.available;
                }
                return false;
            })
        );
    }

    public isEmailAvailable(email: string): Observable<boolean> {
        let email_param = new HttpParams().set('e', email);

        return this.apiService.get('users/account_available/', { params: email_param }).pipe(
            map((res: any) => {
                if (res.success && res.data) {
                    return res.data.available;
                }
                return false;
            })
        );
    }

    public resetPasswordLink(user: any): Observable<ApiResult> {
        return this.apiService.post('auth/get-password-reset-link', user);
    }

    public refreshToken(): Observable<boolean> {
        return of(true);
    }

    public getPasswordResetToken(email: string): Observable<any> {
        return of(true);
    }

    public updateUserPassword(user: User, resetToken: string): Observable<ApiResult> {
        return this.apiService.post(`auth/reset-password?t=${resetToken}&u=${user.username}`, user);
    }

    public updateUserPasswordManual(request: any): Observable<ApiResult> {
        return this.apiService.post('auth/reset-password/manual-request', request);
    }

    public deleteUser(userId: number): Observable<ApiResult> {
        return this.delete('users/' + userId, userId);
    }

    public getRolesForUser(userId: number): Observable<ApiResult> {
        return this.apiService.get('users/' + userId + '/roles');
    }

    public getAllRoles(): Observable<ApiResult> {
        return this.apiService.get('roles');
    }

    public updateUser(user: User): Observable<ApiResult> {
        return this.update(`users/${user.id}`, user.id!, user);
    }

    public getUsers(): Observable<User[]> {
        return this.getAllNoCache('users');
    }

    public getUser(userId: number): Observable<User> {
        return this.get(`users/${userId}`, { id: userId }).pipe(
            map((res: User[]) => res[0])
        );
    }

    public getUserByUsername(username: string): Observable<User> {
        return this.get(`users/${username}`, { username: username }).pipe(
            map((res: User[]) => res[0])
        );
    }
}
