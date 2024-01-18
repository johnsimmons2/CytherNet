import { Component } from "@angular/core";
import { UserService } from "../../../services/user.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Class } from "src/app/model/class";
import { MatChip } from "@angular/material/chips";
import { Dice } from "src/app/model/dice";
import { Spellslot } from "src/app/model/spellslot";
import { StatsFormComponent } from "src/app/shared/stats-form-component/stats-form.component";
import { Router } from "@angular/router";
import { StatsService } from "src/app/services/stats.service";
import { ClassService } from "src/app/services/class.service";


@Component({
  selector: 'create-character-app',
  templateUrl: './create-character.component.html',
  styleUrls: ['./create-character.component.scss']
})
export class CreateCharacterComponent {

  clazzes: Class[] = [];
  hitDice: Dice[] = [];
  spellSlots: Spellslot[] = [];
  characterForm: FormGroup;
  selectedCharType: number = 0;

  constructor(
    private userService: UserService, 
    private statsService: StatsService,
    private classService: ClassService,
    private formBuilder: FormBuilder, 
    public router: Router) {

    this.characterForm = this.formBuilder.group({
      characterNameForm: this.formBuilder.control('', [Validators.required, Validators.maxLength(30)]),
      classForm: this.formBuilder.control('', Validators.required),
      levelForm: this.formBuilder.control({value: 1, disabled: true}, [Validators.max(20), Validators.min(1)]),
      characterTypeForm: this.formBuilder.control(0),
      subclassForm: this.formBuilder.control('', Validators.required),
      raceForm: this.formBuilder.control('', Validators.required),
      statsForm: new FormControl(''),
      backgroundForm: new FormControl(''),
      alignmentForm: new FormControl(''),
      personalityForm: new FormControl(''),
      spellsForm: new FormControl(''),
      cantripsForm: new FormControl(''),
    });
  }


  get isadmin() {
    return this.userService.hasRoleAdmin();
  }

  get level() {
    if (this.characterForm.get('levelForm')?.value) {
      return this.characterForm.get('levelForm')?.value;
    } else {
      return 1;
    }
  }

  public getSubclasses(): any {
    if (this.characterForm.get('classForm')?.value) {
      return this.characterForm.get('classForm')?.value.subclasses;
    } else {
      return [];
    }
  }

  // Returns a string of HTML to populate the modal.
  public getRaceTraitDescription(): string {
    let desc = "In D&D 5e, each race has unique traits that are described in the Player's Handbook.<br><br>";

    if (this.characterForm.get('raceForm')?.value) {
      // Get the description of this race.
      desc += this.characterForm.get('raceForm')?.value.name + ":<br>";
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
    if (!this.characterForm.get('characterTypeForm')?.disabled) {
      if (matChip.value.replace(/\s/g, "") === "NPC") {
        if (this.isadmin) {
          this.characterForm.get('characterTypeForm')!.setValue(1);
          this.selectedCharType = 1;
        }
      } else {
        this.characterForm.get('characterTypeForm')!.setValue(0);
        this.selectedCharType = 0;
      }
    } else {
      console.log('disabled! ' + this.characterForm.get('characterTypeForm')!.value);
    }
  }

  initFormVals() {
    this.characterForm.get('levelForm')!.setValue(1);
    this.characterForm.get('characterTypeForm')!.setValue(0);
    if (this.isadmin) {
      this.characterForm.get('levelForm')!.enable();
      this.characterForm.get('characterTypeForm')!.enable();
    } else {
      this.characterForm.get('levelForm')!.disable();
      this.characterForm.get('characterTypeForm')!.disable();
    }
  }

  // Get classes from the local API. The database will return what it has.
  ngOnInit() {
    this.initFormVals();
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
    this.clazzes = this.classService.classes;
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
