import { Injectable } from "@angular/core";
import { BehaviorSubject, map, tap } from "rxjs";
import { Note } from "../model/note";
import { ApiService } from "./api.service";
import { ApiResult } from "../model/apiresult";

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  notes: BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>([]);

  constructor(private apiService: ApiService) {

  }

  get notes$() {
    return (this.notes.getValue() && this.notes.getValue().length > 0) ? this.notes.asObservable() : this.getPlayerNotes().pipe(
      map((x: ApiResult) => x.data as Note[]),
      tap(mappedNotes => {
        this.notes.next(mappedNotes);
      }));
  }

  public getPlayerNotes() {
    return this.apiService.get("notes");
  }

}
