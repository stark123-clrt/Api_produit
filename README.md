
# Mini API Catalogue

Ce projet est une API catalogue de produits et catégories réalisée avec Next.js.

## Structure du projet

```
Api_produit/
│
├── data/
│   ├── categories.json
│   └── products.json
│
├── pages/
│   └── api/
│       ├── categories.js
│       └── products.js
│
├── package.json
├── .gitignore
└── README.md
```

## Installation

1. Cloner le dépôt GitHub :
	```bash
	git clone https://github.com/stark123-clrt/Api_produit.git
	cd Api_produit
	```
2. Installer les dépendances :
	```bash
	npm install
	```

## Lancement du serveur

Pour démarrer le serveur de développement Next.js :
```bash
npm run dev
```
Le serveur sera accessible sur http://localhost:3000

## Endpoints API
http://localhost:3000/api/categories

http://localhost:3000/api/products

### Catégories
- `GET    /api/categories` : Liste toutes les catégories
- `POST   /api/categories` : Ajoute une catégorie (body : `{ name }`)
- `PUT    /api/categories` : Modifie une catégorie (body : `{ id, newName }`)
- `DELETE /api/categories` : Supprime une catégorie (body : `{ deleteId }`)

### Produits
- `GET    /api/products` : Liste tous les produits
- `POST   /api/products` : Ajoute un produit (body : `{ name, categoryId, price }`)
- `PUT    /api/products` : Modifie un produit (body : `{ id, newName, newCategoryId, newPrice }`)
- `DELETE /api/products` : Supprime un produit (body : `{ deleteId }`)

## Bonnes pratiques

- Le dossier `node_modules` est exclu du dépôt grâce au fichier `.gitignore`.
- Les données sont stockées dans des fichiers JSON pour la simplicité.
- Les endpoints respectent les méthodes HTTP standards (GET, POST, PUT, DELETE).
- Pour toute modification, créez une branche dédiée et ouvrez une Pull Request pour la revue de code.

## Collaboration

Ce projet est conçu pour la collaboration GitHub :
- Travail en binôme
- Branches de fonctionnalité
- Pull Requests et revue de code

## Tests

Une partie Python est prévue pour des tests unitaires simples (voir consignes du TP).
