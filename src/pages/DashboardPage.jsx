import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import CampaignCard from "../components/CampaignCard";
import { campaignApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import "../styles/dashboard.css";

const CATEGORIES = ["", "EDUCATION", "HEALTH", "ENVIRONMENT", "TECHNOLOGY", "ARTS", "COMMUNITY", "ANIMALS", "OTHER"];

export default function DashboardPage() {
  const { token } = useAuth();
  const { toast, ToastContainer } = useToast();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    keyword: "",
    category: "",
    sortDir: "desc",
    page: 0,
    size: 9,
  });

  const [inputKeyword, setInputKeyword] = useState("");

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.keyword) params.keyword = filters.keyword;
      if (filters.category) params.category = filters.category;
      if (filters.sortDir) params.sortDir = filters.sortDir;
      params.page = filters.page;
      params.size = filters.size;

      const res = await campaignApi.getAll(params, token);
      const data = res.data || res;
      setCampaigns(Array.isArray(data) ? data : data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      toast(err.message || "Failed to load campaigns", "error");
    } finally {
      setLoading(false);
    }
  }, [filters, token]);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((f) => ({ ...f, keyword: inputKeyword, page: 0 }));
  };

  const handleCategoryChange = (cat) => setFilters((f) => ({ ...f, category: cat, page: 0 }));
  const handleSortChange = (dir) => setFilters((f) => ({ ...f, sortDir: dir, page: 0 }));
  const handlePage = (p) => setFilters((f) => ({ ...f, page: p }));

  return (
    <div className="page">
      <Navbar />
      <ToastContainer />
      <div className="page-content">
        {/* Header */}
        <div className="dash-header fade-up">
          <div>
            <h1 className="section-title">Campaigns</h1>
            <p className="section-subtitle">Discover and support causes that matter</p>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="filters-bar fade-up" style={{ animationDelay: "0.1s" }}>
          <form onSubmit={handleSearch} className="search-form">
            <input
              className="form-input search-input"
              placeholder="Search campaigns…"
              value={inputKeyword}
              onChange={(e) => setInputKeyword(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
            {filters.keyword && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => {
                setInputKeyword("");
                setFilters((f) => ({ ...f, keyword: "", page: 0 }));
              }}>Clear</button>
            )}
          </form>

          <div className="filter-group">
            <select
              className="form-input filter-select"
              value={filters.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="">All Categories</option>
              {CATEGORIES.filter(Boolean).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <div className="sort-btns">
              <span style={{ fontSize: 13, color: "var(--text3)" }}>Sort:</span>
              <button
                className={`btn btn-sm ${filters.sortDir === "desc" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => handleSortChange("desc")}
              >↓ Highest</button>
              <button
                className={`btn btn-sm ${filters.sortDir === "asc" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => handleSortChange("asc")}
              >↑ Lowest</button>
            </div>
          </div>
        </div>

        {/* Active filter pills */}
        {(filters.keyword || filters.category) && (
          <div className="active-filters">
            {filters.keyword && (
              <span className="filter-pill">
                🔍 "{filters.keyword}"
                <button onClick={() => { setInputKeyword(""); setFilters(f => ({ ...f, keyword: "", page: 0 })); }}>×</button>
              </span>
            )}
            {filters.category && (
              <span className="filter-pill">
                📂 {filters.category}
                <button onClick={() => handleCategoryChange("")}>×</button>
              </span>
            )}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <span className="spinner" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 48 }}>🔍</div>
            <h3>No campaigns found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="campaigns-grid fade-up" style={{ animationDelay: "0.2s" }}>
            {campaigns.map((c) => <CampaignCard key={c.id} campaign={c} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="btn btn-ghost btn-sm"
              disabled={filters.page === 0}
              onClick={() => handlePage(filters.page - 1)}
            >← Prev</button>
            <div className="page-nums">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`btn btn-sm ${filters.page === i ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => handlePage(i)}
                >{i + 1}</button>
              ))}
            </div>
            <button
              className="btn btn-ghost btn-sm"
              disabled={filters.page >= totalPages - 1}
              onClick={() => handlePage(filters.page + 1)}
            >Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
