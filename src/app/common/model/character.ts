export interface Character {
  id: number;
  name: string;
  classId: number;
  subclassId: number;
  statsheetId: number;
  raceId: number;
  campaignCompatability: string;
  languages: string;
  speed: number;
  type: number;
  proficiencybonus: number;

  userId?: number;
}

export interface CharacterDto {
  id?: number;
  name: string;
  class: string;
  subclass: string;
  race: string;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  level: number;
  experience: number;
  health: number;
  armorclass: number;
  initiative: number;
  speed: number;
  proficiencybonus: number;

  // 0 player, 1 npc
  type?: number;
}
