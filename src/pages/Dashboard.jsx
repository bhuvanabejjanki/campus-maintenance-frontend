import { useEffect, useMemo, useState } from "react";
import api from "../api";
import { useAuth } from "../AuthContext";
import RequestForm from "../components/RequestForm";
import RequestCard from "../components/RequestCard";
import TechnicianForm from "../components/TechnicianForm";

const PRIORITY_RANK = { HIGH: 3, MEDIUM: 2, LOW: 1 };

export default function Dashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [techs, setTechs] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("NEWEST");

  const load = async () => {
    const { data } = await api.get("/requests");
    setRequests(data);
  };

  const loadTechs = async () => {
    const { data } = await api.get("/users/technicians");
    setTechs(data);
  };

  useEffect(() => {
    load();
    if (user.role === "ADMIN") loadTechs();
  }, []);

  const count = (s) => requests.filter((r) => r.status === s).length;

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = requests.filter(
      (r) =>
        (filter === "ALL" || r.status === filter) &&
        (!q ||
          [r.title, r.description, r.location, r.category, r.createdBy].some((v) =>
            v?.toLowerCase().includes(q)
          ))
    );
    return [...list].sort((a, b) => {
      const byNewest = new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "PRIORITY") return PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority] || byNewest;
      if (sort === "OLDEST") return -byNewest;
      return byNewest;
    });
  }, [requests, filter, search, sort]);

  return (
    <main className="container">
      <div className="stats">
        <div className="stat"><b>{requests.length}</b><span>Total</span></div>
        <div className="stat"><b>{count("PENDING")}</b><span>Pending</span></div>
        <div className="stat"><b>{count("IN_PROGRESS")}</b><span>In progress</span></div>
        <div className="stat"><b>{count("COMPLETED")}</b><span>Completed</span></div>
      </div>

      {user.role === "STUDENT" && <RequestForm onCreated={load} />}
      {user.role === "ADMIN" && <TechnicianForm onCreated={loadTechs} />}

      <h3>{user.role === "STUDENT" ? "My Requests" : user.role === "ADMIN" ? "All Requests" : "Assigned to Me"}</h3>

      <div className="toolbar">
        <input placeholder="Search title, location, category…" value={search}
               onChange={(e) => setSearch(e.target.value)} />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="ALL">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_PROGRESS">In progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="NEWEST">Newest first</option>
          <option value="OLDEST">Oldest first</option>
          <option value="PRIORITY">Priority (high → low)</option>
        </select>
      </div>

      {visible.length === 0 && <p className="empty">No requests found.</p>}
      {visible.map((r) => (
        <RequestCard key={r.id} r={r} role={user.role} techs={techs} onChanged={load} />
      ))}
    </main>
  );
}