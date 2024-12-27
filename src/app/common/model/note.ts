export interface Note {
  id: number;
  userId: number;
  characterId: number;
  campaignId: number;
  name: string;
  description: string;

  created: Date;
  updated: Date;
  active: boolean;

  creator?: string; // User name
  character?: string; // Character name
  shared_users?: number[]; // List of IDs
}
