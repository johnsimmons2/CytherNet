import { Injectable } from "@angular/core";
import { Class } from "../model/class";
import { BehaviorSubject, Observable, map, tap } from "rxjs";
import { ApiService } from "./api.service";
import { ApiResult } from "../model/apiresult";

@Injectable({ providedIn: 'root' })
export class ClassService {

  constructor(private apiService: ApiService) { }

  classes: BehaviorSubject<Class[]> = new BehaviorSubject<Class[]>([]);

  get classes$(): Observable<Class[]> {
    return (this.classes.getValue() && this.classes.getValue().length > 0) ? this.classes.asObservable() : this.getClasses().pipe(
      map((x: ApiResult) => x.data as Class[]),
      tap(mappedClasses => {
        this.classes.next(mappedClasses);
      }));
  }

  public getClasses() {
    return this.apiService.get("classes");
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
