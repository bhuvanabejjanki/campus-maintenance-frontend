import { useState } from "react";
import api from "../api";
import CommentSection from "./CommentSection";
import RequestImage from "./RequestImage";
import EditRequestForm from "./EditRequestForm";

const STATUSES = ["PENDING", "ASSIGNED", "IN_PROGRESS", "COMPLETED"];

export default function RequestCard({ r, role, techs, onChanged }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const changeStatus = async (status) => {
    await api.put(`/requests/${r.id}/status`, { status });
    onChanged();
  };

  const assign = async (techId) => {
    if (!techId) return;
    await api.put(`/requests/${r.id}/assign/${techId}`);
    onChanged();
  };

  const remove = async () => {
    if (window.confirm("Delete this request?")) {
      await api.delete(`/requests/${r.id}`);
      onChanged();
    }
  };

  if (editing) {
    return (
      <div className="card request">
        <EditRequestForm
          r={r}
          onSaved={() => { setEditing(false); onChanged(); }}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="card request">
      <div className="request-head">
        <h4>{r.title}</h4>
        <span className={`badge ${r.status}`}>{r.status.replace("_", " ")}</span>
      </div>
      <p>{r.description}</p>
      {r.hasImage && <RequestImage requestId={r.id} />}
      <div className="meta">
        <span>📍 {r.location}</span>
        <span>🏷 {r.category}</span>
        <span className={`badge ${r.priority}`}>{r.priority}</span>
      </div>
      <div className="meta small">
        <span>By: {r.createdBy}</span>
        <span>Technician: {r.assignedTo || "Not assigned"}</span>
        <span>{new Date(r.createdAt).toLocaleString()}</span>
      </div>

      {(role === "ADMIN" || role === "TECHNICIAN") && (
        <div className="actions">
          {role === "ADMIN" && (
            <select value={r.assignedToId || ""} onChange={(e) => assign(e.target.value)}>
              <option value="">Assign technician…</option>
              {techs.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          )}
          <select value={r.status} onChange={(e) => changeStatus(e.target.value)}>
            {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
          </select>
          {role === "ADMIN" && <button className="btn-danger" onClick={remove}>Delete</button>}
        </div>
      )}

      <div className="card-links">
        <button className="btn-link" onClick={() => setOpen(!open)}>
          {open ? "Hide comments & history" : "💬 Comments & history"}
        </button>
        {role === "STUDENT" && r.status === "PENDING" && (
          <button className="btn-link" onClick={() => setEditing(true)}>✏️ Edit</button>
        )}
      </div>
      {open && <CommentSection requestId={r.id} refreshToken={`${r.status}-${r.assignedToId}-${r.title}`} />}
    </div>
  );
}