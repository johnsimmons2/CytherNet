import { Component } from "@angular/core";

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
})
export class AboutComponent {
    //TODO Version control service
    version: string = '0.0.1';
    
}