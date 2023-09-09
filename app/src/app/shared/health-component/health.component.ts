import { Component, Input, OnInit } from '@angular/core';
import { Dice } from 'src/app/model/dice';

@Component({
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.scss']
})
export class HealthComponent implements OnInit {

  @Input() dice: Dice[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
