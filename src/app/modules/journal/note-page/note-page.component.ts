import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonFab, IonFabButton, IonFabList, IonHeader, IonIcon, IonInput, IonText, IonTextarea, IonTitle, IonToolbar } from "@ionic/angular/standalone";
import { catchError, of, switchMap, tap } from "rxjs";
import { NoteTextComponent } from "src/app/common/components/notetext/notetext.component";
import { Note } from "src/app/common/model/note";
import { ParsedNote } from "src/app/common/model/parsednote";
import { NoteService } from "src/app/common/services/note.service";
import { ParsingService } from "src/app/common/services/parsing.service";
import { NoteTextBlockComponent } from "../../../common/components/notetext/notetext-block/notetext-block.component";
import { addIcons } from "ionicons";
import { createOutline, chevronUpOutline, trashOutline, eyeOutline } from "ionicons/icons";
import { UserService } from "src/app/common/services/user.service";
import { ToastService } from "src/app/common/services/toast.service";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";


@Component({
  selector: 'app-note-page',
  templateUrl: './note-page.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonInput,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,

    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonFab,
    IonFabList,
    IonFabButton,
    IonText,
    IonIcon,
    IonBackButton,
    IonTitle,
    NoteTextComponent,
    IonTextarea,
    NoteTextBlockComponent
]
})
export class NotePageComponent implements OnInit {

  itemId: number = -1;

  editMode: boolean = false;
  newMode: boolean = false;
  note: ParsedNote | undefined = undefined;

  noteForm: FormGroup = new FormGroup({
    description: new FormControl(''),
    name: new FormControl(''),
    directory: new FormControl(''),
  });

  get canEditNote() {
    const doIOwnNote = this.note?.creatorUsername === this.userService.currentUsername;
    const amIAdmin = this.userService.hasRoleAdmin();
    return doIOwnNote || amIAdmin;
  }

  constructor(private route: ActivatedRoute,
              private parser: ParsingService,
              private router: Router,
              private userService: UserService,
              private toastService: ToastService,
              private noteService: NoteService) {
                addIcons({ createOutline, chevronUpOutline, trashOutline, eyeOutline });
              }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.itemId = params['id'];
    });

    if (this.route.snapshot.url.some((segment) => segment.path === 'new')) {
      this.newMode = true;
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
              this.note = parsedNote;
              if (this.route.snapshot.url.some((segment) => segment.path === 'edit')) {
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
        this.noteService.createNote(note).subscribe((res) => {
          console.log(res);
          this.router.navigate(['/journal']);
        });
      } else {
        const note = this.noteForm.value;
        this.noteService.updateNote({
          id: this.itemId,
          name: this.note?.name || '',
          description: note.description,
          directory: this.note?.directory || '',
          active: this.note?.active || true,
          userId: 0,
          characterId: 0,
          campaignId: 0,
          created: note.created,
          updated: note.updated
        }).subscribe((res) => {
          console.log(res);
          this.editMode = false;
          this.router.navigate(['/journal', this.itemId, 'view']);
        });
      }
    }
  }

  editNote() {
    this.editMode = true;
    this.router.navigate(['/journal', this.itemId, 'edit']);
  }

  viewNote() {
    this.editMode = false;
    this.router.navigate(['/journal', this.itemId, 'view']);
  }

  deleteNote() {
    this.noteService.deleteNote(this.itemId).subscribe((res) => {
      console.log(res);
      this.router.navigate(['/journal']);
    });
  }
}
