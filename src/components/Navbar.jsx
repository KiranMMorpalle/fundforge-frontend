import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to={user ? "/campaigns" : "/"} className="navbar-brand">
        Fund<span>Forge</span>
      </Link>
      <div className="navbar-actions">
        {user ? (
          <>
            <span style={{ fontSize: 13, color: "var(--text3)" }}>
              {user.name || user.email}
            </span>
            {isAdmin && (
              <Link to="/admin" className="badge badge-admin" style={{ textDecoration: "none" }}>
                Admin
              </Link>
            )}
            <Link to="/create-campaign" className="btn btn-outline btn-sm">
              + Campaign
            </Link>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm">
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/auth" className="btn btn-outline btn-sm">Sign in</Link>
            <Link to="/auth?tab=register" className="btn btn-primary btn-sm">Get started</Link>
          </>
        )}
      </div>
    </nav>
  );
}
