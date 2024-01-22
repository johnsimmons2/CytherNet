import { Injectable } from "@angular/core";
import { Class } from "../model/class";
import { MapperService } from "./mapper.service";
import { ApiService } from "./api.service";
import { Observable, map } from "rxjs";
import { ApiResult } from "../model/apiresult";

@Injectable({ providedIn: 'root' })
export class ClassService {
    constructor(private mapper: MapperService, private apiService: ApiService) { }

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

    public getClasses(): Observable<Class[]> {
        return this.apiService.get("classes").pipe(
            map((res: ApiResult) => {
                if (res.success) {
                    return res.data.reduce((classesAcc: Class[], classResult: any) => {
                        let classDto = this.mapper.asClassDto(classResult);
                        if (classDto !== null) {
                            classesAcc.push(classDto);
                        }
                        return classesAcc;
                    }, []);
                }
            })
        );
    }

    public getClassSubclasses(id: number): Observable<Class[]> {
        return this.apiService.get(`classes/${id}/subclasses`).pipe(
            map((res: ApiResult) => {
                if (res.success) {
                    return res.data.reduce((classesAcc: Class[], classResult: any) => {
                        let classDto = this.mapper.asClassDto(classResult);
                        if (classDto !== null) {
                            classesAcc.push(classDto);
                        }
                        return classesAcc;
                    }, []);
                }
            })
        );
    }

}