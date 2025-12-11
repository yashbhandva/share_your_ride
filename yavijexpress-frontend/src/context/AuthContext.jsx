import { createContext, useContext, useEffect, useState } from "react";
import { logoutApi } from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, email, role, name }

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");
    const name = localStorage.getItem("userName");
    const idStr = localStorage.getItem("userId");
    const id = idStr ? Number(idStr) : null;
    if (token && role) {
      setUser({ id, email, role, name });
    }
  }, []);

  const loginUser = ({ accessToken, id, role, email, name }) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("userRole", role);
    if (id != null) localStorage.setItem("userId", String(id));
    if (email) localStorage.setItem("userEmail", email);
    if (name) localStorage.setItem("userName", name);
    setUser({ id, email, role, name });
  };

  const logoutUser = async () => {
    try {
      await logoutApi();
    } catch (e) {
      // ignore network errors during logout
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
