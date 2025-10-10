import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, Input } from "@angular/core";
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule, AbstractControl, ValidationErrors } from "@angular/forms";
import { Router } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { debounceTime, distinctUntilChanged, filter, switchMap } from "rxjs";
import { User } from "src/app/common/model/user";
import { UserService } from "src/app/common/services/user.service";

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
    public readonly USERNAME_LENGTH = 4;
    public readonly PASSWORD_LENGTH = 5;

    registerForm = new FormGroup({
        username: new FormControl('', [Validators.required, Validators.minLength(this.USERNAME_LENGTH)]),
        password: new FormControl('', [Validators.required, Validators.minLength(this.PASSWORD_LENGTH)]),
        passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(this.PASSWORD_LENGTH)]),
        email: new FormControl('', [Validators.email, Validators.required]),
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

        this.registerForm.controls.username.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            filter((value: any) => typeof value === 'string' && value.length >= this.USERNAME_LENGTH),
            switchMap((value: string) => this.loginService.isNameAvailable(value))
        ).subscribe((isAvailable: boolean) => {
            const control = this.registerForm.controls.username;
            this.updateFormAvailableStatus(control, isAvailable);
        });

        this.registerForm.controls.email.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            filter((value: any) => typeof value === 'string'),
            switchMap((value: string) => this.loginService.isEmailAvailable(value))
        ).subscribe((isAvailable: boolean) => {
            const control = this.registerForm.controls.email;
            this.updateFormAvailableStatus(control, isAvailable);
        });
    }

    private updateFormAvailableStatus(control: FormControl, isAvailable: boolean) {
        if (isAvailable) {
            control.setErrors({ 'taken': false });
        } else {
            control.setErrors({ 'taken': true });
        }
        this.sanitizeErrors(control);
    }

    private updatePasswordFormErrors(compareValue: any, value: any) {
        if (compareValue !== value) {
            this.registerForm.controls.passwordConfirm.setErrors({ 'mismatch': true });
        } else {
            this.registerForm.controls.passwordConfirm.setErrors({ 'mismatch': false });
        }
        this.sanitizeErrors(this.registerForm.controls.passwordConfirm);
    }

    public register() {
        if (this.registerForm.valid) {
            var user: User = {
                password: this.registerForm.value.password!,
                username: this.registerForm.value.username!,
                email: this.registerForm.value.email!
            };

            user.first_name = this.registerForm.value.firstName ?? '';
            user.last_name = this.registerForm.value.lastName ?? '';

            this.loginService.register(user).subscribe((success: boolean) => {
                if (success) {
                    this.router.navigate(['/']);
                } else {
                    console.error('Registration failed'); // TODO: add error message or some feedback.
                }
            });
        }
    }

    /**
     * This is a wrapper, because angular's forms are awful. When a field is required and missing,
     * { required: true } is added to the errors dictionary. But, for some ungodly reason,
     * { required: false } tells the form it is ALSO invalid. So the state and internal data
     * of the error is completely pointless for validation out of box. This means if you want
     * to manage more than one type of error on one control, oh boy, enjoy some array
     * indexing for some reason! https://github.com/angular/angular/issues/21564
     *
     */
    public sanitizeErrors(control: AbstractControl): void {
        const errors = control.errors;
        if (!errors) return;

        const activeErrors: ValidationErrors = {};
        for (const [key, value] of Object.entries(errors)) {
            if (value !== false) {
            activeErrors[key] = value;
            }
        }

        if (Object.keys(activeErrors).length === 0) {
            // Forcefully override: no active errors
            control.setErrors(null);
        } else {
            control.setErrors(activeErrors);
        }
    }
}
