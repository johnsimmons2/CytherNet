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

  public nameTaken: boolean = false;
  public loginError: boolean = false;

  constructor(private loginService: UserService, private router: Router) { }

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  ngOnInit() {
  }

  submit() {
    console.log("Login form submitted");
    if (this.loginForm.valid) {
      var user: UserDto = {
        password: this.loginForm.value.password!,
        username: this.loginForm.value.username!
      };
      this.loginService.login(user).subscribe((res: boolean) => {
        this.loginError = !res;
        console.log(this.loginError);
        if (!this.loginError) {
          this.router.navigate(['/']);
        }
      });
    }
  }

  registerUser() {
    if (this.loginForm.valid) {
      var user: UserDto = {
        password: this.loginForm.value.password!,
        username: this.loginForm.value.username!
      };
      this.loginService.register(user).subscribe((res: boolean) => {
        if (!res) {
          this.nameTaken = true;
        } else {
          this.router.navigate(['/']);
        }
      });
    }
  }

  canRegister(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null =>
      !this.nameTaken ? { 'nameTaken': { value: control.value } } : null;
  }
}
