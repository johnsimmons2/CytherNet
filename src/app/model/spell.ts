export interface SpellComponent {
  id: number;
  spellId: number;
  itemId: number;
  quantity: number;
  goldValue: number;
}

export interface Spell {
  id: number;
  spellComponentId: number;
  name: string;
  castingTime: string;

  //DEPRECATED
  type: number;
  ritual: boolean;

  level: number;
  verbal: boolean;
  somatic: boolean;
  material: boolean;
}
