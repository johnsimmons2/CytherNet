import { Injectable } from "@angular/core";
import { Class } from "../model/class";

@Injectable({ providedIn: 'root' })
export class ClassService {
    private readonly CLASSES: Class[] = [
        {
            id: 1,
            name: "Barbarian",
            startingHp: 12,
            description: "A fierce warrior of primitive background who can enter a battle rage",
            subclasses: [
                {
                    name: "Path of Athe Ancestral Guardian",
                    description: "",
                }
            ]
          },
          {
            id: 2,
            name: "Bard",
            startingHp: 8,
            description: "An inspiring magician whose power echoes the music of creation",
            subclasses: [
                {
                    name: "College of Creation",
                    description: "",
                }
            ]
          },
          {
            id: 3,
            name: "Cleric",
            startingHp: 8,
            description: "A priestly champion who wields divine magic in service of a higher power",
            subclasses: [
                {
                    name: "Twilight Domain",
                    description: "",
                }
            ]
          },
          {
            id: 4,
            name: "Druid",
            startingHp: 8,
            description: "A priest of the Old Faith, wielding the powers of nature and adopting animal forms",
            subclasses: [
                {
                    name: "Circle of the Moon",
                    description: "",
                }
            ]
          },
          {
            id: 5,
            name: "Fighter",
            startingHp: 10,
            description: "A master of martial combat, skilled with a variety of weapons and armor",
            subclasses: [
                {
                    name: "Path of FUCK",
                    description: "",
                }
            ]
          }
    ]

    constructor() { }

    get classes() {
        return this.CLASSES;
    }
}