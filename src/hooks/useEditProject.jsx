import { useState } from "react";
import axios from "axios";

const useEditProject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const editProject = async (projectId, updatedData) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `https://task-manager.codionslab.com/api/v1/admin/project/${projectId}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err);
      setLoading(false);
      console.error("Failed to edit project", err);
      throw err;
    }
  };

  return { editProject, loading, error };
};

export default useEditProject;
