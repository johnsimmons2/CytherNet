import { Component, ViewChild } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { User } from "src/app/common/model/user";
import { UserService } from "src/app/common/services/user.service";
import { Router, RouterModule } from "@angular/router";
import { ApiResult } from "src/app/common/model/apiresult";
import { CommonModule, DatePipe } from "@angular/common";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonIcon, IonInput, IonItem, IonModal, IonNote, IonText, IonToast } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline, refreshOutline } from 'ionicons/icons';
import { tap } from "rxjs";

@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss',],
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
    IonContent,
    IonCardHeader,
    IonCard,
    IonCardTitle,
    IonCardContent,
    IonText,
    IonItem,
    IonButton,
    IonIcon,
    IonCardSubtitle,
    IonNote,
    IonInput,
    IonModal,
    RouterModule,
    IonToast
	],
  providers: [DatePipe]
})
export class LoginComponent {

  @ViewChild(IonModal) modal!: IonModal;

	hidePassword: boolean = true;
  toastOpen: boolean = false;

	constructor(private loginService: UserService, public router: Router) {
		addIcons({ eyeOutline, eyeOffOutline });
	}

	loginFormGroup = new FormGroup({
		username: new FormControl('', [Validators.required]),
		password: new FormControl('', [Validators.required])
	});

	passwordFormGroup = new FormGroup({
		email: new FormControl('', [Validators.required, Validators.email])
	});

	get eyeCon() {
		return this.hidePassword ? eyeOutline : eyeOffOutline;
	}

  get resetIcon() {
    return refreshOutline;
  }

  ionViewWillEnter() {
    this.loginFormGroup.reset();
    this.passwordFormGroup.reset();
  }

	ngOnInit() {
    if (this.loginService.checkAuthentication()) {
      this.loginService.logout();
    }
	}

	togglePasswordVisibility() {
		this.hidePassword = !this.hidePassword;
	}

	resetPassword() {
		if (this.passwordFormGroup.valid) {
			this.loginService.getPasswordResetToken(this.passwordFormGroup.value.email!).pipe(
        tap((res: ApiResult) => {
          this.toastOpen = true;
        })
      ).subscribe();
      this.modal.dismiss(null, 'submit');
		}
	}

	submit() {
		if (this.loginFormGroup.valid) {
			var user: User = {
				password: this.loginFormGroup.value.password!,
				username: this.loginFormGroup.value.username!
			};

			this.loginService.login(user).pipe(
        tap((res: ApiResult) => {
          if (res.status === 401) {
            this.loginFormGroup.controls.password.setErrors({ 'loginError': true });
          } else if (res.status !== 200) {
            console.log(res);
            this.loginFormGroup.controls.password.setErrors({ 'genericError': true });
          }
        })).subscribe();
		}
	}

  cancel() {
    this.modal.dismiss(null, 'cancel');
    this.loginFormGroup.reset();
    this.toastOpen = false;
    this.hidePassword = true;
  }

  onWillDismiss(event: any) {
    this.loginFormGroup.reset();
    this.toastOpen = false;
    this.hidePassword = true;
  }

	registerUser() {
		this.router.navigate(['/register']);
	}

}
