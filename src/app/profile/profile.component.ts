import { Component } from "@angular/core";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UserService } from "../services/user.service";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";


@Component({
  selector: 'profile-app',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [UserService]
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
