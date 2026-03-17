import { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import API from '../api/axios';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    title: '', price: 0, image: '', category: 'Electronics', brand: '', stock: 0, description: ''
  });

  const categories = ['Electronics', 'Fashion', 'Books', 'Home & Kitchen', 'Sports', 'Beauty', 'Toys', 'Food', 'Other'];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/products?page=${page}&keyword=${searchTerm}`);
      setProducts(data.products);
      setPages(data.pages);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await API.delete(`/products/${id}`);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentProduct({
      title: '', price: 0, image: '', category: 'Electronics', brand: '', stock: 0, description: ''
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await API.put(`/products/${currentProduct._id}`, currentProduct);
        toast.success('Product updated successfully');
      } else {
        await API.post('/products', currentProduct);
        toast.success('Product added successfully');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  return (
    <div className="container-custom py-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Console</h1>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <Link to="/admin" className="text-gray-500 hover:text-orange-500">Overview</Link>
            <Link to="/admin/products" className="font-bold text-orange-500">Products</Link>
            <Link to="/admin/orders" className="text-gray-500 hover:text-orange-500">Orders</Link>
            <Link to="/admin/users" className="text-gray-500 hover:text-orange-500">Users</Link>
          </div>
        </div>
        <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
          <FiPlus /> Add Product
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              className="input pl-10 h-10 py-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {loading ? <Loader /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Product</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold">Stock</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                        <span className="font-semibold text-gray-900 dark:text-white max-w-[200px] truncate">{product.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
                    <td className="px-6 py-4 font-bold">₹{product.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${product.stock < 10 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(product)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                          <FiEdit size={18} />
                        </button>
                        <button onClick={() => handleDelete(product._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination page={page} pages={pages} onPageChange={setPage} />

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-fade-in max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <h2 className="text-xl font-bold">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1">Product Title</label>
                  <input required className="input" value={currentProduct.title} onChange={e => setCurrentProduct({...currentProduct, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Price (₹)</label>
                  <input required type="number" className="input" value={currentProduct.price} onChange={e => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Stock</label>
                  <input required type="number" className="input" value={currentProduct.stock} onChange={e => setCurrentProduct({...currentProduct, stock: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Category</label>
                  <select className="input" value={currentProduct.category} onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Brand</label>
                  <input required className="input" value={currentProduct.brand} onChange={e => setCurrentProduct({...currentProduct, brand: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1">Product Image</label>
                  <div className="flex gap-4">
                    <input className="input flex-1" value={currentProduct.image} onChange={e => setCurrentProduct({...currentProduct, image: e.target.value})} placeholder="Image URL" />
                    <label className="btn-secondary flex items-center justify-center cursor-pointer px-4 whitespace-nowrap">
                      Upload File
                      <input type="file" hidden onChange={async (e) => {
                        const file = e.target.files[0];
                        const formData = new FormData();
                        formData.append('image', file);
                        try {
                          const { data } = await API.post('/upload', formData, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                          });
                          setCurrentProduct({ ...currentProduct, image: data.image });
                          toast.success('Image uploaded!');
                        } catch (err) {
                          toast.error('Upload failed');
                        }
                      }} />
                    </label>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1">Description</label>
                  <textarea required className="input h-32 resize-none" value={currentProduct.description} onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
