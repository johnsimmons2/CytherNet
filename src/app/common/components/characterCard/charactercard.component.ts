import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { Character } from "../../model/character";
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonItem, IonLabel, IonText, IonToolbar } from "@ionic/angular/standalone";
import { CharacterService } from "../../services/character.service";
import { ClassService } from "../../services/class.service";
import { RaceService } from "../../services/race.service";
import { Class, Subclass } from "../../model/class";
import { Race } from "../../model/race";
import { combineLatest, tap } from "rxjs";
import { Statsheet } from "../../model/statsheet";
import { addIcons } from "ionicons";
import { helpCircleOutline } from "ionicons/icons";


@Component({
  selector: 'app-character-card',
  templateUrl: './charactercard.component.html',
  standalone: true,
  imports: [
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonButtons,
    IonButton,
    IonToolbar,
    IonIcon,
    IonText,
    IonItem,
    IonLabel
  ]
})
export class CharacterCardComponent implements OnInit {
  //TODO: Clean up and don't use any here.
  @Input() character!: { 'character': Character, 'userId': number } | any;
  @Input() ownerId: number = -1;
  @Input() size: 'small' | 'medium' | 'large' = 'small';

  _character!: Character;
  _statsheet!: Statsheet;
  _classname: string = '';

  private classes: Class[] = [];
  private subclasses: Subclass[] = [];
  subclassname: string = '';
  private races: Race[] = [];

  constructor(private characterService: CharacterService,
              private classService: ClassService,
              private raceService: RaceService,
              private changeDetectionRef: ChangeDetectorRef) {
    addIcons({ helpCircleOutline });
  }

  get classname(): string {
    if (this.classes.length > 0) {
      const cls = this.classes.find(c => c.id === this._character.classId);
      if (cls) {
        return cls.name;
      }
    }
    return '';
  }

  // get subclassname(): string {
  //   if (this.subclasses.length > 0) {
  //     const subclass = this.subclasses.find(sc => sc.id === this._character.subclassId);
  //     if (subclass) {
  //       return subclass.name;
  //     }
  //   }
  //   return '';
  // }

  get racename(): string {
    if (this.races.length > 0) {
      const races = this.races.find(r => r.id === this._character.raceId);
      console.log(this.races, races);
      if (races) {
        return races.name;
      }
    }
    return '';
  }

  ngOnInit(): void {
    this._character = this.character.character;
    if (this._character !== undefined) {
      this._statsheet = {
        id: this._character.statsheetId,
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
        health: 0,
        exp: 14320,
        level: 6,
        inspiration: false,
        savingThrows: [],
        proficiencies: [],
        skills: [],
        spellbook: {
          spellslot1: 0,
          spellslot2: 0,
          spellslot3: 0,
          spellslot4: 0,
          spellslot5: 0,
          spellslot6: 0,
          spellslot7: 0,
          spellslot8: 0,
          spellslot9: 0,
          warlockslots: 0,
          warlockslotlevel: 0
        }
      }
      console.log(this._character);

      combineLatest([
        this.classService.classes$,
        this.classService.subclasses$,
        this.raceService.races$
      ]).pipe(
        tap(([classes, subclasses, races]) => {
          this.classes = classes;
          this.subclasses = subclasses
          this.races = races;

          const subclass = this.subclasses.find(sc => sc.id === this._character.subclassId);
          if (subclass) {
            this.subclassname = subclass.name;
          }

          this.changeDetectionRef.markForCheck();
        })
      ).subscribe();
    }

  }

}
