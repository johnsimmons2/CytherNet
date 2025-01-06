import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, of, tap } from "rxjs";
import { Note } from "../model/note";
import { ApiService } from "./api.service";
import { ApiResult } from "../model/apiresult";
import { ParsingService } from "./parsing.service";
import { BaseService } from "./base.service";
import { DatabaseService } from "./database.service";

@Injectable({
  providedIn: 'root'
})
export class NoteService extends BaseService<Note> {

  notes: BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>([]);
  allNotes: BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>([]);

  constructor(protected override apiService: ApiService,
              protected override database: DatabaseService,
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

  protected override getTableName(): string {
    return 'notes';
}

  public getPlayerNotes(): Observable<ApiResult> {
    return this.apiService.get("notes");
  }

  public getAllNotes() {
    return this.getAll("notes/all");
  }

  public getById(id: number) {
    return this.get(`notes/${id}`, { id: id});
  }

  public deleteNote(noteId: number): Observable<ApiResult> {
    return this.delete('notes/' + noteId, noteId);
  }

  public updateNote(note: Note): Observable<ApiResult> {
    return this.update('notes/' + note.id, note.id, { description: note.description });
  }

  public createNote(note: Note) {
    return this.create('notes', {
      description: note.description,
      id: 0,
      userId: 0,
      characterId: 0,
      campaignId: 0,
      name: note.name,
      directory: note.directory,
      active: false
    });
  }
}
