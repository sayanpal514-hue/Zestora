import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { FiMail, FiArrowLeft } from 'react-icons/fi';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.post('/auth/forgotpassword', { email });
      setSent(true);
      toast.success('Reset link check (Console logged link)');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full animate-fade-in">
        <div className="card p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiMail size={32} />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Forgot Password?</h2>
            <p className="mt-2 text-sm text-gray-500">
              No worries! Enter your email and we'll send you a reset link.
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <FiMail />
                  </span>
                  <input
                    required
                    type="email"
                    className="input pl-10"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl text-sm font-medium">
                We've simulated sending a reset email. For this demo, please check the **backend server console** for the link!
              </div>
              <button 
                onClick={() => setSent(false)} 
                className="text-orange-500 hover:text-orange-600 text-sm font-semibold"
              >
                Try another email
              </button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-orange-500 transition-colors"
            >
              <FiArrowLeft /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
