import { Component, Inject, OnInit, ViewEncapsulation, inject } from "@angular/core";
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from "@angular/material/snack-bar";

@Component({
    selector: 'error-snack',
    templateUrl: './error-snack.component.html',
    styleUrls: ['./error-snack.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ErrorSnackComponent implements OnInit {

    snackBarRef = inject(MatSnackBarRef);

    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {

    }

    // Probable solution:
    // https://stackoverflow.com/questions/47763799/angular-material-overriding-default-style-of-snackbar-component
    ngOnInit(): void {
        console.log(this.snackBarRef.instance);
    }
}