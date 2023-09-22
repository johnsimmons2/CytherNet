import { Component } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { UserService } from "../services/user.service";


@Component({
  selector: 'profile-app',
  templateUrl: './profile.component.html'
})
export class ProfileComponent {

  profileForm = new FormGroup({

  });

  constructor(private userService: UserService) { }

  get username() {
    return localStorage.getItem('username');
  }

  ngOnInit() {
  }

}
