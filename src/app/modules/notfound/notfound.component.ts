import { Component } from "@angular/core";
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonTitle } from "@ionic/angular/standalone";

@Component({
  selector: 'not-found',
  templateUrl: './notfound.component.html',
  standalone: true,
  imports: [
    IonCard,
    IonContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent
  ]
})
export class NotFoundComponent {
}
