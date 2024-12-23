import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { IonButton, IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  standalone: true,
  imports: [
    IonContent,
    IonButton
  ]
})
export class AdminComponent {
  constructor(private router: Router) {
  }

  routeToUsers() {
    this.router.navigate(['/admin/users']);
  }
}
