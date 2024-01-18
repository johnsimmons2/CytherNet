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

  userId: number = 0;
  
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
      let userId = params['id'];
      if (userId) {
        this.userId = -1;
      } else {
        this.userId = Number.parseInt(userId);
      }

      // If we are passed a user ID, we are viewing their characters.
      if (this.userId > 0) {
        this.characterService.getPlayerCharacters(this.userId).subscribe((res: any) => {
          this.characters = res.data;
        });
  
        this.userService.getUser(this.userId).subscribe((res: any) => {
          this.selectedUsername = res.data.username;
        });
      } else {
        // Otherwise, we are viewing all characters. Which requires an admin role.
        if (this.userService.hasRoleAdmin()) {
          this.characterService.getAllCharacters().subscribe((res: any) => {
            this.characters = res.data;
          });
        }
      }

    });
  }
}

