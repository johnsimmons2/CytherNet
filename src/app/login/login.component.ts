import { Component } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from "@angular/forms";
import { UserDto } from "../model/user";
import { UserService } from "../services/user.service";
import { Router } from "@angular/router";
import { ApiResult } from "../model/apiresult";

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

      this.loginService.login(user).subscribe((res: ApiResult) => {
        if (res.success) {
          this.router.navigate(['/']);
        } 
      },

      (error: any) => {
        if (error.status === 401) {
          this.loginForm.controls.username.setErrors({'loginError': true});
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
