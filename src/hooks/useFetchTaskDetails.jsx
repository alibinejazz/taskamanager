import { useState } from "react";
import axios from "axios";

const useFetchTaskDetails = (projectId) => {
  const [taskDetails, setTaskDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTaskDetails = async (taskId) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await axios.get(`https://task-manager.codionslab.com/api/v1/project/${projectId}/task/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTaskDetails(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { taskDetails, loading, error, fetchTaskDetails };
};

export default useFetchTaskDetails;
