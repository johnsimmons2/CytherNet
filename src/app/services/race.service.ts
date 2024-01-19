import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Race } from "../model/race";

@Injectable({ providedIn: 'root' })
export class RaceService {

    constructor(private apiService: ApiService) { }

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