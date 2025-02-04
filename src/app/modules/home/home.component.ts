import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonButton, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonLabel, IonNote, IonPopover, IonTab, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { DownloadComponent } from 'src/app/common/components/download/download.component';
import { UserService } from 'src/app/common/services/user.service';
import { CharacterService } from 'src/app/common/services/character.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';


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
    IonButton,
    IonTabButton,
    IonLabel,
    IonNote,
    IonIcon,
    DownloadComponent
  ],
})
export class HomeComponent implements OnInit {

  navHistory: string[] = [];
  isTooltipVisible: boolean = false;

  constructor(private userService: UserService,
              private characterService: CharacterService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  get isAdmin(): boolean {
    return this.userService.hasRoleAdmin();
  }

  get isPlayer(): boolean {
    return this.userService.hasRolePlayer() || this.isAdmin;
  }

  get selectedCharacter() {
    return this.characterService.getSelectedCharacter();
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.navHistory.push(event.urlAfterRedirects);
      }
    });
  }

  goBack() {
    this.navHistory.pop();
    const url = this.navHistory.pop();
    if (url) {
      this.router.navigateByUrl(url);
    } else {
      this.router.navigateByUrl('/');
    }
  }

  previousUrl() {
    if (this.navHistory.length > 1) {
      return this.navHistory[this.navHistory.length - 2];
    }
    return null;
  }

  toggleToolTip() {

  }

}
