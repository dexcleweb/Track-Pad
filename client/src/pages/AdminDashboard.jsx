import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarCheck,
  IndianRupee,
  Package,
  Plus,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import Button from "../components/common/Button";
import { getAdminStats } from "../services/adminApi";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState("Loading dashboard...");

  const loadStats = async () => {
    try {
      setStatus("Loading dashboard...");
      const data = await getAdminStats();
      setStats(data);
      setStatus("");
    } catch {
      setStats(null);
      setStatus("Failed to load admin stats.");
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const statCards = useMemo(
    () => [
      { label: "Total Users", value: stats?.users ?? 0, icon: Users, tone: "green", link: "/admin/users" },
      { label: "Products", value: stats?.products ?? 0, icon: Package, tone: "gold" },
      { label: "Orders", value: stats?.orders ?? 0, icon: ReceiptText, tone: "green" },
      { label: "Bookings", value: stats?.bookings ?? 0, icon: CalendarCheck, tone: "gold" },
      { label: "Revenue", value: `₹${(stats?.revenue ?? 0).toLocaleString("en-IN")}`, icon: IndianRupee, tone: "green" },
    ],
    [stats]
  );

  const adminLinks = [
    { to: "/admin/products", title: "Manage Products", description: "Add, edit, disable, and organize digital products.", icon: Package, button: "Products" },
    { to: "/admin/orders", title: "View Orders", description: "Track payments, purchases, and customer order history.", icon: ReceiptText, button: "Orders" },
    { to: "/admin/bookings", title: "Counselling Bookings", description: "Review bookings and update counselling session status.", icon: CalendarCheck, button: "Bookings" },
  ];

  return (
    <section className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow"><ShieldCheck size={13} /> Admin Control</p>
          <h1>Welcome back, <span>Admin.</span></h1>
          <p>Manage products, orders, customers, and counselling bookings from one clean dashboard.</p>
        </div>
        <div className="admin-header-actions">
          <button type="button" onClick={loadStats} className="header-btn">
            <RefreshCw size={14} /> Refresh
          </button>
          <Link to="/admin/products">
            <Button><Plus size={14} /> Add Product</Button>
          </Link>
        </div>
      </header>

      {status && <p className="admin-status">{status}</p>}

      <div className="admin-stats-grid">
        {statCards.map((item) => {
          const Icon = item.icon;
          const content = (
            <>
              <div className={`stat-icon ${item.tone}`}><Icon size={18} /></div>
              <div>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
              {item.link && <ArrowRight size={14} className="stat-arrow" />}
            </>
          );
          return item.link ? (
            <Link key={item.label} to={item.link} className={`admin-stat-card ${item.tone}`}>{content}</Link>
          ) : (
            <article key={item.label} className={`admin-stat-card ${item.tone}`}>{content}</article>
          );
        })}
      </div>

      <div className="admin-content-grid">
        <div className="admin-panel">
          <div className="panel-head">
            <h2>Management</h2>
            <p>Quick access to the main admin sections.</p>
          </div>
          <div className="admin-actions-grid">
            {adminLinks.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.to} className="admin-action-card">
                  <div className="action-icon"><Icon size={18} /></div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <Link to={item.to} className="action-link">
                    {item.button} <ArrowRight size={13} />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="admin-panel summary-panel">
          <div className="panel-head">
            <h2><TrendingUp size={15} /> Store Summary</h2>
            <p>Current platform snapshot.</p>
          </div>
          <div className="summary-list">
            {[
              { label: "Total Users", value: stats?.users ?? 0, icon: Users },
              { label: "Active Products", value: stats?.products ?? 0, icon: Package },
              { label: "Total Orders", value: stats?.orders ?? 0, icon: ReceiptText },
              { label: "Bookings", value: stats?.bookings ?? 0, icon: CalendarCheck },
              { label: "Revenue", value: `₹${(stats?.revenue ?? 0).toLocaleString("en-IN")}`, icon: IndianRupee },
            ].map((row) => {
              const Icon = row.icon;
              return (
                <div key={row.label}>
                  <span><Icon size={13} /> {row.label}</span>
                  <strong>{row.value}</strong>
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      <style>{`
        * { scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
        *::-webkit-scrollbar { width: 6px; height: 6px; }
        *::-webkit-scrollbar-track { background: transparent; }
        *::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
        *::-webkit-scrollbar-corner { background: transparent; }

        .admin-page {
          padding: 18px 0 42px;
          font-family: Inter, "DM Sans", system-ui, sans-serif;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .admin-header {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px;
          align-items: end;
          padding: 22px;
          border-radius: 22px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .admin-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin: 0 0 8px;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(22,163,74,0.12);
          color: #16a34a;
          border: 1px solid rgba(22,163,74,0.2);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .admin-header h1 {
          margin: 0;
          font-size: clamp(1.9rem, 3.8vw, 3rem);
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.055em;
          color: var(--text);
        }

        .admin-header h1 span {
          background: linear-gradient(120deg, #16a34a, #d6b300);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .admin-header > div > p {
          max-width: 570px;
          margin: 8px 0 0;
          color: var(--muted);
          font-size: 0.86rem;
          line-height: 1.55;
        }

        .admin-header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .header-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 14px;
          font-size: 0.8rem;
          white-space: nowrap;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--text);
          cursor: pointer;
          font-weight: 850;
        }

        .admin-status {
          padding: 10px 14px;
          border-radius: 12px;
          background: rgba(22,163,74,0.1);
          color: #16a34a;
          border: 1px solid rgba(22,163,74,0.2);
          font-size: 0.8rem;
          font-weight: 700;
          margin: 0;
        }

        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 10px;
        }

        .admin-stat-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px;
          border-radius: 16px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          text-decoration: none;
          color: inherit;
          transition: transform 0.2s ease, border-color 0.2s ease;
          position: relative;
        }

        .admin-stat-card:hover {
          transform: translateY(-2px);
          border-color: rgba(22,163,74,0.3);
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          flex-shrink: 0;
        }

        .stat-icon.green { background: rgba(22,163,74,0.12); color: #16a34a; }
        .stat-icon.gold  { background: rgba(214,179,0,0.14); color: #b89400; }

        .admin-stat-card strong {
          font-size: 1.35rem;
          font-weight: 950;
          color: var(--text);
          display: block;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .admin-stat-card span {
          display: block;
          margin-top: 4px;
          font-size: 0.7rem;
          font-weight: 850;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .stat-arrow {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--muted);
          opacity: 0.5;
        }

        .admin-content-grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 12px;
        }

        .admin-panel {
          padding: 18px;
          border-radius: 20px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .panel-head { margin-bottom: 14px; }

        .panel-head h2 {
          margin: 0;
          font-size: 1.05rem;
          font-weight: 900;
          color: var(--text);
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .panel-head h2 svg { color: #16a34a; }

        .panel-head p {
          margin: 4px 0 0;
          font-size: 0.8rem;
          color: var(--muted);
          line-height: 1.4;
        }

        .admin-actions-grid { display: grid; gap: 8px; }

        .admin-action-card {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 12px;
          padding: 14px;
          border-radius: 14px;
          background: var(--bg);
          border: 1px solid var(--border);
          transition: transform 0.18s ease, border-color 0.18s ease;
        }

        .admin-action-card:hover {
          transform: translateY(-1px);
          border-color: rgba(22,163,74,0.28);
        }

        .action-icon {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: rgba(22,163,74,0.12);
          color: #16a34a;
          flex-shrink: 0;
        }

        .admin-action-card h3 {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 900;
          color: var(--text);
        }

        .admin-action-card p {
          margin: 3px 0 0;
          font-size: 0.78rem;
          color: var(--muted);
          line-height: 1.4;
        }

        .action-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 12px;
          border-radius: 999px;
          font-size: 0.76rem;
          font-weight: 900;
          color: #16a34a;
          background: rgba(22,163,74,0.1);
          border: 1px solid rgba(22,163,74,0.18);
          text-decoration: none;
          white-space: nowrap;
          transition: background 0.15s ease;
        }

        .action-link:hover { background: rgba(22,163,74,0.18); }

        .summary-panel { display: flex; flex-direction: column; }

        .summary-list { display: grid; gap: 2px; flex: 1; }

        .summary-list div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          padding: 11px 0;
          border-bottom: 1px solid var(--border);
        }

        .summary-list div:last-child { border-bottom: 0; }

        .summary-list span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--muted);
        }

        .summary-list span svg { color: #16a34a; opacity: 0.7; }

        .summary-list strong {
          font-size: 0.95rem;
          font-weight: 950;
          color: #16a34a;
          letter-spacing: -0.03em;
        }

        @media (max-width: 1060px) {
          .admin-stats-grid { grid-template-columns: repeat(3, 1fr); }
          .admin-content-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 760px) {
          .admin-header { grid-template-columns: 1fr; padding: 18px; }
          .admin-header-actions { justify-content: flex-start; }
          .admin-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .admin-action-card { grid-template-columns: auto 1fr; }
          .action-link { grid-column: 1 / -1; justify-content: center; }
        }

        @media (max-width: 520px) {
          .admin-stats-grid { grid-template-columns: 1fr; }
          .header-btn { width: 100%; justify-content: center; }
        }
      `}</style>
    </section>
  );
};

export default AdminDashboard;