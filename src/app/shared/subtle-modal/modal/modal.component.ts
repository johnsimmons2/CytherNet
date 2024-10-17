import { Component, Inject, Input, OnInit, TemplateRef } from '@angular/core';

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
  ) {}

  ngOnInit(): void {
  }

}
