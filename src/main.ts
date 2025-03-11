import { Component, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemService, Item } from './app/services/item.service';
import { RecipeService, Recipe } from './app/services/recipe.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <header class="header">
        <h1>Recipe Architect</h1>
        <p class="subtitle">Culinary Composition Platform</p>
      </header>

      <main class="main-content">
        <section class="creation-panel">
          <h2 class="section-title">Compose New Recipe</h2>
          <form (ngSubmit)="addRecipe()" class="recipe-form">
            <div class="form-group">
              <input type="text" [(ngModel)]="newRecipe.title" name="title" 
                     placeholder="Recipe title" class="form-input"
                     required>
            </div>
            <div class="form-group">
              <textarea [(ngModel)]="newRecipe.ingredients" name="ingredients"
                        placeholder="Ingredients (comma separated)"
                        class="form-textarea"></textarea>
            </div>
            <div class="form-group">
              <textarea [(ngModel)]="newRecipe.instructions" name="instructions"
                        placeholder="Step-by-step instructions"
                        class="form-textarea"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Duration</label>
                <input type="number" [(ngModel)]="newRecipe.cookingTime" 
                       name="cookingTime" class="form-input compact">
              </div>
              <div class="form-group">
                <label class="form-label">Complexity</label>
                <select [(ngModel)]="newRecipe.difficulty" name="difficulty"
                        class="form-select">
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
            </div>
            <button type="submit" class="primary-btn">
              Commit Recipe
            </button>
          </form>
        </section>

        <section class="library-section">
          <h2 class="section-title">Recipe Library</h2>
          <div class="grid-container">
            <div *ngFor="let recipe of recipes" 
                 class="recipe-card"
                 (click)="showRecipeDetails(recipe.id)">
              <div class="card-header">
                <h3 class="card-title">{{ recipe.title }}</h3>
                <div class="meta-group">
                  <span class="meta-tag">{{ recipe.cookingTime }}′</span>
                  <span class="meta-tag">{{ recipe.difficulty }}</span>
                </div>
              </div>
              <ul class="ingredient-preview">
                <li *ngFor="let ingredient of recipe.ingredients.slice(0,3)" 
                    class="ingredient-item">
                  {{ ingredient }}
                </li>
                <li *ngIf="recipe.ingredients.length > 3" class="more-indicator">
                  +{{ recipe.ingredients.length - 3 }} more
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <div *ngIf="selectedRecipe" class="modal-overlay">
        <div class="modal-container">
          <div class="modal-header">
            <h2>{{ selectedRecipe.title }}</h2>
            <button (click)="selectedRecipe = null" class="icon-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
          <div class="modal-content">
            <div class="detail-section">
              <h3 class="detail-title">Components</h3>
              <ul class="ingredient-list">
                <li *ngFor="let ingredient of selectedRecipe.ingredients"
                    class="ingredient-item">
                  {{ ingredient }}
                </li>
              </ul>
            </div>
            <div class="detail-section">
              <h3 class="detail-title">Methodology</h3>
              <div class="instruction-block">
                {{ selectedRecipe.instructions }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :root {
      --base-100: #ffffff;
      --base-200: #f8f9fa;
      --base-300: #e9ecef;
      --base-400: #dee2e6;
      --base-500: #adb5bd;
      --base-600: #6c757d;
      --base-700: #495057;
      --base-800: #343a40;
      --base-900: #212529;
    }

    .container {
      max-width: 1440px;
      margin: 0 auto;
      padding: 2rem;
      background: var(--base-100);
      min-height: 100vh;
    }

    .header {
      text-align: center;
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--base-300);
    }

    h1 {
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      color: var(--base-900);
      margin: 0;
      font-size: 2.5rem;
    }

    .subtitle {
      color: var(--base-600);
      font-size: 1.1rem;
      margin-top: 0.5rem;
    }

    .main-content {
      display: grid;
      grid-template-columns: minmax(300px, 1fr) 2fr;
      gap: 2rem;
    }

    .creation-panel {
      background: var(--base-200);
      padding: 2rem;
      border-radius: 8px;
      border: 1px solid var(--base-300);
    }

    .section-title {
      font-family: 'Inter', sans-serif;
      font-weight: 500;
      color: var(--base-800);
      margin-top: 0;
      margin-bottom: 1.5rem;
      font-size: 1.25rem;
    }

    .recipe-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-input, .form-textarea, .form-select {
      padding: 0.75rem;
      border: 1px solid var(--base-400);
      border-radius: 4px;
      background: var(--base-100);
      font-family: 'Inter', sans-serif;
      transition: all 0.2s ease;
      width: 100%;
    }

    .form-input:focus, .form-textarea:focus, .form-select:focus {
      outline: none;
      border-color: var(--base-600);
      box-shadow: 0 0 0 2px var(--base-300);
    }

    .form-textarea {
      min-height: 100px;
      resize: vertical;
    }

    .form-row {
      display: flex;
      gap: 1rem;
    }

    .primary-btn {
      background: var(--base-800);
      color: var(--base-100);
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-family: 'Inter', sans-serif;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .primary-btn:hover {
      background: var(--base-900);
    }

    .primary-btn:disabled {
      background: var(--base-400);
      cursor: not-allowed;
    }

    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .recipe-card {
      background: var(--base-100);
      border: 1px solid var(--base-300);
      border-radius: 6px;
      padding: 1.5rem;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .recipe-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }

    .card-header {
      margin-bottom: 1rem;
    }

    .card-title {
      font-family: 'Inter', sans-serif;
      font-weight: 500;
      color: var(--base-900);
      margin: 0 0 0.5rem 0;
    }

    .meta-group {
      display: flex;
      gap: 0.5rem;
    }

    .meta-tag {
      background: var(--base-200);
      color: var(--base-700);
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
    }

    .ingredient-preview {
      margin: 0;
      color: var(--base-700);
      line-height: 1.6;
    }

    .more-indicator {
      color: var(--base-500);
      font-style: italic;
    }

    .modal-overlay {
      position: fixed;
      z-index: 1000;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.3);
      backdrop-filter: blur(5px);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .modal-container {
      background: var(--base-100);
      border-radius: 8px;
      width: 90%;
      max-width: 800px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid var(--base-300);
    }

    .modal-header h2 {
      margin: 0;
      color: var(--base-900);
    }

    .icon-btn {
      background: none;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
      color: var(--base-600);
    }

    .icon-btn:hover {
      color: var(--base-800);
    }

    .modal-content {
      padding: 1.5rem;
      overflow-y: auto;
    }

    .detail-section {
      margin-bottom: 2rem;
    }

    .detail-title {
      color: var(--base-800);
      font-family: 'Inter', sans-serif;
      font-weight: 500;
      margin-top: 0;
      margin-bottom: 1rem;
    }

    .ingredient-list {
      columns: 2;
      gap: 2rem;
    }

    .instruction-block {
      white-space: pre-wrap;
      line-height: 1.6;
      color: var(--base-700);
    }

    @media (max-width: 768px) {
      .main-content {
        grid-template-columns: 1fr;
      }
      
      .creation-panel {
        order: 2;
      }
    }
  `],
  imports: [CommonModule, HttpClientModule, FormsModule],
  providers: [ItemService, RecipeService]
})
export class App implements OnInit {
  recipes: Recipe[] = [];
  selectedRecipe: Recipe | null = null;
  newRecipe = {
    title: '',
    ingredients: '',
    instructions: '',
    cookingTime: 30,
    difficulty: 'Easy'
  };
  error: string = '';
  isSubmitting: boolean = false;

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.loadRecipes();
  }

  loadRecipes() {
    this.recipeService.getRecipes().subscribe({
      next: (recipes) => this.recipes = recipes,
      error: (error) => this.error = 'Failed to load recipes'
    });
  }

  showRecipeDetails(id: number) {
    this.recipeService.getRecipe(id).subscribe({
      next: (recipe) => this.selectedRecipe = recipe,
      error: (error) => this.error = 'Failed to load recipe details'
    });
  }

  addRecipe() {
    if (this.newRecipe.title.trim() && this.newRecipe.ingredients.trim()) {
      this.isSubmitting = true;
      const ingredientsArray = this.newRecipe.ingredients
        .split(',')
        .map(i => i.trim())
        .filter(i => i.length > 0);

      this.recipeService.addRecipe({
        title: this.newRecipe.title.trim(),
        ingredients: ingredientsArray,
        instructions: this.newRecipe.instructions.trim(),
        cookingTime: Number(this.newRecipe.cookingTime) || 30,
        difficulty: this.newRecipe.difficulty
      }).subscribe({
        next: (newRecipe) => {
          this.recipes = [...this.recipes, newRecipe];
          this.newRecipe = {
            title: '',
            ingredients: '',
            instructions: '',
            cookingTime: 30,
            difficulty: 'Easy'
          };
          this.isSubmitting = false;
        },
        error: (error) => {
          this.error = 'Failed to save recipe';
          this.isSubmitting = false;
        }
      });
    }
  }
}

bootstrapApplication(App, {
  providers: [
    provideHttpClient()
  ]
}).catch(err => console.error(err));