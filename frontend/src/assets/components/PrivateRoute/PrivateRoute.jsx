import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../components/Context/user.context'
import { useNavigate } from 'react-router-dom';


const PrivateRoute = ({ children }) => {
  const { user, token } = useContext(UserContext);
  console.log('User:', token);

  const navigate = useNavigate()

  if (!token) {
    console.log('Редирект на логин');


    return <Navigate to="/"  />;
  }

  return children;
};

export default PrivateRoute;