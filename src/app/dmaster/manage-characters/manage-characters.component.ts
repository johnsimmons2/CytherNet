import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Character } from "src/app/model/character";
import { CharacterService } from "src/app/services/character.service";

@Component({
  selector: 'manage-characters',
  templateUrl: './manage-characters.component.html',
})
export class ManageCharactersComponent implements OnInit {

  private userId: string = '';

  characters: Character[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private characterService: CharacterService) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.userId = params['id'];
      this.characterService.getPlayerCharacters(this.userId).subscribe((res: any) => {
        this.characters = res.data;
      });
    });
  }
}

