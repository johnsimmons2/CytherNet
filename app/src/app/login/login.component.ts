import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { User } from "../model/user";
import { UserService } from "../services/user.service";

@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  constructor(private loginService: UserService) { }

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  ngOnInit() {
  }

  register() {
    if (this.loginForm.valid) {
      var user: User = {
        password: this.loginForm.value.password!,
        username: this.loginForm.value.username!
      };
      this.loginService.register(user);
    }
  }

  submit() {
    if (this.loginForm.valid) {
      var user: User = {
        password: this.loginForm.value.password!,
        username: this.loginForm.value.username!
      };
      this.loginService.login(user);
    }
  }
}
