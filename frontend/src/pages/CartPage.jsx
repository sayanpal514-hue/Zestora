import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';

export default function CartPage() {
  const { cart, cartLoading, updateQty, removeFromCart, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  if (cartLoading) return <Loader />;

  if (!cart?.items?.length) {
    return (
      <div className="container-custom py-20 animate-fade-in text-center flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/30 text-orange-500 rounded-full flex items-center justify-center mb-6">
          <FiShoppingBag size={40} />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Your cart is empty</h2>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          Looks like you haven't added anything to your cart yet. Discover something amazing in our store.
        </p>
        <Link to="/products" className="btn-primary flex items-center gap-2">
          Start Shopping <FiArrowRight />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-10 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Shopping Cart ({cartCount} Items)</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.product._id} className="card p-4 sm:p-6 flex flex-col sm:flex-row gap-6">
              <Link to={`/products/${item.product._id}`} className="shrink-0">
                <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <img src={item.product.image} alt={item.product.title} className="w-full h-full object-cover" />
                </div>
              </Link>
              
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <Link to={`/products/${item.product._id}`}>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white hover:text-orange-500 transition-colors line-clamp-2">
                      {item.product.title}
                    </h3>
                  </Link>
                  <span className="text-xl font-extrabold text-gray-900 dark:text-white whitespace-nowrap">
                    ₹{item.product.price.toLocaleString('en-IN')}
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 mb-4">{item.product.brand}</p>
                
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center w-28 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <button 
                      onClick={() => updateQty(item.product._id, item.qty - 1)}
                      disabled={item.qty <= 1}
                      className="text-gray-500 hover:text-orange-500 disabled:opacity-50"
                    ><FiMinus size={14} /></button>
                    <span className="flex-1 text-center font-bold text-gray-900 dark:text-white text-sm">{item.qty}</span>
                    <button 
                      onClick={() => updateQty(item.product._id, item.qty + 1)}
                      disabled={item.qty >= item.product.stock}
                      className="text-gray-500 hover:text-orange-500 disabled:opacity-50"
                    ><FiPlus size={14} /></button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.product._id)}
                    className="flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <FiTrash2 /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
              Order Summary
            </h2>
            
            <div className="space-y-4 mb-6 text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal ({cartCount} items)</span>
                <span className="font-medium text-gray-900 dark:text-white">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Discount</span>
                <span>-₹0</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="text-green-600 dark:text-green-400">FREE</span>
              </div>
            </div>
            
            <div className="py-4 border-t border-dashed border-gray-200 dark:border-gray-700 mb-6 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4 -mx-2">
              <span className="text-lg font-bold text-gray-900 dark:text-white">Total Amount</span>
              <span className="text-2xl font-extrabold text-orange-500">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full text-lg py-3.5 mb-4 shadow-lg shadow-orange-500/30"
            >
              Proceed to Checkout
            </button>
            <Link to="/products" className="block text-center text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
