import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-subtle-modal',
  templateUrl: './subtle-modal.component.html',
  styleUrls: ['./subtle-modal.component.scss']
})
export class SubtleModalComponent implements OnInit {

  @Input() text: string = "";

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog() {
    const dialogReg = this.dialog.open(ModalComponent);

    dialogReg.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
