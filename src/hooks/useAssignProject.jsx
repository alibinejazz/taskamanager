import { useState } from "react";
import axios from "axios";

const useAssignProject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const assignProject = async (projectId, userIds) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `https://task-manager.codionslab.com/api/v1/admin/project/${projectId}/assign`,
        { user_ids: userIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(response.data); 
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setError(error.response.data.errors);
      } else {
        setError("Failed to assign users");
      }
      console.error("Failed to assign project", error);
    } finally {
      setLoading(false);
    }
  };

  return { assignProject, loading, error, success };
};

export default useAssignProject;
