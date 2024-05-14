export interface SpellComponent {
  id?: number;
  spellId: number;
  itemId: number;
  quantity: number;
  goldValue: number;
}

export interface Spell {
  id: number;
  name: string;
  castingTime: string;
  description: string;
  duration: string;
  school: string;
  range: string;
  level: number;

  ritual: boolean;
  verbal: boolean;
  somatic: boolean;
  material: boolean;
  concentration: boolean;

  components: SpellComponent;
}
