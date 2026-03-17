import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-8 sm:p-10 animate-fade-in shadow-2xl shadow-orange-500/5">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">Z</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-2">Sign in to your Zestora account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input bg-gray-50 dark:bg-gray-800/50"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
              <Link to="/forgotpassword" data-testid="forgot-password-link" className="text-xs font-semibold text-orange-500 hover:text-orange-600 cursor-pointer">Forgot?</Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input bg-gray-50 dark:bg-gray-800/50"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-3 mt-4 text-sm flex justify-center"
          >
            {loading ? <span className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></span> : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-orange-500 hover:text-orange-600 transition-colors">
            Create an account
          </Link>
        </p>
        
        {/* Helper values */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-xs text-center text-gray-400">
          <p>Demo Admin: admin@zestora.com / admin123</p>
          <p>Demo User: john@example.com / user1234</p>
        </div>
      </div>
    </div>
  );
}
