import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { AlertController, IonAccordion, IonAccordionGroup, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonNote, IonRow, IonSearchbar, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, ModalController } from "@ionic/angular/standalone";
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
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { addIcons } from "ionicons";
import { add, pencilOutline, shareOutline, trashBinOutline, helpCircleOutline } from "ionicons/icons";
import { NoteCardComponent } from "../../common/components/noteCard/notecard.component";
import { ApiResult } from "src/app/common/model/apiresult";
import { UserService } from "src/app/common/services/user.service";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

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
  encapsulation: ViewEncapsulation.None,
  styles: [`
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
export class JournalComponent implements OnInit, AfterViewInit {

  @ViewChild('directoryAccordion') directoryAccordion!: IonAccordionGroup;
  @ViewChild('shareDirectoryModal') shareModalTemplate!: TemplateRef<any>;

  filterString: string = '';
  filter: NoteFilter | undefined;

  _notes: ParsedNote[] = [];
  notes: ParsedNote[] = [];
  notesByDirectory: Map<string, ParsedNote[]> = new Map<string, ParsedNote[]>();
  directories: string[] = [];

  get firstDirectory(): string | undefined {
    return this.notesByDirectory.keys().next().value;
  }

  constructor(private noteService: NoteService,
              private userService: UserService,
              private parser: ParsingService,
              private alert: AlertController,
              private sanitizer: DomSanitizer,
              private modal: ModalController,
              private router: Router,
              private changeDetectorRef: ChangeDetectorRef)
  {
    addIcons({ pencilOutline, trashBinOutline, add, shareOutline, helpCircleOutline });
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
        console.log('should open?');
      }
    }, 500);
  }

  refreshNotes() {
    this.directories = [];
    this.notes = [];
    this._notes = [];
    this.notesByDirectory.clear();

    this.noteService.getPlayerNotes().pipe(
      map((res: ApiResult) => {
        if (res.data) {
          return res.data as Note[];
        }
        return [];
      }),
      tap((res: Note[]) => {
        if (res.length === 0) {
          // New user, has no directories / notes. Pre-make a note for them.
          const note: Note = {
            name: 'My First Note',
            description: 'This is a note to help you get started. Try using markdown to format your text.',
            directory: this.userService.currentUsername + '/',
            active: true,
            created: new Date(),
            updated: new Date()
          };
          this.noteService.createNote(note).subscribe();
        }
        const parseObservables = res.map(note => this.parser.parseNote(note));
        forkJoin(parseObservables).subscribe(parsedNotes => {
          parsedNotes.forEach(pn => {
            if (!this.notesByDirectory.has(pn.directory)) {
              this.notesByDirectory.set(pn.directory, []);
              this.directories.push(pn.directory);
            }
            this.notes.push(pn);
            this.notesByDirectory.get(pn.directory)!.push(pn);
          });
          this.directories = this.directories.sort();
          this.notes = this.notes.sort((a, b) => a.updated > b.updated ? -1 : 1);
          this._notes = this.notes;
          this.changeDetectorRef.markForCheck();
        });
      })
    ).subscribe();
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.urlAfterRedirects === '/journal') {
        this.refreshNotes();
      }
    });
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

  async shareDirectory(directory: string) {
    this.alert.create({
      header: 'Share Directory',
      message: `Enter usernames to share [${directory}] with (comma separated).`,
      inputs: [
        {
          name: 'username',
          type: 'text',
          placeholder: 'Username(s)'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Share',
          handler: (data) => {
            this.userService.getUsers().pipe(
              map(users => {
                return data.username.split(',').map((username: string) => {
                  return users.find(user => user.username === username.trim());
                }).filter((user: any) => user !== undefined);
              })
            ).subscribe(users => {
              console.log('Share', data, users);
              this.noteService.shareDirectory(directory, users).subscribe(res => {
                console.log('Share result', res);
              });
            });
          }
        }
      ]
    }).then(alert => {
      alert.present();
    });
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

  addNewDirectory() {
    const baseDirectory = this.userService.currentUsername + "/";
    this.alert.create({
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
                this.router.navigate(['/journal', note?.id, 'edit'], { replaceUrl: true });
              })
            ).subscribe();
          }
        }
      ]
    }).then(alert => {
      alert.present().then(() => {
        const input = alert.querySelector('input') as HTMLInputElement;
        console.log('input', input);
        if (input) {
          input.addEventListener('input', (event: any) => {
            console.log('hi', event);
            const fullPath = baseDirectory + event.target.value;
            document.getElementById('resolved-directory')!.textContent = fullPath;
          });
        }
      });

    });
  }
}
