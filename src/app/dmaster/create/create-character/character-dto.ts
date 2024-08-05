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

export interface CharacterDTO {
  // FORM 1
  name: string;
  level: number; // 1-20
  characterType: number; //0 = player, 1 = npc
  classId: number;
  subclassId: number;
  raceId: number;

  // FORM 2
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  skillIds: number[];
  savingThrows: string[];
  proficiencyIds: number[];
  backgrounds: string[];
  languages: string[];
}
