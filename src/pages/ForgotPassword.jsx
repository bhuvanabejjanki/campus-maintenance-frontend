import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setMessage(data.message);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card auth" onSubmit={submit}>
      <h2>Forgot Password</h2>
      <p className="hint">Enter your account email and we'll send you a reset link.</p>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <input type="email" placeholder="Email" value={email}
             onChange={(e) => setEmail(e.target.value)} required />
      <button className="btn" disabled={loading}>{loading ? "Sending..." : "Send reset link"}</button>
      <p><Link to="/login">Back to login</Link></p>
    </form>
  );
}