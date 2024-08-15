import { Component, Inject, Input, OnInit, TemplateRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  template: TemplateRef<any> | null = null;
  content: string = '';
  title: string = ''
  cancel: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.content = this.data.content;
    this.title = this.data.title;
    this.cancel = this.data.cancel;
    this.template = this.data.template;
  }

}
