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

}
