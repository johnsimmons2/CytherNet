import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { IonButton, IonContent, IonRouterLink } from "@ionic/angular/standalone";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  standalone: true,
  imports: [
    CommonModule,
    IonRouterLink,
    RouterModule,
    IonContent,
    IonButton
  ]
})
export class AdminComponent {
  constructor(private router: Router) {
  }

  routeToUsers() {
    this.router.navigate(['admin/users']);
  }
}
