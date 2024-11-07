export interface Skill {
    name: string;
    description: string;
}

export interface Spellbook {
    spellslot1: number;
    spellslot2: number;
    spellslot3: number;
    spellslot4: number;
    spellslot5: number;
    spellslot6: number;
    spellslot7: number;
    spellslot8: number;
    spellslot9: number;
    warlockslots: number;
    warlockslotlevel: number;
}

export interface Statsheet {
    id?: number;
    characterId?: number;
    exp: number;
    level: number;

    inspiration: boolean;

    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;

    health: number;
    proficiencies: string[];
    savingThrows: string[];
    skills: Skill[];
    spellbook: Spellbook;
}