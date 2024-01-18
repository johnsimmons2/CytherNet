import { Component, Inject, OnInit, inject } from "@angular/core";
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from "@angular/material/snack-bar";

@Component({
    selector: 'success-snack',
    templateUrl: './success-snack.component.html',
    styleUrls: ['./success-snack.component.scss']
})
export class SuccessSnackComponent implements OnInit {

    snackBarRef = inject(MatSnackBarRef);

    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    }

    ngOnInit(): void {
    }
}