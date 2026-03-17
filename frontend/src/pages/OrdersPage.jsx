import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Loader from '../components/Loader';
import { FiEye, FiCheck, FiX } from 'react-icons/fi';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders/mine');
        setOrders(data);
      } catch (error) {
        console.error('Failure fetching orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container-custom py-10 animate-fade-in min-h-[70vh]">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="card p-12 text-center flex flex-col items-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold mb-2">No orders found</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
          <Link to="/products" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="card overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800 flex flex-wrap justify-between items-center gap-4">
                <div className="flex gap-8">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Order Placed</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Total</p>
                    <p className="text-sm font-bold text-orange-500">₹{order.totalPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Order #</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white font-mono break-all max-w-[120px] sm:max-w-xs truncate">
                      {order._id}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`badge px-3 py-1 flex items-center gap-1.5 ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                    order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status === 'Delivered' ? <FiCheck /> : order.status === 'Cancelled' ? <FiX /> : <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>}
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div className="p-4 sm:p-6 pb-2">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex gap-4 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0 last:mb-0">
                    <img src={item.image} alt={item.title} className="w-20 h-20 rounded-xl object-cover border border-gray-200 dark:border-gray-700 shrink-0" />
                    <div className="flex-1">
                      <Link to={`/products/${item.product}`}>
                        <h4 className="font-bold text-gray-900 dark:text-white hover:text-orange-500 line-clamp-2 md:line-clamp-1 mb-1 transition-colors">{item.title}</h4>
                      </Link>
                      <p className="text-sm text-gray-500 mb-2">Qty: {item.qty} × ₹{item.price.toLocaleString()}</p>
                    </div>
                    <div className="shrink-0 flex gap-2">
                      <Link to={`/products/${item.product}`} className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 hidden sm:flex">
                        <FiEye /> View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
