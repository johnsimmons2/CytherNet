import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonIcon, IonItem, IonLabel, IonList, IonSearchbar, IonSelect, IonSelectOption } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { listCircleOutline } from "ionicons/icons";


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonList,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonSearchbar,
    IonContent,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonButton,
    IonCardSubtitle,
    IonCardTitle,
    IonIcon,
  ]
})
export class ContentComponent {
  constructor() {
    addIcons({ listCircleOutline });
  }
}
