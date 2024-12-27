import { Component, OnInit } from "@angular/core";
import { IonAvatar, IonButton, IonButtons, IonChip, IonIcon, IonLabel, IonTitle, IonToolbar } from "@ionic/angular/standalone";
import { UserService } from "../../services/user.service";
import { CommonModule } from "@angular/common";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { take, tap } from "rxjs/operators";
import { addIcons } from 'ionicons';
import { personOutline } from "ionicons/icons";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [
    CommonModule,
    IonIcon,
    IonChip,
    IonLabel,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    RouterModule
  ],
})
export class HeaderComponent implements OnInit {

  public title: string = 'Cyther.online';

  private authSubscription: any;

  authenticated: boolean = false;
  onAbout: boolean = false; // Do not display a link to the about page if we are already here
  onProfile: boolean = false; // Do not display a link to the profile page if we are already here

  get username() {
    return this.userService.getCurrentUsername();
  }

  constructor(private userService: UserService, private router: Router) {
    addIcons({ personOutline });
  }

  ngOnInit() {
    this.authSubscription = this.userService.isAuthenticated$.pipe(
      tap((isAuth) => {
        this.authenticated = isAuth;
      })
    ).subscribe();

    this.router.events.pipe(
      tap((event) => {
        if (event instanceof NavigationEnd) {
          this.onAbout = event.url === '/about';
          this.onProfile = event.url === '/profile';
        }
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

  logout() {
    this.userService.logout();
  }

}

