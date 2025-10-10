import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCheckbox, IonChip, IonContent, IonFab, IonFabButton, IonFabList, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonNote, IonPopover, IonSelect, IonSelectOption, IonText, IonTextarea, IonTitle, IonToolbar, PopoverController } from "@ionic/angular/standalone";
import { catchError, of, switchMap, tap } from "rxjs";
import { NoteTextComponent } from "src/app/common/components/notetext/notetext.component";
import { Note } from "src/app/common/model/note";
import { ParsedNote } from "src/app/common/model/parsednote";
import { NoteService } from "src/app/common/services/note.service";
import { ParsingService } from "src/app/common/services/parsing.service";
import { NoteTextBlockComponent } from "../../../common/components/notetext/notetext-block/notetext-block.component";
import { UserService } from "src/app/common/services/user.service";
import { ToastService } from "src/app/common/services/toast.service";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MarkdownComponent } from "ngx-markdown";
import { AlertController } from "@ionic/angular";
import { Tag } from "src/app/common/model/tag";
import { TagComponent } from "../../../common/components/tag/tag.component";
import { UserSelectComponent } from "src/app/common/components/userSelect/user-select..component";
import { User } from "src/app/common/model/user";
import { ApiResult } from "src/app/common/model/apiresult";
import { Campaign } from "src/app/common/model/campaign";
import { CampaignService } from "src/app/common/services/campaign.service";


