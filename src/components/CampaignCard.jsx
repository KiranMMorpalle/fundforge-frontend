import { Link } from "react-router-dom";

const CATEGORY_EMOJI = {
  EDUCATION: "📚",
  HEALTH: "❤️",
  ENVIRONMENT: "🌱",
  TECHNOLOGY: "💡",
  ARTS: "🎨",
  COMMUNITY: "🤝",
  ANIMALS: "🐾",
  OTHER: "✨",
};

export default function CampaignCard({ campaign }) {
  const {
    id, title, description, targetAmount, raisedAmount = 0,
    status, category, creatorName,
  } = campaign;

  const progress = Math.min((raisedAmount / targetAmount) * 100, 100);
  const emoji = CATEGORY_EMOJI[category] || "✨";

  return (
    <Link to={`/campaigns/${id}`} style={{ display: "block" }}>
      <div className="card campaign-card">
        <div className="campaign-card-header">
          <span className="campaign-emoji">{emoji}</span>
          <span className={`badge badge-${status?.toLowerCase() || "pending"}`}>
            {status}
          </span>
        </div>
        <div className="campaign-card-body">
          <h3 className="campaign-title">{title}</h3>
          <p className="campaign-desc">
            {description?.slice(0, 100)}{description?.length > 100 ? "…" : ""}
          </p>
          <div className="campaign-meta">
            <span className="campaign-creator">by {creatorName || "Anonymous"}</span>
            {category && <span className="campaign-category">{category}</span>}
          </div>
          <div className="campaign-progress">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="campaign-amounts">
              <span className="raised">₹{raisedAmount?.toLocaleString("en-IN")}</span>
              <span className="target">of ₹{targetAmount?.toLocaleString("en-IN")}</span>
            </div>
            <div className="progress-pct">{Math.round(progress)}% funded</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
