import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonItem, IonLabel, IonList, IonRow, IonSearchbar, IonSelect, IonSelectOption } from "@ionic/angular/standalone";
import { TableComponent } from "../../../../common/components/table/table.component";


@Component({
  selector: 'app-all-feats',
  templateUrl: './all-feats.component.html',
  standalone: true,
  imports: [
    CommonModule,
    IonList,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonSearchbar,
    IonContent,
    IonCard,
    IonGrid,
    IonRow,
    IonCol,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    TableComponent
]
})
export class AllFeatsComponent {
  feats: any[] = [];

  constructor() {
  }
}
