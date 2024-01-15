import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-subtle-modal',
  templateUrl: './subtle-modal.component.html',
  styleUrls: ['./subtle-modal.component.scss']
})
export class SubtleModalComponent implements OnInit {

  @Input() text: string = "";
  @Input() title: string = "";

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog() {
    const dialogReg = this.dialog.open(ModalComponent, {
      data: {
        content: this.text,
        title: this.title
      }
    });

    dialogReg.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
