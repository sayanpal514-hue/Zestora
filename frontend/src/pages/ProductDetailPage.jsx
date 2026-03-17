import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiMinus, FiPlus, FiTruck, FiShield, FiRotateCcw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import StarRating from '../components/StarRating';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }
    addToCart(product._id, qty);
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    try {
      if (!rating || !comment) {
        return toast.error('Please provide a rating and a review comment');
      }
      await API.post(`/products/${id}/reviews`, { rating, comment });
      toast.success('Review submitted successfully');
      // Refetch product
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
      setRating(0);
      setComment('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return <Loader />;

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const images = product.images?.length > 0 ? product.images : [product.image];

  return (
    <div className="container-custom py-10 animate-fade-in">
      <div className="card grid grid-cols-1 lg:grid-cols-2 gap-10 p-6 md:p-10 mb-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img 
              src={images[activeImage]} 
              alt={product.title} 
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            {discount > 0 && <span className="absolute top-4 left-4 badge bg-green-500 text-white px-3 py-1.5 text-sm">-{discount}% OFF</span>}
          </div>
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)}
                  className={`relative w-24 h-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-orange-500' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col h-full">
          <span className="text-sm font-semibold text-orange-500 mb-2 uppercase tracking-wide">{product.category}</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">{product.title}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <StarRating rating={product.rating} readOnly />
            <span className="text-sm text-gray-500 dark:text-gray-400">({product.numReviews} Reviews)</span>
            <span className="text-sm text-gray-400">|</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Brand: {product.brand}</span>
          </div>

          <div className="py-6 border-y border-gray-200 dark:border-gray-800 mb-6">
            <div className="flex items-baseline gap-4 mb-2">
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">₹{product.price.toLocaleString('en-IN')}</span>
              {discount > 0 && (
                <span className="text-xl text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Inclusive of all taxes</p>
          </div>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">{product.description}</p>

          <div className="mt-auto space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Quantity selector */}
              {product.stock > 0 && (
                <div className="flex items-center justify-between w-32 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)} className="text-gray-500 hover:text-orange-500"><FiMinus /></button>
                  <span className="font-bold text-gray-900 dark:text-white">{qty}</span>
                  <button onClick={() => setQty(qty < product.stock ? qty + 1 : qty)} className="text-gray-500 hover:text-orange-500"><FiPlus /></button>
                </div>
              )}

              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn-primary flex-1 flex items-center justify-center gap-2 py-3.5 text-lg"
              >
                <FiShoppingCart />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
            {product.stock > 0 && product.stock <= 5 && (
              <p className="text-red-500 text-sm font-semibold">Hurry! Only {product.stock} left in stock.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400"><FiTruck size={20} className="text-orange-500"/> Free delivery</div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400"><FiRotateCcw size={20} className="text-orange-500"/> 7 days replacement</div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400"><FiShield size={20} className="text-orange-500"/> 1 year warranty</div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="card p-6 md:p-10">
        <h2 className="section-title mb-8">Customer Reviews</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
              <h3 className="text-6xl font-extrabold text-gray-900 dark:text-white mb-2">{product.rating.toFixed(1)}</h3>
              <div className="flex justify-center mb-2"><StarRating rating={product.rating} readOnly /></div>
              <p className="text-sm text-gray-500">Based on {product.numReviews} reviews</p>
            </div>
            
            {user ? (
              <form onSubmit={submitReviewHandler} className="space-y-4">
                <h4 className="font-bold text-gray-900 dark:text-white">Write a Review</h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <span className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Select Rating</span>
                  <StarRating rating={rating} setRating={setRating} />
                </div>
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows="4" 
                  className="input resize-none"
                ></textarea>
                <button type="submit" className="btn-primary w-full">Submit Review</button>
              </form>
            ) : (
              <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl text-center border border-orange-100 dark:border-orange-900/30">
                <p className="text-gray-700 dark:text-gray-300 mb-3">Please login to write a review</p>
                <button onClick={() => navigate('/login')} className="btn-secondary w-full">Login Now</button>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            {product.reviews.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 py-10">
                <div className="text-4xl mb-3">📝</div>
                <p>No reviews yet. Be the first to review!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {product.reviews.map((rev) => (
                  <div key={rev._id} className="border-b border-gray-100 dark:border-gray-800 pb-6 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {rev.name[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-900 dark:text-white">{rev.name}</p>
                            {user?.isAdmin && (
                              <button 
                                onClick={async () => {
                                  if(window.confirm('Delete this review?')) {
                                    try {
                                      await API.delete(`/products/${product._id}/reviews/${rev._id}`);
                                      toast.success('Review deleted');
                                      const { data } = await API.get(`/products/${product._id}`);
                                      setProduct(data);
                                    } catch (err) { toast.error('Failed to delete'); }
                                  }
                                }}
                                className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded hover:bg-red-200 transition-colors"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{new Date(rev.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <StarRating rating={rev.rating} readOnly />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mt-3">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
