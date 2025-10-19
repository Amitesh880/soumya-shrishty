import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";

const useAuthCheck = () => {
  // 1. Get loginWithRedirect here
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0(); 

  const validateLogin = () => {
    if (isLoading) return false;

    if (!isAuthenticated) {
      // 2. Add the call to initiate the login process
      loginWithRedirect(); 
      
      toast.error("You need to log in to continue", {
        position: "bottom-right",
      });
      
      // 3. Return false so the calling component knows to stop
      return false; 
    }

    return true;
  };

  return { validateLogin };
};

export default useAuthCheck;