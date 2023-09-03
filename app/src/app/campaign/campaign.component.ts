import { Component } from "@angular/core";
import { UserService } from "../services/user.service";


@Component({
  selector: 'campaign-app',
  templateUrl: './campaign.component.html'
})
export class CampaignComponent {

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

}
