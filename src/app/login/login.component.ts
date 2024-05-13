import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UserDto } from "../model/user";
import { UserService } from "../services/user.service";
import { Router } from "@angular/router";
import { ApiResult } from "../model/apiresult";
import { catchError, map, tap } from "rxjs";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss',]
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

  forgotPassword() {

  }

  submit() {
    if (this.loginForm.valid) {
      var user: UserDto = {
        password: this.loginForm.value.password!,
        username: this.loginForm.value.username!
      };

      this.loginService.login(user).subscribe({
        next: (res: ApiResult) => {
          if (res.success) {
            this.router.navigate(['/']);
          } else {
            if (res.status === 401) {
              this.loginForm.controls.username.setErrors({'loginError': true});
            } else {
              this.loginForm.controls.username.setErrors({'genericError': true});
            }
          }
        },

        error: (err: any) => {
          console.log(err);
          this.loginForm.controls.username.setErrors({'genericError': true});
        }
      });
    }
  }

  registerUser() {
    this.router.navigate(['/register']);
  }

}
