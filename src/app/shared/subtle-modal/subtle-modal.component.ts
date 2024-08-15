import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-subtle-modal',
  templateUrl: './subtle-modal.component.html',
  styleUrls: ['./subtle-modal.component.scss']
})
export class SubtleModalComponent implements OnInit {

  @Input() template: TemplateRef<any> | null = null;
  @Input() text: string | null = null;
  @Input() title: string | null = null;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog() {
    const dialogReg = this.dialog.open(ModalComponent, {
      data: {
        content: this.text,
        title: this.title,
        template: this.template
      }
    });

    dialogReg.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