@Component({
    selector: 'app-note-page',
    templateUrl: './note-page.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        IonPopover,
        ReactiveFormsModule,
        IonContent,
        IonLabel,
        IonInput,
        IonChip,
        IonModal,
        IonHeader,
        IonCheckbox,
        IonToolbar,
        IonItem,
        IonList,
        IonSelect,
        IonSelectOption,
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
        NoteTextBlockComponent,
        TagComponent,
        UserSelectComponent
    ],
    styles: [`
    .notepagecontainer {
      max-width: 100%;
      margin: 0 auto;
    }

    .tag-popover {
      --min-width: 250px;
      --max-width: 300px;
      --border-radius: 12px;
      padding: 8px;
    }

    ::ng-deep .share-popover {
      --width: 540px;
    }

    .fab-label {
      position: relative;
      left: -3.5rem;
      bottom: -2.8rem;
      background-color: var(--ion-color-light);
      align-self: end;
      border-radius: 0.5rem;
      padding: 0.5rem;
      padding-right: 0.8rem;
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
export class NotePageComponent {

    @ViewChild('tagPopover', { static: true }) tagPopover!: TemplateRef<any>;
    @ViewChild('tagMenuModal', { static: true }) tagMenuModal!: IonModal;

    itemId: number = -1;

    tags: Tag[] = [];
    tagIcons: string[] = [];
    tagIconMap: { [tag: string]: string } = {};

    editMode: boolean = false;
    newMode: boolean = false;
    note: ParsedNote | undefined = undefined;
    username: string = '';
    startingDirectory: string = '';
    noteSharedUsers: User[] = [];
    campaigns: Campaign[] = [];

    shareNotePopoverOpen = false;
    tagPopoverOpen = false;

    selectedTags: Tag[] = [];

    noteForm: FormGroup = new FormGroup({
        description: new FormControl(''),
        name: new FormControl(''),
        directory: new FormControl(''),
        campaign: new FormControl(false),
        campaignId: new FormControl('')
    });

    get canEditNote() {
        const doIOwnNote = this.note?.creatorUsername === this.userService.currentUsername;
        const amIAdmin = false; // TODO;
        return (doIOwnNote || amIAdmin);
    }

    get canFabButton() {
        return !this.newMode;
    }

    get isCampaignNote() {
        if (this.note) {
            return this.note.campaignId && this.note.campaignId !== undefined;
        }
        return false;
    }

    constructor(private route: ActivatedRoute,
        private alert: AlertController,
        private popover: PopoverController,
        private campaignService: CampaignService,
        private parser: ParsingService,
        private router: Router,
        private userService: UserService,
        private toastService: ToastService,
        private noteService: NoteService) {
    }

    iconNameWithDash(iconName: string) {
        return iconName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    }

    ionViewWillEnter() {
        this.initializeNotePageState();
    }

    async openGuide() {
        const alert = await this.alert.create({
            header: 'Note Editor Guide',
            message: `
        <p>To change the directory of a note, enter a subdirectory name into the subdirectory field, or change the existing value.</p>
        <p>Tap or click the up arrow button to open the context menu, from here you can do the following:
          <ol>
            <li>Change between view and edit modes.</li>
            <li>Manage tags on the note or create a custom tag.</li>
            <li>Share or unshare the note with specific users.</li>
            <li>Delete the note.</li>
          </ol>
        </p>
        `,
            buttons: [
                {
                    text: 'Close',
                    role: 'cancel'
                }
            ]
        });
        alert.present();
    }

    initializeNotePageState() {
        this.tagPopoverOpen = false;
        this.shareNotePopoverOpen = false;
        this.username = this.userService.currentUsername ?? '';
        this.route.params.subscribe(params => {
            this.itemId = params['id'] || -1;

            this.campaignService.getCampaigns().subscribe((res: ApiResult) => {
                if (res.success) {
                    this.campaigns = res.data;
                }
            });

            this.noteService.tags$.subscribe((tags) => {
                this.tags = tags;
            });

            this.route.queryParams.subscribe(params => {
                this.startingDirectory = params['directory'] || '';
                this.noteForm.controls['directory'].setValue(this.startingDirectory);
            });

            if (this.route.snapshot.url.some((segment) => segment.path === 'new')) {
                this.newMode = true;
                this.editMode = false;
                this.noteForm.controls['name'].setValue('Untitled Note');
            } else if (this.route.snapshot.url.some((segment) => segment.path === 'edit')) {
                this.editMode = true;
                this.newMode = false;
            } else {
                this.editMode = false;
                this.newMode = false;
            }

            if (this.itemId === -1) {
                this.newMode = true;
            }

            if (!this.newMode) {
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
                            this.note = { ...parsedNote };
                            this.noteSharedUsers = parsedNote.sharedWith || [];
                            const doIOwnNote = this.note?.creatorUsername === this.userService.currentUsername;
                            const amIAdmin = false; // TODO
                            if ((!doIOwnNote || !amIAdmin) && this.editMode) {
                                this.viewNote();
                            }
                        } else {
                            this.router.navigate(['/journal']);
                        }
                    })
                ).subscribe(() => {
                    this.initFormFromNote();
                });
            }
        });
    }

    openShareNote() {
        this.shareNotePopoverOpen = true;
    }

    closeShareNote() {
        this.shareNotePopoverOpen = false;
    }

    shareNote(user: User) {
        this.noteService.shareNote(this.note!.note!, [user.id!]).subscribe((res: ApiResult) => {
            if (res.success && !this.noteSharedUsers.some((u) => u.id === user.id)) {
                this.noteSharedUsers.push(user);
            }
        });
    }

    unShareNote(user: User) {
        this.noteService.unShareNote(this.note!.note!, [user.id!]).subscribe((res: ApiResult) => {
            if (res.success) {
                this.noteSharedUsers = this.noteSharedUsers.filter((u) => u.id !== user.id);
            }
        });
    }

    initFormFromNote() {
        const subdirectories = this.note!.directory.split('/').slice(1);
        this.noteForm.controls['name'].setValue(this.note!.name);
        this.noteForm.controls['directory'].setValue(subdirectories.join('/'));
        this.noteForm.get('description')?.setValue(this.note!.rawText);
        this.selectedTags = this.note?.note!.tags ?? [];
    }

    saveNote() {
        if (this.noteForm.valid) {
            if (this.newMode) {
                if (this.noteForm.controls['campaign'].value) {
                    const note = this.noteForm.value;
                    note.directory = this.noteForm.value.directory;
                    this.noteService.createNoteWithCampaign({
                        name: note.name,
                        directory: note.directory,
                        campaignId: note.campaignId,
                        description: note.description,
                    }).subscribe((res) => {
                        this.router.navigate(['/journal']);
                    });
                } else {
                    const note = this.noteForm.value;
                    note.directory = this.userService.currentUsername + "/" + this.noteForm.value.directory;
                    this.noteService.createNote(note).subscribe((res) => {
                        this.router.navigate(['/journal']);
                    });
                }
            } else {
                const note = {
                    id: this.itemId,
                    name: this.noteForm.controls['name'].value || this.note?.name,
                    description: this.noteForm.controls['description'].value,
                    directory: (this.username + "/" + this.noteForm.controls['directory'].value || this.note?.directory) ?? '',
                    active: this.note?.active || true
                }
                this.noteService.updateNote(note).subscribe((res) => {
                    if (res.success) {
                        this.viewNote();
                    }
                },
                    (err) => {
                        console.error(err);
                        this.toastService.show({
                            message: 'Cannot save note! Make sure there is not already a note within this directory with that name.',
                            duration: 3600,
                            type: 'warning'
                        });
                    });
            }
        }
    }

    editNote() {
        this.editMode = true;
        this.router.navigate(['/journal', this.itemId, 'edit']).then(() => {
            this.initializeNotePageState();
        });
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
        this.note = { ...this.note! };
        this.router.navigate(['/journal', this.itemId, 'view']).then(() => {
            this.initializeNotePageState();
        });
    }

    cancelAll() {
        this.router.navigate(['/journal']).then(() => {
        });
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

    closeTagMenu() {
        this.tagMenuModal.dismiss();
    }

    openTagMenu() {
        this.tagMenuModal.present();
    }

    tagNote(tag: Tag) {
        if (this.note?.id) {
            this.noteService.tagNote(this.note.note!, tag).subscribe();
        }
    }

    isTagSelected(tag: Tag) {
        return this.selectedTags.find((t) => t.id === tag.id) !== undefined;
    }

    unTagNote(tag: Tag) {
        if (this.note?.id) {
            this.noteService.unTagNote(this.note.note!, tag).subscribe();
        }
    }

    unTagAll() {
        if (this.note?.note?.tags) {
            this.note!.note!.tags.forEach((tag) => {
                this.unTagNote(tag);
            });
            this.selectedTags = [];
        }
    }

    toggleTagSelection(event: any, tag: Tag) {
        event.stopPropagation();
        console.log(event, tag);
        if (this.isTagSelected(tag)) {
            this.selectedTags = this.selectedTags.filter((t) => t.id! !== tag.id!);
            this.unTagNote(tag);
        } else {
            this.selectedTags.push(tag);
            this.tagNote(tag);
        }
    }

    tagSelectChanged(event: any) {
        console.log(event);
    }

    openTagPopOver() {
        console.log("fuck you");
        this.tagPopoverOpen = true
    }

    closeTagPopOver() {
        this.tagPopoverOpen = false;
    }

    deleteNote() {
        this.noteService.deleteNote(this.itemId).subscribe((res) => {
            console.log(res);
            this.router.navigate(['/journal'], { replaceUrl: true });
        });
    }
}
