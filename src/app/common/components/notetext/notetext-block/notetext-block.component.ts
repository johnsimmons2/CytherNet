import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { IonText } from "@ionic/angular/standalone";
import { NoteTextComponent } from "../notetext.component";
import { IParsedNoteReference, ParsedNote, ParsedNotePart } from "src/app/common/model/parsednote";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Component({
  selector: 'app-notetext-block',
  templateUrl: './notetext-block.component.html',
  standalone: true,
  imports: [
    CommonModule,
    IonText,
    NoteTextComponent
  ]
})
export class NoteTextBlockComponent implements OnInit {

  @Input() note!: ParsedNote;
  @Input() maxLength: number = 160;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  getPartDisplayText(part: ParsedNotePart): SafeHtml {
    const maxLength = this.maxLength; // Limit the displayed content to 100 characters

    if (part.type === 'reference') {
      const text = (part.value as IParsedNoteReference).displayText;
      return this.sanitizer.bypassSecurityTrustHtml(this.truncateHtml(text, maxLength));
    } else {
      const text = part.value as string;
      return this.sanitizer.bypassSecurityTrustHtml(this.truncateHtml(text, maxLength));
    }
  }

  private truncateHtml(html: string, maxLength: number): string {
    if (maxLength <= 0) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      return doc.body.innerHTML;
    }
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
}
