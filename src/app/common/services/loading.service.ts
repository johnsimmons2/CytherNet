import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class LoadingService {
  private _loading: boolean = false;

  get loading() {
    return this._loading;
  }

  set loading(value: boolean) {
    this._loading = value;
  }
}
