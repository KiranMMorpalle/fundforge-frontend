import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../services/api";
import { useToast } from "../hooks/useToast";
import "../styles/auth.css";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get("tab") === "register" ? "register" : "login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "USER" });
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { toast, ToastContainer } = useToast();

  useEffect(() => { if (user) navigate("/campaigns"); }, [user]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === "login") {
        const res = await authApi.login({ email: form.email, password: form.password });
        const token = res.data?.token || res.token;
        const userData = res.data?.user || res.user || { email: form.email };
        login(token, userData);
        toast("Welcome back!");
        navigate("/campaigns");
      } else {
        await authApi.register({ name: form.name, email: form.email, password: form.password, role: form.role });
        toast("Account created! Please log in.");
        setTab("login");
        setForm((f) => ({ ...f, password: "" }));
      }
    } catch (err) {
      toast(err.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <ToastContainer />
      <div className="auth-left">
        <Link to="/" className="navbar-brand" style={{ marginBottom: 48, display: "inline-flex" }}>
          Fund<span>Forge</span>
        </Link>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, lineHeight: 1.2, marginBottom: 16, color: "var(--text)" }}>
          {tab === "login" ? "Welcome back." : "Join the movement."}
        </h2>
        <p style={{ color: "var(--text2)", fontSize: 15, lineHeight: 1.7, maxWidth: 380 }}>
          {tab === "login"
            ? "Sign in to manage your campaigns, track donations, and make a difference."
            : "Create an account to start raising funds for causes you believe in."}
        </p>
        <div className="auth-features">
          {["Admin-verified campaigns", "Razorpay-secured payments", "Real-time donation tracking"].map((f) => (
            <div key={f} className="auth-feature-item">
              <span style={{ color: "var(--success)" }}>✓</span> {f}
            </div>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card fade-up">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${tab === "login" ? "active" : ""}`}
              onClick={() => setTab("login")}
            >
              Sign in
            </button>
            <button
              className={`auth-tab ${tab === "register" ? "active" : ""}`}
              onClick={() => setTab("register")}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {tab === "register" && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className="form-input"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Arjun Mehta"
                  required
                />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                className="form-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            {tab === "register" && (
              <div className="form-group">
                <label className="form-label">Account type</label>
                <select className="form-input" name="role" value={form.role} onChange={handleChange}>
                  <option value="USER">Donor / Campaign Creator</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            )}
            <button className="btn btn-primary" style={{ width: "100%", marginTop: 8 }} disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : null}
              {tab === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="auth-switch">
            {tab === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setTab(tab === "login" ? "register" : "login")} className="auth-switch-btn">
              {tab === "login" ? "Register" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
