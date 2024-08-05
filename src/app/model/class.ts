export interface Class {
  id?: number;
  name: string;
  description: string;
  spellCastingAbility?: string;
  startingHp?: number;
  subclasses?: Subclass[];
}

export interface Subclass {
  id?: number;
  name: string;
  description: string;
}
