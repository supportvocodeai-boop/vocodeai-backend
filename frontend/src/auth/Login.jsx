import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import "../styles/auth.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      // 🔥 store access token in memory
      login(data.accessToken, data.user);

      navigate("/dashboard");

    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-logo">
          <img src="/icon.png" alt="CodeWhisper" />
        </div>

        <h2>Sign in</h2>

        {error && <div className="auth-error">{error}</div>}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="auth-forgot">
          <span onClick={() => navigate("/forgot")}>
            Forgot password?
          </span>
        </div>

        <button
          type="submit"
          className="primary-btn"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Enter CodeWhisper"}
        </button>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button
          type="button"
          className="google-btn"
          onClick={() =>
            (window.location.href =
              `${backendUrl}/api/auth/google`)
          }
        >
          <img src="/google.png" alt="Google" />
          Continue with Google
        </button>

        <p className="auth-switch">
          New to CodeWhisper?{" "}
          <span onClick={() => navigate("/signup")}>
            Create account
          </span>
        </p>
      </form>
    </div>
  );
}