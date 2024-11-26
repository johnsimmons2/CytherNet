import { Component } from "@angular/core";
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonItem, IonLabel, IonList } from "@ionic/angular/standalone";

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    standalone: true,
    imports: [
      IonContent,
      IonCardHeader,
      IonCard,
      IonCardTitle,
      IonCardSubtitle,
      IonCardContent,
      IonList,
      IonItem,
      IonLabel
    ]
})
export class AboutComponent {
    //TODO get the version from the package.json
    version: string = '0.0.3';

}
