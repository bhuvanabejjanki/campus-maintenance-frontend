import { useState } from "react";
import api from "../api";

const CATEGORIES = ["Electrical", "Plumbing", "Furniture", "Cleaning", "IT / Network", "Other"];

export default function EditRequestForm({ r, onSaved, onCancel }) {
  const [form, setForm] = useState({
    title: r.title,
    description: r.description,
    category: r.category,
    location: r.location,
    priority: r.priority,
  });
  const [error, setError] = useState("");

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/requests/${r.id}`, form);
      onSaved();
    } catch (err) {
      setError(
        err.response?.status === 409
          ? "This request is no longer pending, so it can't be edited."
          : "Could not save changes."
      );
    }
  };

  const removePhoto = async () => {
    if (!window.confirm("Remove the photo from this request?")) return;
    try {
      await api.delete(`/requests/${r.id}/image`);
      onSaved();
    } catch {
      setError("Could not remove the photo.");
    }
  };

  return (
    <form className="form" onSubmit={save}>
      <h3>Edit request</h3>
      {error && <p className="error">{error}</p>}
      <input name="title" value={form.title} onChange={change} required />
      <textarea name="description" value={form.description} onChange={change} required />
      <div className="row">
        <select name="category" value={form.category} onChange={change}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select name="priority" value={form.priority} onChange={change}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>
      <input name="location" value={form.location} onChange={change} required />
      {r.hasImage && (
        <button type="button" className="btn-danger" onClick={removePhoto}>Remove photo</button>
      )}
      <div className="row">
        <button className="btn">Save changes</button>
        <button type="button" className="btn-outline-dark" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}