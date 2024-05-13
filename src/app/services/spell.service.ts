import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';


@Injectable({ providedIn: 'root' })
export class SpellService {
  constructor(
      private router: Router,
      private apiService: ApiService
  ) {}

  getSpells() {
    return this.apiService.get('spells');
  }
}
