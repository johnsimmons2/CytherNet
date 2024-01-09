import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Role, User, UserDto } from 'src/app/model/user';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';
import { forkJoin, mergeMap, map } from 'rxjs'
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationModal } from 'src/app/shared/confirmation-modal/confirmation-modal.component';
import { FormControl, Validators } from '@angular/forms';
import { TupleType } from 'typescript';
import { Router } from '@angular/router';
import { ApiResult } from 'src/app/model/apiresult';

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
    let modal: MatDialogRef<ConfirmationModal> = this.modal.open(ConfirmationModal, {
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
    this.userService.getUsers().pipe(
      mergeMap((res: ApiResult) => {
        const userWithRoles = res.data.map((user: User) => {
          return this.userService.getRolesForUser(user.id).pipe(
            map((roles: Role[]) => ({ user, roles }))
          );
        });
        return forkJoin(userWithRoles);
      })
    ).subscribe({
      next: (data: any) => {
        if (data !== undefined && Array.isArray(data)) {
          data.forEach((userWithRoles: any) => {
            this.dataSource.push({
              id: userWithRoles.user.id,
              username: userWithRoles.user.username ?? '',
              email: userWithRoles.user.email ?? '',
              firstName: userWithRoles.user.fName ?? '',
              lastName: userWithRoles.user.lName ?? '',
              lastOnline: userWithRoles.user.lastOnline ?? '',
              created: userWithRoles.user.created ?? '',
              roles: userWithRoles.roles.data ?? null,
            });
          });
        }
        this.resetTable();
      },
      error: (err: any) => {
        console.log(err);
        console.log('error in the table');
      }
    });
  }


}
