import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StatsService } from "src/app/services/stats.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: 'stats-form-app',
  templateUrl: './stats-form.component.html',
  styleUrls: ['./stats-form.component.scss']
})
export class StatsFormComponent {
  descriptionOpen: boolean = false;

  @Input() stat: string = '';
  @Input() statName: string = '';
  @Input() statDescription: string = '';
  @Input() statValue: number = 1;
  @Input() disabled: boolean = false;

  @Output() changed: EventEmitter<number> = new EventEmitter<number>();

  constructor(private userService: UserService, private statsService: StatsService) {
  }

  get bonus(): string {
    const statBonus = Math.floor((this.statValue - 10) / 2);
    if (statBonus >= 1) {
      return `+${statBonus}`;
    } else if (statBonus < 0) {
      return `${statBonus}`;
    } else {
      return '+0';
    }
  }

  get isNegativeBonus(): boolean {
    return Math.floor((this.statValue - 10) / 2) < 0;
  }

  get isAdmin(): boolean {
    return this.userService.hasRoleAdmin();
  }

  iChanged(event: any) {
    if (event.target.value > 20) {
      this.statValue = 20;
    } else if (event.target.value < 1) {
      this.statValue = 1;
    } else {
      console.log(event.target.value);
      console.log(typeof event.target.value);
      this.statValue = Number.parseInt(event.target.value);
    }
    this.changed.emit(Number.parseInt(event.target.value));
  }

  ngOnInit() {
    if (this.stat !== '') {
      this.statName = this.statsService.getStatName(this.stat) ?? '???';
      this.statDescription = this.statsService.getStatDescription(this.stat) ?? '???';
    }
  }

}
