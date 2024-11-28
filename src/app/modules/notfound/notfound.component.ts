import { Component } from "@angular/core";
import { IonContent, IonTitle } from "@ionic/angular/standalone";

@Component({
  selector: 'not-found',
  templateUrl: './notfound.component.html',
  standalone: true,
  imports: [
    IonContent,
    IonTitle
  ]
})
export class NotFoundComponent {

}
