import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <header className="navbar">
      <h1>🛠 Campus Maintenance</h1>
      {user && (
        <div className="nav-right">
          {user.role === "ADMIN" && (
            <>
              <Link className="nav-link" to="/">Requests</Link>
              <Link className="nav-link" to="/users">Users</Link>
            </>
          )}
          <span>{user.name} <span className="badge role">{user.role}</span></span>
          <button className="btn-outline" onClick={() => { logout(); nav("/login"); }}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
}