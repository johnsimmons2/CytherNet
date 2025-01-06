import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ApiService } from './api.service';
import jwtDecode from 'jwt-decode';
import { Character } from '../model/character';
import { DatabaseService } from './database.service';
import { BaseService } from './base.service';


@Injectable({ providedIn: 'root' })
export class CharacterService extends BaseService<Character>{
  constructor(
      private router: Router,
      protected override database: DatabaseService,
      protected override apiService: ApiService
  ) {
    super(database, apiService);
  }

  protected override getTableName(): string {
    return 'characters';
  }

  updateUserCharacter(userId: number, characterId: number) {
    return this.apiService.patch(`characters/users/${userId}`, { userId: userId, characterId: characterId });
  }

  getSelectedCharacter() {
    const characterId = localStorage.getItem('selectedCharacterId');
    const character = localStorage.getItem('selectedCharacter');
    return character && characterId ? {name: character, id: characterId} : null;
  }

  selectCharacter(character: Character) {
    localStorage.setItem('selectedCharacterId', character.id!.toString());
    localStorage.setItem('selectedCharacter', character.name.toString());
  }

  getCharacter(id: number) {
    return this.get(`characters/${id}`, { id: id });
  }

  getCharacterByName(name: string) {
    return this.get(`characters/${name}`, { name: name });
  }

  getCharacters() {
    return this.getAll(`characters`);
  }

  getCharactersForUser(username: string) {
    return this.getAll(`characters?username=${username}`);
  }

  /*
  * SECTION: Online mode only code
  */

  getAllPlayerCharacters() {
    return this.apiService.get('characters/player');
  }

  getAllNPCCharacters() {
    return this.apiService.get('characters/npc');
  }

  getAllCharacters() {
    return this.apiService.get('characters/users');
  }

  getCharacterHitDice(username: string) {
    // TODO: Get the hit dice from the api based on the character ID not the username.
    return this.apiService.get('characters/player');
  }

}
