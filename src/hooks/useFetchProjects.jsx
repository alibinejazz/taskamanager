import { useState, useEffect } from "react";
import axios from "axios";

const useFetchProjects = (isAdmin, user) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProjects = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          isAdmin
            ? `https://task-manager.codionslab.com/api/v1/admin/project?page=${page}`
            : `https://task-manager.codionslab.com/api/v1/project?page=${page}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProjects(response.data);
      } catch (error) {
        setError(error);
        console.error("Failed to fetch projects", error);
        if (error.response && error.response.status === 401) {
          console.log("Unauthorized access");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [isAdmin, user, page]);

  return { projects, loading, error, setProjects, page, setPage };
};

export default useFetchProjects;
