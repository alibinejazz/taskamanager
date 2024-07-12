import { useState } from "react";
import axios from "axios";

const useFetchComments = (projectId, taskId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await axios.get(`https://task-manager.codionslab.com/api/v1/project/${projectId}/task/${taskId}/comment`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { comments, loading, error, fetchComments };
};

export default useFetchComments;
