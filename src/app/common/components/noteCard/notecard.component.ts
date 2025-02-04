import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Compiler, Component, Input, ModuleWithComponentFactories, NgModule, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AlertController, IonBadge, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonIcon, IonItem, IonLabel, IonNote, IonPopover, IonSelect, IonText } from "@ionic/angular/standalone";
import { IParsedNoteReference, ParsedNote, ParsedNotePart } from "../../model/parsednote";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { NoteTextComponent } from "../notetext/notetext.component";
import { UserService } from "../../services/user.service";
import { User } from "../../model/user";
import { Router, RouterModule } from "@angular/router";
import { NoteTextBlockComponent } from "../notetext/notetext-block/notetext-block.component";
import { Note } from "../../model/note";
import { NoteService } from "../../services/note.service";
import { tap } from "rxjs";
import { TagComponent } from "../tag/tag.component";


@Component({
  selector: 'app-note-card',
  templateUrl: './notecard.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonContent,
    IonCard,
    IonCardTitle,
    IonCardSubtitle,
    IonCardHeader,
    IonCardContent,
    IonText,
    IonItem,
    IonButton,
    IonIcon,
    IonLabel,
    IonPopover,
    IonNote,
    NoteTextBlockComponent,
    TagComponent
],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .note-updated {
      display: block; /* Default is visible */
    }

    @media (max-width: 600px) {
      .note-updated {
        display: none; /* Hide on small screens */
      }
    }
  `]
})
export class NoteCardComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() note: ParsedNote | undefined | null;
  @Input() directory!: string;
  @Input() mode: 'card' | 'row' = 'card';

  @ViewChild('cardView') cardView!: TemplateRef<any>;
  @ViewChild('rowView') rowView!: TemplateRef<any>;

  noteParts: ParsedNotePart[] = [];

  title: string = 'New Note';

  get viewTemplate() {
    if (this.mode === 'card') {
      return this.cardView;
    } else {
      return this.rowView;
    }
  }

  get isNoteSharedWithMe() {
    if (this.note) {
      if (this.note.note?.userId) {
        return this.note.creatorUsername !== this.userService.currentUsername;
      }
    }
    return false;
  }

  constructor(private sanitizer: DomSanitizer,
    private userService: UserService,
    private alert: AlertController,
    private noteService: NoteService,
    private cdr: ChangeDetectorRef,
    private router: Router) {
  }

  ngAfterViewInit(): void {
    this.cdr.markForCheck();
  }

  ngOnChanges(): void {
    if (this.note) {
      this.title = this.note.name;
      this.noteParts.forEach(part => {
        if (part.type === 'reference') {
          this.cdr.markForCheck();
        }
      })
    }
  }

  ngOnInit(): void {
    if (this.note) {
      this.title = this.note.name;
      this.noteParts = this.note.parsedParts;
      this.noteParts.forEach(part => {
        if (part.type === 'reference') {
          this.cdr.markForCheck();
        }
      });

      if (this.note.note?.userId) {
        this.userService.getUser(this.note.note.userId).subscribe(user => {
          if (user) {
            this.note!.creatorUsername = user.username;
            this.note!.creator = user;
          }
          this.cdr.markForCheck();
        });
      }
    } else {
      this.cdr.markForCheck();
    }
  }

  getPartDisplayText(part: ParsedNotePart): SafeHtml {
    const maxLength = 160; // Limit the displayed content to 100 characters

    if (part.type === 'reference') {
      const text = (part.value as IParsedNoteReference).displayText;
      return this.sanitizer.bypassSecurityTrustHtml(this.truncateHtml(text, maxLength));
    } else {
      const text = part.value as string;
      return this.sanitizer.bypassSecurityTrustHtml(this.truncateHtml(text, maxLength));
    }
  }

  private truncateHtml(html: string, maxLength: number): string {
    // Create a DOM parser to handle the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const truncated = this.truncateNode(doc.body, maxLength);
    return truncated.innerHTML;
  }

  private truncateNode(node: Node, maxLength: number): HTMLElement {
    let charCount = 0;

    const truncate = (child: Node): boolean => {
      if (child.nodeType === Node.TEXT_NODE) {
        const textContent = child.textContent || '';
        if (charCount + textContent.length > maxLength) {
          child.textContent = textContent.slice(0, maxLength - charCount) + '...';
          return true; // Stop truncating
        }
        charCount += textContent.length;
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const children = Array.from(child.childNodes);
        for (const childNode of children) {
          if (truncate(childNode)) {
            while (childNode.nextSibling) {
              childNode.parentNode?.removeChild(childNode.nextSibling);
            }
            return true; // Stop truncating
          }
        }
      }
      return false;
    };

    truncate(node);
    return node as HTMLElement;
  }

  openNote(): void {
    if (this.note) {
      this.router.navigate(['/journal', this.note.id, 'view']);
    } else {
      if (this.directory !== this.userService.currentUsername) {
        this.router.navigate(['/journal', 'new'], {
          queryParams: {
            directory: this.directory.replace(this.userService.currentUsername + '/', '')
          }
        });
      } else {
        this.router.navigate(['/journal', 'new']);
      }
    }
  }

  shareIndividualNote(): void {
    this.alert.create({
      header: 'Share Note with Users',
      message: `<p>Enter the usernames to share this note with (comma separated):</p>`,
      inputs: [
        {
          name: 'usernames',
          type: 'text',
          placeholder: 'Usernames'
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
            const userIds = data.usernames.split(',').map((username: any) => {
              return this.userService.getUserByUsername(username).subscribe(user => {
                return user.id;
              });
            });

            console.log(this.note, userIds);
            this.noteService.shareNote(this.note!.note!, userIds).subscribe();
          }
        }
      ]
    }).then(alert => {
      alert.present().then(() => {
        // const input = alert.querySelector('input') as HTMLInputElement;
        // console.log('input', input);
        // if (input) {
        //   input.addEventListener('input', (event: any) => {
        //     console.log('hi', event);
        //     const fullPath = baseDirectory + event.target.value;
        //     document.getElementById('resolved-directory')!.textContent = fullPath;
        //   });
        // }
      });

    });
  }
}
