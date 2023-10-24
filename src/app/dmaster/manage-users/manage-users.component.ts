import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Role, User, UserDto } from 'src/app/model/user';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';
import { forkJoin } from 'rxjs'
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModal } from 'src/app/shared/confirmation-modal/confirmation-modal.component';
import { FormControl, Validators } from '@angular/forms';
import { TupleType } from 'typescript';
import { Router } from '@angular/router';

// We set the ID user 1 disabled because it is always admin.

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit, AfterViewInit {

  dataSource: User[] = [];
  xcolumns: string[] = ['id', 'username', 'email', 'lastOnline', 'created', 'roles', 'actions'];

  roles: Role[] = [];

  @ViewChild(MatTable) table!: MatTable<User>;

  constructor(private userService: UserService, private modal: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.userService.getAllRoles().subscribe((res: any) => {
      this.roles = res;
    });
  }

  editRoles(row: any): void {
    console.log(row);
  }

  manageCharacters(userId: any): void {
    this.router.navigate([`/dmaster/users/${userId}/characters/`]);
  }


  updateRolesFor(id: string, event: any): void {
    console.log(event);
    this.userService.updateUserRoles(parseInt(id), event).subscribe((res: any) => {
      console.log(res);
      this.resetTable();
    });
  }

  compareRoles(role1: Role, role2: Role): boolean {
    return role1 && role2 ? role1.id === role2.id : role1 === role2;
  }

  updateEmailFor(id: string, event: any): void {
    // Use validators to clean email form for SQL and other junk:
    let email = event.target.value;
    console.log(email);
    if (!email || email.length === 0) {
      return;
    }
    if (Validators.email(new FormControl(email)) != null) {
      console.log(`Not a valid email. ${Validators.email(new FormControl(email))}`);
      return;
    }
    let user: UserDto = {
      id: parseInt(id),
      email: email,
    };
    this.userService.updateUser(user).subscribe((res: any) => {
      console.log(res);
      this.resetTable();
    });
  }

  deleteRow(row: any): void {
    console.log(row);
    let duration = '100ms';
    let modal = this.modal.open(ConfirmationModal, {
      width: '500px',
      data: {
        duration,
        action: row.id,
      },
    });
    modal.componentInstance.title = 'Delete User';
    modal.componentInstance.content = `Are you sure you want to delete ${row.username}?`;
    modal.componentInstance.action = 'Delete';

    modal.afterClosed().subscribe((res: any) => {
      if (res !== undefined && res !== 1 && res !== '1') {
        console.log(`attempting to delete user ${res}`);
        this.userService.deleteUser(row.id).subscribe((res: any) => {
          if (res.success) {
            this.dataSource = this.dataSource.filter((user: any) => user.id !== row.id);
            this.resetTable();
          }
        });
      }
    });
  }

  resetTable(): void {
    this.dataSource = this.dataSource.sort((a: any, b: any) => a.id - b.id);
    this.table.renderRows();
  }

  ngAfterViewInit(): void {
    this.userService.getUsers().subscribe((res: any) => {
      if (res.success) {
        const roles = res.data.map((user: any) => this.userService.getRolesForUser(user.id));

        forkJoin(roles).subscribe((response: any) => {
          response.forEach((roleRes: any, index: number)=> {
            this.dataSource.push({
              id: res.data[index].id,
              username: res.data[index].username ?? '',
              email: res.data[index].email ?? '',
              firstName: res.data[index].fName ?? '',
              lastName: res.data[index].lName ?? '',
              lastOnline: res.data[index].lastOnline ?? '',
              created: res.data[index].created ?? '',
              roles: roleRes.data ?? null,
            });
          })
          this.resetTable();
          console.log(this.dataSource);
        });
      }
    });
  }

}
