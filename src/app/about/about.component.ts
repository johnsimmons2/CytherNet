import { Component } from "@angular/core";

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
})
export class AboutComponent {
    //TODO get the version from the package.json
    version: string = '0.0.3';

}
