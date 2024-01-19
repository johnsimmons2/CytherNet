import { Component, Inject, OnInit, ViewEncapsulation, inject } from "@angular/core";
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from "@angular/material/snack-bar";

@Component({
    selector: 'app-http-snack-bar',
    templateUrl: './httpsnackbar.component.html',
    styleUrls: ['./httpsnackbar.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class HttpSnackBarComponent implements OnInit {

    constructor(
        @Inject(MAT_SNACK_BAR_DATA) public data: any, 
        public snackBarRef: MatSnackBarRef<HttpSnackBarComponent>) 
    {}

    // Probable solution:
    // https://stackoverflow.com/questions/47763799/angular-material-overriding-default-style-of-snackbar-component
    ngOnInit(): void {
        console.log(this.snackBarRef.instance);
    }
}