import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Context/AuthContext";

const useAuthRedirect = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);
};

export default useAuthRedirect;
