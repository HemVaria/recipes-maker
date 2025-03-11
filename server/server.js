const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Sample API endpoints
app.get('/api/items', (req, res) => {
  res.json([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ]);
});

app.post('/api/items', (req, res) => {
  const newItem = req.body;
  res.status(201).json(newItem);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});