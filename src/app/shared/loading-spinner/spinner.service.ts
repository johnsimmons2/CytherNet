import { Injectable } from "@angular/core";

@Injectable({ 
    providedIn: 'root' 
})
export class SpinnerService {
    private loading: boolean = false;

    get spinnerVisible(): boolean {
        return this.loading;
    }

    set spinnerVisible(value: boolean) {
        this.loading = value;
    }
}