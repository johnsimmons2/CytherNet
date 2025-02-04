import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, defaultIfEmpty, forkJoin, map, mergeMap, Observable, of, tap } from "rxjs";
import { Note } from "../model/note";
import { ApiService } from "./api.service";
import { ApiResult } from "../model/apiresult";
import { ParsingService } from "./parsing.service";
import { BaseService } from "./base.service";
import { DatabaseService } from "./database.service";
import { User } from "../model/user";
import { Tag } from "../model/tag";
import { UserService } from "./user.service";

export interface DirectoryNote {
  notes?: Note[];
  directories: { [dirName: string]: DirectoryNote };
  name: string;
  fullName: string;
  sharedWith?: User[];
}

@Injectable({
  providedIn: 'root'
})
export class NoteService extends BaseService<Note> {

  notes: BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>([]);
  allNotes: BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>([]);
  tags: BehaviorSubject<Tag[]> = new BehaviorSubject<Tag[]>([]);
  tagIcons: BehaviorSubject<{ [tag: string]: string }[]> = new BehaviorSubject<{ [tag: string]: string }[]>([]);

  constructor(protected override apiService: ApiService,
              protected override database: DatabaseService,
              private userService: UserService,
              private parser: ParsingService,) {
    super(database, apiService)
  }

  get notes$() {
    return (this.notes.getValue() && this.notes.getValue().length > 0) ? this.notes.asObservable() : this.getPlayerNotes().pipe(
      map((res: ApiResult) => {
        if (res.data) {
          return res.data as Note[];
        }
        return [];
      }),
      tap(mappedNotes => {
        this.notes.next(mappedNotes);
      }));
  }

  get allNotes$() {
    return (this.allNotes.getValue() && this.allNotes.getValue().length > 0) ? this.allNotes.asObservable() : this.getAllNotes().pipe(
      tap(mappedNotes => {
        this.allNotes.next(mappedNotes);
      }));
  }

  get tags$() {
    return (this.tags.getValue() && this.tags.getValue().length > 0) ? this.tags.asObservable() : this.getAllTags().pipe(
      tap(mappedTags => {
        this.tags.next(mappedTags);
      }));
  }

  get tagIcons$() {
    return (this.tagIcons.getValue() && this.tagIcons.getValue().length > 0) ? this.tagIcons.asObservable() : this.getAllTagIcons().pipe(
      tap(mappedIcons => {
        this.tagIcons.next(mappedIcons);
      }));
  }

  protected override getTableName(): string {
    return 'notes';
  }

  public createNoteWithCampaign(note: any): Observable<ApiResult> {
    return this.apiService.post('notes/campaign', {
      description: note.description,
      directory: note.directory,
      campaignId: note.campaignId,
      name: note.name
    });
  }

  public buildNestedDirectories(notes: Note[]): Observable<DirectoryNote> {
    const root: DirectoryNote = { directories: {}, notes: [], name: '', fullName: '', sharedWith: [] };
    return this.getDirectoryShareStatus().pipe(
      mergeMap((res: ApiResult) => {
        if (!res.success) {
          return of([]);
        }
        const userRequests = res.data.map((share: any) =>
          this.userService.getUser(share.sharedWithId)
        );
        return forkJoin(userRequests).pipe(
          defaultIfEmpty([]), // Because of course, I would want my app to hang if my API returns no data (correctly)
          map((users: any) => {
            const userMap = new Map(users.map((u: any) => [u.id, u]));
            return res.data.map((share: any) => ({
              ...share,
              sharedUser: userMap.get(share.sharedWithId) || null
            }));
          }),
        );
      }),
      map((directoryShares: any[]) => {
        for (const note of notes) {
          const segments = note.directory ? note.directory.split('/') : [];
          let current = root;

          for (const segment of segments) {
            // if subdirectory doesn't exist, create it
            if (!current.directories[segment]) {
              const fullName = current.fullName ? `${current.fullName}/${segment}` : segment;
              current.directories[segment] = {
                directories: {},
                notes: [],
                name: segment,
                fullName: fullName,
                sharedWith: directoryShares.filter((share: any) => share.directory === fullName).map((share: any) => share.sharedUser)
              };
            }
            // drill down
            current = current.directories[segment];
          }

          if (!current.notes) {
            current.notes = [];
          }
          current.notes!.push(note);
        }

        return root;
      })
    );
  }

  public getTagShareStatus(tagId: string): Observable<ApiResult> {
    return this.apiService.get(`notes/share/tag/${tagId}/status`);
  }

