import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonIcon, IonInput, IonItem, IonLabel, IonList, IonRow, IonSearchbar, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView, IonSelect, IonSelectOption, IonText } from "@ionic/angular/standalone";
import { NoteFilter } from "./note-filter";
import { CommonModule } from "@angular/common";
import { ParsedNote } from "src/app/common/model/parsednote";
import { NoteService } from "src/app/common/services/note.service";
import { ParsingService } from "src/app/common/services/parsing.service";
import { Note } from "src/app/common/model/note";
import { tap, forkJoin, map } from "rxjs";
import { TableComponent } from "src/app/common/components/table/table.component";
import { TableColumn } from "src/app/common/components/table/table.column";
import { TableActon } from "src/app/common/components/table/table.actions";
import { RouterModule } from "@angular/router";
import { addIcons } from "ionicons";
import { pencilOutline, trashBinOutline } from "ionicons/icons";
import { NoteCardComponent } from "../../common/components/noteCard/notecard.component";
import { ApiResult } from "src/app/common/model/apiresult";


@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonContent,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonText,
    IonList,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonSegmentContent,
    IonSegmentView,
    IonSearchbar,
    TableComponent,
    NoteCardComponent
],
  styles: [`
    .notes-header {
      border-bottom: 1px solid;
      font-weight: bold;
    }

    @media (max-width: 600px) {
      .action-button .action-text {
        display: none; /* Hide the text on smaller screens */
      }
    }

    @media (min-width: 601px) {
      .action-button ion-icon {
        display: none; /* Hide the icon on larger screens */
      }
    }

    ion-label strong {
      display: block;
      max-width: calc(100% - 60px);
      overflow: hidden;
      text-overflow: ellipsis;
    }

    ion-label ion-note {
      font-size: 0.9rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JournalComponent implements OnInit {

  filterString: string = '';
  filter: NoteFilter | undefined;

  _notes: ParsedNote[] = [];
  notes: ParsedNote[] = [];
  notesByDirectory: Map<string, ParsedNote[]> = new Map<string, ParsedNote[]>();

  constructor(private noteService: NoteService,
              private parser: ParsingService,
              private changeDetectorRef: ChangeDetectorRef)
  {
    addIcons({ pencilOutline, trashBinOutline });
  }

  ngOnInit(): void {
    this.noteService.getPlayerNotes().pipe(
      map((res: ApiResult) => {
        if (res.data) {
          return res.data as Note[];
        }
        return [];
      }),
      tap((res: Note[]) => {
        const parseObservables = res.map(note => this.parser.parseNote(note));
        forkJoin(parseObservables).subscribe(parsedNotes => {
          parsedNotes.forEach(pn => {
            if (!this.notesByDirectory.has(pn.directory)) {
              this.notesByDirectory.set(pn.directory, []);
            }
            this.notes.push(pn);
            this.notesByDirectory.get(pn.directory)!.push(pn);
          });
          console.log(this.notesByDirectory);
          this.notes = this.notes.sort((a, b) => a.updated > b.updated ? -1 : 1);
          this._notes = this.notes;
          this.changeDetectorRef.markForCheck();
        });
      })
    ).subscribe();
  }

  refresh(event: any): void {
    if (event !== undefined) {
      if (event.target.value !== '') {
        const val = event.target.value;
        console.log(val);
        this.notes = this._notes.filter(note => {
          return note.name.toLowerCase().includes(val) || note.rawText.includes(val)
        });
      } else {
        this.notes = this._notes;
      }
    }
    this.changeDetectorRef.markForCheck();
  }
}
