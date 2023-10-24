import { Component, Inject, Input } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
})
export class ConfirmationModal {

  @Input() title!: string;
  @Input() content!: string;
  @Input() action!: string;

  constructor (public dialogRef: MatDialogRef<ConfirmationModal>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
