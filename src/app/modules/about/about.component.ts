import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonItem, IonLabel, IonList } from "@ionic/angular/standalone";
import { ApiService } from "src/app/common/services/api.service";
import { environment } from "src/environments/environment";

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    standalone: true,
    imports: [
      CommonModule,
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
    version: string = '';
    apiVersion: string = '';
    features: { [key: string]: any[] } = {};
    changeLog: any[] = [];

  constructor(private http: HttpClient, private apiService: ApiService) {
    this.version = environment.version;
    this.http.get('assets/features.json', { responseType: 'json' }).subscribe((data: any) => {
      this.features = data;
    });
    this.http.get('assets/changelog.json', { responseType: 'json' }).subscribe((data: any) => {
      this.changeLog = data;
    });
    this.version = environment.version;
    this.apiService.healthCheck().subscribe((res) => {
      this.apiVersion = res.data;
    });
  }
}
