import { Component } from "@angular/core";
import { UserService } from "../../services/user.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Class } from "src/app/model/class";
import { MatChip } from "@angular/material/chips";
import { Dice } from "src/app/model/dice";
import { Spellslot } from "src/app/model/spellslot";
import { StatsFormComponent } from "src/app/shared/stats-form-component/stats-form.component";
import { Router } from "@angular/router";
import { StatsService } from "src/app/services/stats.service";
import { ClassService } from "src/app/services/class.service";
import { Race } from "src/app/model/race";
import { Stat } from "src/app/model/enum/statsenum";
import { RaceService } from "src/app/services/race.service";
import { ApiResult } from "src/app/model/apiresult";
import { skills as SKILLS } from "src/app/model/readonly/skills";
import { languages as LANGUAGES } from "src/app/model/readonly/languages";


@Component({
  selector: 'create-character-app',
  templateUrl: './create-character.component.html',
  styleUrls: ['./create-character.component.scss']
})
export class CreateCharacterComponent {

  readonly StatsEnum = Stat;
  readonly iterStatsEnum = Object.values(this.StatsEnum);
  readonly skills = SKILLS;
  readonly languages = LANGUAGES;

  clazzes: Class[] = [];
  races: Race[] = [];
  hitDice: Dice[] = [];
  spellSlots: Spellslot[] = [];

  characterFormOne: FormGroup;
  characterFormTwo: FormGroup;
  characterFormThree: FormGroup;
  characterFormOptional: FormGroup;

  selectedCharType: number = 0;

  constructor(
    private userService: UserService,
    private statsService: StatsService,
    private raceService: RaceService,
    private classService: ClassService,
    private formBuilder: FormBuilder,
    public router: Router) {

    this.characterFormOne = this.formBuilder.group({
      characterNameForm: this.formBuilder.control('', [Validators.required, Validators.maxLength(30)]),
      levelForm: this.formBuilder.control({value: 1, disabled: true}, [Validators.max(20), Validators.min(1)]),
      characterTypeForm: this.formBuilder.control(0),
      classForm: this.formBuilder.control('', [Validators.required]),
      subclassForm: this.formBuilder.control({value: '', disabled: true}),
      raceForm: this.formBuilder.control('', [Validators.required]),
    });

    this.characterFormTwo = this.formBuilder.group({
      statsForm: this.formBuilder.group({
        str: this.formBuilder.control(10, [Validators.required, Validators.max(20), Validators.min(1)]),
        dex: this.formBuilder.control(10, [Validators.required, Validators.max(20), Validators.min(1)]),
        con: this.formBuilder.control(10, [Validators.required, Validators.max(20), Validators.min(1)]),
        int: this.formBuilder.control(10, [Validators.required, Validators.max(20), Validators.min(1)]),
        wis: this.formBuilder.control(10, [Validators.required, Validators.max(20), Validators.min(1)]),
        cha: this.formBuilder.control(10, [Validators.required, Validators.max(20), Validators.min(1)]),
      }),
      skillsForm: this.formBuilder.control('', []),
      savingThrowsForm: this.formBuilder.control('', []),
      proficienciesForm: this.formBuilder.control('', []),
      backgroundForm: this.formBuilder.control('', []),
      languagesForm: this.formBuilder.control('', []),
    });

    this.characterFormThree = this.formBuilder.group({
      spellsKnownForm: this.formBuilder.control('', [Validators.required]),
      cantripsForm: this.formBuilder.control('', [Validators.required]),
      equipmentForm: this.formBuilder.control('', [Validators.required]),
    });

    this.characterFormOptional = this.formBuilder.group({
      personalityTraitsForm: this.formBuilder.control('', []),
      alliesAndOrgsForm: this.formBuilder.control('', []),
      idealsForm: this.formBuilder.control('', []),
      bondsForm: this.formBuilder.control('', []),
      flawsForm: this.formBuilder.control('', []),
      appearanceForm: this.formBuilder.control('', [Validators.required]),
      backstoryForm: this.formBuilder.control('', [Validators.required]),
      additionalInfoForm: this.formBuilder.control('', []),
    });
  }

