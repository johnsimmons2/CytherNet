import { Component } from "@angular/core";
import { IonicModule } from "@ionic/angular";

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    standalone: true,
    imports: [
      IonicModule
    ]
})
export class AboutComponent {
    //TODO get the version from the package.json
    version: string = '0.0.3';

}
