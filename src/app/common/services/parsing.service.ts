import { Injectable } from "@angular/core";
import { catchError, defaultIfEmpty, forkJoin, map, Observable, of, switchMap, tap } from "rxjs";
import { IParsedNoteReference, ParsedNote, ParsedNotePart } from "../model/parsednote";
import { UserService } from "./user.service";
import { Note } from "../model/note";
import { CharacterService } from "./character.service";

@Injectable({
  providedIn: 'root'
})
export class ParsingService {

  private transformations: any[] = [
    {
      search: /^\# (.*?)$/gm, // Header 1
      replace: '<h1>$1</h1>'
    },
    {
      search: /^(?:<br>)?## (.*?)$/gm, // Header 2
      replace: '<h2>$1</h2>'
    },
    {
      search: /^(?:<br>)?### (.*?)$/gm, // Header 3
      replace: '<h3>$1</h3>'
    },
    {
      search: /\*\*(.*?)\*\*/g, // Bold
      replace: '<strong>$1</strong>'
    },
    {
      search: /\*(.*?)\*/g, // Italics
      replace: '<em>$1</em>'
    },
    {
      search: /~~(.*?)~~/g, // Strikethrough
      replace: '<strike>$1</strike>'
    },
    {
      search: /__(.*?)__/g, // Underline
      replace: '<u>$1</u>'
    },
    {
      search: /\[(.*?)\]\((.*?)\)/g, // Links
      replace: '<a href="$2" target="_blank">$1</a>'
    },
    {
      search: /([^\n])(?:\r\n|\r|\n)(?!<\/?(ul|li|h1|h2|h3|p|blockquote)>)/g,
      replace: '$1<br>'
    }
  ];

  constructor(private userService: UserService, private characterService: CharacterService) {

  }

  public parseNote(note: Note): Observable<ParsedNote> {
    return this.parseTextIntoParts(note.description).pipe(
      catchError((error) => {
        console.error('Failed to parse note:', note, error);
        return of([]);
      }),
      switchMap((parsedParts: ParsedNotePart[]) => {
        if (note.userId === null) {
          return of({
            rawText: note.description,
            parsedParts: parsedParts,
            id: note.id,
            name: note.name,
            created: note.created ?? new Date(),
            updated: note.updated ?? new Date(),
            directory: note.directory,
            note: note,
            active: note.active,
          });
        }
        return this.userService.getUser(note.userId).pipe(
          map((user) => ({
              rawText: note.description,
              parsedParts: parsedParts,
              id: note.id,
              name: note.name,
              created: note.created ?? new Date(),
              updated: note.updated ?? new Date(),
              directory: note.directory,
              note: note,
              active: note.active,
              creatorUsername: user?.username || undefined
          }))
        );
      })
    );
  }

  public parseMarkdown(text: string): string {
    const nestedListProcessed = this.parseNestedLists(text);

    return this.transformations.reduce((text, { search, replace }) => {
      return text.replace(search, replace);
    }, nestedListProcessed);
  }

  private parseTextIntoParts(text: string): Observable<ParsedNotePart[]> {
    text = this.parseMarkdown(text);

    const parts: Array<ParsedNotePart> = [];
    const regex = /\[\[(.*?)\]\]/g;
    let lastIndex = 0;
    let curIndex = 0; // Sequential index for each part

    const observables: Array<Observable<any>> = [];
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      // Add text part before the reference, if any
      if (match.index > lastIndex) {
        parts[curIndex++] = {
          type: 'text' as const,
          value: text.slice(lastIndex, match.index),
        };
      }

      // Create an observable for the reference part
      const currentIndex = curIndex++; // Capture the current index for this reference
      const refObservable = this.parseReference(match[1]).pipe(
        catchError(() => of({
          displayText: match![1],
          id: 0,
          tableName: 'unknown' as const,
          fieldName: 'unknown' as const,
          field: 'unkown',
          rawText: `<unknown>`
        })),
        tap((result: IParsedNoteReference) => {
          parts[currentIndex] = {
            type: 'reference' as const,
            value: result,
            noteReference: result
          };
        })
      );

      observables.push(refObservable);
      lastIndex = regex.lastIndex; // Update lastIndex to after this match
    }

