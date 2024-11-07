import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, Input } from "@angular/core";
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { UserDto } from "src/app/model/user";
import { UserService } from "src/app/services/user.service";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [UserService]
})
export class RegisterComponent implements AfterViewInit {

    @Input() username: string = '';

    public nameTaken: boolean = false;
    public showPassword: boolean = false;

    registerForm = new FormGroup({
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
        passwordConfirm: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.email]),
        firstName: new FormControl('', []),
        lastName: new FormControl('', [])
    });

    constructor(private loginService: UserService, public router: Router) { }

    ngAfterViewInit(): void {
        this.registerForm.controls.passwordConfirm.valueChanges.subscribe((value: any) => {
            this.updatePasswordFormErrors(this.registerForm.value.password, value);
        });

        this.registerForm.controls.password.valueChanges.subscribe((value: any) => {
            this.updatePasswordFormErrors(this.registerForm.value.passwordConfirm, value);
        });
    }

    private updatePasswordFormErrors(compareValue: any, value: any) {
        if (compareValue !== value) {
            this.registerForm.controls.passwordConfirm.setErrors({ 'mismatch': true });
        } else {
            this.registerForm.controls.passwordConfirm.setErrors(null);
        }
    }

    public register() {
        if (this.registerForm.valid) {
            var user: UserDto = {
                password: this.registerForm.value.password!,
                username: this.registerForm.value.username!
            };

            if (this.registerForm.value.email) {
                user.email = this.registerForm.value.email;
            }

            if (this.registerForm.value.firstName) {
                user.fName = this.registerForm.value.firstName;
            }

            if (this.registerForm.value.lastName) {
                user.lName = this.registerForm.value.lastName;
            }

            this.loginService.register(user).subscribe((res: any) => {
                if (!res.success) {
                    if (res.status === 409) {
                        this.registerForm.controls.username.setErrors({ 'nameTaken': true });
                    } else {
                        this.registerForm.controls.username.setErrors({ 'genericError': true });
                    }
                } else {
                    this.router.navigate(['/']);
                }
            });
        }
    }
}
