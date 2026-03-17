import { useState, useEffect } from 'react';
import { FiTrash2, FiShield, FiUser } from 'react-icons/fi';
import API from '../api/axios';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/users?page=${page}`);
      setUsers(data.users);
      setPages(data.pages);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await API.delete(`/users/${id}`);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleToggleAdmin = async (user) => {
    try {
      await API.put(`/users/${user._id}`, { isAdmin: !user.isAdmin });
      toast.success(`User updated: ${user.name} is now ${!user.isAdmin ? 'an Admin' : 'a regular User'}`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  return (
    <div className="container-custom py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Console</h1>
        <div className="flex items-center gap-4 mt-2 text-sm">
          <Link to="/admin" className="text-gray-500 hover:text-orange-500">Overview</Link>
          <Link to="/admin/products" className="text-gray-500 hover:text-orange-500">Products</Link>
          <Link to="/admin/orders" className="text-gray-500 hover:text-orange-500">Orders</Link>
          <Link to="/admin/users" className="font-bold text-orange-500">Users</Link>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? <Loader /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">User Info</th>
                  <th className="px-6 py-4 font-semibold">Joined On</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                          {u.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{u.name}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${u.isAdmin ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>
                        {u.isAdmin ? 'Admin' : 'Customer'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleToggleAdmin(u)}
                          className={`p-2 rounded-lg transition-colors ${u.isAdmin ? 'text-gray-500 hover:bg-gray-100' : 'text-orange-500 hover:bg-orange-50'}`}
                          title={u.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                        >
                          {u.isAdmin ? <FiUser size={18} /> : <FiShield size={18} />}
                        </button>
                        <button 
                          onClick={() => handleDelete(u._id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg title='Delete User'"
                        >
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
    </div>
  );
}
