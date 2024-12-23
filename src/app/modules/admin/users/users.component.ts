import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { IonButton, IonCol, IonContent, IonGrid, IonInput, IonRow } from "@ionic/angular/standalone";
import { UserDto } from "src/app/common/model/user";
import { UserService } from "src/app/common/services/user.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
  ]
})
export class UsersComponent {

  users: UserDto[] = [];

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getUsers().subscribe(users => {
      users.data.forEach((user: UserDto) => {
        this.users.push({
          id: user.id,
          username: user.username,
          email: user.email,
          fName: user.fName,
          lName: user.lName,
          token: user.token,
          roles: user.roles
        });
      });
      console.log(this.users);
    });
  }

  editUser(user: any) {

  }

  resetPassword(user: any) {
    this.userService.resetPasswordLink(this.users.find(x => x.id === user)).subscribe((res) => {
      console.log(res);
    });
  }

  deleteUser(user: any) {
    console.log(user);
    this.userService.deleteUser(user).subscribe(() => {
      this.users = this.users.filter(u => u.id !== user.id);
    });
  }
}
