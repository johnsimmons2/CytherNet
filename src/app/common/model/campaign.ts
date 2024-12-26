import { Character } from "./character";
import { User } from "./user";

export interface Campaign {
  id?: number;
  description: string;
  name: string;
  created: Date;
  updated: Date;
  active: boolean;
  characters: Character[];
  users: User[];
}
