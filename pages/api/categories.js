
import fs from 'fs';
import path from 'path';

// Chemin du fichier JSON contenant les catégories
const filePath = path.join(process.cwd(), 'data', 'categories.json');

/**
 * Lit les catégories depuis le fichier JSON.
 * @returns {Array} Liste des catégories
 */
function readCategories() {
	try {
		return JSON.parse(fs.readFileSync(filePath, 'utf8'));
	} catch (error) {
		// En cas d'erreur de lecture ou de parsing, retourne un tableau vide
		return [];
	}
}

/**
 * Écrit les catégories dans le fichier JSON.
 * @param {Array} data - Liste des catégories à sauvegarder
 */
function writeCategories(data) {
	fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/**
 * API handler pour la gestion des catégories
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
export default function handler(req, res) {
	let categories = readCategories();
	const { method } = req;

	switch (method) {
		case 'GET':
			// Retourne toutes les catégories
			res.status(200).json(categories);
			break;
		case 'POST': {
			// Ajoute une nouvelle catégorie
			const { name } = req.body;
			if (!name || typeof name !== 'string' || !name.trim()) {
				res.status(400).json({ error: 'Le nom est requis et doit être une chaîne non vide.' });
				return;
			}
			// Vérifie si le nom existe déjà
			if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
				res.status(409).json({ error: 'La catégorie existe déjà.' });
				return;
			}
			const newCategory = {
				id: categories.length ? categories[categories.length - 1].id + 1 : 1,
				name: name.trim(),
			};
			categories.push(newCategory);
			writeCategories(categories);
			res.status(201).json(newCategory);
			break;
		}
		case 'PUT': {
			// Modifie le nom d'une catégorie existante
			const { id, newName } = req.body;
			const catIdx = categories.findIndex(c => c.id === id);
			if (catIdx === -1) {
				res.status(404).json({ error: 'Catégorie non trouvée.' });
				return;
			}
			if (!newName || typeof newName !== 'string' || !newName.trim()) {
				res.status(400).json({ error: 'Le nouveau nom est requis et doit être une chaîne non vide.' });
				return;
			}
			categories[catIdx].name = newName.trim();
			writeCategories(categories);
			res.status(200).json(categories[catIdx]);
			break;
		}
		case 'DELETE': {
			// Supprime une catégorie par son id
			const { deleteId } = req.body;
			const filtered = categories.filter(c => c.id !== deleteId);
			if (filtered.length === categories.length) {
				res.status(404).json({ error: 'Catégorie non trouvée.' });
				return;
			}
			writeCategories(filtered);
			res.status(204).end();
			break;
		}
		default:
			// Méthode HTTP non supportée
			res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
			res.status(405).end(`Méthode ${method} non autorisée`);
	}
}