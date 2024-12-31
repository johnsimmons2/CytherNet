import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonLabel, IonRow } from "@ionic/angular/standalone";
import { CharacterCardComponent } from "src/app/common/components/characterCard/charactercard.component";
import { Character } from "src/app/common/model/character";
import { CharacterService } from "src/app/common/services/character.service";


@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    CharacterCardComponent,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol
  ]
})
export class CharactersComponent implements OnInit{

  characters: Character[] = [];

  constructor(private characterService: CharacterService) {
  }

  ngOnInit(): void {
    this.characterService.getCharacters().subscribe((characters) => {
      this.characters = characters;
    });
  }
}
