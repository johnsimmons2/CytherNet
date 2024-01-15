import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialog } from '@angular/material/dialog';
import { ModalInputComponent } from './modal-input/modal-input.component';


@Component({
  selector: 'app-input-modal',
  templateUrl: './input-modal.component.html',
  styleUrls: ['./input-modal.component.scss'],
  providers: [
    {
        provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {panelClass: 'mat-dialog-override'}
    }
  ]
})
export class InputModalComponent implements OnInit {

  @Input() title: string = "Edit";
  @Input() text: string = "";
  @Input() subject: string = "";
  @Input() inputForm!: TemplateRef<any>;

  @Output() submit: EventEmitter<any> = new EventEmitter<any>();

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog() {
    const dialogReg = this.dialog.open(ModalInputComponent, {
      width: '50%',
      data: {
        content: this.text,
        title: this.title,
        subject: this.subject,
        inputForm: this.inputForm
      }
    });

    dialogReg.afterClosed().subscribe(result => {
      if (result) {
        this.submit.emit(result);
      }
    });
  }

}
