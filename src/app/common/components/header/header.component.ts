import { Component, OnInit } from "@angular/core";
import { IonButton, IonButtons, IonTitle, IonToolbar } from "@ionic/angular/standalone";
import { UserService } from "../../services/user.service";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
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

  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit() {
    this.authSubscription = this.userService.isAuthenticated$.pipe(
      tap((isAuth) => {
        this.authenticated = isAuth;
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

