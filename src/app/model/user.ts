export interface UserDto {
    id?: number;
    username: string;
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    token?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  lastOnline?: Date;
  created?: Date;
}