    // Add remaining text part at the end, if any
    if (lastIndex < text.length) {
      parts[curIndex++] = {
        type: 'text' as const,
        value: text.slice(lastIndex),
      };
    }
    // Wait for all observables to complete and return the parts array
    return forkJoin(observables).pipe(
      defaultIfEmpty([]),
      map(() => {
        return parts;
      }) // No sorting needed, parts are already in the correct order
    );
  }

  private parseReference(reference: string): Observable<IParsedNoteReference> {
    const emptyNoteReference: IParsedNoteReference = {
      displayText: `<ion-text color="secondary">&lt;unknown&gt;</ion-text>`,
      id: 0,
      tableName: 'unknown',
      fieldName: 'unknown',
      field: 'unkown',
      rawText: `<unknown>`
    }

    try {
      const query = reference.split('.');
      const tableName = query[0].toUpperCase();
      const condition = query[1].split('=');
      const fieldName = condition[0];
      const fieldValue = condition[1];

      // Find which parser to use
      switch(tableName) {
        case 'USERS':
          return this.parseUserReference(fieldName, fieldValue).pipe(
            tap((result: any) => {
              if (result !== undefined) {
                return result;
              }
              return emptyNoteReference;
            })
          );
        case 'CHARACTERS':
          return this.parseCharacterReference(fieldName, fieldValue).pipe(
            tap((result: any) => {
              if (result !== undefined) {
                return result;
              }
              return emptyNoteReference;
            })
          );
        default:
          return of(emptyNoteReference);
      }
    } catch (error) {
      console.error('Failed to parse reference:', reference, error);
    }

    return of(emptyNoteReference);
  }

  private parseNestedLists(input: string): string {
    const lines = input.split(/\r\n|\r|\n/); // Split the input into lines
    const result: string[] = [];
    const stack: number[] = []; // Tracks indentation levels

    lines.forEach((line) => {
      if (!line.trim()) {
        return;
      }

      const match = /^(\s*)([-*]) (.*)/.exec(line); // Match list items with optional indentation
      if (match) {
        const [_, indent, bullet, content] = match;
        const level = indent.length;

        // Close previous lists if indentation decreases
        while (stack.length > 0 && stack[stack.length - 1] > level) {
          result.push('</ul>');
          stack.pop();
        }

        // Open a new list if indentation increases
        if (stack.length === 0 || stack[stack.length - 1] < level) {
          result.push('<ul>');
          stack.push(level);
        }

        // Add the current list item
        result.push(`<li>${content}</li>`);
      } else {
        // Close all open lists when a non-list line is encountered
        while (stack.length > 0) {
          result.push('</ul>');
          stack.pop();
        }

        // Append the non-list line as-is
        if (line.trim()) {
          result.push(line);
        }
      }
    });

    // Close remaining open lists at the end
    while (stack.length > 0) {
      result.push('</ul>');
      stack.pop();
    }

    return result.join('\n');
  }

  private parseUserReference(field: string, equals: string): Observable<IParsedNoteReference | undefined> {
    return this.userService.getUserByUsername(equals).pipe(
      map((result) => {
        if (result) {
          return {
            displayText: this.getReferenceDisplayText(equals),
            id: parseInt(equals),
            tableName: "USERS" as const,
            fieldName: field === 'id' ? 'id' as const : 'name' as const,
            rawText: `${field}=${equals}`,
            field: equals
          };
        }
        return undefined;
      }),

      catchError((error) => {
        return of(undefined);
      })
    );
  }

  private parseCharacterReference(field: string, equals: string): Observable<IParsedNoteReference | undefined> {
    return this.characterService.getCharacterByName(equals).pipe(
      map((result) => {
        if (result) {
          return {
            displayText: this.getReferenceDisplayText(equals),
            id: parseInt(equals),
            tableName: "CHARACTERS" as const,
            fieldName: field === 'id' ? 'id' as const : 'name' as const,
            rawText: `${field}=${equals}`,
            field: equals
          };
        }
        return undefined;
      }),

      catchError((error) => {
        return of(undefined);
      })
    );
  }

  private getReferenceDisplayText(fieldValue: string): string {
    return `<ion-text color="secondary"><em>${fieldValue}</em></ion-text>`
  }

}
