import { Component, TemplateRef, ViewChild } from "@angular/core";
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

  loginFormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  passwordFormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  //@ViewChild('passwordForm', {static: true}) passwordFormTemplate: TemplateRef<any> | null = null;

  ngOnInit() {
    this.loginFormGroup.controls.password.valueChanges.subscribe((value: any) => {
      this.loginFormGroup.controls.password.setErrors(null);
      this.loginFormGroup.controls.username.setErrors(null);
    });
  }

  resetPassword() {
    if (this.passwordFormGroup.valid) {
      console.log("Gonna send a password request!");

      console.log(this.passwordFormGroup.value.email!);
      this.loginService.getPasswordResetToken(this.passwordFormGroup.value.email!).subscribe(res => {
        console.log(res);
      });
      // Get the reset token from the server
      // Send the request passing token in body, express will proxy to mail service
    }
  }

  submit() {
    if (this.loginFormGroup.valid) {
      var user: UserDto = {
        password: this.loginFormGroup.value.password!,
        username: this.loginFormGroup.value.username!
      };

      this.loginService.login(user).subscribe({
        next: (res: ApiResult) => {
          if (res.success) {
            this.router.navigate(['/']);
          } else {
            if (res.status === 401) {
              this.loginFormGroup.controls.username.setErrors({ 'loginError': true });
            } else {
              this.loginFormGroup.controls.username.setErrors({ 'genericError': true });
            }
          }
        },

        error: (err: any) => {
          console.log(err);
          this.loginFormGroup.controls.username.setErrors({ 'genericError': true });
        }
      });
    }
  }

  registerUser() {
    this.router.navigate(['/register']);
  }

}
