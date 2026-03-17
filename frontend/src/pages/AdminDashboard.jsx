import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiBox, FiShoppingBag, FiDollarSign } from 'react-icons/fi';
import API from '../api/axios';
import Loader from '../components/Loader';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0, products: 0, orders: 0, revenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          API.get('/users?pageSize=1'),
          API.get('/products?pageSize=1'),
          API.get('/orders?pageSize=5')
        ]);
        
        // Sum total revenue manually for dummy purposes (since we don't have a direct aggregate route yet)
        const allOrders = await API.get('/orders?pageSize=1000').catch(() => ({ data: { orders: [] } }));
        const totalRevenue = allOrders.data?.orders?.reduce((acc, order) => {
          return order.isPaid || order.status === 'Delivered' ? acc + order.totalPrice : acc;
        }, 0) || 0;

        setStats({
          users: usersRes.data.total,
          products: productsRes.data.total,
          orders: ordersRes.data.total,
          revenue: totalRevenue
        });
        
        setRecentOrders(ordersRes.data.orders);
      } catch (error) {
        console.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container-custom py-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your store's performance</p>
        </div>
        <Link to="/" className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors">
          &larr; Back to Store
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="card p-6 flex flex-col bg-gradient-to-br from-green-50 to-white dark:from-green-900/10 dark:to-gray-900">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Revenue</p>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">₹{stats.revenue.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-green-100 text-green-600 rounded-xl"><FiDollarSign size={24} /></div>
          </div>
        </div>
        
        <Link to="/admin/orders" className="card p-6 flex flex-col hover:border-orange-500 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Orders</p>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">{stats.orders}</h3>
            </div>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><FiShoppingBag size={24} /></div>
          </div>
          <div className="mt-auto text-xs font-bold text-orange-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            Manage Orders &rarr;
          </div>
        </Link>

        <Link to="/admin/products" className="card p-6 flex flex-col hover:border-orange-500 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Products</p>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">{stats.products}</h3>
            </div>
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl"><FiBox size={24} /></div>
          </div>
          <div className="mt-auto text-xs font-bold text-orange-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            Manage Inventory &rarr;
          </div>
        </Link>

        <Link to="/admin/users" className="card p-6 flex flex-col hover:border-orange-500 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Users</p>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">{stats.users}</h3>
            </div>
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><FiUsers size={24} /></div>
          </div>
          <div className="mt-auto text-xs font-bold text-orange-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            Manage Users &rarr;
          </div>
        </Link>
      </div>

      {/* Recent Orders Table */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
              {recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-gray-900 dark:text-gray-300">{order._id}</td>
                  <td className="px-6 py-4 font-semibold">{order.user?.name || 'Deleted User'}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-bold">₹{order.totalPrice.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
