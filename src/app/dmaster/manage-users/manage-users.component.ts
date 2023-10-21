import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { User } from 'src/app/model/user';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';
import { forkJoin } from 'rxjs'


@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit, AfterViewInit {

  dataSource: User[] = [];
  xcolumns: string[] = ['id', 'username', 'email', 'lastOnline', 'created', 'roles'];

  @ViewChild(MatTable) table!: MatTable<User>;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.userService.getUsers().subscribe((res: any) => {
      if (res.success) {
        const roles = res.data.map((user: any) => this.userService.getRolesForUser(user.id));

        forkJoin(roles).subscribe((response: any) => {
          response.forEach((roleRes: any, index: number)=> {
            const roleNames: string[] = roleRes.success ? roleRes.data.map((role: any) => role.roleName) : [];
            this.dataSource.push({
              id: res.data[index].id,
              username: res.data[index].username ?? '',
              email: res.data[index].email ?? '',
              firstName: res.data[index].fName ?? '',
              lastName: res.data[index].lName ?? '',
              lastOnline: res.data[index].lastOnline ?? '',
              created: res.data[index].created ?? '',
              roles: roleNames.join(', ') ?? []
            });
          })
          this.table.renderRows();
        });
      }
    });
  }

}
