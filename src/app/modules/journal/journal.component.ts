import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { AlertController, IonAccordion, IonAccordionGroup, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonFab, IonFabButton, IonFabList, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonNote, IonRow, IonSearchbar, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, ModalController, PopoverController, ViewWillEnter } from "@ionic/angular/standalone";
import { NoteFilter } from "./note-filter";
import { CommonModule } from "@angular/common";
import { ParsedNote } from "src/app/common/model/parsednote";
import { NoteService, DirectoryNote } from "src/app/common/services/note.service";
import { ParsingService } from "src/app/common/services/parsing.service";
import { Note } from "src/app/common/model/note";
import { tap, forkJoin, map } from "rxjs";
import { TableComponent } from "src/app/common/components/table/table.component";
import { TableColumn } from "src/app/common/components/table/table.column";
import { TableActon } from "src/app/common/components/table/table.actions";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { NoteCardComponent } from "../../common/components/noteCard/notecard.component";
import { ApiResult } from "src/app/common/model/apiresult";
import { UserService } from "src/app/common/services/user.service";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { JournalRowItemComponent } from "./journal-row-item.component";
import { User } from "src/app/common/model/user";

/**
 * TODO:
 * - What if I "create" a directory that already exists?
 * - Drag notes from one directory to another
 * - adding an empty directory
 */

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonAccordion,
    IonAccordionGroup,
    IonContent,
    IonCard,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonText,
    IonList,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonNote,
    IonInput,
    IonFab,
    IonFabButton,
    IonFabList,
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
    NoteCardComponent,
    JournalRowItemComponent
  ],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .fab-label {
      position: relative;
      left: -4rem;
      bottom: -2.8rem;
      background-color: var(--ion-color-light);
      align-self: end;
      border-radius: 0.5rem;
      padding: 0.5rem;
      padding-right: 0.8rem;
    }

    .selfdir {
      color: var(--ion-color-primary);
    }

    .notes-header {
      border-bottom: 1px solid;
      font-weight: bold;
    }

    @media (max-width: 600px) {
      .file-count {
        display: none;
      }

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
export class JournalComponent implements AfterViewInit, ViewWillEnter {

  @ViewChild('directoryAccordion') directoryAccordion!: IonAccordionGroup;
  @ViewChild('shareDirectoryModal') shareModalTemplate!: TemplateRef<any>;

  filterString: string = '';
  filter: NoteFilter | undefined;

  sortByDate: boolean = true;

  _notes: ParsedNote[] = [];
  _myNotes: ParsedNote[] = [];
  _rawNotes: Note[] = [];
  _rawMyNotes: Note[] = [];
  myNotes: ParsedNote[] = [];
  notes: ParsedNote[] = [];
  notesByDirectory: Map<string, ParsedNote[]> = new Map<string, ParsedNote[]>();
  directories: string[] = [];
  noteDirectoryMap: DirectoryNote = { directories: {}, name: '', fullName: '' };
  myNoteDirectoryMap: DirectoryNote = { directories: {}, name: '', fullName: '' };

  get firstDirectory(): string | undefined {
    return this.notesByDirectory.keys().next().value;
  }

  get userId(): number | undefined {
    if (this.userService.currentUserId) {
      return +this.userService.currentUserId;
    }
    return undefined;
  }

  constructor(private noteService: NoteService,
              private userService: UserService,
              private parser: ParsingService,
              private popover: PopoverController,
              private alert: AlertController,
              private sanitizer: DomSanitizer,
              private modal: ModalController,
              private router: Router,
              private changeDetectorRef: ChangeDetectorRef)
  {
  }

  directoryStylized(directory: string): SafeHtml {
    const search = this.userService.currentUsername + '';
    const styledDirectory = directory.replace(
      search,
      `<span class="selfdir">${search}</span>`
    );
    return this.sanitizer.bypassSecurityTrustHtml(styledDirectory);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.directoryAccordion && this.directories.length > 0) {
        this.directoryAccordion.value = this.directories[0];
      }
    }, 500);
  }

  refreshNotes(secondPass: boolean = false) {
    this.directories = [];
    this.notes = [];
    this._rawNotes = [];
    this._notes = [];
    this.myNoteDirectoryMap = { directories: {}, name: '', fullName: '' };
    this.noteDirectoryMap = { directories: {}, name: '', fullName: '' };
    this._myNotes = [];
    this._rawMyNotes = [];
    this.notesByDirectory.clear();

    this.noteService.getPlayerNotes().pipe(
      map((res: ApiResult) => {
        if (res.data) {
          return res.data as Note[];
        }
        return [];
      }),
      tap((res: Note[]) => {
        if (res.length === 0 && !secondPass) {
          // New user, has no directories / notes. Pre-make a note for them.
          const note: Note = {
            name: 'My First Note',
            description: 'This is a note to help you get started. Try using markdown to format your text.',
            directory: this.userService.currentUsername + '/',
            active: true,
            created: new Date(),
            updated: new Date(),
            userId: this.userId
          };
          this.noteService.createNote(note).subscribe(() => this.refreshNotes(true));
        }
        this._rawNotes = res.filter(n => n.campaignId && n.campaignId !== undefined);
        const parseObservables = res.map(note => this.parser.parseNote(note));
        forkJoin(parseObservables).subscribe(parsedNotes => {
          console.log(parsedNotes);
          parsedNotes.forEach(pn => {
            if (!this.notesByDirectory.has(pn.directory)) {
              this.notesByDirectory.set(pn.directory, []);
              this.directories.push(pn.directory);
            }
            this.notes.push(pn);
            this.notesByDirectory.get(pn.directory)!.push(pn);
          });
          this.directories = this.directories.sort();
          this.notes = this.sorted(this.notes);

          this._notes = this.notes.filter(n => n.campaignId && n.campaignId !== undefined);
          this.myNotes = this.notes.filter(n => !n.campaignId || n.campaignId === undefined);
          this._myNotes = this.myNotes;
          console.log(this.myNotes, this._notes);
          this._rawMyNotes = res.filter(n => !n.campaignId || n.campaignId === undefined);
          this.noteService.buildNestedDirectories(this._rawNotes).subscribe(res => {
            this.noteDirectoryMap = res;
            this.changeDetectorRef.detectChanges();
          });

          this.noteService.buildNestedDirectories(this._rawMyNotes).subscribe(res => {
            this.myNoteDirectoryMap = res;
            this.changeDetectorRef.detectChanges();
          });
        });
      })
    ).subscribe();
  }

  sorted(notes: ParsedNote[]): ParsedNote[] {
    if (this.sortByDate) {
      return notes.sort((a, b) => a.updated > b.updated ? -1 : 1);
    } else {
      return notes.sort((a, b) => a.name > b.name ? 1 : -1);
    }
  }

  ionViewWillEnter(): void {
    this.refreshNotes(true);
  }

  refresh(event: any): void {
    if (event !== undefined) {
      if (event.detail.value !== '') {
        const val = event.detail.value;
        this.notes = this._notes.filter(note => {
          return note.name.toLowerCase().includes(val) || note.rawText.includes(val)
        });
        this.myNotes = this._myNotes.filter(note => {
          return note.name.toLowerCase().includes(val) || note.rawText.includes(val)
        });
      } else {
        this.notes = this._notes;
        this.myNotes = this._myNotes;
      }
      const newMyRawNotes = this.myNotes.map(note => note.note!);
      this.noteService.buildNestedDirectories(newMyRawNotes).subscribe(res => {
        this.myNoteDirectoryMap = res;
        this.changeDetectorRef.markForCheck();
      });

      const newRawNotes = this.notes.map(note => note.note!);
      this.noteService.buildNestedDirectories(newRawNotes).subscribe(res => {
        this.noteDirectoryMap = res;
        this.changeDetectorRef.markForCheck();
      });
    }
    this.changeDetectorRef.markForCheck();
  }

  addNewNote(event: any) {
    this.router.navigate(['/journal', 'new']);
  }

  getDirSharedUsers(directory: string): User[] {
    try {
      return this.noteDirectoryMap.directories[directory].sharedWith ?? [];
    } catch {
      return [];
    }
  }

  getMyDirSharedUsers(directory: string): User[] {
    try {
      return this.myNoteDirectoryMap.directories[directory].sharedWith ?? [];
    } catch {
      return [];
    }
  }

  getDirectoryKeys(): string[] {
    return Object.keys(this.noteDirectoryMap.directories || {});
  }

  getMyDirectoryKeys(): string[] {
    return Object.keys(this.myNoteDirectoryMap.directories || {});
  }

  openGuide() {
    this.alert.create({
      header: 'How to use the Journal:',
      message: `
        <p>The Journal is used to take notes and share information between players.</p>
        <br/>
        <p>1. Click on a note to view it.</p>
        <p>2. Press the button on the bottom right to open the context panel.</p>
        <p>3. From the context menu, switch to edit mode; or share, tag, or delete the note.</p>
        <p>4. Notes support full markdown, and will eventually include graphs/charts.</p>
        <p>5. Image attachment support coming soon.</p>
        <p>6. When a directory is shared with users, all notes within that directory are shared.</p>
        <p>7. Only the owner of a note can edit/rename/move a note.</p>
        <p>8. Empty directories are automatically deleted.</p>
        <p>9. Make sure to save constantly! If you encounter errors or user experience issues, contact site admins.</p>
        <br/>
        <p>Don't worry! New views and methods of organizing your notes are coming soon, and you won't lose anything!
        Soon the directories will look a bit more, directory-ish.</p>
        `
    }).then(alert => {
      alert.present();
    });

  }

  async addNewDirectory(event: any) {
    event.stopPropagation();
    const baseDirectory = this.userService.currentUsername + "/";
    let alertInstance: HTMLIonAlertElement;

    const alert = await this.alert.create({
      header: 'Add a Directory',
      message: `<p>Enter the name of the subdirectory under your username:</p><p><span id="resolved-directory"><strong>${baseDirectory}</strong></span></p>`,
      inputs: [
        {
          name: 'subdirectory',
          type: 'text',
          placeholder: 'Enter a Subdirectory'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: (data) => {
            const note: Note = {
              name: 'Untitled',
              description: '',
              directory: baseDirectory + data.subdirectory,
              active: true,
              created: new Date(),
              updated: new Date()
            };
            this.noteService.createNote(note).pipe(
              tap((note: Note | undefined) => {
                alert.dismiss().then(() => {
                  this.router.navigate(['/journal', note?.id, 'edit']).then(() => {
                    location.reload();
                  });
                });
              })
            ).subscribe();
          }
        }
      ]
    });

    alert.present().then(() => {
      alertInstance = alert;
      alert.present().then(() => {
        const input = alert.querySelector('input') as HTMLInputElement;
        if (input) {
          input.addEventListener('input', (event: any) => {
            const fullPath = baseDirectory + event.target.value;
            document.getElementById('resolved-directory')!.textContent = fullPath;
          });
        }
      });
    });
  }
}
