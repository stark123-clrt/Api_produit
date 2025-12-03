import { useEffect, useState } from 'react';

// Interface CRUD produits + affichage du nom de la catégorie
export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: '', categoryid: '', price: '' });
  const [editId, setEditId] = useState(null);
  // Pour le CRUD catégorie
  const [catForm, setCatForm] = useState({ name: '' });
  const [catEditId, setCatEditId] = useState(null);
  // Gère la saisie du formulaire catégorie
  const handleCatChange = (e) => {
    setCatForm({ ...catForm, [e.target.name]: e.target.value });
  };

  // Ajoute ou modifie une catégorie
  const handleCatSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const method = catEditId ? 'PUT' : 'POST';
      const body = catEditId
        ? { id: catEditId, name: catForm.name }
        : { name: catForm.name };
      const res = await fetch('/api/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Erreur lors de l\'enregistrement catégorie');
      setCatForm({ name: '' });
      setCatEditId(null);
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  // Prépare la modification catégorie
  const handleCatEdit = (cat) => {
    setCatEditId(cat.id);
    setCatForm({ name: cat.name });
  };

  // Supprime une catégorie
  const handleCatDelete = async (id) => {
    if (!window.confirm('Supprimer cette catégorie ?')) return;
    setError(null);
    try {
      const res = await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Erreur lors de la suppression catégorie');
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  // Récupère les produits et catégories
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const [resProd, resCat] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
      ]);
      if (!resProd.ok || !resCat.ok) throw new Error('Erreur lors du chargement');
      const dataProd = await resProd.json();
      const dataCat = await resCat.json();
      setProducts(dataProd);
      setCategories(dataCat);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Gère la saisie du formulaire
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Ajoute ou modifie un produit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const method = editId ? 'PUT' : 'POST';
      const body = editId
        ? { id: editId, ...form, price: parseFloat(form.price), categoryid: parseInt(form.categoryid) }
        : { ...form, price: parseFloat(form.price), categoryid: parseInt(form.categoryid) };
      const res = await fetch('/api/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Erreur lors de l\'enregistrement');
      setForm({ name: '', categoryid: '', price: '' });
      setEditId(null);
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  // Prépare la modification
  const handleEdit = (prod) => {
    setEditId(prod.id);
    setForm({ name: prod.name, categoryid: prod.categoryid, price: prod.price });
  };

  // Supprime un produit
  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return;
    setError(null);
    try {
      const res = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  // Trouve le nom de la catégorie à partir de l'id
  const getCategoryName = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : id;
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Gestion des produits</h1>

      {/* CRUD Catégories */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-2">Catégories</h2>
        <form onSubmit={handleCatSubmit} className="mb-4 flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium">Nom</label>
            <input name="name" value={catForm.name} onChange={handleCatChange} required className="mt-1 w-full border rounded px-2 py-1" />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            {catEditId ? 'Modifier' : 'Ajouter'}
          </button>
        </form>
        <table className="w-full border text-sm mb-2">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 border">Nom</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="p-2 border">{cat.name}</td>
                <td className="p-2 border flex gap-2 justify-center">
                  <button onClick={() => handleCatEdit(cat)} className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500">Éditer</button>
                  <button onClick={() => handleCatDelete(cat.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CRUD Produits */}
      <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium">Nom</label>
          <input name="name" value={form.name} onChange={handleChange} required className="mt-1 w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label className="block text-sm font-medium">Catégorie</label>
          <select name="categoryid" value={form.categoryid} onChange={handleChange} required className="mt-1 w-full border rounded px-2 py-1">
            <option value="">Choisir…</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Prix (€)</label>
          <input name="price" value={form.price} onChange={handleChange} required type="number" step="0.01" className="mt-1 w-full border rounded px-2 py-1" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          {editId ? 'Modifier' : 'Ajouter'}
        </button>
      </form>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Nom</th>
              <th className="p-2 border">Catégorie</th>
              <th className="p-2 border">Prix (€)</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id} className="hover:bg-gray-50">
                <td className="p-2 border">{prod.name}</td>
                <td className="p-2 border">{getCategoryName(prod.categoryid)}</td>
                <td className="p-2 border">{prod.price}</td>
                <td className="p-2 border flex gap-2 justify-center">
                  <button onClick={() => handleEdit(prod)} className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500">Éditer</button>
                  <button onClick={() => handleDelete(prod.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
