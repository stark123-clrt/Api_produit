const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialiser Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Webhook retour (n8n) - configurable via env
const RETURNS_WEBHOOK_URL = process.env.RETURNS_WEBHOOK_URL || 'https://belvans.app.n8n.cloud/webhook-test/0d917279-b84e-492d-9db4-26af97eab4c9';


// ==================== PROXY CHATBOT N8N ====================
app.get('/api/chat', async (req, res) => {
  try {
    
    const message = req.query.message;
    if (!message) {
      return res.status(400).json({ error: 'Message requis' });
    }


    // Appel vers n8n via Cloudflare tunnel
    const n8nUrl = `https://query-revolution-console-theta.trycloudflare.com/webhook/f83f5f08-33e8-46dc-a8ee-909ce18a36a9?message=${encodeURIComponent(message)}`;
    
    const response = await fetch(n8nUrl);
    const data = await response.json();
    
    res.json(data);
  } catch (error) {
    console.error('Erreur proxy n8n:', error.message);
    res.status(500).json({ error: 'Erreur de connexion au chatbot' });
  }
});


// ==================== ROUTES PRODUCTS ====================
app.get('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([req.body])
      .select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(req.body)
      .eq('id', req.body.id)
      .select();
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products', async (req, res) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.body.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ROUTES CATEGORIES ====================
app.get('/api/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*');
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name: req.body.name }])
      .select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update({ name: req.body.name })
      .eq('id', req.body.id)
      .select();
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/categories', async (req, res) => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', req.body.id);
    if (error) throw error;
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

// ==================== PROXY RETOURS (n8n) ====================
app.post('/api/returns', async (req, res) => {
  try {
    if (!RETURNS_WEBHOOK_URL) {
      return res.status(500).json({ error: 'RETURNS_WEBHOOK_URL non configuré' });
    }

    const response = await fetch(RETURNS_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const payload = isJson ? await response.json() : await response.text();

    res.status(response.status)
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Headers', 'Content-Type')
      .send(payload);
  } catch (error) {
    console.error('Erreur proxy returns:', error.message);
    res.status(500).json({ error: 'Erreur de connexion au webhook returns', detail: error.message });
  }
});