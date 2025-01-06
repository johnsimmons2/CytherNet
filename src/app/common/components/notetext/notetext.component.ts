import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, TemplateRef, Type, ViewChild } from "@angular/core";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonItem, IonLabel, IonList, IonPopover, IonText } from "@ionic/angular/standalone";
import { Character } from "../../model/character";
import { Campaign } from "../../model/campaign";
import { Feat } from "../../model/feat";
import { Note } from "../../model/note";
import { Race } from "../../model/race";
import { User } from "../../model/user";
import { CampaignService } from "../../services/campaign.service";
import { CharacterService } from "../../services/character.service";
import { RaceService } from "../../services/race.service";
import { UserService } from "../../services/user.service";
import { catchError, finalize, of, retry, Subject, takeUntil, tap } from "rxjs";
import { ApiResult } from "../../model/apiresult";
import { IParsedNoteReference, ParsedNote } from "../../model/parsednote";

@Component({
  selector: 'app-note-text',
  templateUrl: './notetext.component.html',
  standalone: true,
  imports: [
    CommonModule,
    IonText,
    IonPopover,
    IonContent,
    IonButton,
    IonLabel,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonList,
    IonItem,
    IonCardHeader
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
  ion-popover {
    &::part(content) {
      min-width: 530px;
    }
  }
  `
})
export class NoteTextComponent implements OnInit {

  private unsubscribe$ = new Subject<void>();

  @Input() noteRef!: IParsedNoteReference;
  @Input() html!: any;

  @ViewChild(IonPopover) popover!: IonPopover;

  @ViewChild('userContent') userContent!: TemplateRef<any>;
  @ViewChild('characterContent') characterContent!: TemplateRef<any>;

  showPopover: boolean = false;

  constructor(private userService: UserService,
              private characterService: CharacterService,
              private campaignService: CampaignService,
              private raceService: RaceService,
              private cdr: ChangeDetectorRef) {
  }

  get viewContent(): TemplateRef<any> | null {
    switch (this.noteRef.tableName) {
      case 'USERS':
        return this.userContent;
      case 'CHARACTERS':
        return this.characterContent;
      default:
        return null;
    }
  }


  ngOnInit(): void {

  }

  showDetails(event: any) {
    this.showPopover = true;
    this.popover.event = event;
  }

}
