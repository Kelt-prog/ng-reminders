import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  localStorage: Storage;

  changes$ = new Subject();

  constructor() {
    this.localStorage = window.localStorage;
  }

  get(key: string): any {
    if (this.isLocalStorageSupported) {
      return JSON.parse(this.localStorage.getItem(key));
    }

    return null;
  }

  set(name: string, id: string): boolean {
    if (this.isLocalStorageSupported) {
      const userData = { name, id };
      this.localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }

    return false;
  }

  remove(key: string): boolean {
    if (this.isLocalStorageSupported) {
      this.localStorage.removeItem(key);
      return true;
    }

    return false;
  }

  get isLocalStorageSupported(): boolean {
    return !!this.localStorage;
  }
}
