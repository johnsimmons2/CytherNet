import { Note } from "./note";
import { User } from "./user";

export interface ParsedNote {
  id?: number;
  name: string;
  rawText: string;
  parsedParts: ParsedNotePart[];
  created: Date;
  updated: Date;
  directory: string;
  active: boolean;

  note?: Note;
  creator?: User;
  creatorUsername?: string;
}

export interface ParsedNotePart {
  type: 'text' | 'reference';
  value: string | IParsedNoteReference;
  noteReference?: IParsedNoteReference;
}

export interface IParsedNoteReference {
  displayText: string;
  id: number;
  tableName: 'USERS' | 'CHARACTERS' | 'CAMPAIGNS' | 'unknown';
  fieldName: 'name' | 'id' | 'unknown';
  field: string;
  rawText: string;
}
