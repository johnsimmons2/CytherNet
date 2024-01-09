export interface UserDto {
    id?: number;
    username?: string;
    email?: string;
    password?: string;
    fName?: string;
    lName?: string;
    token?: string;
}

export interface Role {
  id?: number;
  roleName?: string;
  level: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  lastOnline?: Date;
  created?: Date;
  roles?: Role[];
}
