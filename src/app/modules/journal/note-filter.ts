export interface NoteFilter {
  type: NoteFilterType;
  id: string;
  name: string;
  owner: string;
  tags: string[];
  directory: string;
}

export enum NoteFilterType {
  USERS='users',
  CAMPAIGNS='campaigns',
  CHARACTERS='characters',
}
