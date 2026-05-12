import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";
import "../styles/auth.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [form, setForm] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (!email) {
    navigate("/forgot");
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/reset-password", {
        email,
        otp: form.otp,
        newPassword: form.newPassword,
      });

      setSuccess("Password changed successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.error || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h2>Reset Password</h2>

        <p className="auth-subtitle">
          Enter the OTP sent to your email and set a new password.
        </p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          className="otp-input"
          value={form.otp}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
          required
        />

        <button className="primary-btn" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <div className="auth-back">
          <span onClick={() => navigate("/login")}>
            Back to Login
          </span>
        </div>
      </form>
    </div>
  );
}