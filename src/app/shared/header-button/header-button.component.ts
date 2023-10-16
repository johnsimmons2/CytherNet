import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-button',
  templateUrl: './header-button.component.html',
  styleUrls: ['./header-button.component.scss']
})
export class HeaderButtonComponent implements OnInit {

  @Input() buttonName: string = '';
  @Input() isEnabled: boolean = false;
  @Input() buttonRoute: string = '';
  @Input() buttonIcon: string = '';
  @Input() buttonIconActive: string = '';

  constructor(private router: Router) { }

  get textColor(): string {
    return "warn";
  }

  get isActiveRoute(): boolean {
    return this.router.url === this.buttonRoute;
  }

  get calculatedIcon(): string {
    if (this.buttonIconActive === '') return this.buttonIcon;
    return this.buttonIconActive;
  }

  ngOnInit(): void {
  }

}
