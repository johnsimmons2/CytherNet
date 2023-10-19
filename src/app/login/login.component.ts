import { Component } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from "@angular/forms";
import { UserDto } from "../model/user";
import { UserService } from "../services/user.service";

@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  public nameTaken: boolean = true;

  constructor(private loginService: UserService) { }

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  ngOnInit() {
  }

  submit() {
    if (this.loginForm.valid) {
      var user: UserDto = {
        password: this.loginForm.value.password!,
        username: this.loginForm.value.username!
      };
      this.loginService.login(user);
    }
  }

  registerUser() {
    if (this.loginForm.valid) {
      var user: UserDto = {
        password: this.loginForm.value.password!,
        username: this.loginForm.value.username!
      };
      this.loginService.register(user).then((res: boolean) => {
        if (res) {
          this.nameTaken = false;
        }
      });
    }
  }

  canRegister(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null =>
      !this.nameTaken ? { 'nameTaken': { value: control.value } } : null;
  }
}
