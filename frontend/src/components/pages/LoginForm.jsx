// src/components/pages/LoginForm.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "../../reducers/userActions"; // Sesuaikan dengan path yang tepat
import axios from "axios";
import "../css/LoginForm.css";

const LoginForm = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          username,
          password,
        }
      );

      const { token, role, userId } = response.data;
      localStorage.setItem("accessToken", token);
      localStorage.setItem("accessRole", role);
      localStorage.setItem("loggedInUserId", userId);

      dispatch(setToken({ token, role, userId }));

      onLoginSuccess();
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  return (
    <div className="login-form-page">
      <div className="overlay"></div>
      <div className="wrapper-vertical">
        <h1 className="welcome-message">Welcome to MyGrosir!</h1>
        <div className="login-box-container">
          <div className="login-container">
            <form onSubmit={handleSubmit}>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="forgot-password-link">
                <a href="/forgot-password">Change/forgot password</a>
              </div>
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
