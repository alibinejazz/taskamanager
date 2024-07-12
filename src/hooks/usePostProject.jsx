import { useState } from 'react';
import axios from 'axios';

const usePostProject = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const postProject = async (onUpdate, onCancel) => {
    try {
      setLoading(true);
      setError(null);  
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://task-manager.codionslab.com/api/v1/admin/project',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Project posted successfully:', response.data);
      onUpdate(response.data);
      onCancel();
    } catch (error) {
      console.error('Failed to post project:', error);
      setError(error.response?.data || error.message); 
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    postProject,
    loading,
    error,  
  };
};

export default usePostProject;
