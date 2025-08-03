import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loader from '../common/Loader';

/**
 * A component that protects routes based on authentication and role-based access
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {string} [props.requiredRole] - Required role to access the route (e.g., 'admin')
 * @param {string} [props.redirectTo] - Custom redirect path when unauthorized
 * @returns {JSX.Element} The protected route component
 */
const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  redirectTo = null 
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader fullScreen />;
  }

  // If not authenticated, redirect to login with return URL
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check if user has the required role if specified
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to custom path or unauthorized page
    return (
      <Navigate 
        to={redirectTo || '/unauthorized'} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // User is authenticated and has required role, render children
  return children;
};

export default ProtectedRoute;
