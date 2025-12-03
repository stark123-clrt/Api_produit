
import fs from 'fs';
import path from 'path';

// Chemin du fichier JSON contenant les produits
const filePath = path.join(process.cwd(), 'data', 'products.json');

/**
 * Lit les produits depuis le fichier JSON.
 * @returns {Array} Liste des produits
 */
function readProducts() {
	try {
		return JSON.parse(fs.readFileSync(filePath, 'utf8'));
	} catch (error) {
		// En cas d'erreur de lecture ou de parsing, retourne un tableau vide
		return [];
	}
}

/**
 * Écrit les produits dans le fichier JSON.
 * @param {Array} data - Liste des produits à sauvegarder
 */
function writeProducts(data) {
	fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/**
 * API handler pour la gestion des produits
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
export default function handler(req, res) {
	let products = readProducts();
	const { method } = req;

	switch (method) {
		case 'GET':
			// Retourne tous les produits
			res.status(200).json(products);
			break;
		case 'POST': {
			// Ajoute un nouveau produit
			const { name, categoryId, price } = req.body;
			if (!name || typeof name !== 'string' || !name.trim()) {
				res.status(400).json({ error: 'Le nom du produit est requis et doit être une chaîne non vide.' });
				return;
			}
			if (!categoryId || typeof categoryId !== 'number') {
				res.status(400).json({ error: 'L\'ID de catégorie est requis et doit être un nombre.' });
				return;
			}
			if (price === undefined || typeof price !== 'number' || price < 0) {
				res.status(400).json({ error: 'Le prix est requis et doit être un nombre positif.' });
				return;
			}
			// Vérifie si le nom existe déjà
			if (products.some(p => p.name.toLowerCase() === name.toLowerCase())) {
				res.status(409).json({ error: 'Le produit existe déjà.' });
				return;
			}
			const newProduct = {
				id: products.length ? products[products.length - 1].id + 1 : 1,
				name: name.trim(),
				categoryId,
				price,
			};
			products.push(newProduct);
			writeProducts(products);
			res.status(201).json(newProduct);
			break;
		}
		case 'PUT': {
			// Modifie un produit existant
			const { id, newName, newCategoryId, newPrice } = req.body;
			const prodIdx = products.findIndex(p => p.id === id);
			if (prodIdx === -1) {
				res.status(404).json({ error: 'Produit non trouvé.' });
				return;
			}
			if (newName !== undefined) {
				if (typeof newName !== 'string' || !newName.trim()) {
					res.status(400).json({ error: 'Le nouveau nom doit être une chaîne non vide.' });
					return;
				}
				products[prodIdx].name = newName.trim();
			}
			if (newCategoryId !== undefined) {
				if (typeof newCategoryId !== 'number') {
					res.status(400).json({ error: 'Le nouvel ID de catégorie doit être un nombre.' });
					return;
				}
				products[prodIdx].categoryId = newCategoryId;
			}
			if (newPrice !== undefined) {
				if (typeof newPrice !== 'number' || newPrice < 0) {
					res.status(400).json({ error: 'Le nouveau prix doit être un nombre positif.' });
					return;
				}
				products[prodIdx].price = newPrice;
			}
			writeProducts(products);
			res.status(200).json(products[prodIdx]);
			break;
		}
		case 'DELETE': {
			// Supprime un produit par son id
			const { deleteId } = req.body;
			const filtered = products.filter(p => p.id !== deleteId);
			if (filtered.length === products.length) {
				res.status(404).json({ error: 'Produit non trouvé.' });
				return;
			}
			writeProducts(filtered);
			res.status(204).end();
			break;
		}
		default:
			// Méthode HTTP non supportée
			res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
			res.status(405).end(`Méthode ${method} non autorisée`);
	}
}