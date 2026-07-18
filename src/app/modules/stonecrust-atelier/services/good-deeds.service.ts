import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface GoodDeed {
  id: number;
  name: string;
  email: string;
  story: string;
  ratingCount: number;
  isPreviousWeekWinner: boolean;
  createdDate: string;
}

const STORAGE_KEY = 'good_deeds_data_v1';

@Injectable({ providedIn: 'root' })
export class GoodDeedsService {
  private seedPath = 'assets/good-deeds.json';

  constructor(private http: HttpClient) {}

  private saveToStorage(items: GoodDeed[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  private loadFromStorage(): GoodDeed[] | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as GoodDeed[]) : null;
  }

  loadAll(): Observable<GoodDeed[]> {
    const fromStorage = this.loadFromStorage();
    if (fromStorage) {
      return of(fromStorage);
    }
    return this.http.get<GoodDeed[]>(this.seedPath).pipe(
      map((list) => {
        this.saveToStorage(list);
        return list;
      }),
    );
  }

  addStory(
    payload: Omit<
      GoodDeed,
      'id' | 'ratingCount' | 'isPreviousWeekWinner' | 'createdDate'
    >,
  ): Observable<GoodDeed> {
    const items = this.loadFromStorage() || [];
    const id = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    const newItem: GoodDeed = {
      id,
      name: payload.name,
      email: payload.email,
      story: payload.story,
      ratingCount: 0,
      isPreviousWeekWinner: false,
      createdDate: new Date().toISOString(),
    };
    items.unshift(newItem);
    this.saveToStorage(items);
    return of(newItem);
  }

  updateRating(id: number, delta = 1): Observable<GoodDeed | null> {
    const items = this.loadFromStorage() || [];
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return of(null);
    items[idx].ratingCount = (items[idx].ratingCount || 0) + delta;
    this.saveToStorage(items);
    return of(items[idx]);
  }

  maskEmail(email: string): string {
    const parts = email.split('@');
    if (parts.length !== 2) return email;
    const name = parts[0];
    const domain = parts[1];
    const visible = Math.min(4, Math.max(1, Math.floor(name.length / 2)));
    return name.substring(0, visible) + '*****@' + domain;
  }
}
