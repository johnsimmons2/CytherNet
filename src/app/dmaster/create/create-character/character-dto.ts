export interface CharacterDescriptionDTO {
  age: string;
  height: string;
  weight: string;
  eyes: string;
  skin: string;
  hair: string;
  background: string;
  appearance: string;
  bonds: string;
  ideals: string;
  personality: string;
  flaws: string;
  religion: string;
  backstory: string;
}

export interface StatsheetDTO {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface SpellbookDTO {
  cantripIds: number[];
  knownSpellIds: number[];
  preparedSpellIds: number[];
}

export interface CharacterDTO {
  // FORM 1
  name: string;
  classId: number;
  subclassId: number | null;
  raceId: number;
  type: number; //0 = player, 1 = npc
  speed: number;
  // FORM 2
  languages: string;
  stats: StatsheetDTO;
  spellbook: SpellbookDTO;
  savingThrows: string[];
  skillIds: number[];
  proficiencies: string[];
  description: CharacterDescriptionDTO;
  hitDiceShape: number | null;
}
