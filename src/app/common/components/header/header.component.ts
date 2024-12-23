import { Component, OnInit } from "@angular/core";
import { IonButton, IonButtons, IonTitle, IonToolbar } from "@ionic/angular/standalone";
import { UserService } from "../../services/user.service";
import { CommonModule } from "@angular/common";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { take, tap } from "rxjs/operators";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [
    CommonModule,
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

  constructor(private userService: UserService, private router: Router) {
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

