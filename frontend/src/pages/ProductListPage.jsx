import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiFilter, FiX } from 'react-icons/fi';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [mobFilterOpen, setMobFilterOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const currentPage = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    API.get('/products/categories').then((res) => setCategories(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/products?keyword=${keyword}&category=${category}&sort=${sort}&page=${currentPage}`);
        setProducts(data.products);
        setPage(data.page);
        setPages(data.pages);
        setTotal(data.total);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, category, sort, currentPage]);

  const updateSearchParam = (key, value) => {
    const params = new URLSearchParams(location.search);
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== 'page') params.set('page', '1');
    navigate(`/products?${params.toString()}`);
  };

  const handlePageChange = (p) => {
    updateSearchParam('page', p.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sidebar Filters Component
  const Filters = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-800">
          Categories
        </h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => updateSearchParam('category', '')}
              className={`text-sm w-full text-left py-1.5 transition-colors ${!category ? 'font-bold text-orange-500' : 'text-gray-600 dark:text-gray-400 hover:text-orange-500'}`}
            >
              All Categories
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => updateSearchParam('category', cat)}
                className={`text-sm w-full text-left py-1.5 transition-colors ${category === cat ? 'font-bold text-orange-500' : 'text-gray-600 dark:text-gray-400 hover:text-orange-500'}`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-800">
          Sort By
        </h3>
        <select
          value={sort}
          onChange={(e) => updateSearchParam('sort', e.target.value)}
          className="input"
        >
          <option value="">Featured</option>
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Average Rating</option>
        </select>
      </div>

      {keyword && (
        <button
          onClick={() => updateSearchParam('keyword', '')}
          className="btn-outline w-full text-sm"
        >
          Clear Search ({keyword})
        </button>
      )}
    </div>
  );

  return (
    <div className="container-custom py-8 animate-fade-in">
      {/* Mobile Header Box */}
      <div className="flex md:hidden items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">{keyword ? `Search: ${keyword}` : category || 'All Products'}</h1>
          <p className="text-sm text-gray-500">{total} items found</p>
        </div>
        <button onClick={() => setMobFilterOpen(true)} className="btn-secondary text-sm flex items-center gap-2 px-4 py-2">
          <FiFilter /> Filter
        </button>
      </div>

      {/* Desktop Layout */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 shrink-0">
          <div className="sticky top-24 card p-6">
            <Filters />
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="flex-1">
          {/* Desktop Header Range */}
          <div className="hidden md:flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {keyword ? `Search Results for "${keyword}"` : category || 'All Products'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">Showing {products.length} of {total} items</p>
            </div>
          </div>

          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No products found</h2>
              <p className="text-gray-500 mb-6">We couldn't find anything matching your criteria.</p>
              <button onClick={() => navigate('/products')} className="btn-primary">Clear all filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <Pagination page={page} pages={pages} onPageChange={handlePageChange} />
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Slide Over */}
      {mobFilterOpen && (
        <div className="fixed inset-0 z-[60] flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobFilterOpen(false)} />
          <div className="relative w-4/5 max-w-sm ml-auto bg-white dark:bg-gray-950 h-full p-6 shadow-2xl overflow-y-auto animate-fade-in flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
              <button onClick={() => setMobFilterOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-300">
                <FiX size={20} />
              </button>
            </div>
            <div className="flex-1">
              <Filters />
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
              <button onClick={() => setMobFilterOpen(false)} className="btn-primary w-full">Apply Filters</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
