# Interface d’administration et API client

## Interface d’administration (CRUD produits & catégories)

Une interface web moderne est disponible à l’adresse `/products`.

- Accessible uniquement aux administrateurs (par défaut, sans authentification, tout utilisateur peut y accéder en local).
- Permet d’ajouter, modifier, supprimer des produits et des catégories en temps réel.
- Les catégories sont auto-incrémentées dans la base de données.
- L’interface utilise l’API REST du projet : chaque action (ajout, édition, suppression) déclenche un appel à `/api/products` ou `/api/categories`.

### Exemple d’utilisation côté admin

1. Aller sur http://localhost:3000/products
2. Ajouter une catégorie (ex : "Informatique")
3. Ajouter un produit en choisissant la catégorie créée
4. Modifier ou supprimer produits et catégories à volonté

## Utilisation de l’API côté client

Les clients (front, mobile, Postman, etc.) peuvent consommer l’API produits :

- `GET /api/products` : liste tous les produits (avec nom de la catégorie)
- `GET /api/categories` : liste toutes les catégories
- `POST /api/products` : ajoute un produit (voir exemples plus bas)
- `POST /api/categories` : ajoute une catégorie
- `PUT /api/products` : modifie un produit
- `PUT /api/categories` : modifie une catégorie
- `DELETE /api/products` : supprime un produit
- `DELETE /api/categories` : supprime une catégorie

L’API est donc utilisable à la fois par l’interface d’administration et par tout client externe (Postman, front, mobile, etc.).

---
## Endpoints API (CRUD)

### Catégories
- `GET    /api/categories` : Liste toutes les catégories
- `POST   /api/categories` : Ajoute une catégorie (body : `{ "name": "Informatique" }`)
- `PUT    /api/categories` : Modifie une catégorie (body : `{ "id": 1, "name": "Nouveau nom" }`)
- `DELETE /api/categories` : Supprime une catégorie (body : `{ "id": 1 }`)

### Produits
- `GET    /api/products` : Liste tous les produits
- `POST   /api/products` : Ajoute un produit (body : `{ "name": "Ordinateur portable", "categoryid": 1, "price": 899.99 }`)
- `PUT    /api/products` : Modifie un produit (body : `{ "id": 1, "name": "Nouveau nom", "categoryid": 2, "price": 100 }`)
- `DELETE /api/products` : Supprime un produit (body : `{ "id": 1 }`)

## Exemples d’utilisation avec Postman ou curl

### Ajouter un produit
POST http://localhost:3000/api/products
Body (JSON) :
```
{
	"name": "Clavier mécanique",
	"categoryid": 1,
	"price": 49.99
}
```

### Modifier un produit
PUT http://localhost:3000/api/products
Body (JSON) :
```
{
	"id": 1,
	"name": "Clavier gamer",
	"price": 59.99
}
```

### Supprimer un produit
DELETE http://localhost:3000/api/products
Body (JSON) :
```
{
	"id": 1
}
```

### Ajouter une catégorie
POST http://localhost:3000/api/categories
Body (JSON) :
```
{
	"name": "Bureau"
}
```

### Modifier une catégorie
PUT http://localhost:3000/api/categories
Body (JSON) :
```
{
	"id": 1,
	"name": "Informatique et multimédia"
}
```

### Supprimer une catégorie
DELETE http://localhost:3000/api/categories
Body (JSON) :
```
{
	"id": 1
}
```

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
