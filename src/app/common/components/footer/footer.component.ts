import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonHeader, IonItem, IonLabel, IonList, IonModal, IonNote, IonRow, IonTitle, IonToolbar } from "@ionic/angular/standalone";
import { UserService } from "../../services/user.service";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { take, tap } from "rxjs/operators";
import { ApiService } from "../../services/api.service";


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  imports: [
    CommonModule,
    IonToolbar,
    IonCardTitle,
    IonCardSubtitle,
    IonHeader,
    IonButton,
    RouterModule,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonModal,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonGrid,
    IonRow,
    IonCol
  ],
})
export class FooterComponent {

  public title: string = 'Cyther.online';

  @ViewChild(IonModal) modal!: IonModal;

  @Input() apiVersion!: string;
  @Input() appVersion!: string;
  @Input() browser!: string;
  @Input() browserVersion!: string;
  @Input() ipAddress!: string;
  @Input() operatingSystem!: string;
  @Input() platform!: string;

  constructor(private apiService: ApiService, private router: Router) {
  }

  close() {
    this.modal.dismiss(null, 'cancel');
  }
}

