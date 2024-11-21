import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { Observable, catchError, finalize, tap, throwError } from "rxjs";
import { LoadingService } from "./loading.service";

@Injectable({
    providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {

    constructor(
        private loadingService: LoadingService,
        private zone: NgZone) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      this.loadingService.loading = true;

      return next.handle(req).pipe(
          // Check if successfully posted, patched, deleted
          tap((res: any) => {
              if (res instanceof HttpResponse) {
                  switch(res.status) {
                      case 201:
                          //this.showSnackBar("Updated");
                  }
              }
          }),
          // Snackbar for errors
          catchError((error: any) => {
              if (error instanceof HttpErrorResponse) {
                  let message = '';
                  console.log(error.status);
                  console.log(error.error);
                  switch(error.status) {
                      case 401:
                          message = "Could not authenticate you.";
                          break;
                      case 400:
                          message = error.error.data;
                          break;
                      case 403:
                          message = "You do not have the permissions for this action.";
                          break;
                      case 404:
                          message = "Could not find the given endpoint.";
                          break;
                      case 500:
                      default:
                          message = "Unknown server error ocurred!";
                  }
                  // Show the snackbar
                  // this.zone.run(() => {
                  //     this.showSnackBar(message, true);
                  // });
              }
              return throwError(() => error);
          }),
          finalize(()=> {
            this.loadingService.loading = false;
        }));
    }

}
