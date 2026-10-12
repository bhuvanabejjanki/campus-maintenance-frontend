import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../AuthContext";

export default function CommentSection({ requestId, refreshToken }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get(`/requests/${requestId}/comments`);
      setItems(data);
    } catch {
      setError("Could not load comments");
    }
  };

  useEffect(() => {
    load();
  }, [requestId, refreshToken]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await api.post(`/requests/${requestId}/comments`, { text });
      setText("");
      setError("");
      load();
    } catch {
      setError("Could not post comment");
    }
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    setEditText(c.text);
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      await api.put(`/requests/${requestId}/comments/${id}`, { text: editText });
      setEditingId(null);
      setError("");
      load();
    } catch {
      setError("Could not save the comment");
    }
  };

  const removeComment = async (id) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await api.delete(`/requests/${requestId}/comments/${id}`);
      setError("");
      load();
    } catch {
      setError("Could not delete the comment");
    }
  };

  return (
    <div className="comments">
      {error && <p className="error">{error}</p>}
      {items.length === 0 && <p className="hint">No history yet.</p>}
      {items.map((c) =>
        c.system ? (
          <div key={c.id} className="event">
            {c.text} · {c.author} · {new Date(c.createdAt).toLocaleString()}
          </div>
        ) : (
          <div key={c.id} className="comment">
            <span className="who">{c.author}</span>
            <span className="badge role">{c.role}</span>
            <span className="when">{new Date(c.createdAt).toLocaleString()}</span>
            {c.edited && <span className="edited">(edited)</span>}

            {editingId === c.id ? (
              <div className="comment-form" style={{ marginTop: 6 }}>
                <input value={editText} maxLength={1000} onChange={(e) => setEditText(e.target.value)} />
                <button className="btn" type="button" onClick={() => saveEdit(c.id)}>Save</button>
                <button className="btn-outline-dark" type="button" onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            ) : (
              <>
                <p>{c.text}</p>
                <div>
                  {c.mine && <button className="mini" onClick={() => startEdit(c)}>Edit</button>}
                  {(c.mine || user.role === "ADMIN") && (
                    <button className="mini danger" onClick={() => removeComment(c.id)}>Delete</button>
                  )}
                </div>
              </>
            )}
          </div>
        )
      )}
      <form className="comment-form" onSubmit={send}>
        <input placeholder="Write a comment…" value={text} maxLength={1000}
               onChange={(e) => setText(e.target.value)} />
        <button className="btn">Send</button>
      </form>
    </div>
  );
}