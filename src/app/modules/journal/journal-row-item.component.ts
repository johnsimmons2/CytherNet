import { Component, Input, OnInit } from '@angular/core';
import { DirectoryNote, NoteService } from 'src/app/common/services/note.service';
import { Observable, forkJoin, of } from 'rxjs';
import { ParsingService } from 'src/app/common/services/parsing.service';
import { ParsedNote } from 'src/app/common/model/parsednote';
import { Note } from 'src/app/common/model/note';
import { IonAccordion, IonAccordionGroup, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonIcon, IonItem, IonLabel, IonList, IonNote, IonPopover, IonRow, IonText, PopoverController } from '@ionic/angular/standalone';
import { NoteCardComponent } from 'src/app/common/components/noteCard/notecard.component';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UserService } from 'src/app/common/services/user.service';
import { UserSelectComponent } from 'src/app/common/components/userSelect/user-select..component';
import { User } from 'src/app/common/model/user';
import { ApiResult } from 'src/app/common/model/apiresult';

@Component({
  selector: 'app-journal-row-item',
  templateUrl: './journal-row-item.component.html',
  standalone: true,
  imports: [
    CommonModule,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonIcon,
    IonButton,
    IonLabel,
    IonList,
    IonItem,
    IonNote,
    IonAccordion,
    IonAccordionGroup,
    IonText,
    IonRow,
    IonCol,
    IonPopover,
    NoteCardComponent,
    UserSelectComponent
  ],
  styles: [`
    ::ng-deep .dir-share-popover {
      --width: 540px;
    }
  `]
})
export class JournalRowItemComponent implements OnInit {
  @Input() directoryNote!: DirectoryNote; // TODO: just pass parsed note here to reduce load
  @Input() directoryName!: string; // optional, if you want to display or pass it
  @Input() depth: number = 0;
  @Input() directorySharedUsers: User[] = [];
  @Input() canCreate: boolean = true;

  parsedNotes$!: Observable<ParsedNote[]>;
  showShareDirPopover: boolean = false;

  get currentKey(): string {
    // If you want to use directoryName for the accordion [value]
    return this.directoryName || 'root';
  }

  get ownsRow(): boolean {
    if (this.directoryNote.fullName.split('/')[0] === this.userService.currentUsername) {
      return true;
    }
    return false;
  }

  constructor(private parser: ParsingService,
    private userService: UserService,
    private noteService: NoteService,
    private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    if (!this.directoryNote.notes || this.directoryNote.notes.length === 0) {
      // No notes => emit empty array
      this.parsedNotes$ = of([]);
    } else {
      // Parse each note in this directory
      const observables = this.directoryNote.notes.map(note => this.parser.parseNote(note));
      this.parsedNotes$ = forkJoin(observables);
    }
  }

  directoryStylized(directory: string): SafeHtml {
      const search = this.userService.currentUsername + '';
      const styledDirectory = directory.replace(
        search,
        `<span class="selfdir">${search}</span>`
      );
      return this.sanitizer.bypassSecurityTrustHtml(styledDirectory);
    }

  getDirectoryKeys(): string[] {
    return Object.keys(this.directoryNote.directories || {});
  }

  openShareDirectory(event: any, directory: string) {
    event.stopPropagation();
    this.showShareDirPopover = true;
  }

  closeShareDirectory() {
    this.showShareDirPopover = false;
  }

  shareDirectory(user: User) {
    this.noteService.shareDirectory(this.directoryNote.fullName, [user]).subscribe((res: ApiResult) => {
      if (res.success && !this.directorySharedUsers.some((u) => u.id === user.id)) {
        this.directorySharedUsers.push(user);
      }
    });
  }

  unShareDirectory(user: User) {
    this.noteService.unShareDirectory(this.directoryNote.fullName, [user]).subscribe((res: ApiResult) => {
      if (res.success) {
        this.directorySharedUsers = this.directorySharedUsers.filter((u) => u.id !== user.id);
      }
    });
  }
}
