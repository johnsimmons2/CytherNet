import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserDto } from '../model/user';
import { ApiService } from './api.service';
import jwtDecode from 'jwt-decode';


@Injectable({ providedIn: 'root' })
export class CharacterService {
  constructor(
      private router: Router,
      private apiService: ApiService
  ) {}

  getCharacter(id: number) {
    return this.apiService.get(`characters/${id}`);
  }

  getCharacterByName(name: string) {
    return this.apiService.get(`characters/${name}`);
  }

  getPlayerCharacters(username: string) {
    return this.apiService.get(`characters`, { params: { username: username } });
  }

  getAllPlayerCharacters() {
    return this.apiService.get('characters/player');
  }

  getAllNPCCharacters() {
    return this.apiService.get('characters/npc');
  }

  getAllCharacters() {
    return this.apiService.get('characters');
  }

  getCharacterHitDice(username: string) {
    // TODO: Get the hit dice from the api based on the character ID not the username.
    return this.apiService.get('characters/player');
  }

}
