import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { FiUser, FiMapPin, FiLock, FiSave } from 'react-icons/fi';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: {
      street: '', city: '', state: '', zip: '', country: ''
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/auth/me');
        setFormData({
          name: data.name || '',
          email: data.email || '',
          password: '',
          confirmPassword: '',
          address: data.address || { street: '', city: '', state: '', zip: '', country: '' }
        });
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    try {
      setUpdating(true);
      const { data } = await API.put('/auth/profile', {
        name: formData.name,
        email: formData.email,
        password: formData.password || undefined,
        address: formData.address
      });
      
      updateUser({ name: data.name, email: data.email });
      toast.success('Profile updated successfully! ✨');
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container-custom py-10 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Account</h1>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Account Settings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6 md:p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FiUser className="text-orange-500" /> Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Full Name</label>
                  <input 
                    required 
                    className="input" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Email Address</label>
                  <input 
                    required 
                    type="email" 
                    className="input" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
              </div>
            </div>

            <div className="card p-6 md:p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FiMapPin className="text-orange-500" /> Default Shipping Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Street Address</label>
                  <input 
                    className="input" 
                    value={formData.address.street} 
                    onChange={e => setFormData({...formData, address: {...formData.address, street: e.target.value}})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">City</label>
                  <input 
                    className="input" 
                    value={formData.address.city} 
                    onChange={e => setFormData({...formData, address: {...formData.address, city: e.target.value}})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">State</label>
                  <input 
                    className="input" 
                    value={formData.address.state} 
                    onChange={e => setFormData({...formData, address: {...formData.address, state: e.target.value}})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">ZIP Code</label>
                  <input 
                    className="input" 
                    value={formData.address.zip} 
                    onChange={e => setFormData({...formData, address: {...formData.address, zip: e.target.value}})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Country</label>
                  <input 
                    className="input" 
                    value={formData.address.country} 
                    onChange={e => setFormData({...formData, address: {...formData.address, country: e.target.value}})} 
                  />
                </div>
              </div>
            </div>

            <div className="card p-6 md:p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FiLock className="text-orange-500" /> Change Password
              </h2>
              <p className="text-sm text-gray-500 mb-6 font-medium">Leave blank if you don't want to change it.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">New Password</label>
                  <input 
                    type="password" 
                    className="input" 
                    value={formData.password} 
                    placeholder="••••••••"
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Confirm New Password</label>
                  <input 
                    type="password" 
                    className="input" 
                    value={formData.confirmPassword} 
                    placeholder="••••••••"
                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 border-4 border-white dark:border-gray-800 shadow-lg">
                  {formData.name[0]?.toUpperCase()}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">{formData.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{formData.email}</p>
              </div>

              <button 
                type="submit" 
                disabled={updating}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3"
              >
                {updating ? (
                  <span className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <FiSave /> Save Changes
                  </>
                )}
              </button>
              
              <p className="text-[10px] text-center text-gray-400 mt-4 leading-relaxed">
                Updating your email will require you to use the new one for your next sign-in.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
