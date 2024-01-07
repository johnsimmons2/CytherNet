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

  constructor(private loginService: UserService, private router: Router) { }

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  ngOnInit() {
    this.loginForm.controls.password.valueChanges.subscribe((value: any) => {
      this.loginForm.controls.password.setErrors(null);
      this.loginForm.controls.username.setErrors(null);
    });
  }

  submit() {
    console.log("Login form submitted");

    if (this.loginForm.valid) {
      var user: UserDto = {
        password: this.loginForm.value.password!,
        username: this.loginForm.value.username!
      };

      this.loginService.login(user).subscribe((res: any) => {
        if (res !== null) {
          if (res.success) {
            this.router.navigate(['/']);
          } else {
            if (res.status === 401) {
              this.loginForm.controls.username.setErrors({'loginError': true});
            } else {
              this.loginForm.controls.username.setErrors({'genericError': true});
            }
          }
        } else {
          this.loginForm.controls.username.setErrors({'genericError': true});
        }
      });
    }
  }

  registerUser() {
    this.router.navigate(['/register']);
  }

}
