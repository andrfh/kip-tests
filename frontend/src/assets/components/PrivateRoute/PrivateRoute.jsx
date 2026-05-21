import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../components/Context/user.context'


const PrivateRoute = ({ children, allowedRoles }) => {
  const { authReady, isAuthenticated, user } = useContext(UserContext);

  if (!authReady) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/"  />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/error/403" replace />;
  }

  return children;
};

export default PrivateRoute;


