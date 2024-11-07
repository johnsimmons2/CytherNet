import { Component } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { UserDto } from "../model/user";
import { UserService } from "../services/user.service";
import { Router } from "@angular/router";
import { ApiResult } from "../model/apiresult";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import {addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss',],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ],
  providers: [UserService, Router]
})
export class LoginComponent {

  hidePassword: boolean = true;

  constructor(private loginService: UserService, private router: Router) {
    addIcons({eyeOutline, eyeOffOutline});
  }

  loginFormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  passwordFormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  //@ViewChild('passwordForm', {static: true}) passwordFormTemplate: TemplateRef<any> | null = null;

  get eyeCon() {
    return this.hidePassword ? eyeOutline : eyeOffOutline;
  }

  ngOnInit() {
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  resetPassword() {
    if (this.passwordFormGroup.valid) {
      this.loginService.getPasswordResetToken(this.passwordFormGroup.value.email!).subscribe(res => {
        console.log(res);
      });
      // Get the reset token from the server
      // Send the request passing token in body, express will proxy to mail service
    }
  }

  submit() {
    console.log(this.loginFormGroup)
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
    console.log(this.loginFormGroup.valid);
   // this.router.navigate(['/register']);
  }

}
