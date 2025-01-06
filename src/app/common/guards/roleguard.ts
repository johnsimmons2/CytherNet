import { LowerCasePipe } from "@angular/common";
import { CanActivateFn } from "@angular/router";

export const RoleGuard: CanActivateFn = (route, state) => {
  const rolesJson = localStorage.getItem('roles') ?? '[]';
  const roles = JSON.parse(rolesJson) as Array<{ level: number; roleName: string}>;
  const queryRoles = (route.data['roles'] as Array<string>).map(x => x.toLowerCase()) ?? [];

  const isAdmin = roles.some(role => queryRoles.includes(role.roleName.toLowerCase()));
  const isAuthenticated = localStorage.getItem('jwtToken') !== null;

  return isAdmin && isAuthenticated;
};
