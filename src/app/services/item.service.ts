import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Item {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/items`);
  }

  addItem(item: Omit<Item, 'id'>): Observable<Item> {
    return this.http.post<Item>(`${this.apiUrl}/items`, item);
  }
}