import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: 'stats-form-app',
  templateUrl: './stats-form.component.html',
  styleUrls: ['./stats-form.component.scss']
})
export class StatsFormComponent {
  descriptionOpen: boolean = false;

  @Input() statName: string = '';
  @Input() statDescription: string = '';
  @Input() statValue: number = 1;

  @Output() changed: EventEmitter<string> = new EventEmitter<string>();

  statForm: FormGroup;

  constructor(private userService: UserService, private formBuilder: FormBuilder) {
    this.statForm = this.formBuilder.group({
      statValueControl: this.formBuilder.control(this.statValue, [Validators.max(20), Validators.min(1)]),
    });
  }

  get bonus(): string {
    const statBonus = Math.floor((this.statValue - 10) / 2);
    if (statBonus >= 1) {
      return `+${statBonus}`;
    } else if (statBonus < 0) {
      return `${statBonus}`;
    } else {
      return '';
    }
  }

  get isNegativeBonus(): boolean {
    return this.bonus.startsWith('-');
  }

  get isAdmin(): boolean {
    return this.userService.hasRoleAdmin();
  }

  iChanged(event: any) {
    if (event.target.value > 20) {
      this.statValue = 20;
      this.statForm.get('statValueControl')!.setValue(this.statValue);
    } else if (event.target.value < 1) {
      this.statValue = 1;
      this.statForm.get('statValueControl')!.setValue(this.statValue);
    } else {
      this.statValue = event.target.value;
      this.statForm.get('statValueControl')!.setValue(this.statValue);
    }
    this.changed.emit(event.target.value);
  }

  ngOnInit() {
    this.statForm.get('statValueControl')!.setValue(this.statValue);
  }

}
