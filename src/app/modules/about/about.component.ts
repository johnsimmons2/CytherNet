import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonItem, IonLabel, IonList } from "@ionic/angular/standalone";
import { environment } from "src/environments/environment";

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
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

    changeLog: any[] = [{
      version: '0.0.1',
      description: 'Initial release',
      id: 1,
    },
    {
      version: '0.0.2 - 0.0.3',
      description: 'CRUD operations and role based authentication. Database recovery / revision system.',
      id: 2,
    },
    {
      version: '0.0.3 - 0.0.5',
      description: 'Characters, races, spells, monsters, items; dungeon master administration screen.',
      id: 3,
    },
    {
      version: '0.0.6',
      description: 'Password retreival via email and password reset form.',
      id: 4,
    },
    {
      version: '0.1.X (beta / current)',
      description: 'Major refactor, theme change, android mobile platform support, offline mode.',
      id: 5,
    }
  ];

  constructor() {
    this.version = environment.version;
  }
}
