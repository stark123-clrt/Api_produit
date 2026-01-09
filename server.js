const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Chemins des fichiers data
const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');
const CATEGORIES_FILE = path.join(__dirname, 'data', 'categories.json');

// Helper pour lire/écrire les fichiers
async function readJSON(filePath) {
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

async function writeJSON(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Routes Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await readJSON(PRODUCTS_FILE);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const products = await readJSON(PRODUCTS_FILE);
    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      ...req.body
    };
    products.push(newProduct);
    await writeJSON(PRODUCTS_FILE, products);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products', async (req, res) => {
  try {
    const products = await readJSON(PRODUCTS_FILE);
    const index = products.findIndex(p => p.id === req.body.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    products[index] = { ...products[index], ...req.body };
    await writeJSON(PRODUCTS_FILE, products);
    res.json(products[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products', async (req, res) => {
  try {
    const products = await readJSON(PRODUCTS_FILE);
    const filtered = products.filter(p => p.id !== req.body.id);
    await writeJSON(PRODUCTS_FILE, filtered);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes Categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await readJSON(CATEGORIES_FILE);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const categories = await readJSON(CATEGORIES_FILE);
    const newCategory = {
      id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
      name: req.body.name
    };
    categories.push(newCategory);
    await writeJSON(CATEGORIES_FILE, categories);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/categories', async (req, res) => {
  try {
    const categories = await readJSON(CATEGORIES_FILE);
    const index = categories.findIndex(c => c.id === req.body.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Category not found' });
    }
    categories[index] = { ...categories[index], ...req.body };
    await writeJSON(CATEGORIES_FILE, categories);
    res.json(categories[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/categories', async (req, res) => {
  try {
    const categories = await readJSON(CATEGORIES_FILE);
    const filtered = categories.filter(c => c.id !== req.body.id);
    await writeJSON(CATEGORIES_FILE, filtered);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route principale
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
