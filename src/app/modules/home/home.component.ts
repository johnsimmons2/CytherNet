import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonIcon, IonLabel, IonTab, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { DownloadComponent } from 'src/app/common/components/download/download.component';
import { UserService } from 'src/app/common/services/user.service';
import { addIcons } from 'ionicons';
import { add, homeOutline, hammerOutline, bookOutline } from 'ionicons/icons';


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
    IonLabel,
    IonIcon,
    DownloadComponent
  ]
})
export class HomeComponent implements OnInit {

  constructor(private userService: UserService) {
    addIcons({ homeOutline, hammerOutline, bookOutline });
  }

  get isAdmin(): boolean {
    return this.userService.hasRoleAdmin();
  }

  ngOnInit(): void {
  }

}
