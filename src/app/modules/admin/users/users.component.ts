import { CommonModule } from "@angular/common";
import { Component, ViewChild, TemplateRef, AfterViewInit } from "@angular/core";
import { IonButton, IonSelectOption, IonCard, IonLabel, IonCardContent, IonCol, IonContent, IonGrid, IonInput, IonItem, IonRow, IonSelect, IonList } from "@ionic/angular/standalone";
import { Role, User } from "src/app/common/model/user";
import { UserService } from "src/app/common/services/user.service";
import { TableComponent } from "src/app/common/components/table/table.component";
import { TableActon } from "src/app/common/components/table/table.actions";
import { from, map, mergeMap, of, tap, toArray } from "rxjs";
import { ApiResult } from "src/app/common/model/apiresult";
import { TableValueChangeEvent } from "src/app/common/components/table/tablevaluechanges.event";
import { TableColumn } from "src/app/common/components/table/table.column";
import { FormsModule } from "@angular/forms";
import { ToastService } from "src/app/common/services/toast.service";


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonGrid,
    IonList,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonLabel,
    IonRow,
    IonCol,
    IonButton,
    IonCard,
    IonCardContent,
    TableComponent
  ]
})
export class UsersComponent implements AfterViewInit {

  @ViewChild('rolesTemplate') rolesTemplate!: TemplateRef<any>;
  @ViewChild(TableComponent) table!: TableComponent;

  roleOptions: Role[] = [];
  users: User[] = [];
  cols: TableColumn[] = [
    {
      name: 'id',
    },
    {
      name: 'username',
      canEdit: (index) => !this.isUserAdmin(index)
    },
    {
      name: 'email',
      canEdit: (index) => !this.isUserAdmin(index)
    },
    {
      name: 'fName',
      canEdit: (index) => !this.isUserAdmin(index),
      alias: 'first name'
    },
    {
      name: 'lName',
      canEdit: (index) => !this.isUserAdmin(index),
      alias: 'last name'
    },
    {
      name: 'roles',
      canEdit: (index) => !this.isUserAdmin(index),
      customTemplate: this.rolesTemplate
    }
  ];

  constructor(private userService: UserService, private toastService: ToastService) {
  }

  closeModal() {
    this.table.modal.dismiss(null, 'close');
  }

  ngAfterViewInit() {
    const roles = this.cols.find(x => x.name === 'roles');
    roles!.customTemplate = this.rolesTemplate;
  }

  confirmRoleChange(row: User) {
    try {
      console.log('hi');
      this.userService.updateUserRoles(row.id!, row.roles!).pipe(
        tap((res: ApiResult) => {
          if (res.success) {
            this.toastService.show({
              message: res.message ?? 'Roles updated',
              type: 'success',
            });
            this.table.modal.dismiss(null, 'saved');
          } else {
            this.toastService.show({
              message: 'An error occurred',
              type: 'warning',
            });
          }
        })
      ).subscribe();
    } catch (e) {
      console.error(e);
    }
  }

  compareRoleFn(o1: any, o2: any): boolean {
    return o1.id === o2.id;
  }

  getTableActions(): TableActon[] {
    return [
      {
        label: 'Reset',
        disabled: (index) => this.isUserAdmin(index),
        color: 'primary',
        action: (index) => this.resetPassword(index)
      },
      {
        label: 'Delete',
        disabled: (index) => this.isUserAdmin(index),
        color: 'secondary',
        action: (index) => this.deleteUser(index)
      }
    ];
  }

  getUsersWithRoles() {
    this.userService.getUsers().pipe(
      mergeMap((users: User[]) =>
        from(users).pipe(
          tap((user: User) => console.log(user)),
          mergeMap((user: User) =>

            this.userService.getRolesForUser(user.id!).pipe(
              map((result: ApiResult) => result.data),
              map((roles: Role[]) => ({
                id: user.id,
                username: user.username,
                email: user.email,
                fName: user.fName,
                lName: user.lName,
                token: user.token,
                roles: roles
              }))
            )
          ),
          tap((user: User) => {
            this.users.push(user);
          }),
          tap(() => {
            this.users = this.users.sort((a, b) => a.id! - b.id!);
          })
        )
      )
    ).subscribe();
  }

  ngOnInit() {
    this.getUsersWithRoles();

    this.userService.getAllRoles().pipe(
      map((res: ApiResult) => {
        console.log(res);
        return res.data;
      }),
      tap((roles: Role[]) => {
        console.log(roles);
        this.roleOptions = roles;
      })
    ).subscribe();
  }

  isUserAdmin(index: number): boolean {
    return this.users[index].username === 'admin' ? true : false;
  }

  resetPassword(index: number) {
    console.log(index);
    const user = this.users[index].id!;
    this.userService.resetPasswordLink(this.users.find(x => x.id === user)).pipe(
      tap((res: ApiResult) => {
        if (res.success) {
          this.toastService.show({
            message: 'Password reset created in console ',
            type: 'success',
          });
          console.log(res);
        } else {
          this.toastService.show({
            message: res.errors?.join(', ') ?? 'An error occurred',
            type: 'warning',
          });
        }
      })
    ).subscribe();
  }

  deleteUser(index: number) {
    const user = this.users[index].id!;
    console.log(user);
    this.userService.deleteUser(user).pipe(
      tap((res: ApiResult) => {
        if (res.success) {
          this.users = this.users.filter(u => u.id !== user);
          this.toastService.show({
            message: 'User deleted',
            type: 'success',
          })
        } else {
          this.toastService.show({
            message: res.errors?.join(', ') ?? 'An error occurred',
            type: 'warning',
          });
        }
      })
    ).subscribe();
  }

  saveChanges(event: TableValueChangeEvent) {
    try {
      const newValue = event.value;
      event.data[event.column] = newValue;
      const user: User = event.data;
      this.userService.updateUser(user).pipe(
        tap((res: ApiResult) => {
          if (res.success) {
            this.users = [];
            this.getUsersWithRoles();
            this.toastService.show({
              message: 'User updated',
              type: 'success',
            });
          } else {
            this.toastService.show({
              message: res.errors?.join(', ') ?? 'An error occurred',
              type: 'warning',
            });
          }
        })
      ).subscribe()
    } catch (e) {
      this.toastService.show({
        message: 'An exception has ocurred: ' + e,
        type: 'warning',
      });
    }
  }
}
