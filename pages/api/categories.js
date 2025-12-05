
// API CRUD pour la gestion des catégories avec Supabase
import { createClient } from '@supabase/supabase-js';

// Initialisation du client Supabase avec les variables d'environnement
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * Handler Next.js pour les opérations CRUD sur les catégories
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */


export default async function handler(req, res) {
	const { method } = req;

	switch (method) {
		// Récupérer toutes les catégories
		case 'GET': {
			const { data, error } = await supabase.from('categories').select('*');
			if (error) {
				res.status(500).json({ error: error.message });
				return;
			}
			res.status(200).json(data);
			break;
		}
		// Ajouter une catégorie
		case 'POST': {
			const { name } = req.body;
			if (!name || typeof name !== 'string' || !name.trim()) {
				res.status(400).json({ error: 'Le nom est requis et doit être une chaîne non vide.' });
				return;
			}
			const { data, error } = await supabase.from('categories').insert([{ name: name.trim() }]).select().single();
			if (error) {
				res.status(500).json({ error: error.message });
				return;
			}
			res.status(201).json(data);
			break;
		}
		// Modifier une catégorie
		case 'PUT': {
			const { id, name } = req.body;
			if (!id || !name || typeof name !== 'string' || !name.trim()) {
				res.status(400).json({ error: 'ID et nom requis.' });
				return;
			}
			const { data, error } = await supabase.from('categories').update({ name: name.trim() }).eq('id', id).select().single();
			if (error) {
				res.status(500).json({ error: error.message });
				return;
			}
			res.status(200).json(data);
			break;
		}
		// Supprimer une catégorie
		case 'DELETE': {
			const { id } = req.body;
			if (!id) {
				res.status(400).json({ error: 'ID requis.' });
				return;
			}
			const { error } = await supabase.from('categories').delete().eq('id', id);
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