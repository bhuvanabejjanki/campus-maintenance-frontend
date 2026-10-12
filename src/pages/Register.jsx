import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { saveSession } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/register", form);
      saveSession(data);
      nav("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed (password needs 6+ characters)");
    }
  };

  return (
    <form className="card auth" onSubmit={submit}>
      <h2>Student Registration</h2>
      {error && <p className="error">{error}</p>}
      <input placeholder="Full name" value={form.name}
             onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <input type="email" placeholder="Email" value={form.email}
             onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      <input type="password" placeholder="Password (min 6 chars)" value={form.password}
             onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      <button className="btn">Create account</button>
      <p>Already registered? <Link to="/login">Login</Link></p>
    </form>
  );
}