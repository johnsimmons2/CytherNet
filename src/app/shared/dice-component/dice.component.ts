import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: 'dice-app',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.scss']
})
export class DiceComponent {

  @Input() dice: string | undefined;
  @Input() amount: number | undefined;
  @Input() displayOnly: boolean = false;
  @Input() diceSize: number | undefined;
  @Input() modifier: number | undefined;
  @Input() size: number = 2; // 0 = small, 1 = medium, 2 = large
  @Input() value: number = 1;

  @Output() rollDice = new EventEmitter<number>();

  get calcDiceIcon(): string {
    if (this.diceSize) {
      return "dice-" + this.diceSize;
    } else {
      return "dice-6";
    }
  }

  constructor() {}

  ngOnInit() {
    if (this.displayOnly) {
      this.value = this.diceSize!;
    }
  }

  diceClicked() {
    this.rollDice.emit(this.roll());
  }

  roll(): number {
    return 10;
  }

}
