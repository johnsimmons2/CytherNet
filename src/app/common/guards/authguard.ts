import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';
import { ApiService } from '../services/api.service';
import { take, map, tap, catchError, filter } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private accountService: UserService,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.accountService.isAuthenticated$.pipe(
            filter(val => val !== null),         // wait until initAuth finished
            take(1),
            tap(isAuth => { if (!isAuth) this.router.navigate(['/login']); })
    );
    }
}
