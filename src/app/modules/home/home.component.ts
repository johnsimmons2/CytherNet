import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonTab, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { DownloadComponent } from 'src/app/common/components/download/download.component';
import { UserService } from 'src/app/common/services/user.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonTabs,
    IonTabBar,
    IonToolbar,
    IonContent,
    IonTabButton,
    DownloadComponent
  ]
})
export class HomeComponent implements OnInit {

  constructor(private userService: UserService) { }

  get isAdmin(): boolean {
    return this.userService.hasRoleAdmin();
  }

  ngOnInit(): void {
  }

}
