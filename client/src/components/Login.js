import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { toast } from "react-toastify";
import "./Login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // DEMO MODE: Skip API call and login directly for testing
      const mockAdmin = {
        id: "demo-admin-id",
        email: "demo@controlroom.com",
        name: "Demo Operator",
        role: "operator",
      };

      const mockToken = "demo-token-for-testing";

      // Store mock data
      localStorage.setItem("token", mockToken);
      localStorage.setItem("admin", JSON.stringify(mockAdmin));

      toast.success("Demo login successful! (Offline Mode)");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setCredentials({
      email: "demo@controlroom.com",
      password: "demo123",
    });
    toast.info("Demo credentials loaded! Click Login to continue.");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">🎯 Control Room Login</h1>
        <p className="login-subtitle">Emergency Response Management System</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email (Optional - Auto Demo Login)</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              placeholder="Leave empty for demo login"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password (Optional)</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Leave empty for demo login"
            />
          </div>

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? "Logging in..." : "🚀 Enter Dashboard (Demo Mode)"}
          </button>

          <p className="demo-note">
            ℹ️ Just click the button above to explore the dashboard!
          </p>
        </form>

        <div className="login-footer">
          <p>
            Authorized personnel only. All activities are monitored and logged.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
