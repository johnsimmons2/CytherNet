import { Injectable } from "@angular/core";
import { Class, Subclass } from "../model/class";
import { BehaviorSubject, Observable, map, tap } from "rxjs";
import { ApiService } from "./api.service";
import { ApiResult } from "../model/apiresult";

@Injectable({ providedIn: 'root' })
export class ClassService {

  constructor(private apiService: ApiService) { }

  classes: BehaviorSubject<Class[]> = new BehaviorSubject<Class[]>([]);
  subclasses: BehaviorSubject<Subclass[]> = new BehaviorSubject<Subclass[]>([]);

  get classes$(): Observable<Class[]> {
    return (this.classes.getValue() && this.classes.getValue().length > 0) ? this.classes.asObservable() : this.getClasses().pipe(
      map((x: ApiResult) => x.data as Class[]),
      tap(mappedClasses => {
        this.classes.next(mappedClasses);
      }));
  }

  get subclasses$(): Observable<Subclass[]> {
    return (this.subclasses.getValue() && this.subclasses.getValue().length > 0) ? this.subclasses.asObservable() : this.getSubclasses().pipe(
      map((x: ApiResult) => x.data as Subclass[]),
      tap(mappedClasses => {
        this.subclasses.next(mappedClasses);
      }));
  }

  public getClasses() {
    return this.apiService.get("classes");
  }

  public getSubclasses() {
    return this.apiService.get("subclasses");
  }

  public delete(id: number) {
      return this.apiService.delete(`classes/${id}`);
  }

  public update(clazz: Class): Observable<ApiResult> {
      return this.apiService.patch(`classes/${clazz.id}`, clazz);
  }

  public createSubclasses(classId: number, subclasses: Class[]): Observable<ApiResult> {
      return this.apiService.post(`classes/${classId}/subclasses`, subclasses);
  }

  public create(clazz: Class): Observable<ApiResult> {
      return this.apiService.post(`classes`, clazz);
  }

}
