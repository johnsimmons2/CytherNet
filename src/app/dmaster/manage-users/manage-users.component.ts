import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { User } from 'src/app/model/user';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements AfterViewInit {

  dataSource: User[] = [];
  xcolumns: string[] = ['id', 'username', 'email', 'lastOnline', 'created'];

  @ViewChild(MatTable) table!: MatTable<User>;

  constructor(private userService: UserService) { }

  ngAfterViewInit(): void {
    this.userService.getUsers().subscribe((res: any) => {
      if (res.success) {
        res.data.forEach((user: any) => {
          this.dataSource.push({
            id: user.id,
            username: user.username ?? '',
            email: user.email ?? '',
            firstName: user.fName ?? '',
            lastName: user.lName ?? '',
            lastOnline: user.lastOnline ?? '',
            created: user.created ?? ''
          });
        });
        this.table.renderRows();
      }
    });
  }

}
