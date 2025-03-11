const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let recipes = [];

// Get all recipes
app.get('/api/recipes', (req, res) => {
  res.json(recipes);
});

// Get single recipe
app.get('/api/recipes/:id', (req, res) => {
  const recipe = recipes.find(r => r.id === parseInt(req.params.id));
  if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
  res.json(recipe);
});

// Create new recipe
app.post('/api/recipes', (req, res) => {
  if (!req.body.title || !req.body.ingredients) {
    return res.status(400).json({ error: 'Title and ingredients are required' });
  }

  const newRecipe = {
    id: recipes.length > 0 ? Math.max(...recipes.map(r => r.id)) + 1 : 1,
    title: req.body.title.trim(),
    ingredients: Array.isArray(req.body.ingredients) 
      ? req.body.ingredients 
      : [req.body.ingredients],
    instructions: req.body.instructions || '',
    cookingTime: parseInt(req.body.cookingTime) || 0,
    difficulty: ['Easy','Medium','Hard'].includes(req.body.difficulty) 
      ? req.body.difficulty 
      : 'Easy'
  };

  recipes.push(newRecipe);
  res.status(201).json(newRecipe);
});

app.listen(port, () => {
  console.log(`Recipe API running at http://localhost:${port}`);
});