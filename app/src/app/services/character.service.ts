import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from '../model/user';
import { ApiService } from './api.service';
import jwtDecode from 'jwt-decode';


@Injectable({ providedIn: 'root' })
export class CharacterService {
  constructor(
      private router: Router,
      private apiService: ApiService
  ) {}

  getCharacters() {
    return this.apiService.get('characters/player');
  }

  getCharacterHitDice(username: string) {
    // TODO: Get the hit dice from the api based on the character ID not the username.
    return this.apiService.get('characters/player');
  }

}
