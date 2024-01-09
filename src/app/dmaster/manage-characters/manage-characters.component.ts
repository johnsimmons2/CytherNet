import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Character } from "src/app/model/character";
import { CharacterService } from "src/app/services/character.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: 'manage-characters',
  templateUrl: './manage-characters.component.html',
})
export class ManageCharactersComponent implements OnInit {

  private userId: string = '';
  
  selectedUsername: string = '';
  characters: Character[] = [];

  constructor(private router: Router, 
    private route: ActivatedRoute, 
    private characterService: CharacterService,
    private userService: UserService) {
  }

  routeTo(route: string) {
    this.router.navigate([route]);
  }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.userId = params['id'];
      this.characterService.getPlayerCharacters(this.userId).subscribe((res: any) => {
        this.characters = res.data;
      });

      this.userService.getUser(Number.parseInt(this.userId)).subscribe((res: any) => {
        this.selectedUsername = res.data.username;
      });
    });
  }
}

