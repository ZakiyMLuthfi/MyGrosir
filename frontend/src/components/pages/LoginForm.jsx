// src/components/pages/LoginForm.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "../../reducers/userActions"; // Sesuaikan dengan path yang tepat
import axios from "axios";

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

      console.log("Response dari API:", response);

      const { token } = response.data;
      console.log("accessToken setelah dinyatakan sebagai respon", token);
      // Simpan token di localStorage dan Redux
      localStorage.setItem("accessToken", token);
      console.log("Token setelah login:", localStorage.getItem("accessToken"));
      dispatch(setToken(token));

      // Panggil callback untuk menangani sukses login
      onLoginSuccess();
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  return (
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
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
