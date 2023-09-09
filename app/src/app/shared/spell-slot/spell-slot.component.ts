import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: 'spell-slot-app',
  templateUrl: './spell-slot.component.html',
  styleUrls: ['./spell-slot.component.scss']
})
export class SpellSlotComponent {

  @Input() tier: number | undefined;
  @Input() amount: number = 0;

  @Output() rollDice = new EventEmitter<number>();

  constructor() {}

  get romanNumeralValue() {
    switch(this.tier) {
      case 1: return 'I';
      case 2: return 'II';
      case 3: return 'III';
      case 4: return 'IV';
      case 5: return 'V';
      case 6: return 'VI';
      case 7: return 'VII';
      case 8: return 'VIII';
      case 9: return 'IX';
      default: return '';
    }
  }

  get amountString() {
    if (this.amount > 1) {
      return `${this.amount}`;
    }
    return '';
  }

  ngOnInit() {

  }

}
