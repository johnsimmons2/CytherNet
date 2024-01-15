import { Component, Input} from "@angular/core";
import { SpinnerService } from "./spinner.service";

@Component({
    selector: 'app-loading-spinner',
    templateUrl: './loading-spinner.component.html',
    styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent {
    @Input() showSpinner: boolean = false;

    constructor() { }

}