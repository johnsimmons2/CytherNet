import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Race } from "../model/race";
import { MapperService } from "./mapper.service";
import { ApiResult } from "../model/apiresult";
import { Observable, map } from "rxjs";

@Injectable({ providedIn: 'root' })
export class RaceService {

    constructor(private apiService: ApiService, private mapper: MapperService) { }

    public delete(id: number) {
        return this.apiService.delete(`race/${id}`);
    }

    public getRaces(): Observable<Race[]> {
        return this.apiService.get("race").pipe(
          map((res: ApiResult) => {
            if (res.success) {
              return res.data.reduce((racesAcc: Race[], raceResult: any) => {
                let raceDto = this.mapper.asRaceDto(raceResult);
                if (raceDto !== null) {
                  racesAcc.push(raceDto);
                }
                return racesAcc;
              }, []);
            }
          })
        );
      }

    public updateRace(race: Race) {
        return this.apiService.patch(`race/${race.id}`, race);
    }

    public createRace(race: Race) {
        return this.apiService.post('race', race);
    }

}