import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import API from '../api/axios';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [address, setAddress] = useState({
    name: '', street: '', city: '', state: '', zip: '', country: '', phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');

  if (!cart?.items?.length && step !== 3) {
    navigate('/cart');
    return null;
  }

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    const tax = Math.round(cartTotal * 0.18);
    const totalAmount = cartTotal + tax;

    try {
      setLoading(true);

      if (paymentMethod === 'Card') {
        // Razorpay Simulation
        const options = {
          key: 'rzp_test_dummykey', // Replace with real key in production
          amount: totalAmount * 100, // Amount in paise
          currency: 'INR',
          name: 'Zestora',
          description: 'Payment for your order',
          image: 'https://cdn-icons-png.flaticon.com/512/1162/1162460.png',
          handler: async function (response) {
            toast.success('Payment Successful! Processing order...');
            await submitOrder(totalAmount, tax, response.razorpay_payment_id);
          },
          prefill: {
            name: address.name,
            email: user?.email,
            contact: address.phone,
          },
          theme: { color: '#f97316' },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
        setLoading(false);
      } else {
        await submitOrder(totalAmount, tax);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  const submitOrder = async (total, tax, paymentId = 'COD') => {
    const orderItems = cart.items.map((i) => ({
      product: i.product._id,
      title: i.product.title,
      image: i.product.image,
      price: i.product.price,
      qty: i.qty,
    }));

    await API.post('/orders', {
      orderItems,
      shippingAddress: address,
      paymentMethod,
      itemsPrice: cartTotal,
      taxPrice: tax,
      shippingPrice: 0,
      totalPrice: total,
      paymentResult: { id: paymentId, status: 'success', update_time: new Date().toISOString() },
      isPaid: paymentMethod === 'Card',
      paidAt: paymentMethod === 'Card' ? new Date() : undefined,
    });

    await clearCart();
    setStep(3);
  };

  if (step === 3) {
    return (
      <div className="container-custom py-20 animate-fade-in flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
          <FiCheckCircle size={48} />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Order Confirmed!</h1>
        <p className="text-gray-500 text-lg mb-8 max-w-md">
          Thank you for shopping with Zestora. Your order has been placed successfully and is being processed.
        </p>
        <div className="flex gap-4">
          <button onClick={() => navigate('/orders')} className="btn-primary">View Orders</button>
          <button onClick={() => navigate('/products')} className="btn-secondary">Shop More</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-10 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:col-span-2 flex-1 space-y-8">
          
          {/* Step Tracker */}
          <div className="flex items-center gap-4 mb-8">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg ${step >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
            <div className={`h-1 flex-1 rounded ${step >= 2 ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg ${step >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
          </div>

          {/* Address Form */}
          {step === 1 && (
            <form onSubmit={handleAddressSubmit} className="card p-6 md:p-8 animate-fade-in">
              <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required type="text" placeholder="Full Name" value={address.name} onChange={e => setAddress({...address, name: e.target.value})} className="input md:col-span-2" />
                <input required type="text" placeholder="Street Address" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} className="input md:col-span-2" />
                <input required type="text" placeholder="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="input" />
                <input required type="text" placeholder="State" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} className="input" />
                <input required type="text" placeholder="ZIP Code" value={address.zip} onChange={e => setAddress({...address, zip: e.target.value})} className="input" />
                <input required type="text" placeholder="Phone Number" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} className="input" />
                <input required type="text" placeholder="Country" value={address.country} onChange={e => setAddress({...address, country: e.target.value})} className="input md:col-span-2" />
              </div>
              <button type="submit" className="btn-primary w-full mt-6">Continue to Payment</button>
            </form>
          )}

          {/* Payment Method */}
          {step === 2 && (
            <div className="card p-6 md:p-8 animate-fade-in">
              <h2 className="text-xl font-bold mb-6 flex justify-between items-center">
                Payment Method
                <button onClick={() => setStep(1)} className="text-sm text-orange-500 font-semibold hover:underline border-none bg-transparent">Edit Address</button>
              </h2>
              <div className="space-y-4">
                <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10' : 'border-gray-200 dark:border-gray-700'}`}>
                  <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-orange-500" />
                  <span className="font-semibold text-gray-900 dark:text-white">Cash on Delivery</span>
                </label>
                <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'Card' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10' : 'border-gray-200 dark:border-gray-700'}`}>
                  <input type="radio" name="payment" value="Card" checked={paymentMethod === 'Card'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-orange-500" />
                  <span className="font-semibold text-gray-900 dark:text-white">Credit / Debit Card (Dummy)</span>
                </label>
              </div>
              <button 
                onClick={handlePlaceOrder} 
                disabled={loading}
                className="btn-primary w-full mt-8 text-lg py-3.5 flex items-center justify-center gap-2"
              >
                {loading ? <span className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></span> : 'Place Order'}
              </button>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 lg:w-96">
          <div className="card p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">Order Summary</h2>
            <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
              {cart.items.map((i) => (
                <div key={i.product._id} className="flex gap-3">
                  <img src={i.product.image} alt="" className="w-16 h-16 rounded-lg object-cover bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug">{i.product.title}</p>
                    <p className="text-xs text-gray-500 mt-1">Qty: {i.qty} × ₹{i.product.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold text-gray-900 dark:text-white">₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tax (18% GST)</span>
                <span className="font-semibold text-gray-900 dark:text-white">₹{Math.round(cartTotal * 0.18).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
              <div className="flex justify-between pt-4 pb-2 text-lg font-bold border-t border-gray-200 dark:border-gray-800">
                <span>Total</span>
                <span className="text-orange-500">₹{(cartTotal + Math.round(cartTotal * 0.18)).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
