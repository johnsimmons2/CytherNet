import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Feat } from "../model/feat";
import { Observable, map } from "rxjs";
import { ApiResult } from "../model/apiresult";
import { MapperService } from "./mapper.service";

@Injectable({ providedIn: 'root' })
export class FeatService {

    constructor(private apiService: ApiService, private mapper: MapperService) { }

    public delete(id: number) {
        return this.apiService.delete(`feats/${id}`);
    }

    public getRacialFeatsFor(id: number): Observable<Feat[]> {
        return this.apiService.get("feats/race/" + id).pipe(
            map((res: ApiResult) => {
                if (res.success) {
                    return res.data.reduce((featAcc: Feat[], featRes: any) => {
                        let featDto = this.mapper.asFeatDto(featRes);
                        if (featDto !== null) {
                            featAcc.push(featDto);
                        }
                        return featAcc;
                      }, []);
                } else {
                    return [];
                }
            })
        );
    }

    public getRacialFeats(): Observable<Feat[]> {
        return this.apiService.get("feats/race").pipe(
            map((res: ApiResult) => {
                if (res.success) {
                    return res.data.reduce((featAcc: Feat[], featRes: any) => {
                        let featDto = this.mapper.asFeatDto(featRes);
                        if (featDto !== null) {
                            featAcc.push(featDto);
                        }
                        return featAcc;
                      }, []);
                } else {
                    return [];
                }
            })
        );
    }

    public get(id: number): Observable<Feat | null> {
        return this.apiService.get(`feats/${id}`).pipe(
            map((res: ApiResult) => {
                if (res.success) {
                    const dto = this.mapper.asFeatDto(res.data);
                    if (dto !== null) {
                        return dto;
                    }
                }
                return null;
            })
        );
    }

    public getFeats(): Observable<Feat[]> {
        return this.apiService.get("feats").pipe(
            map((res: ApiResult) => {
                if (res.success) {
                    return res.data.reduce((featAcc: Feat[], featRes: any) => {
                        let featDto = this.mapper.asFeatDto(featRes);
                        if (featDto !== null) {
                            featAcc.push(featDto);
                        }
                        return featAcc;
                      }, []);
                } else {
                    return [];
                }
            })
        );
    }

    public createFeat(feat: Feat): any {
        return this.apiService.post("feats", feat);
    }

    public updateFeat(feat: Feat): any {
        return this.apiService.patch(`feats/${feat.id}`, feat);
    }

}