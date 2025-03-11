import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Recipe {
  id: number;
  title: string;
  ingredients: string[];
  instructions: string;
  cookingTime: number;
  difficulty: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = '/api/recipes';

  constructor(private http: HttpClient) {}

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiUrl);
  }

  getRecipe(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`);
  }

  addRecipe(recipe: Omit<Recipe, 'id'>): Observable<Recipe> {
    return this.http.post<Recipe>(this.apiUrl, recipe);
  }
} 