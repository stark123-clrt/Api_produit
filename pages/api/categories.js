import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'categories.json');

function readCategories() {
	return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeCategories(data) {
	fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export default function handler(req, res) {
	let categories = readCategories();
	const { method } = req;

	switch (method) {
		case 'GET':
			res.status(200).json(categories);
			break;
		case 'POST':
			const { name } = req.body;
			if (!name) {
				res.status(400).json({ error: 'Le nom est requis.' });
				return;
			}
			const newCategory = {
				id: categories.length ? categories[categories.length - 1].id + 1 : 1,
				name,
			};
			categories.push(newCategory);
			writeCategories(categories);
			res.status(201).json(newCategory);
			break;
		case 'PUT':
			const { id, newName } = req.body;
			const catIdx = categories.findIndex(c => c.id === id);
			if (catIdx === -1) {
				res.status(404).json({ error: 'Catégorie non trouvée.' });
				return;
			}
			categories[catIdx].name = newName;
			writeCategories(categories);
			res.status(200).json(categories[catIdx]);
			break;
		case 'DELETE':
			const { deleteId } = req.body;
			const filtered = categories.filter(c => c.id !== deleteId);
			if (filtered.length === categories.length) {
				res.status(404).json({ error: 'Catégorie non trouvée.' });
				return;
			}
			writeCategories(filtered);
			res.status(204).end();
			break;
		default:
			res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
			res.status(405).end(`Méthode ${method} non autorisée`);
	}
}