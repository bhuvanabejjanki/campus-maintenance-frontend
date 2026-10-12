import { useEffect, useState } from "react";
import api from "../api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", role: "STUDENT" });

  const load = async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(data);
    } catch {
      setError("Could not load users");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const show = (ok, text) => {
    setMessage(ok ? text : "");
    setError(ok ? "" : text);
  };

  const startEdit = (u) => {
    setEditId(u.id);
    setForm({ name: u.name, email: u.email, role: u.role });
    setMessage("");
    setError("");
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${editId}`, form);
      setEditId(null);
      show(true, "User updated");
      load();
    } catch (err) {
      show(false, err.response?.data?.message || "Could not update the user (check the name and email)");
    }
  };

  const toggle = async (u) => {
    try {
      await api.put(`/users/${u.id}/disabled`, { disabled: !u.disabled });
      show(true, u.disabled ? `${u.name} activated` : `${u.name} deactivated`);
      load();
    } catch (err) {
      show(false, err.response?.data?.message || "Could not change the account status");
    }
  };

  const remove = async (u) => {
    if (!window.confirm(`Delete ${u.name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/users/${u.id}`);
      show(true, `${u.name} deleted`);
      load();
    } catch (err) {
      show(false, err.response?.data?.message || "Could not delete the user");
    }
  };

  return (
    <main className="container">
      <h2>Manage Users</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      {editId && (
        <form className="card form" onSubmit={save}>
          <h3>Edit user</h3>
          <input value={form.name} placeholder="Full name" required
                 onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input type="email" value={form.email} placeholder="Email" required
                 onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="STUDENT">STUDENT</option>
            <option value="TECHNICIAN">TECHNICIAN</option>
          </select>
          <p className="hint">If you change the email, the user has to log in again.</p>
          <div className="row">
            <button className="btn">Save changes</button>
            <button type="button" className="btn-outline-dark" onClick={() => setEditId(null)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="card table-wrap">
        <table className="table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className={u.disabled ? "row-disabled" : ""}>
                <td>{u.name}{u.self && " (you)"}</td>
                <td>{u.email}</td>
                <td><span className="badge">{u.role}</span></td>
                <td>
                  {u.disabled
                    ? <span className="badge HIGH">Deactivated</span>
                    : <span className="badge COMPLETED">Active</span>}
                </td>
                <td>
                  {u.admin ? (
                    <span className="hint">Protected</span>
                  ) : (
                    <>
                      <button className="mini" onClick={() => startEdit(u)}>Edit</button>
                      <button className="mini" onClick={() => toggle(u)}>
                        {u.disabled ? "Activate" : "Deactivate"}
                      </button>
                      <button className="mini danger" onClick={() => remove(u)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}