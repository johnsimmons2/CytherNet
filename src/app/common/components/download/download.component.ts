import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { IonButton, IonCard, IonCardHeader, IonCardTitle, IonModal, IonTitle, IonToolbar } from "@ionic/angular/standalone";
import { UserService } from "../../services/user.service";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { take, tap } from "rxjs/operators";
import { PlatformService } from "../../services/platform.service";


@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  standalone: true,
  imports: [
    CommonModule,
    IonToolbar,
    IonTitle,
    IonButton,
    RouterModule,
    IonModal,
    IonCard,
    IonCardHeader,
    IonCardTitle
  ],
})
export class DownloadComponent implements AfterViewInit {

  @ViewChild(IonModal) modal!: IonModal;

  constructor(private userService: UserService, private router: Router, private platformService: PlatformService) {
  }

  ngAfterViewInit() {
    if (this.platformService.operatingSystem === 'Android') {
      this.modal.present();
    }
  }

  tryDownload() {
    const link = document.createElement('a');
    link.href = '/assets/android-cyther.apk';
    link.download = 'android-cyther.apk';
    link.click();
    this.modal.dismiss();
  }

  close() {
    this.modal.dismiss(null, 'cancel');
  }

}

