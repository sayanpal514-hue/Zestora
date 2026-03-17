import { useState, useEffect } from 'react';
import { FiEye, FiCheck, FiTruck, FiX } from 'react-icons/fi';
import API from '../api/axios';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/orders?page=${page}`);
      setOrders(data.orders);
      setPages(data.pages);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="container-custom py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Console</h1>
        <div className="flex items-center gap-4 mt-2 text-sm">
          <Link to="/admin" className="text-gray-500 hover:text-orange-500">Overview</Link>
          <Link to="/admin/products" className="text-gray-500 hover:text-orange-500">Products</Link>
          <Link to="/admin/orders" className="font-bold text-orange-500">Orders</Link>
          <Link to="/admin/users" className="text-gray-500 hover:text-orange-500">Users</Link>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? <Loader /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Order ID</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Total</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-mono">{order._id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{order.user?.name || 'Deleted User'}</p>
                        <p className="text-xs text-gray-500">{order.user?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">₹{order.totalPrice.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(order._id, 'Shipped')}
                              className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg title='Mark as Shipped'"
                            >
                              <FiTruck size={18} />
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(order._id, 'Delivered')}
                              className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg title='Mark as Delivered'"
                            >
                              <FiCheck size={18} />
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(order._id, 'Cancelled')}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg title='Cancel Order'"
                            >
                              <FiX size={18} />
                            </button>
                          </>
                        )}
                        <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                          <FiEye size={18} />
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
    </div>
  );
}
