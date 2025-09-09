import axios from "axios";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      // 🔴 Remove from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userData");

      // 🔴 Call backend to clear cookie
      await axios.post("http://localhost:4000/api/auth/logout", {}, {
        withCredentials: true,
      });

      // 🔁 Redirect to login
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login"); // Fallback redirect
    }
  };

  return logout;
};

export default useLogout;
