import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonContent, IonCardHeader, IonCard, IonCardTitle, IonCardContent, IonText, IonItem, IonButton, IonIcon, IonCardSubtitle, IonNote, IonInput, IonModal, IonToast } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { warningOutline } from "ionicons/icons";


@Component({
  selector: 'app-connection-status',
  templateUrl: './connectionstatus.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonCardHeader,
    IonCard,
    IonCardTitle,
    IonCardContent,
    IonText,
    IonItem,
    IonButton,
    IonIcon,
    IonCardSubtitle,
    IonNote,
    IonInput,
    IonModal,
    RouterModule,
    IonToast
  ],
  styles: [`
    :host {
      display: flex; /* Align the button with the parent flex layout */
      align-items: center;
      justify-content: center;

      /* Explicitly size the component */
      width: 20px;
      height: 20px;
      margin: 0;
      padding: 0;
    }

    ion-button {
      /* Control button size */
      width: 20px;
      height: 20px;
      padding: 0;
      margin: 0;

      /* Round the button */
      --border-radius: 50%;

      /* Inner button styles */
      ::part(native) {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        border-radius: 50%;
      }

      /* Adjust icon size */
      ion-icon {
        width: 16px;
        height: 16px;
        font-size: 16px;
      }
    }
  `]
})
export class ConnectionStatusComponent {

  constructor() {
    addIcons({ warningOutline });
  }

  get isOnline() {
    return navigator.onLine;
  }
}
