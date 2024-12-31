import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonInput, IonItem, IonLabel, IonList, IonText, IonToast } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { eyeOffOutline, eyeOutline } from "ionicons/icons";
import { tap } from "rxjs";
import { ApiResult } from "src/app/common/model/apiresult";
import { User } from "src/app/common/model/user";
import { UserService } from "src/app/common/services/user.service";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonCard,
    IonCardTitle,
    IonCardHeader,
    IonCardContent,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonText,
    IonLabel,
    IonButton,
    IonToast
  ]
})
export class ResetPasswordComponent {

  hidePassword: boolean = true;
  toastOpen: boolean = false;
  toastMessage: string = '';
  username: string = '';
  token: string = '';

  passwordForm = new FormGroup({
    passwordConfirm: new FormControl('', [Validators.required]),
    passwordConfirm2: new FormControl('', [Validators.required])
  });

  constructor(private router: Router, private userService: UserService) {
    addIcons({ eyeOutline, eyeOffOutline });
  }

  get eyeCon() {
		return this.hidePassword ? eyeOutline : eyeOffOutline;
	}

  get invalidForm() {
    const p1 = this.passwordForm.controls.passwordConfirm.value ?? '';
    const p2 = this.passwordForm.controls.passwordConfirm2.value ?? '';
    if (p1 === '' || p2 === '') {
      return true;
    }

    if (p1 !== p2) {
      return true;
    }

    return false;
  }

  ngOnInit() {
    this.router.routerState.root.queryParams.subscribe((params) => {
      if (params['t'] === undefined || params['u'] === undefined) {
        this.router.navigate(['/login']);
      } else {
        this.setupForm();
        this.username = params['u'];
        this.token = params['t'];
      }
    });
	}

  setupForm() {
    this.passwordForm.controls.passwordConfirm2.valueChanges.subscribe((value: any) => {
      if (value !== this.passwordForm.controls.passwordConfirm.value) {
        this.passwordForm.controls.passwordConfirm.setErrors({'mismatch': true});
      } else {
        this.passwordForm.controls.passwordConfirm.setErrors({'mismatch': false});
      }
    });
  }

  ionViewWillEnter() {
    this.passwordForm.reset();
  }

  changePassword() {
    const user: User = {
      username: this.username,
      password: this.passwordForm.controls.passwordConfirm.value!
    };

    this.userService.updateUserPassword(user, this.token).pipe(
      tap((res: ApiResult) => {
        if (res.success) {
          this.toastMessage = 'Password reset successfully. Redirecting to login page...';
          this.toastOpen = true;
          setTimeout(() => {
            // TODO: Just go ahead and log them in.
            this.router.navigate(['/login']);
          }, 1800);
        } else {
          this.toastOpen = true;
          this.toastMessage = 'An error occurred. Please try again later.';
          console.error(res.errors);
          console.error(res.data);
        }
      })
    ).subscribe();
  }
}
