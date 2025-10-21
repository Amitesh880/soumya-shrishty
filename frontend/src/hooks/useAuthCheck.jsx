
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";


const useAuthCheck = () => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  
  const validateLogin = (onSuccess) => {
    if (isLoading) return false;

    if (!isAuthenticated) {
      setTimeout(() => {
        toast.error("You need to log in to continue", {
          position: "bottom-right",
        });
      }, 100);

      loginWithRedirect();
      return false;
    }

    if (onSuccess) onSuccess();
    return true;
  };

  return { validateLogin, isAuthenticated };
};

export default useAuthCheck;