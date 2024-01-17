import { Component, EventEmitter, Input, Output, TemplateRef } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html'
})
export class ToolbarComponent {


    @Input() currentTitle: string = 'CytherNet';
    @Input() opened: boolean = false;
    @Output() navToggleChange = new EventEmitter<boolean>();

    constructor(private userService: UserService, private router: Router) {}

    get isLoggedIn() {
        return this.userService.isAuthenticated();
    }

    get isAdmin() {
        return this.userService.hasRoleLevel(0);
    }

    get isPlayer() {
        return this.userService.hasRoleLevel(1);
    }

    routeTo(route: string) {
        this.router.navigate([route]).then(() => {
            this.opened = false;
        });
    }

    logout() {
        localStorage.removeItem('username');
        localStorage.removeItem('jwtToken');

        this.navToggleChange.emit(false); // Close the sidenav; it could remain open after logging out.
        this.routeTo('login');
    }

    toggleNav() {
        this.opened = !this.opened;
        this.navToggleChange.emit(this.opened);
    }
}
