import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonIcon, IonItem, IonLabel, IonRow, IonText, IonToolbar } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { addCircleOutline } from "ionicons/icons";
import { Subject, takeUntil, tap } from "rxjs";
import { CharacterCardComponent } from "src/app/common/components/characterCard/charactercard.component";
import { NotetextComponent } from "src/app/common/components/notetext/notetext.component";
import { TableComponent } from "src/app/common/components/table/table.component";
import { ApiResult } from "src/app/common/model/apiresult";
import { Campaign } from "src/app/common/model/campaign";
import { Character } from "src/app/common/model/character";
import { Note } from "src/app/common/model/note";
import { CampaignService } from "src/app/common/services/campaign.service";
import { CharacterService } from "src/app/common/services/character.service";
import { NoteService } from "src/app/common/services/note.service";
import { ToastService } from "src/app/common/services/toast.service";
import { UserService } from "src/app/common/services/user.service";


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonContent,
    IonCard,
    IonButton,
    IonLabel,
    IonIcon,
    IonText,
    IonButtons,
    IonToolbar,
    IonLabel,
    IonItem,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    NotetextComponent,
    CharacterCardComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent implements OnInit {

  private unsubscribe$ = new Subject<void>();

  sections: [{
    [name: string]: string;
  }] = [
    {
      name: 'Home'
    }
  ];

  campaigns: Campaign[] = [];
  characters: Character[] = [];
  notes: Note[] = [];
  parts: {note: Note, parts: any[]}[] = [];

  get hasCampaigns() {
    return this.campaigns.length > 0;
  }

  constructor(private campaignService: CampaignService,
              private userService: UserService,
              private characterService: CharacterService,
              private noteService: NoteService,
              private toastService: ToastService,
              private changeDetectorRef: ChangeDetectorRef) {
    addIcons({addCircleOutline});
  }

  ngOnInit() {
    this.campaignService.getCampaignsForUser(this.userService.getCurrentUsername()!).pipe(
      tap((res: ApiResult) => {
        if (res.success) {
          this.campaigns = res.data.map((campaign: Campaign) => {
            campaign.description = "this is a test!\nSo _anyway_ I started blasting.\n\nI said. **blasting**!!!"
            this.changeDetectorRef.markForCheck();
            return campaign;
          });
        }
      })
    ).subscribe();

    this.characterService.getCharacters().pipe(
      tap((res: Character[]) => {
        console.log(res);
        if (res.length > 0) {
          this.characters = res;
          this.changeDetectorRef.markForCheck();
        }
      })
    ).subscribe();

    // this.noteService.getPlayerNotes().pipe(
    //   tap((res: ApiResult) => {
    //     if (res.success) {
    //       this.notes = res.data as Note[];
    //       this.notes.forEach(note => {
    //         this.parts.push({note, parts: this.parseDescriptionIntoParts(note.description)});
    //       });
    //       this.changeDetectorRef.markForCheck();
    //       console.log(this.parts);
    //     }
    //   })
    // ).subscribe();

  }

  public findNoteParts(noteId: number) {
    return this.parts.find(part => part.note.id === noteId)?.parts;
  }

  /**
   * TODO:
   * - This will soon become a separate service to handle this kind of transformation as well
   * as searching for matching tags. E.g.: `And then [USER.Jericho] said...`
   * @param description
   * @returns
   */

  public trackByNoteId(index: number, note: Note) {
    return note.id;
  }

  public trackByPartId(index: number, part: {note: Note, part: any}) {
    return part.note.id + index;
  }

  public innerHtmlForDescription(description: string) {
    const transformations = [
      {
        search: /(?:\r\n|\r|\n)/g,
        replace: '<br>'
      },
      {
        search: /\*\*(.*?)\*\*/g,
        replace: '<strong>$1</strong>'
      },
      {
        search: /\*(.*?)\*/g,
        replace: '<em>$1</em>'
      },
    ];
    transformations.forEach((transformation) => {
      description = description.replace(transformation.search, transformation.replace);
    });

    return description;
  }

  public parseDescriptionIntoParts(description: string) {
    const transformations = [
      {
        search: /(?:\r\n|\r|\n)/g,
        replace: '<br>'
      },
      {
        search: /\*\*(.*?)\*\*/g,
        replace: '<strong>$1</strong>'
      },
      {
        search: /\*(.*?)\*/g,
        replace: '<em>$1</em>'
      },
    ];
    transformations.forEach((transformation) => {
      description = description.replace(transformation.search, transformation.replace);
    });

    const parts: Array<{ type: 'text' | 'component'; value: string }> = [];
    const regex = /\[(.*?)\]/g;
    let lastIndex = 0;

    let match: RegExpExecArray | null;
    while ((match = regex.exec(description)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', value: description.slice(lastIndex, match.index) });
      }
      parts.push({ type: 'component', value: match[1] });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < description.length) {
      parts.push({ type: 'text', value: description.slice(lastIndex) });
    }

    return parts;
  }
}
