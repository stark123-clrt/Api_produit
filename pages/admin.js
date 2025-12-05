import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Package, FolderOpen, Plus, Edit2, Trash2, X } from 'lucide-react';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  
  // États formulaire produit
  const [showProductModal, setShowProductModal] = useState(false);
  const [productForm, setProductForm] = useState({ name: '', categoryid: '', price: '' });
  const [editProductId, setEditProductId] = useState(null);
  

  // États formulaire catégorie
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: '' });
  const [editCategoryId, setEditCategoryId] = useState(null);


  // Récupère les données
  const fetchData = async () => {
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



  // Rafraîchissement silencieux en arrière-plan (sans loader)
  const silentFetchData = async () => {
    try {
      const [resProd, resCat] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
      ]);
      if (resProd.ok && resCat.ok) {
        const dataProd = await resProd.json();
        const dataCat = await resCat.json();
        setProducts(dataProd);
        setCategories(dataCat);
      }
    } catch (err) {
      // Ignore les erreurs en mode silencieux
    }
  };

  useEffect(() => {
    fetchData();
    
    // Rafraîchissement silencieux toutes les 10 secondes
    const interval = setInterval(() => {
      silentFetchData();
    }, 10000);
    
    
    // Charger le chatbot n8n via CDN
    const loadChat = () => {
      if (typeof window !== 'undefined' && !window.chatLoaded) {
        // Ajouter le CSS
        const link = document.createElement('link');
        link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        // Ajouter le script
        const script = document.createElement('script');
        script.type = 'module';
        script.innerHTML = `
          import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
          
          createChat({
            webhookUrl: 'https://stark123christ.app.n8n.cloud/webhook/fe33fc56-7b26-4c58-a523-773d78c4e364/chat',
            mode: 'window',
            loadPreviousSession: true,
            showWelcomeScreen: true,
            initialMessages: [
              'Bonjour!',
              'Je suis votre assistant IA pour la gestion d\\'API produit. Comment puis-je vous aider?'
            ],
            i18n: {
              en: {
                title: 'Assistant IA',
                subtitle: "Pour la gestion d'API produit",
                footer: '',
                getStarted: 'Nouvelle Conversation',
                inputPlaceholder: 'Tapez votre question..',
              },
            },
          });
        `;
        document.body.appendChild(script);
        window.chatLoaded = true;
      }
    };
    
    loadChat();
    
    return () => clearInterval(interval);
  }, []);

  // Calculs pour le dashboard
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const averagePrice = products.length > 0 
    ? (products.reduce((sum, p) => sum + parseFloat(p.price), 0) / products.length).toFixed(2)
    : 0;
  const totalValue = products.reduce((sum, p) => sum + parseFloat(p.price), 0).toFixed(2);

  // Produits par catégorie pour le graphique
  const productsByCategory = categories.map(cat => ({
    name: cat.name,
    count: products.filter(p => p.categoryid === cat.id).length,
  }));

  const maxCount = Math.max(...productsByCategory.map(c => c.count), 1);

  // Gestion produit
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const method = editProductId ? 'PUT' : 'POST';
      const body = editProductId
        ? { id: editProductId, ...productForm, price: parseFloat(productForm.price), categoryid: parseInt(productForm.categoryid) }
        : { ...productForm, price: parseFloat(productForm.price), categoryid: parseInt(productForm.categoryid) };
      const res = await fetch('/api/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Erreur lors de l\'enregistrement');
      setProductForm({ name: '', categoryid: '', price: '' });
      setEditProductId(null);
      setShowProductModal(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleProductEdit = (prod) => {
    setEditProductId(prod.id);
    setProductForm({ name: prod.name, categoryid: prod.categoryid, price: prod.price });
    setShowProductModal(true);
  };

  const handleProductDelete = async (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return;
    setError(null);
    try {
      const res = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  // Gestion catégorie
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const method = editCategoryId ? 'PUT' : 'POST';
      const body = editCategoryId
        ? { id: editCategoryId, name: categoryForm.name }
        : { name: categoryForm.name };
      const res = await fetch('/api/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Erreur lors de l\'enregistrement');
      setCategoryForm({ name: '' });
      setEditCategoryId(null);
      setShowCategoryModal(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCategoryEdit = (cat) => {
    setEditCategoryId(cat.id);
    setCategoryForm({ name: cat.name });
    setShowCategoryModal(true);
  };

  const handleCategoryDelete = async (id) => {
    if (!window.confirm('Supprimer cette catégorie ?')) return;
    setError(null);
    try {
      const res = await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : id;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <style jsx global>{`
        :root {
          --chat--color--primary: #2563eb;
          --chat--color--primary-shade-50: #1d4ed8;
          --chat--color--primary--shade-100: #1e40af;
          --chat--color--secondary: #8b5cf6;
          --chat--color-secondary-shade-50: #7c3aed;
          --chat--window--width: 400px;
          --chat--window--height: 600px;
          --chat--toggle--size: 60px;
        }
      `}</style>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard API Produits</h1>
              <p className="text-sm text-gray-600">Gestion des produits et catégories</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Valeur</p>
                <p className="text-xl font-bold text-green-600">{totalValue} €</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="inline w-4 h-4 mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition ${
                activeTab === 'products'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Package className="inline w-4 h-4 mr-2" />
              Produits
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition ${
                activeTab === 'categories'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FolderOpen className="inline w-4 h-4 mr-2" />
              Catégories
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Chargement...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Produits</p>
                        <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Catégories</p>
                        <p className="text-3xl font-bold text-gray-900">{totalCategories}</p>
                      </div>
                      <div className="bg-purple-100 p-3 rounded-full">
                        <FolderOpen className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Prix Moyen</p>
                        <p className="text-3xl font-bold text-gray-900">{averagePrice} €</p>
                      </div>
                      <div className="bg-green-100 p-3 rounded-full">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Valeur Totale</p>
                        <p className="text-3xl font-bold text-gray-900">{totalValue} €</p>
                      </div>
                      <div className="bg-yellow-100 p-3 rounded-full">
                        <BarChart3 className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Produits par Catégorie</h2>
                  <div className="space-y-4">
                    {productsByCategory.map((cat, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                          <span className="text-sm font-semibold text-gray-900">{cat.count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${(cat.count / maxCount) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Products */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">Produits Récents</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {products.slice().reverse().slice(0, 5).map((prod) => (
                          <tr key={prod.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{prod.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                                {getCategoryName(prod.categoryid)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">{parseFloat(prod.price).toFixed(2)} €</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Gestion des Produits</h2>
                  <button
                    onClick={() => {
                      setEditProductId(null);
                      setProductForm({ name: '', categoryid: '', price: '' });
                      setShowProductModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Nouveau Produit
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="max-h-[450px] overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b sticky top-0 z-10">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50">Nom</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50">Catégorie</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50">Prix</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase bg-gray-50">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {products.map((prod) => (
                          <tr key={prod.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{prod.name}</td>
                            <td className="px-6 py-4 text-sm">
                              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                                {getCategoryName(prod.categoryid)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">{parseFloat(prod.price).toFixed(2)} €</td>
                            <td className="px-6 py-4 text-sm text-right">
                              <button
                                onClick={() => handleProductEdit(prod)}
                                className="text-blue-600 hover:text-blue-800 mr-3"
                              >
                                <Edit2 className="w-4 h-4 inline" />
                              </button>
                              <button
                                onClick={() => handleProductDelete(prod.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4 inline" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Gestion des Catégories</h2>
                  <button
                    onClick={() => {
                      setEditCategoryId(null);
                      setCategoryForm({ name: '' });
                      setShowCategoryModal(true);
                    }}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Nouvelle Catégorie
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((cat) => (
                    <div key={cat.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{cat.name}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCategoryEdit(cat)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCategoryDelete(cat.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {products.filter(p => p.categoryid === cat.id).length} produit(s)
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {editProductId ? 'Modifier le Produit' : 'Nouveau Produit'}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleProductSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: iPhone 15"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  value={productForm.categoryid}
                  onChange={(e) => setProductForm({ ...productForm, categoryid: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {editProductId ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {editCategoryId ? 'Modifier la Catégorie' : 'Nouvelle Catégorie'}
              </h3>
              <button onClick={() => setShowCategoryModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCategorySubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la catégorie</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ex: Électronique"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  {editCategoryId ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
