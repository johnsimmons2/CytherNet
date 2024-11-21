import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Spell } from '../model/spell';
import { ApiResult } from '../model/apiresult';


@Injectable({ providedIn: 'root' })
export class SpellService {
  constructor(
      private router: Router,
      private apiService: ApiService
  ) {}

  spells: BehaviorSubject<Spell[]> = new BehaviorSubject<Spell[]>([]);

  get spells$(): Observable<Spell[]> {
    return (this.spells.getValue() && this.spells.getValue().length > 0) ?
      this.spells.asObservable() :
      this.getSpells().pipe(
        map((x: ApiResult) => x.data as Spell[]),
        tap(tappedData => this.spells.next(tappedData))
      );
  }

  getSpells() {
    return this.apiService.get('spells');
  }

  get(id: number) {
    return this.apiService.get(`spells/${id}`);
  }

  update(id: number, spell: Spell) {
    return this.apiService.patch(`spells/${id}`, spell);
  }

  create(spell: Spell) {
    return this.apiService.post('spells', spell);
  }
}
