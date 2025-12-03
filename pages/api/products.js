import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'products.json');

function readProducts() {
	return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeProducts(data) {
	fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export default function handler(req, res) {
	let products = readProducts();
	const { method } = req;

	switch (method) {
		case 'GET':
			res.status(200).json(products);
			break;
		case 'POST':
			const { name, categoryId, price } = req.body;
			if (!name || !categoryId || price === undefined) {
				res.status(400).json({ error: 'Champs requis manquants.' });
				return;
			}
			const newProduct = {
				id: products.length ? products[products.length - 1].id + 1 : 1,
				name,
				categoryId,
				price,
			};
			products.push(newProduct);
			writeProducts(products);
			res.status(201).json(newProduct);
			break;
		case 'PUT':
			const { id, newName, newCategoryId, newPrice } = req.body;
			const prodIdx = products.findIndex(p => p.id === id);
			if (prodIdx === -1) {
				res.status(404).json({ error: 'Produit non trouvé.' });
				return;
			}
			if (newName) products[prodIdx].name = newName;
			if (newCategoryId) products[prodIdx].categoryId = newCategoryId;
			if (newPrice !== undefined) products[prodIdx].price = newPrice;
			writeProducts(products);
			res.status(200).json(products[prodIdx]);
			break;
		case 'DELETE':
			const { deleteId } = req.body;
			const filtered = products.filter(p => p.id !== deleteId);
			if (filtered.length === products.length) {
				res.status(404).json({ error: 'Produit non trouvé.' });
				return;
			}
			writeProducts(filtered);
			res.status(204).end();
			break;
		default:
			res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
			res.status(405).end(`Méthode ${method} non autorisée`);
	}
}