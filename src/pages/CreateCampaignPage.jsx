import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { campaignApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";

const CATEGORIES = ["EDUCATION", "HEALTH", "ENVIRONMENT", "TECHNOLOGY", "ARTS", "COMMUNITY", "ANIMALS", "OTHER"];

export default function CreateCampaignPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { toast, ToastContainer } = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    targetAmount: "",
    category: "OTHER",
  });

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast("Title is required", "error");
    if (!form.description.trim()) return toast("Description is required", "error");
    if (!form.targetAmount || Number(form.targetAmount) <= 0) return toast("Enter a valid target amount", "error");

    setLoading(true);
    try {
      await campaignApi.create({
        ...form,
        targetAmount: Number(form.targetAmount),
      }, token);
      toast("Campaign submitted for review! 🎉");
      setTimeout(() => navigate("/campaigns"), 1500);
    } catch (err) {
      toast(err.message || "Failed to create campaign", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar />
      <ToastContainer />
      <div className="page-content" style={{ maxWidth: 680 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate("/campaigns")} style={{ marginBottom: 24 }}>
          ← Back
        </button>

        <div className="fade-up">
          <h1 className="section-title">Create a Campaign</h1>
          <p className="section-subtitle" style={{ marginBottom: 32 }}>
            Submit your campaign for admin review. Once approved, it will go live for donations.
          </p>

          <div className="card" style={{ padding: 32 }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div className="form-group">
                <label className="form-label">Campaign Title *</label>
                <input
                  className="form-input"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Plant 10,000 Trees in Pune"
                  maxLength={120}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-input"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell donors about your campaign, its purpose, and how funds will be used…"
                  style={{ resize: "vertical" }}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div className="form-group">
                  <label className="form-label">Target Amount (₹) *</label>
                  <input
                    className="form-input"
                    type="number"
                    name="targetAmount"
                    value={form.targetAmount}
                    onChange={handleChange}
                    placeholder="500000"
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input" name="category" value={form.category} onChange={handleChange}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="card" style={{ background: "var(--bg3)", border: "1px solid var(--border)", padding: "16px 20px", borderRadius: "var(--radius-sm)" }}>
                <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7 }}>
                  <strong style={{ color: "var(--accent)" }}>ℹ️ Review process</strong><br />
                  Your campaign will be reviewed by an admin before going live. This usually takes 24–48 hours.
                  Only approved campaigns accept donations.
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button type="button" className="btn btn-ghost" onClick={() => navigate("/campaigns")}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : null}
                  Submit Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
