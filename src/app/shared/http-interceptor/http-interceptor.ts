import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, finalize } from "rxjs";
import { SpinnerService } from "../loading-spinner/spinner.service";

@Injectable()
export class HttpInterceptorImplementation implements HttpInterceptor {

    constructor(private spinnerService: SpinnerService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.spinnerService.spinnerVisible = true;

        return next.handle(req).pipe(
            finalize(() => {
                this.spinnerService.spinnerVisible = false;
            }));
    }
    
}