import { Component } from "@angular/core";
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonItem, IonLabel, IonList, IonRow } from "@ionic/angular/standalone";

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  standalone: true,
  imports: [
    IonContent,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonList,
    IonGrid,
    IonRow,
    IonCol,
    IonLabel,
    IonItem
  ]
})
export class ShopComponent {
  constructor() {

  }
}
