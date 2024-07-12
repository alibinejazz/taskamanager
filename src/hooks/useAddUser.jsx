import { useState } from 'react';
import axios from 'axios';

const useAddUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addUser = async (userData, token) => {
    setLoading(true);
    setError(null);
    try {
        const token = localStorage.getItem("token");
      const response = await axios.post('https://task-manager.codionslab.com/api/v1/admin/user', userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addUser, loading, error };
};

export default useAddUser;
