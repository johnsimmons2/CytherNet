import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonIcon, IonItem, IonLabel, IonRow, IonText, IonToolbar } from "@ionic/angular/standalone";
import { catchError, forkJoin, map, Subject, switchMap, tap } from "rxjs";
import { CharacterCardComponent } from "src/app/common/components/characterCard/charactercard.component";
import { NoteCardComponent } from "src/app/common/components/noteCard/notecard.component";
import { NoteTextComponent } from "src/app/common/components/notetext/notetext.component";
import { ApiResult } from "src/app/common/model/apiresult";
import { Campaign } from "src/app/common/model/campaign";
import { Character } from "src/app/common/model/character";
import { Note } from "src/app/common/model/note";
import { ParsedNote } from "src/app/common/model/parsednote";
import { CampaignService } from "src/app/common/services/campaign.service";
import { CharacterService } from "src/app/common/services/character.service";
import { NoteService } from "src/app/common/services/note.service";
import { ParsingService } from "src/app/common/services/parsing.service";
import { ToastService } from "src/app/common/services/toast.service";
import { UserService } from "src/app/common/services/user.service";
import { addIcons } from "ionicons";
import { addCircleOutline, listCircleOutline, arrowForwardCircleOutline } from "ionicons/icons";


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
    NoteTextComponent,
    CharacterCardComponent,
    NoteCardComponent
  ],
  styles: [`
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent implements OnInit {

  private unsubscribe$ = new Subject<void>();

  campaigns: Campaign[] = [];
  characters: Character[] = [];
  notes: ParsedNote[] = [];

  get hasCampaigns() {
    return this.campaigns.length > 0;
  }

  constructor(private campaignService: CampaignService,
              private userService: UserService,
              private characterService: CharacterService,
              private noteService: NoteService,
              private toastService: ToastService,
              private parser: ParsingService,
              private changeDetectorRef: ChangeDetectorRef) {
    addIcons({addCircleOutline, listCircleOutline, arrowForwardCircleOutline});
  }

  ngOnInit() {
    this.campaignService.getCampaignsForUser(this.userService.currentUsername!).pipe(
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

    this.characterService.getCharactersForUser(this.userService.currentUsername!).pipe(
      tap((res: Character[]) => {
        if (res.length > 0) {
          this.characters = res;
          console.log(res);
          this.changeDetectorRef.markForCheck();
        }
      })
    ).subscribe();

    this.noteService.getPlayerNotes().pipe(
      map((res: ApiResult) => {
        if (res.data) {
          return res.data as Note[];
        }
        return [];
      }),
      map((res: Note[]) => {
        return res.sort((a, b) => a.updated! > b.updated! ? -1 : 1).slice(0, 5);
      }),
      switchMap((res: Note[]) => {
        const parseObservables = res.map(note => this.parser.parseNote(note));
        return forkJoin(parseObservables);
      })
    ).subscribe({
      next: parsedNotes => {
        this.notes = parsedNotes.sort((a, b) => a.updated > b.updated ? -1 : 1);
        console.log('Parsed Notes:', this.notes);
        this.changeDetectorRef.markForCheck();
      },
      error: err => console.error('Error fetching or parsing notes:', err)
    });
  }

  public notImplemented(): void {
    this.toastService.showUnimplemented();
  }

  public innerHtmlForDescription(text: string) {
    return this.parser.parseMarkdown(text);
  }

  /**
   * TODO:
   * - This will soon become a separate service to handle this kind of transformation as well
   * as searching for matching tags. E.g.: `And then [USER.Jericho] said...`
   * @param description
   * @returns
   */

  public trackByNoteId(index: number, note: ParsedNote) {
    return note.id;
  }

  public trackByPartId(index: number, part: {note: Note, part: any}) {
    return part.note.id + index;
  }
}
