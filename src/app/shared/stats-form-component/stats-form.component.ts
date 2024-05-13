import { Component, Input, forwardRef } from "@angular/core";
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgModel } from "@angular/forms";
import { Stat } from "src/app/model/enum/statsenum";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: 'stats-form-app',
  templateUrl: './stats-form.component.html',
  styleUrls: ['./stats-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StatsFormComponent),
      multi: true
    }
  ]
})
export class StatsFormComponent implements ControlValueAccessor {

  readonly statDescriptions: { [key in Stat]: string } = {
    [Stat.Strength]: 'Strength measures your character’s physical power, affecting how well they perform tasks that require brute force, such as lifting heavy objects, breaking things, and determining the damage of most melee attacks.',
    [Stat.Dexterity]: 'Dexterity assesses agility, reflexes, and balance, playing a crucial role in ranged attacks, dodging threats, stealth, and any activity requiring careful movements or quick reactions.',
    [Stat.Constitution]: 'Constitution represents your character’s health and stamina, determining how resilient they are to injury and illness and directly influencing their total hit points and endurance.',
    [Stat.Intelligence]: 'Intelligence indicates the acuity of mind, knowledge, and reasoning, key for solving puzzles, recalling information, understanding complex languages and codes, and influencing the effectiveness of many magical spells.',
    [Stat.Wisdom]: 'Wisdom measures perceptiveness and intuition, critical for noticing hidden objects or underlying truths, resisting mental influence, and being effective in many clerical spells and nature-related abilities.',
    [Stat.Charisma]: 'Charisma gauges your character’s force of personality, charm, and ability to lead or influence others, important for persuading, deceiving, or performing and essential for casters who channel magic through force of will.',
  }

  descriptionOpen: boolean = false;

  onChange: any = () => { };
  onTouched: any = () => { };

  @Input() stat!: Stat;
  @Input() control!: FormControl | null;

  statValue: number = 10;

  constructor(private userService: UserService) {
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

  writeValue(obj: number): void {
    this.statValue = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  updateChanges() {
    this.onChange(this.statValue);
  }

  iChanged(event: any, statInput: NgModel) {
    if (event > 20) {
      this.statValue = 20;
      statInput.control.setValue(20);
    } else if (event < 1) {
      this.statValue = 1;
      statInput.control.setValue(1);
    } else {
      this.statValue = event;
    }
    this.updateChanges();
  }

  ngOnInit() {
    this.statValue = this.control?.value;
    this.control?.valueChanges.subscribe((value) => {
      if (value > 20) {
        this.statValue = 20;
        this.control?.setValue(20);
      } else if (value < 1) {
        this.statValue = 1;
        this.control?.setValue(1);
      } else {
        this.statValue = value;
      }
    });
  }
}
