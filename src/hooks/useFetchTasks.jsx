// hooks/useFetchTasks.js
import { useState, useEffect } from "react";
import axios from "axios";

const useFetchTasks = (projectId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://task-manager.codionslab.com/api/v1/project/${projectId}/task`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTasks(response.data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId]);

  return { tasks, loading, error };
};

export default useFetchTasks;
