import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    try {
      const { data } = await api.post("/auth/reset-password", { token, newPassword: password });
      setMessage(data.message);
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || "Password must be at least 6 characters");
    }
  };

  if (!token) {
    return (
      <div className="card auth">
        <h2>Reset Password</h2>
        <p className="error">This reset link is missing its token.</p>
        <Link to="/forgot-password">Request a new link</Link>
      </div>
    );
  }

  return (
    <form className="card auth" onSubmit={submit}>
      <h2>Set a New Password</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      {done ? (
        <Link className="btn" style={{ textAlign: "center", textDecoration: "none" }} to="/login">
          Go to login
        </Link>
      ) : (
        <>
          <input type="password" placeholder="New password (min 6 chars)" value={password}
                 onChange={(e) => setPassword(e.target.value)} required />
          <input type="password" placeholder="Confirm new password" value={confirm}
                 onChange={(e) => setConfirm(e.target.value)} required />
          <button className="btn">Reset password</button>
          <p><Link to="/forgot-password">Link expired? Request a new one</Link></p>
        </>
      )}
    </form>
  );
}