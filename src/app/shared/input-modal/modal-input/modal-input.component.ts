import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: 'app-input-modal-modal',
    templateUrl: './modal-input.component.html',
    styleUrls: ['./modal-input.component.scss'],
})
export class ModalInputComponent implements OnInit {
    
    contentForm = new FormControl('');
    content: string = '';

    constructor(
        public dialogRef: MatDialogRef<ModalInputComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

    ngOnInit(): void {
        this.content = this.data.content;
    }
}