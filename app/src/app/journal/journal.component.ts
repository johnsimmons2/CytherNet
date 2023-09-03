import { Component } from "@angular/core";
import { UserService } from "../services/user.service";


@Component({
  selector: 'journal-app',
  templateUrl: './journal.component.html'
})
export class JournalComponent {

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

}
