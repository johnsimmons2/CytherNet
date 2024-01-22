import { AfterViewInit, Component, OnInit } from "@angular/core";
import { UserService } from "../../../services/user.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Class } from "src/app/model/class";
import { MatChip } from "@angular/material/chips";
import { Dice } from "src/app/model/dice";
import { Spellslot } from "src/app/model/spellslot";
import { Router } from "@angular/router";
import { StatsService } from "src/app/services/stats.service";
import { ClassService } from "src/app/services/class.service";
import { Race } from "src/app/model/race";
import { RaceService } from "src/app/services/race.service";
import { FeatService } from "src/app/services/feat.service";
import { from, map } from "rxjs";


@Component({
  selector: 'create-character-app',
  templateUrl: './create-character.component.html',
  styleUrls: ['./create-character.component.scss']
})
export class CreateCharacterComponent implements OnInit, AfterViewInit {

  races: Race[] = [];
  clazzes: Class[] = [];
  subclasses: Class[] = [];
  hitDice: Dice[] = [];
  spellSlots: Spellslot[] = [];
  isPC: boolean = false;
  selectedCharType: number = 0;
  characterForm: FormGroup;

  constructor(
    private raceService: RaceService,
    private userService: UserService, 
    private statsService: StatsService,
    private classService: ClassService,
    private featService: FeatService,
    private formBuilder: FormBuilder, 
    public router: Router) {

    this.characterForm = this.formBuilder.group({
      characterNameForm: this.formBuilder.control('', [Validators.required, Validators.maxLength(30)]),
      levelForm: this.formBuilder.control(1, [Validators.required, Validators.min(1), Validators.max(20)]),
      raceIdForm: this.formBuilder.control(-1, Validators.required),
      classIdForm: this.formBuilder.control(-1, Validators.required),
      statsForm: this.formBuilder.group({
        strengthForm: this.formBuilder.control(10, [Validators.required, Validators.min(1), Validators.max(20)]),
        dexterityForm: this.formBuilder.control(10, [Validators.required, Validators.min(1), Validators.max(20)]),
        constitutionForm: this.formBuilder.control(10, [Validators.required, Validators.min(1), Validators.max(20)]),
        wisdomForm: this.formBuilder.control(10, [Validators.required, Validators.min(1), Validators.max(20)]),
        charismaForm: this.formBuilder.control(10, [Validators.required, Validators.min(1), Validators.max(20)]),
        intelligenceForm: this.formBuilder.control(10, [Validators.required, Validators.min(1), Validators.max(20)]),
      })
      // classForm: this.formBuilder.control('', Validators.required),
      // characterTypeForm: this.formBuilder.control(0),
      // subclassForm: this.formBuilder.control('', Validators.required),
      // statsForm: new FormControl(''),
      // backgroundForm: new FormControl(''),
      // alignmentForm: new FormControl(''),
      // personalityForm: new FormControl(''),
      // spellsForm: new FormControl(''),
      // cantripsForm: new FormControl(''),
    });
  }

  ngAfterViewInit(): void {
    this.initFormVals();
    console.log(this.races);
  }

  // Get classes from the local API. The database will return what it has.
  ngOnInit() {
    this.raceService.getRaces().subscribe((races: Race[]) => {
      this.races = races;
    });

    this.classService.getClasses().subscribe((classes: Class[]) => {
      this.clazzes = classes;
    });

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
  }

  initFormVals() {
    // this.characterForm.get('levelForm')!.setValue(1);
    //this.characterForm.get('characterTypeForm')!.setValue(0);
    if (this.isadmin) {
      //this.characterForm.get('levelForm')!.enable();
      //this.characterForm.get('characterTypeForm')!.enable();
    } else {
      //this.characterForm.get('levelForm')!.disable();
     // this.characterForm.get('characterTypeForm')!.disable();
    }
  }

  get isadmin() {
    return this.userService.hasRoleAdmin();
  }


  public getSubclasses(): any {
    // if (this.characterForm.get('classForm')?.value) {
    //   return this.characterForm.get('classForm')?.value.subclasses;
    // } else {
    //   return [];
    // }
    return [];
  }

  public getClassTraitDescription(): string {
    return "!";
  }

  public getRaceModalTitle(): string {
    if (this.characterForm.get('raceIdForm')?.value > 0) {
      // Get the description of this race.
      const raceId = this.characterForm.get('raceIdForm')?.value;
      const race = this.races.find(x => x.id === raceId)!;

      return `(${race.featIds.length}) Race Traits`;
    } else {
      return "Race Traits";
    }
  }

  // Returns a string of HTML to populate the modal.
  public getRaceTraitDescription(): string {
    let desc = "In D&D 5e, each race has unique traits that are described in the Player's Handbook.<br><br>";

    if (this.characterForm.get('raceIdForm')?.value > 0) {
      // Get the description of this race.
      const raceId = this.characterForm.get('raceIdForm')?.value;
      const race = this.races.find(x => x.id === raceId)!;

      desc += race.name + ":<br>";
      desc += "<ul>";
      
      from(race.featIds).pipe(
        map((featId: number) => this.featService.get(featId))
      )

      race.featIds.forEach((featId: number) => {
        let feat = this.featService.get(featId)
        desc += `<li>${feat}</li>`;
      });
      desc += "</ul>";
    } else {
      desc += "Select a race to view its traits.";
    }
    // TODO: get the current race
    return desc;
  }

  public updateClassSelection(event: any): void {
    this.characterForm.controls['classIdForm'].setValue(event);
    this.classService.getClassSubclasses(event).subscribe((subclasses: Class[]) => {
      console.log(subclasses);
      this.subclasses = subclasses;
    });
  }

  characterTypeFormUpdate(event: any) {
    console.log('hi')
    if (event.value.replace(/\s/g, "") === "PC") {

    } else {

    }
  }

  characterTypeSelect(matChip: MatChip) {
    // if (!this.characterForm.get('characterTypeForm')?.disabled) {
    //   if (matChip.value.replace(/\s/g, "") === "NPC") {
    //     if (this.isadmin) {
    //       this.characterForm.get('characterTypeForm')!.setValue(1);
    //       this.selectedCharType = 1;
    //     }
    //   } else {
    //     this.characterForm.get('characterTypeForm')!.setValue(0);
    //     this.selectedCharType = 0;
    //   }
    // } else {
    //   console.log('disabled! ' + this.characterForm.get('characterTypeForm')!.value);
    // }
  }

  submit() {
  }

}
