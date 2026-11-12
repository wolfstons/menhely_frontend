import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import { Loading } from './Status';

export function PublicLayout() {
  return (<><Navbar /><main><Outlet /></main><Footer /></>);
}

export function AuthLayout() {
  return (<><Navbar /><Outlet /></>);
}

export function AdminGuard({ children }: { children: JSX.Element }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/bejelentkezes" replace state={{ from: '/admin' }} />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}
