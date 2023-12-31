import { Component } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from "@angular/forms";
import { UserDto } from "../model/user";
import { UserService } from "../services/user.service";
import { Router } from "@angular/router";

@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent {


  public loginError: boolean = false;
  public genericError: boolean = false;

  constructor(private loginService: UserService, private router: Router) { }

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  ngOnInit() {
  }

  submit() {
    console.log("Login form submitted");

    if (this.loginForm.valid) {
      var user: UserDto = {
        password: this.loginForm.value.password!,
        username: this.loginForm.value.username!
      };

      this.loginService.login(user).subscribe((res: boolean | null) => {
        if (res !== null) {
          this.loginError = !res;
          if (!this.loginError) {
            this.router.navigate(['/']);
          }
        } else {
          this.genericError = true;
        }
      });
    }
  }

  registerUser() {
    this.router.navigate(['/register']);
  }

}
