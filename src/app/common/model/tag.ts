import { User } from "./user";

export interface Tag {
  id?: number;
  userId?: number;
  name: string;
  description: string;
  created: Date;
  updated: Date;
  active: boolean;
  color: string;
  icon: string;

  creator?: User;
  sharedUsers?: User[];
}
