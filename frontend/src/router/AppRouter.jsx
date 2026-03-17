import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';

import HomePage from '../pages/HomePage';
import ProductListPage from '../pages/ProductListPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrdersPage from '../pages/OrdersPage';
import AdminDashboard from '../pages/AdminDashboard';
import ProfilePage from '../pages/ProfilePage';
import AdminProductsPage from '../pages/AdminProductsPage';
import AdminOrdersPage from '../pages/AdminOrdersPage';
import AdminUsersPage from '../pages/AdminUsersPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
      <Route path="/resetpassword/:token" element={<ResetPasswordPage />} />

      {/* Protected Routes (User only) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
      </Route>
      
      {/* 404 */}
      <Route path="*" element={
        <div className="container-custom py-20 text-center flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-8xl font-black text-orange-500 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Page Not Found</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <a href="/" className="btn-primary">Back to Home</a>
        </div>
      } />
    </Routes>
  );
}
