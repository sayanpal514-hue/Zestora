import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

export default function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  return user && user.isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}
