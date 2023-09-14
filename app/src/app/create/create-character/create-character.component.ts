import { Component } from "@angular/core";
import { UserService } from "../../services/user.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Class } from "src/app/model/class";
import { MatChip } from "@angular/material/chips";
import { Dice } from "src/app/model/dice";
import { Spellslot } from "src/app/model/spellslot";
import { StatsFormComponent } from "src/app/shared/stats-form-component/stats-form.component";


@Component({
  selector: 'create-character-app',
  templateUrl: './create-character.component.html',
  styleUrls: ['./create-character.component.scss']
})
export class CreateCharacterComponent {

  clazzes: Class[] = [];
  hitDice: Dice[] = [];
  stats: any[] = [
    {
      name: "Strength",
      description: "Strength measures bodily power, athletic training, and the extent to which you can exert raw physical force.",
      value: 10,
    },
    {
      name: "Dexterity",
      value: 16,
      description: "Dexterity measures agility, reflexes, and balance.",
    },
    {
      name: "Constitution",
      value: 12,
      description: "Constitution measures health, stamina, and vital force.",
    },
    {
      name: "Intelligence",
      value: 8,
      description: "Intelligence measures mental acuity, accuracy of recall, and the ability to reason.",
    },
    {
      name: "Wisdom",
      value: 11,
      description: "Wisdom reflects how attuned you are to the world around you and represents perceptiveness and intuition.",
    },
    {
      name: "Charisma",
      value: 18,
      description: "Charisma measures your ability to interact effectively with others. It includes such factors as confidence and eloquence, and it can represent a charming or commanding personality.",
    }
  ];
  spellSlots: Spellslot[] = [];
  characterForm: FormGroup;
  selectedCharType: number = 0;

  constructor(private userService: UserService, private formBuilder: FormBuilder) {
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
    return this.userService.isAdmin();
  }

  get level() {
    if (this.characterForm.get('levelForm')?.value) {
      return this.characterForm.get('levelForm')?.value;
    } else {
      return 1;
    }
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
    if (this.userService.isAdmin()) {
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
    this.clazzes = [
      {
        id: 1,
        name: "Barbarian",
        startingHp: 12,
        description: "A fierce warrior of primitive background who can enter a battle rage",
      },
      {
        id: 2,
        name: "Bard",
        startingHp: 8,
        description: "An inspiring magician whose power echoes the music of creation",
      },
      {
        id: 3,
        name: "Cleric",
        startingHp: 8,
        description: "A priestly champion who wields divine magic in service of a higher power",
      },
      {
        id: 4,
        name: "Druid",
        startingHp: 8,
        description: "A priest of the Old Faith, wielding the powers of nature and adopting animal forms",
      },
      {
        id: 5,
        name: "Fighter",
        startingHp: 10,
        description: "A master of martial combat, skilled with a variety of weapons and armor",
      }
    ];
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
