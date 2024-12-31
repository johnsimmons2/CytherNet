import { Component } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { UserService } from "src/app/common/services/user.service";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { tap } from "rxjs";
import { addIcons } from 'ionicons';
import { createOutline, checkboxOutline, closeCircleOutline } from 'ionicons/icons';
import { EditableFieldComponent } from "../../common/components/editableField/editable-field.component";
import { User } from "src/app/common/model/user";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonInput, IonItem, IonLabel, IonList, IonText, IonToast } from "@ionic/angular/standalone";


@Component({
  selector: 'profile-app',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonContent,
    IonCardContent,
    IonItem,
    IonList,
    IonInput,
    IonCardTitle,
    IonText,
    IonLabel,
    IonToast,
    ReactiveFormsModule,
    EditableFieldComponent
],
  providers: [UserService]
})
export class ProfileComponent {

  profileForm = new FormGroup({
    email: new FormControl('', []),
    firstName: new FormControl('', []),
    lastName: new FormControl('', [])
  });

  passwordForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
    passwordConfirm: new FormControl('', [Validators.required]),
    passwordConfirm2: new FormControl('', [Validators.required])
  });

  isEdited: boolean = false;
  toastOpen: boolean = false;
  toastMessage: string = '';
  userId: number = 0;

  users: User[] = [];

  constructor(private userService: UserService) {
    addIcons({ createOutline, checkboxOutline, closeCircleOutline });
  }

  get username() {
    return localStorage.getItem('username');
  }

  ngOnInit() {
    this.userService.getUserByUsername(this.username!).pipe(
      tap((res: User) => {
        console.log(res);
        this.userId = res.id!;
        this.profileForm.patchValue({
          email: res.email,
          firstName: res.fName,
          lastName: res.lName
        })
      })
    ).subscribe();
  }

  updatedField(event: any) {
    if (event.change) {
      this.isEdited = true;
    }
  }

  changePassword() {
    if (this.passwordForm.valid) {
      if (this.passwordForm.value.passwordConfirm !== this.passwordForm.value.passwordConfirm2) {
        this.passwordForm.controls.passwordConfirm.setErrors({ 'mismatch': true });
        return;
      }
      let request: any = {
        old_secret: this.passwordForm.value.password,
        new_secret: this.passwordForm.value.passwordConfirm,
        id: this.userId
      }

      this.userService.updateUserPasswordManual(request).pipe(
        tap((res) => {
          if (res.success) {
            this.toastMessage = "Password updated successfully";
            this.passwordForm.reset();
          } else {
            this.toastMessage = "Something went wrong saving changes";
          }
          this.toastOpen = true;
        })
      ).subscribe();
    }
  }

  submit() {
    console.log(this.userId);
    if (this.profileForm.valid && this.userId) {
      let user: User = {
        id: this.userId,
        email: this.profileForm.value.email!,
        fName: this.profileForm.value.firstName!,
        lName: this.profileForm.value.lastName!
      }

      this.userService.updateUser(user).pipe(
        tap((res) => {
          if (res.success) {
            this.toastMessage = "Profile updated successfully";
          } else {
            this.toastMessage = "Something went wrong saving changes";
          }
          this.isEdited = false;
          this.toastOpen = true;
        })
      ).subscribe();
    }
  }

}
