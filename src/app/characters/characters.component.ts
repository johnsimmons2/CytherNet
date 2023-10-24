import { Component } from "@angular/core";
import { UserService } from "../services/user.service";
import { Character } from "../model/character";


@Component({
  selector: 'characters-app',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss']
})
export class CharactersComponent {

  fakeCharacter: Character | null = null;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.fakeCharacter = {
      name: 'Fake Character',
      class: "test",
      subclass: "test2",
      race: "fake",
      strength: 4,
      dexterity: 11,
      constitution: 7,
      intelligence: 13,
      wisdom: 18,
      charisma: 20,
      level: 1,
      experience: 0,
      health: 20,
      armorclass: 13,
      initiative: 1,
      speed: 30,
      proficiencybonus: 1
    }
  }

}
