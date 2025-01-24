import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonFab, IonFabButton, IonFabList, IonHeader, IonIcon, IonInput, IonLabel, IonNote, IonText, IonTextarea, IonTitle, IonToolbar } from "@ionic/angular/standalone";
import { catchError, of, switchMap, tap } from "rxjs";
import { NoteTextComponent } from "src/app/common/components/notetext/notetext.component";
import { Note } from "src/app/common/model/note";
import { ParsedNote } from "src/app/common/model/parsednote";
import { NoteService } from "src/app/common/services/note.service";
import { ParsingService } from "src/app/common/services/parsing.service";
import { NoteTextBlockComponent } from "../../../common/components/notetext/notetext-block/notetext-block.component";
import { addIcons } from "ionicons";
import { createOutline, chevronUpOutline, trashOutline, eyeOutline, arrowBackCircleOutline, pricetagOutline, shareOutline, pricetagsOutline } from "ionicons/icons";
import { UserService } from "src/app/common/services/user.service";
import { ToastService } from "src/app/common/services/toast.service";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MarkdownComponent } from "ngx-markdown";
import { AlertController } from "@ionic/angular";


@Component({
  selector: 'app-note-page',
  templateUrl: './note-page.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonLabel,
    IonInput,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonFab,
    IonFabList,
    IonFabButton,
    IonText,
    IonNote,
    IonIcon,
    IonBackButton,
    IonTitle,
    NoteTextComponent,
    IonTextarea,
    MarkdownComponent,
    NoteTextBlockComponent
],
  styles: [`
    .notepagecontainer {
      max-width: 100%;
      margin: 0 auto;
    }

    ion-content {
      --padding-start: 0;
      --padding-end: 0;
    }

    @media (min-width: 1024px) {
      .notepagecontainer {
        max-width: 1024px; /* Set a max width for large screens */
        margin: 0 auto;
      }
    }
  `]
})
export class NotePageComponent implements OnInit {

  itemId: number = -1;

  editMode: boolean = false;
  newMode: boolean = false;
  note: ParsedNote | undefined = undefined;
  username: string = '';
  startingDirectory: string = '';

  noteForm: FormGroup = new FormGroup({
    description: new FormControl(''),
    name: new FormControl(''),
    directory: new FormControl(''),
  });

  get canEditNote() {
    const doIOwnNote = this.note?.creatorUsername === this.userService.currentUsername;
    const amIAdmin = this.amAdmin;
    return doIOwnNote || amIAdmin;
  }

  get amAdmin() {
    return this.userService.hasRoleAdmin();
  }

  constructor(private route: ActivatedRoute,
              private alert: AlertController,
              private parser: ParsingService,
              private router: Router,
              private userService: UserService,
              private toastService: ToastService,
              private noteService: NoteService) {
                addIcons({ createOutline, chevronUpOutline, trashOutline, eyeOutline, arrowBackCircleOutline, shareOutline, pricetagOutline });
              }

  ngOnInit(): void {
    this.username = this.userService.currentUsername ?? '';

    this.route.params.subscribe(params => {
      this.itemId = params['id'] || -1;
    });
    this.route.queryParams.subscribe(params => {
      this.startingDirectory = params['directory'] || '';
      this.noteForm.controls['directory'].setValue(this.startingDirectory);
    });

    if (this.route.snapshot.url.some((segment) => segment.path === 'new')) {
      this.newMode = true;
      this.noteForm.controls['name'].setValue('Untitled Note');
    } else {
      if (this.route.snapshot.paramMap.get('id')) {
        const id = this.route.snapshot.paramMap.get('id');

        this.itemId = parseInt(id || '-1');
        this.noteService.getById(this.itemId).pipe(
          switchMap((note: Note[]) => {
            if (note.length === 0) {
              this.toastService.show({
                message: 'Note not found',
                duration: 2000,
                type: 'warning'
              });
              return of(undefined);
            }
            return this.parser.parseNote(note[0]);
          }),
          tap((parsedNote: ParsedNote | undefined) => {
            if (parsedNote) {
              this.noteForm.controls['name'].setValue(parsedNote.name);
              this.note = parsedNote;
              if (this.route.snapshot.url.some((segment) => segment.path === 'edit')) {
                // Currently enforces player root directories
                const subdirectories = parsedNote.directory.split('/').slice(1);
                this.noteForm.controls['directory'].setValue(subdirectories.join('/'));
                this.editMode = true;
                this.noteForm.get('description')?.setValue(this.note.rawText);
              }
            } else {
              this.router.navigate(['/journal'], { replaceUrl: true });
            }
          }),
        ).subscribe();
      }
    }
  }

  initializeNoteById() {

  }

  saveNote() {
    if (this.noteForm.valid) {
      if (this.newMode) {
        const note = this.noteForm.value;
        note.directory = this.userService.currentUsername + "/" + this.noteForm.value.directory;
        this.noteService.createNote(note).subscribe((res) => {
          console.log(res);
          this.router.navigate(['/journal'], { replaceUrl: true });
        });
      } else {
        const note = {
          id: this.itemId,
          name: this.noteForm.controls['name'].value || this.note?.name,
          description: this.noteForm.controls['description'].value,
          directory: (this.username + "/" + this.noteForm.controls['directory'].value || this.note?.directory) ?? '',
          active: this.note?.active || true
        }
        this.noteService.updateNote(note).subscribe((res) => {
          console.log(res);
          this.editMode = false;
          this.router.navigate(['/journal', this.itemId, 'view'], { replaceUrl: true });
        });
      }
    }
  }

  editNote() {
    this.editMode = true;
    this.router.navigate(['/journal', this.itemId, 'edit'], { replaceUrl: true });
  }

  confirmCancelEdit() {
    if (this.editMode && this.noteForm.dirty) {
      this.alert.create({
        header: 'Save Changes',
        message: 'Save your changes before leaving edit mode?',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              this.viewNote();
            }
          },
          {
            text: 'Save',
            handler: () => {
              this.saveNote();
            }
          }
        ]
      }).then(alert => {
        alert.present();
      });
    } else {
      this.viewNote();
    }
  }

  viewNote() {
    this.editMode = false;
    this.router.navigate(['/journal', this.itemId, 'view'], { replaceUrl: true });
  }

  cancelAll() {
    this.router.navigate(['/journal'], { replaceUrl: true });
  }

  async confirmDeleteNote() {
    const alert = await this.alert.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this note?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Delete canceled');
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deleteNote();
          }
        }
      ]
    });

    await alert.present();
  }

  deleteNote() {
    this.noteService.deleteNote(this.itemId).subscribe((res) => {
      console.log(res);
      this.router.navigate(['/journal'], { replaceUrl: true });
    });
  }
}
