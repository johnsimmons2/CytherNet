import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable({ providedIn: 'root' })
export class StatsService {
    public readonly STATS = [
    {
        name: "Strength",
        shortName: "STR",
        description: "Strength measures bodily power, athletic training, and the extent to which you can exert raw physical force.",
      },
      {
        name: "Dexterity",
        shortName: "DEX",
        description: "Dexterity measures agility, reflexes, and balance.",
      },
      {
        name: "Constitution",
        shortName: "CON",
        description: "Constitution measures health, stamina, and vital force.",
      },
      {
        name: "Intelligence",
        shortName: "INT",
        description: "Intelligence measures mental acuity, accuracy of recall, and the ability to reason.",
      },
      {
        name: "Wisdom",
        shortName: "WIS",
        description: "Wisdom reflects how attuned you are to the world around you and represents perceptiveness and intuition.",
      },
      {
        name: "Charisma",
        shortName: "CHA",
        description: "Charisma measures your ability to interact effectively with others. It includes such factors as confidence and eloquence, and it can represent a charming or commanding personality.",
      }
    ];

    constructor(private apiService: ApiService) { }

    get statDescriptions() {
        return this.STATS;
    }

    public getCharacterStats(characterId: number) {
        return this.apiService.get(`stats/${characterId}`);
    }

    public getStatName(shortStat: string): string | undefined {
        return this.STATS.find(stat => stat.shortName.toLowerCase() === shortStat.toLowerCase())?.name;
    }

    public getStatDescription(shortStat: string): string | undefined {
      return this.STATS.find(stat => stat.shortName.toLowerCase() === shortStat.toLowerCase())?.description;
  }
}