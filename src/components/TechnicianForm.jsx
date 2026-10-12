import { useState } from "react";
import api from "../api";

const empty = { name: "", email: "", password: "" };

export default function TechnicianForm({ onCreated }) {
  const [form, setForm] = useState(empty);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await api.post("/users/technicians", form);
      setMessage(`Technician "${form.name}" created`);
      setForm(empty);
      onCreated();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create technician (password needs 6+ characters)");
    }
  };

  return (
    <details className="card">
      <summary><b>➕ Add technician</b></summary>
      <form className="form" onSubmit={submit} style={{ marginTop: 12 }}>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <input name="name" placeholder="Full name" value={form.name} onChange={change} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} required />
        <input name="password" type="password" placeholder="Temporary password (min 6 chars)"
               value={form.password} onChange={change} required />
        <button className="btn">Create technician</button>
      </form>
    </details>
  );
}