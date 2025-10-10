import { CanActivateFn } from "@angular/router";
import { UserService } from "../services/user.service";
import { inject } from "@angular/core";

export const RoleGuard: CanActivateFn = (route, state) => {
    const authService = inject(UserService);
    const queryRoles = (route.data['roles'] as Array<string>).map(x => x.toLowerCase()) ?? [];
    return authService.userHasRoles(queryRoles);
};