  get isadmin() {
    return this.userService.hasRoleAdmin();
  }

  get level() {
    if (this.characterFormOne.get('levelForm')?.value) {
      return this.characterFormOne.get('levelForm')?.value;
    } else {
      return 1;
    }
  }

  public testMethod() {
    console.log(this.characterFormOne);
    console.log(this.characterFormTwo);
  }

  public getFormControl(path: string, group: FormGroup) {
    const control = group.get(path);
    if (control instanceof FormControl) {
      return control;
    } else {
      throw new Error('Control is not an instance of FormControl');
    }
  }

  public updateStat(event: any, stat: string) {
    console.log(event);
    console.log(stat);
  }

  public getSubclasses(): any {
    if (this.characterFormOne.get('classForm')?.value) {
      return this.characterFormOne.get('classForm')?.value.subclasses;
    } else {
      return [];
    }
  }

  // Returns a string of HTML to populate the modal.
  public getRaceTraitDescription(): string {
    let desc = "In D&D 5e, each race has unique traits that are described in the Player's Handbook.<br><br>";

    if (this.characterFormOne.get('raceForm')?.value) {
      // Get the description of this race.
      desc += this.characterFormOne.get('raceForm')?.value.name + ":<br>";
      desc += "<list>";
      desc += "<li>+2 Str</li>";
      desc += "<li>+2 Str</li>";
      desc += "<li>+2 Str</li>";
      desc += "</list>";
    }
    // TODO: get the current race
    return desc;
  }

  characterTypeFormUpdate(event: any) {
    console.log('hi')
    if (event.value.replace(/\s/g, "") === "PC") {

    } else {

    }
  }

  characterTypeSelect(matChip: MatChip) {
    if (!this.characterFormOne.get('characterTypeForm')?.disabled) {
      if (matChip.value.replace(/\s/g, "") === "NPC") {
        if (this.isadmin) {
          this.characterFormOne.get('characterTypeForm')!.setValue(1);
          this.selectedCharType = 1;
        }
      } else {
        this.characterFormOne.get('characterTypeForm')!.setValue(0);
        this.selectedCharType = 0;
      }
    } else {
      console.log('disabled! ' + this.characterFormOne.get('characterTypeForm')!.value);
    }
  }

  initFormVals() {
    this.characterFormOne.get('levelForm')!.setValue(1);
    this.characterFormOne.get('characterTypeForm')!.setValue(0);
    if (this.isadmin) {
      this.characterFormOne.get('levelForm')!.enable();
      this.characterFormOne.get('characterTypeForm')!.enable();
    } else {
      this.characterFormOne.get('levelForm')!.disable();
      this.characterFormOne.get('characterTypeForm')!.disable();
    }
  }

  // Get classes from the local API. The database will return what it has.
  ngOnInit() {
    this.initFormVals();
    // Hit dice service to look up what dice to use for each class and then associate it with how many hit dice that character should have at any given level

    // When I am idle and clearly not logged in, I should be redirected to the login page.
    this.hitDice = [
      {
        amount: 4,
        value: 12
      },
      {
        amount: 1,
        value: 6
      },
      {
        amount: 2,
        value: 8
      }
    ];

    this.classService.classes$.subscribe((classes: Class[]) => {
      this.clazzes = classes;
    });

    this.raceService.races$.subscribe((races: Race[]) => {
      this.races = races;
    });

    this.spellSlots = [
      {
        tier: 3,
        amount: 4
      },
      {
        tier: 2,
        amount: 3
      },
      {
        tier: 7,
        amount: 3
      },
      {
        tier: 9,
        amount: 1
      }
    ];
  }

  submit() {
  }

}
