import { useState } from "react";
import axios from "axios";

const useEditUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const editUser = async (userId, updatedData) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `https://task-manager.codionslab.com/api/v1/admin/user/${userId}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err);
      setLoading(false);
      console.error("Failed to edit user", err);
      throw err;
    }
  };

  return { editUser, loading, error };
};

export default useEditUser;
