import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Style.css";
import { register } from "../api/auth";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("What is your pet's name?");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!fullName || !email || !password || !securityQuestion || !securityAnswer) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const result = await register({ full_name: fullName, email, password, security_question: securityQuestion, security_answer: securityAnswer });
      if (result.success) {
        // After successful registration, redirect to login (do not auto-login)
        navigate('/login');
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="RegisterPage">
      <div className="RegisterCard">
        <h2 className="PanelTitle">Create an account</h2>
        <p className="PanelSub">Join us and get started!</p>

        {error && <p style={{ color: 'red', fontSize: '12px', marginBottom: '10px' }}>{error}</p>}

        <form className="RegisterForm" onSubmit={handleSubmit}>
          <label className="Field">
            <span className="FieldLabel">Full Name</span>
            <input
              className="TextInput"
              type="text"
              placeholder="Enter your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </label>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </label>
          <div className="FormRow">
            <span style={{ fontSize: '12px', color: '#666' }}>Must be at least 8 characters</span>
          </div>

          <label className="Field">
            <span className="FieldLabel">Security Question</span>
            <select
              className="TextInput"
              value={securityQuestion}
              onChange={(e) => setSecurityQuestion(e.target.value)}
              required
            >
              <option value="What is your pet's name?">What is your pet's name?</option>
              <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
              <option value="What city were you born in?">What city were you born in?</option>
              <option value="What was your first car?">What was your first car?</option>
            </select>
          </label>

          <label className="Field">
            <span className="FieldLabel">Security Answer</span>
            <input
              className="TextInput"
              type="text"
              placeholder="Enter your answer"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              required
            />
          </label>

          <button className="Primary" type="submit" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="BottomText">
          Already have an account?{" "}
          <Link className="HighlightLink" to="/login">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

