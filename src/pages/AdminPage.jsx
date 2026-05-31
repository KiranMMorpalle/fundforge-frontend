import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { adminApi, campaignApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";

export default function AdminPage() {
  const { token } = useAuth();
  const { toast, ToastContainer } = useToast();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});
  const [tab, setTab] = useState("PENDING");
  const [allCampaigns, setAllCampaigns] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await campaignApi.getAll({ size: 50 }, token);
      const data = res.data || res;
      const list = Array.isArray(data) ? data : data.content || [];
      setAllCampaigns(list);
    } catch (err) {
      // Try admin endpoint
      try {
        const res = await adminApi.getPending(token);
        setAllCampaigns(res.data || res || []);
      } catch {
        toast("Failed to load campaigns", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const filtered = allCampaigns.filter((c) => c.status === tab);

  const handleApprove = async (id) => {
    setProcessing((p) => ({ ...p, [id]: "approve" }));
    try {
      await adminApi.approve(id, token);
      toast("Campaign approved ✓");
      setAllCampaigns((prev) => prev.map((c) => c.id === id ? { ...c, status: "APPROVED" } : c));
    } catch (err) {
      toast(err.message || "Failed to approve", "error");
    } finally {
      setProcessing((p) => ({ ...p, [id]: null }));
    }
  };

  const handleReject = async (id) => {
    setProcessing((p) => ({ ...p, [id]: "reject" }));
    try {
      await adminApi.reject(id, token);
      toast("Campaign rejected");
      setAllCampaigns((prev) => prev.map((c) => c.id === id ? { ...c, status: "REJECTED" } : c));
    } catch (err) {
      toast(err.message || "Failed to reject", "error");
    } finally {
      setProcessing((p) => ({ ...p, [id]: null }));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this campaign permanently?")) return;
    try {
      await campaignApi.delete(id, token);
      toast("Campaign deleted");
      setAllCampaigns((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      toast(err.message || "Failed to delete", "error");
    }
  };

  const counts = {
    PENDING: allCampaigns.filter((c) => c.status === "PENDING").length,
    APPROVED: allCampaigns.filter((c) => c.status === "APPROVED").length,
    REJECTED: allCampaigns.filter((c) => c.status === "REJECTED").length,
  };

  return (
    <div className="page">
      <Navbar />
      <ToastContainer />
      <div className="page-content">
        <div className="fade-up">
          <h1 className="section-title">Admin Panel</h1>
          <p className="section-subtitle" style={{ marginBottom: 28 }}>Review and moderate campaign submissions</p>

          <div className="stat-grid" style={{ marginBottom: 32 }}>
            {Object.entries(counts).map(([status, count]) => (
              <div key={status} className="stat-card" style={{ cursor: "pointer", borderColor: tab === status ? "var(--accent)" : undefined }}
                onClick={() => setTab(status)}>
                <div className="stat-value" style={{ fontSize: 22 }}>{count}</div>
                <div className="stat-label">{status}</div>
              </div>
            ))}
          </div>

          {/* Tab bar */}
          <div style={{ display: "flex", gap: 4, background: "var(--bg2)", borderRadius: "var(--radius-sm)", padding: 4, marginBottom: 24, width: "fit-content" }}>
            {["PENDING", "APPROVED", "REJECTED"].map((t) => (
              <button
                key={t}
                className={`btn btn-sm ${tab === t ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setTab(t)}
              >
                {t} ({counts[t]})
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
              <span className="spinner" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 40 }}>✓</div>
              <h3>No {tab.toLowerCase()} campaigns</h3>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {filtered.map((c) => (
                <div key={c.id} className="card admin-row">
                  <div className="admin-row-main">
                    <div className="admin-row-info">
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
                        {c.title}
                      </h3>
                      <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 8, lineHeight: 1.5 }}>
                        {c.description?.slice(0, 180)}{c.description?.length > 180 ? "…" : ""}
                      </p>
                      <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--text3)", flexWrap: "wrap" }}>
                        <span>👤 {c.creatorName || "Unknown"}</span>
                        <span>🎯 ₹{c.targetAmount?.toLocaleString("en-IN")}</span>
                        {c.category && <span>📂 {c.category}</span>}
                        <span className={`badge badge-${c.status?.toLowerCase()}`}>{c.status}</span>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap", alignItems: "center" }}>
                      {c.status === "PENDING" && (
                        <>
                          <button
                            className="btn btn-success btn-sm"
                            disabled={!!processing[c.id]}
                            onClick={() => handleApprove(c.id)}
                          >
                            {processing[c.id] === "approve" ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : "✓ Approve"}
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            disabled={!!processing[c.id]}
                            onClick={() => handleReject(c.id)}
                          >
                            {processing[c.id] === "reject" ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : "✕ Reject"}
                          </button>
                        </>
                      )}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(c.id)}
                      >🗑</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .admin-row { padding: 20px 24px; }
        .admin-row-main { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
        .admin-row-info { flex: 1; }
        .empty-state { text-align: center; padding: 60px; color: var(--text3); }
        .empty-state h3 { margin-top: 12px; color: var(--text2); font-size: 16px; }
      `}</style>
    </div>
  );
}
