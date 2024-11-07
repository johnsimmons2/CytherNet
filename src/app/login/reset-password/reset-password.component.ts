import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { UserDto } from "src/app/model/user";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ResetPasswordComponent {

  resetToken: string | null = null;
  user: string = '';

  get valid() {
    return  this.passwordFormGroup.valid   &&
            this.resetToken !== null       &&
            this.user !== ''               &&
            this.passwordFormGroup.value.pword === this.passwordFormGroup.value.pword2;
  }

  constructor(private loginService: UserService, private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.resetToken = params['resetToken'];
      this.user = params['user'];
    });
  }

  passwordFormGroup = new FormGroup({
    pword: new FormControl('', [Validators.required]),
    pword2: new FormControl('', [Validators.required])
  });

  submit() {
    if (this.valid) {
      const user: UserDto = {
        password: this.passwordFormGroup.value.pword!,
        username: this.user
      }
      this.loginService.updateUserPassword(user, this.resetToken!).subscribe(res => {
        if (res.success) {
          this.router.navigate(['/']);
        }
      });
    }
  }

}
