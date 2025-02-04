import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonRow, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView } from "@ionic/angular/standalone";
/**
 *
 * Campaign notes that have no user ID and that have the tag "mechanics" show up in the rules page.
 *
 */


@Component({
  selector: 'app-encyclopedia',
  templateUrl: './encyclopedia.component.html',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonIcon,
    IonItem,
    IonLabel,
    IonButton,
    IonSegment,
    IonSegmentButton,
    IonSegmentContent,
    IonSegmentView
  ],
})
export class EncyclopediaComponent {

  collections: any[] = [
    {
      name: 'Items'
    },
    {
      name: 'Spells'
    },
    {
      name: 'Monsters'
    },
    {
      name: 'Rules'
    },
    {
      name: 'Feats'
    },
    {
      name: 'Classes'
    },
    {
      name: 'Races'
    },
    {
      name: 'Skills'
    },
    {
      name: 'Conditions'
    },
    {
      name: 'Damage Types'
    }
  ]

  constructor() {
  }
}
