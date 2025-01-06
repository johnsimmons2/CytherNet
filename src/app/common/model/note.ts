import { User } from "mailtrap/dist/types/api/accounts";

export interface Note {
  id: number;
  userId: number;
  characterId: number;
  campaignId: number;
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


export interface Tag {
  id: number;
  userId: number;
  name: string;
  description: string;
  created: Date;
  updated: Date;
  active: boolean;

  creator?: User;
  sharedUsers?: User[];
}
