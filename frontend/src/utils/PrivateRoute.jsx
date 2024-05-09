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
      console.log('Checking authentication...'); // Debugging statement
      
      try {
        console.log('Sending request to verify token...'); // Debugging statement
        const response = await apiCall({
          method: 'GET',
          endpoint: '/user/verify-token',
          withCredentials: true
        });
        console.log('Received response:', response); // Debugging statement
        console.log('Response data:', response.data); // Debugging statement
      
        if (response === "OK") {
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
      console.log('Finished checking authentication'); // Debugging statement
    };

    checkAuthentication();
  }, [navigate]); 

  if (isLoading) {
    console.log('Loading...'); // Debugging statement
    return <Spinner />;
  }

  if (!isAuthenticated) {
    console.log('Not authenticated'); // Debugging statement
    return null;
  }

  console.log('Authenticated, rendering children'); // Debugging statement
  return isAuthenticated ? children : <Navigate to="/signin" state={{ from: location }} />;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
export default PrivateRoute;