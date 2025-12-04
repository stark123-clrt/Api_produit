API Catalogue de Produits & Catégories

Ce projet est une API de catalogue de produits et de catégories réalisée avec Next.js. Il utilise Supabase comme base de données et inclut une interface d'administration web moderne (CRUD).

🛠️ Installation du projet

Pour démarrer ce projet en local :

1. Cloner le dépôt :
    ```bash
    git clone https://github.com/stark123-clrt/Api_produit.git
    cd Api_produit
    ```
2. Installer les dépendances Node.js :
    ```bash
    npm install
    ```
3. Configurer les variables d'environnement :
    Créez un fichier `.env.local` à la racine du projet et ajoutez les codes Supabase :

    NEXT_PUBLIC_SUPABASE_URL="..........."

    NEXT_PUBLIC_SUPABASE_ANON_KEY="........."
    

4. Lancer le serveur de développement :
    ```bash
    npm run dev
    ```
Le serveur sera accessible sur http://localhost:3000.

💻 Interface d’administration (CRUD)

Une interface web pour gérer les produits et les catégories est disponible :

- **URL d'accès** : http://localhost:3000/products
- **Fonctionnalités** : L'interface permet l'ajout, la modification et la suppression (C.R.U.D.) des produits et des catégories en temps réel, synchronisées avec la base de données Supabase.
- **Utilisation** : Ouvrez le lien et utilisez les formulaires pour gérer votre catalogue. Chaque action déclenche un appel vers l'API interne du projet (`/api/products` ou `/api/categories`).
- **Remarque de sécurité** : L'interface et l'API sont ouvertes par défaut pour faciliter le développement local. Pour un déploiement, il est crucial d'ajouter un système d'authentification (ex. : Supabase Auth ou NextAuth) pour sécuriser l'accès aux routes d'administration (POST, PUT, DELETE).

🌐 Utilisation de l'API REST

L'API est accessible via deux endpoints principaux et prend en charge les opérations CRUD via les méthodes HTTP standard.

- **URL de base** : http://localhost:3000

| Ressource   | Méthode HTTP | Endpoint           | Description                       |
|-------------|--------------|--------------------|-----------------------------------|
| Produits    | GET          | /api/products      | Liste tous les produits           |
| Produits    | POST         | /api/products      | Ajoute un produit                 |
| Produits    | PUT          | /api/products      | Modifie un produit existant       |
| Produits    | DELETE       | /api/products      | Supprime un produit               |
| Catégories  | GET          | /api/categories    | Liste toutes les catégories       |
| Catégories  | POST         | /api/categories    | Ajoute une catégorie              |
| Catégories  | PUT          | /api/categories    | Modifie une catégorie existante   |
| Catégories  | DELETE       | /api/categories    | Supprime une catégorie            |

### Exemples d'utilisation avec curl ou postman

1. Ajouter un produit (POST)
    ```bash
    curl -X POST http://localhost:3000/api/products \
      -H "Content-Type: application/json" \
      -d '{"name": "Ordinateur portable", "categoryid": 1, "price": 899.99}'
    ```
2. Modifier un produit (PUT)
    ```bash
    curl -X PUT http://localhost:3000/api/products \
      -H "Content-Type: application/json" \
      -d '{"id": 1, "name": "Laptop Gamer", "price": 1099.99}'
    ```
3. Supprimer une catégorie (DELETE)
    ```bash
    curl -X DELETE http://localhost:3000/api/categories \
      -H "Content-Type: application/json" \
      -d '{"id": 2}'
    ```

📁 Structure du projet

Voici un aperçu des fichiers clés :

```
Api_produit/
│
├── pages/
│   ├── api/
│   │   ├── categories.js      # API route pour la gestion des catégories
│   │   └── products.js        # API route pour la gestion des produits
│   └── products.js            # Interface d'administration web (Front-end)
│
├── package.json
└── .env.local                 # Variables d'environnement (Supabase)
```

Collaborateurs : Christian ONDIYO et Samir NZAMBA