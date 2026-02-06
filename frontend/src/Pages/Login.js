import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Style.css";
import { login } from "../api/auth";
import { setAuth } from "../utils/auth";

function Login() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const logoSrc = process.env.PUBLIC_URL + "/AutronicasLogo.png";

  const handleLogin = () => {
    setLoginOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      const result = await login(email, password);
      if (result.success) {
        setAuth(result.data.token, result.data.user);
        // After login, go to role selection before entering any dashboard
        navigate('/select-role');
      } else {
        setError(result.error || "Login failed");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`Stage${loginOpen ? " login-open" : ""}`}>
      <div className="Landing">
        <img src={logoSrc} className="Landing-logo" alt="Autronicas logo" />
        {!loginOpen && (
          <button className="LoginButton" type="button" onClick={handleLogin}>
            Log in
          </button>
        )}
      </div>

      <div className="RightPanel" aria-hidden={!loginOpen}>
        <div className="LoginCard">
          <h2 className="PanelTitle">Log in to your account</h2>
          <p className="PanelSub">Welcome back! Please enter your details.</p>

          {error && <p style={{ color: 'red', fontSize: '12px', marginBottom: '10px' }}>{error}</p>}

          <form className="LoginForm" onSubmit={handleSubmit}>
            <label className="Field">
              <span className="FieldLabel">Email</span>
              <input
                className="TextInput"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="Field">
              <span className="FieldLabel">Password</span>
              <input
                className="TextInput"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <div className="FormRow">
              <label className="CheckRow">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link className="HighlightLink" to="/forgot-password">
                Forgot Password
              </Link>
            </div>

            <button className="Primary" type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="BottomText">
            Don't have an account?{" "}
            <Link className="HighlightLink" to="/register">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
