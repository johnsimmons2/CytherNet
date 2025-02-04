import { User } from "mailtrap/dist/types/api/accounts";
import { Tag } from "./tag";

export interface Note {
  id?: number;
  userId?: number;
  characterId?: number;
  campaignId?: number;
  name: string;
  description: string;
  directory: string;
  active: boolean;

  created?: Date;
  updated?: Date;

  creator?: User; // User name
  character?: string; // Character name
  shared_users?: number[]; // List of IDs
  tags?: Tag[];
}
