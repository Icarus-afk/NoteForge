import { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { apiCall } from './apiHandler';
import Spinner from '../components/Spinner';

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      setIsLoading(true); // Start loading

      try {
        const response = await apiCall({
          method: 'GET',
          endpoint: '/user/verify-token',
          withCredentials: true
        });
        if (response.status === 200) {
          console.log('Refresh token is valid');
          setIsAuthenticated(true);
        } else {
          console.log('Refresh token is invalid');
          setIsAuthenticated(false);
          navigate('/signin');
        }
      } catch (error) {
        if (error.response) {
          console.log('Error verifying token:', error.response.data);
        } else {
          console.log('Error verifying token:', error.message);
        }
        setIsAuthenticated(false);
        navigate('/signin');
      }

      setIsLoading(false); 
    };

    checkAuthentication();
  }, [navigate]); 

  if (isLoading) {
    return <Spinner />;
    }

  if (!isAuthenticated) {
    return null;
  }

  return isAuthenticated ? children : <Navigate to="/signin" state={{ from: location }} />;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
export default PrivateRoute;