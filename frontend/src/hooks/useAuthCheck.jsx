
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useAuthCheck = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const validateLogin = (onSuccess) => {
    if (isLoading) return false;

    if (!isAuthenticated) {
      setTimeout(() => {
        toast.error("You need to log in to continue", {
          position: "bottom-right",
        });
      }, 100);

      navigate("/login");
      return false;
    }

    if (onSuccess) onSuccess();
    return true;
  };

  return { validateLogin, isAuthenticated };
};

export default useAuthCheck;