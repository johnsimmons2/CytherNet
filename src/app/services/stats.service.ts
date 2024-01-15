import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable({ providedIn: 'root' })
export class StatsService {
    private readonly STATS = [
    {
        name: "Strength",
        description: "Strength measures bodily power, athletic training, and the extent to which you can exert raw physical force.",
      },
      {
        name: "Dexterity",
        description: "Dexterity measures agility, reflexes, and balance.",
      },
      {
        name: "Constitution",
        description: "Constitution measures health, stamina, and vital force.",
      },
      {
        name: "Intelligence",
        description: "Intelligence measures mental acuity, accuracy of recall, and the ability to reason.",
      },
      {
        name: "Wisdom",
        description: "Wisdom reflects how attuned you are to the world around you and represents perceptiveness and intuition.",
      },
      {
        name: "Charisma",
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
}