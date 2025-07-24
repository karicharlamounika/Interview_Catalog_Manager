import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles.css'; // Use the pastel CSS here

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      alert('Registration successful! Please login.');
      navigate('/login');
    } else if (response.status === 409) {
      alert('User already registered.');
    } else {
      alert('Registration failed.');
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
      <div style={{ minWidth: 320, padding: 36, background: "#fff", borderRadius: 12, boxShadow: "0 2px 20px #e0e0e0" }}>
        <h2 style={{ textAlign: "center" }}>Register</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input test-id="firstName" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required style={{ width: "95%", margin: "0 auto" }} />
          <input test-id="lastName" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required style={{ width: "95%", margin: "0 auto" }} />
          <input test-id="email" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={{ width: "95%", margin: "0 auto" }} />
          <input test-id="password" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required style={{ width: "95%", margin: "0 auto" }} />
          <button style={{ width: "95%", margin: "0 auto" }} test-id="register" type="submit">Register</button>
          <button
            type="button"
            onClick={() => navigate('/login')}
            style={{
              width: "95%",
              margin: "0 auto",
              marginTop: 8,
              backgroundColor: "#f0f0f0",
              border: "1px solid #ccc",
              color: "#333",
              cursor: "pointer",
            }}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;

