import { Component } from "@angular/core";
import { UserService } from "../services/user.service";


@Component({
  selector: 'character-app',
  templateUrl: './character.component.html'
})
export class CharacterComponent {

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

}
