import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';
import { ApiService } from '../services/api.service';
import { Observable, catchError } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  constructor(
    private router: Router,
    private accountService: UserService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const auth = this.accountService.isAuthenticated();
    if (auth) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }
}
