import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { campaignApi, donationApi, paymentApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import "../styles/campaign-detail.css";

const CATEGORY_EMOJI = {
  EDUCATION: "📚", HEALTH: "❤️", ENVIRONMENT: "🌱",
  TECHNOLOGY: "💡", ARTS: "🎨", COMMUNITY: "🤝",
  ANIMALS: "🐾", OTHER: "✨",
};

export default function CampaignDetailPage() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const { toast, ToastContainer } = useToast();

  const [campaign, setCampaign] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donateModal, setDonateModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [donating, setDonating] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [cRes, dRes] = await Promise.all([
          campaignApi.getById(id, token),
          donationApi.getDonations(id, token).catch(() => ({ data: [] })),
        ]);
        setCampaign(cRes.data || cRes);
        setDonations((dRes.data || dRes) || []);
      } catch (err) {
        toast("Campaign not found", "error");
        navigate("/campaigns");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return toast("Enter a valid amount", "error");
    setDonating(true);
    try {
      const res = await donationApi.donate(id, { amount: Number(amount) }, token);
      const donation = res.data || res;
      // Create Razorpay order
      const orderRes = await paymentApi.createOrder(donation.id, token);
      const order = orderRes.data || orderRes;

      if (window.Razorpay) {
        const rzp = new window.Razorpay({
          key: order.keyId || "rzp_test_XXXX",
          amount: order.amount,
          currency: "INR",
          order_id: order.orderId,
          name: "FundForge",
          description: campaign.title,
          handler: async (response) => {
            try {
              await paymentApi.verify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }, token);
              toast("Payment successful! Thank you for donating 🎉");
              setDonateModal(false);
              setAmount("");
              // Refresh
              const cRes = await campaignApi.getById(id, token);
              setCampaign(cRes.data || cRes);
            } catch {
              toast("Payment verification failed", "error");
            }
          },
          prefill: { email: user?.email },
        });
        rzp.open();
      } else {
        toast("Donation recorded. Payment gateway not loaded in dev mode.", "success");
        setDonateModal(false);
        setAmount("");
      }
    } catch (err) {
      toast(err.message || "Donation failed", "error");
    } finally {
      setDonating(false);
    }
  };

  if (loading) return (
    <div className="page">
      <Navbar />
      <div className="loader-full"><span className="spinner" /></div>
    </div>
  );

  if (!campaign) return null;

  const progress = Math.min(((campaign.raisedAmount || 0) / campaign.targetAmount) * 100, 100);
  const emoji = CATEGORY_EMOJI[campaign.category] || "✨";
  const canDonate = campaign.status === "APPROVED";

  return (
    <div className="page">
      <Navbar />
      <ToastContainer />

      <div className="page-content">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate("/campaigns")} style={{ marginBottom: 24 }}>
          ← Back to Campaigns
        </button>

        <div className="detail-layout fade-up">
          {/* Main */}
          <div className="detail-main">
            <div className="detail-hero">
              <span className="detail-emoji">{emoji}</span>
              <div className="detail-badges">
                <span className={`badge badge-${campaign.status?.toLowerCase()}`}>{campaign.status}</span>
                {campaign.category && (
                  <span className="badge" style={{ background: "var(--bg3)", color: "var(--text2)", border: "1px solid var(--border)" }}>
                    {campaign.category}
                  </span>
                )}
              </div>
            </div>

            <h1 className="detail-title">{campaign.title}</h1>
            <p className="detail-creator">Created by <strong>{campaign.creatorName || "Anonymous"}</strong></p>

            <div className="divider" />

            <div className="detail-desc">
              <h3>About this campaign</h3>
              <p>{campaign.description}</p>
            </div>

            {/* Donations list */}
            {donations.length > 0 && (
              <>
                <div className="divider" />
                <div className="donations-section">
                  <h3>Recent Donors</h3>
                  <div className="donations-list">
                    {donations.slice(0, 8).map((d, i) => (
                      <div key={d.id || i} className="donation-item">
                        <div className="donor-avatar">{(d.donorName || "A")[0].toUpperCase()}</div>
                        <div>
                          <div className="donor-name">{d.donorName || "Anonymous"}</div>
                          <div className="donor-amount">₹{Number(d.amount).toLocaleString("en-IN")}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="detail-sidebar">
            <div className="card sidebar-card">
              <div className="funding-stats">
                <div>
                  <div className="funding-raised">₹{(campaign.raisedAmount || 0).toLocaleString("en-IN")}</div>
                  <div className="funding-label">raised</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="funding-target">of ₹{campaign.targetAmount?.toLocaleString("en-IN")}</div>
                  <div className="funding-label">goal</div>
                </div>
              </div>
              <div className="progress-track" style={{ height: 10, margin: "16px 0" }}>
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="funding-pct">{Math.round(progress)}% funded · {donations.length} donors</div>

              {canDonate ? (
                <button
                  className="btn btn-primary"
                  style={{ width: "100%", marginTop: 20 }}
                  onClick={() => setDonateModal(true)}
                >
                  Donate Now
                </button>
              ) : (
                <div className="sidebar-status">
                  {campaign.status === "PENDING" && (
                    <div style={{ color: "var(--warning)", fontSize: 13, textAlign: "center", marginTop: 16 }}>
                      ⏳ Awaiting admin approval
                    </div>
                  )}
                  {campaign.status === "REJECTED" && (
                    <div style={{ color: "var(--danger)", fontSize: 13, textAlign: "center", marginTop: 16 }}>
                      ✕ This campaign was not approved
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Donate Modal */}
      {donateModal && (
        <div className="modal-overlay" onClick={() => setDonateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Donate to this campaign</h2>
            <p style={{ color: "var(--text2)", fontSize: 14, marginBottom: 24 }}>
              {campaign.title}
            </p>
            <div className="quick-amounts">
              {[100, 500, 1000, 5000].map((a) => (
                <button
                  key={a}
                  className={`btn btn-sm ${Number(amount) === a ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => setAmount(String(a))}
                >₹{a}</button>
              ))}
            </div>
            <form onSubmit={handleDonate} style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Custom amount (₹)</label>
                <input
                  className="form-input"
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setDonateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={donating}>
                  {donating ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : null}
                  Proceed to Pay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
