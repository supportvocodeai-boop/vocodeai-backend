import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";
export default function OAuthSuccess() {
  const [params] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

useEffect(() => {
  const completeLogin = async () => {
    try {
      const { data } = await api.post("/auth/refresh-token");

      login(data.accessToken, data.user);
      navigate("/dashboard");

    } catch {
      navigate("/login");
    }
  };

  completeLogin();
}, []);

  return <p>Logging you in...</p>;
}