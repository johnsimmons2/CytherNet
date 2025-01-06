import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { Observable, catchError, finalize, map, switchMap, tap, throwError } from "rxjs";
import { LoadingService } from "./loading.service";
import { error } from "console";
import { UserService } from "./user.service";

@Injectable({
    providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {

  isRefreshing: boolean = false;

  constructor(
      private loadingService: LoadingService,
      private userService: UserService,
      private zone: NgZone) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.loading = true;

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        if (req.url.indexOf('auth/token') !== -1 || req.url.indexOf('auth/refresh') !== -1) {
          return throwError(() => error); // Stop further processing for login and refresh requests
        }

        if (error.status === 401 && !this.isRefreshing) {
          this.isRefreshing = true;
          console.log('401 detected. Attempting to refresh token.');
          console.log(req);
          return this.userService.refreshToken().pipe(
            switchMap((isAuth: boolean) => {
              if (isAuth) {
                const newToken = localStorage.getItem('jwtToken');
                if (newToken) {
                  console.log('Token refreshed. Retrying request...');
                  const clone = req.clone({
                    setHeaders: { Authorization: `Bearer ${newToken}`}
                  });
                  return next.handle(clone); // Retry request with new token
                }
              }

              this.isRefreshing = false;

              this.userService.logout(); // Immediately log out
              return throwError(() => error); // Stop further processing
            })
          );
        }
        // For all other errors, propagate without retry
        return throwError(() => error);
      }),
      finalize(() => {
        this.loadingService.loading = false; // Stop spinner
      })
    );
  }

}
