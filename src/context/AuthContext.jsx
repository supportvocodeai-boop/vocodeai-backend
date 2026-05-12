import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);   // ✅ ADD THIS
  const [loading, setLoading] = useState(true);

  /* ================= AUTO REFRESH ON APP LOAD ================= */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.post("/auth/refresh-token");

        setAccessToken(data.accessToken);
        setUser(data.user); // ✅ Now valid
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  /* ================= LOGIN ================= */
  const login = (token, userData) => {
    setAccessToken(token);
    setUser(userData);
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}

    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,        // ✅ EXPOSE USER
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);