// API CRUD pour la gestion des produits avec Supabase
import { createClient } from '@supabase/supabase-js';

// Initialisation du client Supabase avec les variables d'environnement
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * Handler Next.js pour les opérations CRUD sur les produits
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    // Récupérer tous les produits
    case 'GET': {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(200).json(data);
      break;
    }
    // Ajouter un produit
    case 'POST': {
      const { name, categoryid, price } = req.body;
      if (!name || !categoryid || price === undefined) {
        res.status(400).json({ error: 'Champs requis manquants.' });
        return;
      }
      const { data, error } = await supabase.from('products').insert([{ name, categoryid, price }]).select().single();
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(201).json(data);
      break;
    }
    // Modifier un produit
    case 'PUT': {
      const { id, name, categoryid, price } = req.body;
      if (!id) {
        res.status(400).json({ error: 'ID requis.' });
        return;
      }
      const updateFields = {};
      if (name !== undefined) updateFields.name = name;
      if (categoryid !== undefined) updateFields.categoryid = categoryid;
      if (price !== undefined) updateFields.price = price;
      const { data, error } = await supabase.from('products').update(updateFields).eq('id', id).select().single();
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(200).json(data);
      break;
    }
    // Supprimer un produit
    case 'DELETE': {
      const { id } = req.body;
      if (!id) {
        res.status(400).json({ error: 'ID requis.' });
        return;
      }
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(204).end();
      break;
    }
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Méthode ${method} non autorisée`);
  }
}

