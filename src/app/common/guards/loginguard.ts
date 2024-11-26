import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';
import { ApiService } from '../services/api.service';
import { take, map, tap, catchError } from 'rxjs';


@Injectable({ providedIn: 'root'})
export class LoginGuard implements CanActivate {
  constructor(
    private router: Router,
    private accountService: UserService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.accountService.isAuthenticated$.pipe(
      take(1), // Ensures the observable completes
      map((isAuth) => {
        if (isAuth) {
          return false;
        }
        return true;
      }),
    );
  }
}
