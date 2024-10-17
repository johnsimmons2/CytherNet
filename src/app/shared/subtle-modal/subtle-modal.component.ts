import { Component, Input, OnInit, TemplateRef } from '@angular/core';
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

  constructor() { }

  ngOnInit(): void {
  }

  openDialog() {
  }

}
