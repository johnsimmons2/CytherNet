import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { Observable, catchError, finalize, tap, throwError } from "rxjs";
import { SpinnerService } from "../loading-spinner/spinner.service";
import { HttpSnackBarComponent } from "./httpsnackbar-component/httpsnackbar.component";

@Injectable({
    providedIn: 'root',
})
export class HttpInterceptorImplementation implements HttpInterceptor {

    constructor(
        private spinnerService: SpinnerService,
        private zone: NgZone) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      this.spinnerService.spinnerVisible = true;

      return next.handle(req).pipe(
          // Check if successfully posted, patched, deleted
          tap((res: any) => {
              if (res instanceof HttpResponse) {
                  switch(res.status) {
                      case 201:
                          this.showSnackBar("Updated");
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
                  this.zone.run(() => {
                      this.showSnackBar(message, true);
                  });
              }
              return throwError(error);
          }),
          finalize(()=> {
            this.spinnerService.spinnerVisible = false;
        }));
    }

    private showSnackBar(message: string, error: boolean = false): void{
        // if (error) {
        //     this.snackBar.openFromComponent(HttpSnackBarComponent, {
        //         duration: 5000,
        //         data: {
        //             message: message
        //         },
        //         panelClass: ['error-snack']
        //     });
        // } else {
        //     console.log("Posting success");
        //     this.snackBar.openFromComponent(HttpSnackBarComponent, {
        //         duration: 5000,
        //         data: {
        //             message: message
        //         },
        //         panelClass: ['success-snack']
        //     });
        // }
    }

}
