import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Race } from "../model/race";
import { BehaviorSubject, Observable, map, tap } from "rxjs";
import { ApiResult } from "../model/apiresult";
import { MapperService } from "./mapper.service";


@Injectable({ providedIn: 'root' })
export class RaceService {

  constructor(private apiService: ApiService, private mapper: MapperService) { }

  races: BehaviorSubject<Race[]> = new BehaviorSubject<Race[]>([]);

  get races$(): Observable<Race[]> {
    return (this.races.getValue() && this.races.getValue().length > 0) ? this.races.asObservable() : this.getRaces().pipe(
      map((x: ApiResult) => x.data as Race[]),
      tap(mappedRaces => {
        this.races.next(mappedRaces);
      }));
  }

  public delete(id: number) {
    return this.apiService.delete(`race/${id}`);
  }

  public getRaces() {
    return this.apiService.get("race");
  }

  public updateRace(race: Race) {
    return this.apiService.patch(`race/${race.id}`, race);
  }

  public createRace(race: Race) {
      return this.apiService.post('race', race);
  }

}
