// Script de test de connexion à Supabase
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialisation du client Supabase avec les variables d'environnement
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * Teste la connexion à Supabase et affiche un exemple de données de la table products
 */
async function testConnection() {
  const { data, error } = await supabase.from('products').select('*').limit(1);
  if (error) {
    console.error('Erreur de connexion à Supabase :', error.message);
    process.exit(1);
  }
  console.log('Connexion à Supabase OK. Exemple de données :', data);
}

testConnection();
