import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/items");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

return (
<div
  style={{
    display: "flex",
    justifyContent: "center",  
    alignItems: "center",      
    height: "100vh",          
    width: "100vw",            
    backgroundColor: "#fdf6f0", 
    fontFamily: "Arial, sans-serif",
  }}
>
    <div
      style={{
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
        textAlign: "center",
        width: "300px",
      }}
    >
      <h2 style={{ color: "#6c5ce7" }}>Login</h2>
      <input
        test-id = "useremail"
        style={{
          marginBottom: "1rem",
          padding: "0.5rem",
          width: "100%",
          borderRadius: "6px",
          border: "1px solid #ddd",
        }}
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        test-id = "password"
        style={{
          marginBottom: "1rem",
          padding: "0.5rem",
          width: "100%",
          borderRadius: "6px",
          border: "1px solid #ddd",
        }}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        test-id = "login"      
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#a29bfe",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
          width: "100%",
        }}
        onClick={login}
      >
        Login
      </button>
      <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
        Don’t have an account?{" "}
        <Link
          test-id = "registerHere"
          to="/register"
          style={{ color: "#6c5ce7", textDecoration: "none" }}
        >
          Register here
        </Link>
      </p>
    </div>
  </div>
);

}


export default LoginPage;
