import { Component } from "@angular/core";
import { UserService } from "../../services/user.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Class } from "src/app/model/class";


@Component({
  selector: 'create-character-app',
  templateUrl: './create-character.component.html',
  styleUrls: ['./create-character.component.scss']
})
export class CreateCharacterComponent {

  clazzes: Class[] = [];

  constructor(private userService: UserService) { }

  characterForm = new FormGroup({
    characterNameForm: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    classForm: new FormControl('', Validators.required),
    levelForm: new FormControl({value: 1, disabled: true}, [Validators.max(20), Validators.min(1)]),
    subclassForm: new FormControl('', Validators.required),
    raceForm: new FormControl('', Validators.required),
    statsForm: new FormControl(''),
    backgroundForm: new FormControl(''),
    alignmentForm: new FormControl(''),
    personalityForm: new FormControl(''),
    spellsForm: new FormControl(''),
    cantripsForm: new FormControl(''),
  });

  get level() {
    if (this.characterForm.get('levelForm')?.value) {
      return this.characterForm.get('levelForm')?.value;
    } else {
      return 1;
    }
  }

  initFormVals() {
    this.characterForm.get('levelForm')!.setValue(1);
    if (this.userService.isAdmin()) {
      this.characterForm.get('levelForm')!.enable();
    }
  }

  // Get classes from the local API. The database will return what it has.
  ngOnInit() {
    this.initFormVals();
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
    ]
  }

  submit() {
  }

}
