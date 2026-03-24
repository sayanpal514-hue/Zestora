import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiTrendingUp } from 'react-icons/fi';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await API.get('/products/featured');
        setFeatured(data);
      } catch (error) {
        console.error('Failed to fetch featured products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500', color: 'bg-blue-500' },
    { name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500', color: 'bg-pink-500' },
    { name: 'Books', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500', color: 'bg-yellow-500' },
    { name: 'Sports', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500', color: 'bg-green-500' },
    { name: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500', color: 'bg-orange-500' },
    { name: 'Beauty', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500', color: 'bg-purple-500' },
    { name: 'Toys', image: 'https://images.unsplash.com/photo-1539627831859-a911cf04d3cd?w=500', color: 'bg-red-500' },
    { name: 'Food', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500', color: 'bg-yellow-600' },
  ];

  return (
    <div className="animate-fade-in pb-16">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600" 
          alt="Hero" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="container-custom relative z-20 py-24 md:py-32 lg:py-40 flex flex-col items-start justify-center">
          <span className="badge bg-orange-500 text-white mb-6 uppercase tracking-wider text-sm px-4 py-1.5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            New Season Arrival
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 max-w-3xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">Everyday Style</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-xl leading-relaxed animate-slide-up" style={{ animationDelay: '0.3s' }}>
            Discover the latest trends in fashion, cutting-edge electronics, and more. Unbeatable prices.
          </p>
          <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Link to="/products" className="btn-primary flex items-center gap-2 text-lg px-8 py-3.5">
              Shop Now <FiArrowRight />
            </Link>
            <Link to="/products?category=Electronics" className="btn-secondary text-gray-900 dark:text-white bg-white/10 hover:bg-white/20 text-lg px-8 py-3.5 backdrop-blur-sm">
              Explore Tech
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container-custom my-20">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-orange-500">
              <FiTrendingUp size={24} />
            </div>
            <h2 className="section-title">Trending Now</h2>
          </div>
          <Link to="/products" className="group flex items-center gap-2 text-orange-500 font-semibold hover:text-orange-600 transition-colors">
            View All <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="bg-gray-100 dark:bg-gray-900 py-20">
        <div className="container-custom">
          <h2 className="section-title mb-10 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <Link 
                to={`/products?category=${encodeURIComponent(cat.name)}`} 
                key={i}
                className="group relative h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} mix-blend-multiply opacity-60 group-hover:opacity-80 transition-opacity`}></div>
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{cat.name}</h3>
                  <span className="text-white/80 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 font-medium">
                    Explore <FiArrowRight />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="container-custom mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Free Shipping', desc: 'On orders over ₹999', icon: '🚚' },
            { title: 'Easy Returns', desc: '30-day return policy', icon: '🔄' },
            { title: 'Secure Payment', desc: '100% secure checkout', icon: '🔒' },
          ].map((perk, i) => (
            <div key={i} className="card p-8 text-center hover:translate-y-[-4px] transition-transform">
              <div className="text-4xl mb-4">{perk.icon}</div>
              <h3 className="hidden shrink text-lg font-bold text-gray-900 dark:text-white mb-2">{perk.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">{perk.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
