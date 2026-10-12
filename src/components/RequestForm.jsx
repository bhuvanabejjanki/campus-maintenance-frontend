import { useRef, useState } from "react";
import api from "../api";

const CATEGORIES = ["Electrical", "Plumbing", "Furniture", "Cleaning", "IT / Network", "Other"];
const empty = { title: "", description: "", category: "Electrical", location: "", priority: "MEDIUM" };
const MAX_BYTES = 5 * 1024 * 1024;

export default function RequestForm({ onCreated }) {
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const pickFile = (e) => {
    const f = e.target.files[0] || null;
    if (f && f.size > MAX_BYTES) {
      setError("Image must be 5 MB or smaller");
      e.target.value = "";
      setFile(null);
      return;
    }
    setError("");
    setFile(f);
  };

  const submit = async (e) => {
    e.preventDefault();
    let created;
    try {
      created = (await api.post("/requests", form)).data;
    } catch (err) {
      setError(`Could not submit: ${err.response?.status || err.message}`);
      return;
    }

    let warning = "";
    if (file) {
      try {
        const fd = new FormData();
        fd.append("file", file);
        await api.post(`/requests/${created.id}/image`, fd);
      } catch {
        warning = "Request submitted, but the image could not be uploaded (use JPG, PNG or WEBP up to 5 MB).";
      }
    }

    setForm(empty);
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
    setError(warning);
    onCreated();
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h3>Report an Issue</h3>
      {error && <p className="error">{error}</p>}
      <input name="title" placeholder="Title (e.g. Broken fan)" value={form.title} onChange={change} required />
      <textarea name="description" placeholder="Describe the problem" value={form.description} onChange={change} required />
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
      <input name="location" placeholder="Location (e.g. Block A, Room 204)" value={form.location} onChange={change} required />
      <label className="file-label">
        📷 Photo (optional, JPG/PNG/WEBP, max 5 MB)
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={pickFile} />
      </label>
      <button className="btn">Submit Request</button>
    </form>
  );
}