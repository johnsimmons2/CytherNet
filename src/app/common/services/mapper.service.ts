import { Injectable } from "@angular/core";
import { Feat } from "../model/feat";
import { Race } from "../model/race";
import { Class, Subclass } from "../model/class";

@Injectable({ providedIn: 'root' })
export class MapperService {
    public asRaceDto(result: any): Race | null {
        try {
            let featIds = result.feats.map((feat: any) => feat.id);
            let dto = {
                id: result.id,
                name: result.name,
                description: result.description,
                size: result.size,
                languages: result.languages,
                alignment: result.alignment,
                featIds: featIds,
            };

            return dto;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    public asFeatDto(result: Feat): Feat | null {
        try {
            let dto = {
                id: result.id,
                name: result.name,
                description: result.description,
            };

            return dto;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    public asClassDto(result: Class): Class | null {
        try {
            const subclasses = result.subclasses;

            return {
                id: result.id,
                name: result.name,
                description: result.description,
                subclasses: subclasses,
                spellCastingAbility: result.spellCastingAbility,
            };
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}
