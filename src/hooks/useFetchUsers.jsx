import { useState, useEffect } from "react";
import axios from "axios";

const useFetchUsers = (isAdmin, page) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!isAdmin) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://task-manager.codionslab.com/api/v1/admin/user?page=${page}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(response.data);
      } catch (error) {
        setError(error);
        console.error("Failed to fetch users", error);
        if (error.response && error.response.status === 401) {
          console.log("Unauthorized access");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAdmin, page]);

  return { users, loading, error, setUsers };
};

export default useFetchUsers;
