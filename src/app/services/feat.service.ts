import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Feat } from "../model/feat";

@Injectable({ providedIn: 'root' })
export class FeatService {

    constructor(private apiService: ApiService) { }

    public delete(id: number) {
        return this.apiService.delete(`feats/${id}`);
    }

    public getFeats() {
        return this.apiService.get("feats");
    }

    public createFeat(feat: Feat): any {
        return this.apiService.post("feats", feat);
    }

    public updateFeat(feat: Feat): any {
        return this.apiService.patch(`feats/${feat.id}`, feat);
    }

}