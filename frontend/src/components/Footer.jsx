import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube } from 'react-icons/fi';

const categories = ['Electronics', 'Fashion', 'Books', 'Home & Kitchen', 'Sports', 'Beauty'];

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 mt-20">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">Z</span>
              </div>
              <span className="text-xl font-extrabold text-white">Zestora</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your one-stop destination for everything you love. Shop smart, shop Zestora.
            </p>
            <div className="flex gap-3 mt-5">
              {[FiInstagram, FiTwitter, FiFacebook, FiYoutube].map((Icon, i) => (
                <button key={i} className="w-9 h-9 bg-gray-800 hover:bg-orange-500 rounded-xl flex items-center justify-center transition-colors duration-200">
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2.5">
              {categories.map((c) => (
                <li key={c}>
                  <Link to={`/products?category=${encodeURIComponent(c)}`} className="text-sm text-gray-400 hover:text-orange-400 transition-colors">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[['Home', '/'], ['Products', '/products'], ['Cart', '/cart'], ['My Orders', '/orders'], ['Login', '/login'], ['Sign Up', '/signup']].map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="text-sm text-gray-400 hover:text-orange-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4">Stay Updated</h3>
            <p className="text-sm text-gray-400 mb-4">Get the latest deals straight to your inbox.</p>
            <div className="flex flex-col gap-2">
              <input type="email" placeholder="your@email.com" className="input text-sm py-2.5 bg-gray-800 border-gray-700" />
              <button className="btn-primary text-sm py-2.5">Subscribe</button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
          <p>© 2025 Zestora. All rights reserved.</p>
          <p>Built with ❤️ using React & Node.js</p>
        </div>
      </div>
    </footer>
  );
}