  public getDirectoryShareStatus(): Observable<ApiResult> {
    return this.apiService.get(`notes/share/directory/status`);
  }

  public getPlayerNotes(): Observable<ApiResult> {
    return this.apiService.get("notes");
  }

  public getAllNotes() {
    return this.getAll("notes/all");
  }

  public getAllTags() {
    return this.apiService.get("notes/tag").pipe(
      map((res: ApiResult) => {
        if (res.success) {
          return res.data as Tag[];
        }
        return [];
      })
    );
  }

  public editTag(tagId: number, tag: any) {
    return this.apiService.patch(`notes/tag/${tagId}`, {
      name: tag.name,
      icon: tag.icon,
      color: tag.color
    }).pipe(
      map((res: ApiResult) => {
        if (res.success) {
          this.tags.next(this.tags.value.map(t => t.id === tag.id ? tag : t));
        }
        return tag;
      })
    );
  }

  public deleteTag(tag: Tag) {
    return this.apiService.delete(`notes/tag/${tag.id}`).pipe(
      map((res: ApiResult) => {
        if (res.success) {
          this.tags.next(this.tags.value.filter(t => t.id !== tag.id));
        }
        return res;
      })
    );
  }

  public getAllTagIcons() {
    return this.apiService.get("notes/tag/icons").pipe(
      map((res: ApiResult) => {
        if (res.success) {
          return res.data;
        }
        return [];
      })
    );
  }

  public getById(id: number) {
    return this.get(`notes/${id}`, { id: id});
  }

  public deleteNote(noteId: number): Observable<ApiResult> {
    return this.delete('notes/' + noteId, noteId);
  }

  public updateNote(note: Note): Observable<ApiResult> {
    return this.update('notes/' + note.id, note.id!,
      {
        description: note.description,
        name: note.name,
        directory: note.directory
      }).pipe(
        tap((res: ApiResult) => {
          if (res.success) {
            this.table.update(note.id!, { description: note.description, name: note.name, directory: note.directory });
          }
        })
      );
  }

  public shareDirectory(directory: string, users: User[]): Observable<ApiResult> {
    return this.apiService.post('notes/share', {
      directory: directory,
      userIds: users.map(u => u.id)
    }).pipe(
      tap((res: ApiResult) => {
        if (res.success) {
          console.log(res);
        }
      })
    );
  }

  public unShareDirectory(directory: string, users: User[]): Observable<ApiResult> {
    return this.apiService.delete('notes/unshare', {
      directory: directory,
      userIds: users.map(u => u.id)
    }).pipe(
      tap((res: ApiResult) => {
        if (res.success) {
          console.log(res);
        }
      })
    );
  }
  public shareNote(note: Note, userIds: number[]): Observable<ApiResult> {
    return this.apiService.post('notes/share', {
      noteId: note.id,
      userIds: userIds
    }).pipe(
      tap((res: ApiResult) => {
        if (res.success) {
          console.log(res);
        }
      })
    );
  }

  public unShareNote(note: Note, userIds: number[]): Observable<ApiResult> {
    return this.apiService.delete('notes/unshare', {
      noteId: note.id,
      userIds: userIds
    }).pipe(
      tap((res: ApiResult) => {
        if (res.success) {
          console.log(res);
        }
      })
    );
  }

  public createNote(note: Note) {
    return this.create('notes', {
      description: note.description,
      name: note.name,
      directory: note.directory,
      active: true
    });
  }

  public tagNote(note: Note, tag: Tag): Observable<ApiResult> {
    return this.apiService.post(`notes/${note.id}/tag/${tag.id}`, {}).pipe(
      tap((res: ApiResult) => {
        if (res.success) {
          this.table.update(note.id!, { tags: [...note.tags!, tag] });
        }
      })
    );
  }

  public unTagNote(note: Note, tag: Tag): Observable<ApiResult> {
    return this.apiService.delete(`notes/${note.id}/tag/${tag.id}`).pipe(
      tap((res: ApiResult) => {
        if (res.success) {
          var noteTags = note.tags!.filter(t => t.id !== tag.id);
          this.table.update(note.id!, { tags: noteTags });
        }
      })
    );
  }

  public shareTag(tag: Tag, users: User[]): Observable<ApiResult> {
    return this.apiService.post(`notes/share/tag/${tag.id}`, {
      userIds: users.map(u => u.id)
    });
  }

  public unShareTag(tag: Tag, users: User[]): Observable<ApiResult> {
    return this.apiService.delete(`notes/unshare/tag/${tag.id}`, {
      userIds: users.map(u => u.id)
    });
  }
}
