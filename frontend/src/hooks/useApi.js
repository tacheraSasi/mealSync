import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:5000/api';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getAuthHeader, logout } = useAuth();

  const request = async (method, endpoint, data = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const url = `${API_URL}${endpoint}`;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      };

      let response;
      switch (method.toLowerCase()) {
        case 'get':
          response = await axios.get(url, config);
          break;
        case 'post':
          response = await axios.post(url, data, config);
          break;
        case 'put':
          response = await axios.put(url, data, config);
          break;
        case 'delete':
          response = await axios.delete(url, config);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      return { data: response.data, error: null };
    } catch (err) {
      // Handle unauthorized errors
      if (err.response?.status === 401) {
        logout();
        return { data: null, error: 'Your session has expired. Please log in again.' };
      }

      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    get: (endpoint) => request('get', endpoint),
    post: (endpoint, data) => request('post', endpoint, data),
    put: (endpoint, data) => request('put', endpoint, data),
    delete: (endpoint) => request('delete', endpoint),
  };
};

export default useApi;
