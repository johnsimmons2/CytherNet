import { Component, Input, TemplateRef } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html'
})
export class ToolbarComponent {

    opened: boolean = false;
    currentTitle: string = 'CytherNet';

    @Input() content!: TemplateRef<any>;
    
    constructor(private userService: UserService, private router: Router) {}

    get isLoggedIn() {
        return this.userService.isAuthenticated();
    }

    get isAdmin() {
        return this.userService.isAdmin();
    }

    get isPlayer() {
        return this.userService.isPlayer();
    }

    routeTo(route: string) {
        this.router.navigate([route]).then(() => {
            this.opened = false;
        });
    }

    logout() {
        localStorage.removeItem('username');
        localStorage.removeItem('jwtToken');
        this.routeTo('login');
    }

    toggleNav() {
        this.opened = !this.opened;
    }
}