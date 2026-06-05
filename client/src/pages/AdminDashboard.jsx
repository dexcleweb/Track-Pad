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
      {
        label: "Users",
        value: stats?.users ?? 0,
        icon: Users,
        tone: "green",
        link: "/admin/users",
      },
      {
        label: "Products",
        value: stats?.products ?? 0,
        icon: Package,
        tone: "gold",
      },
      {
        label: "Orders",
        value: stats?.orders ?? 0,
        icon: ReceiptText,
        tone: "green",
      },
      {
        label: "Bookings",
        value: stats?.bookings ?? 0,
        icon: CalendarCheck,
        tone: "gold",
      },
      {
        label: "Revenue",
        value: `₹${stats?.revenue ?? 0}`,
        icon: IndianRupee,
        tone: "green",
      },
    ],
    [stats]
  );

  const adminLinks = [
    {
      to: "/admin/products",
      title: "Manage Products",
      description: "Add, edit, disable, and organize digital products.",
      icon: Package,
      button: "Products",
    },
    {
      to: "/admin/orders",
      title: "View Orders",
      description: "Track payments, purchases, and customer order history.",
      icon: ReceiptText,
      button: "Orders",
    },
    {
      to: "/admin/bookings",
      title: "Counselling Bookings",
      description: "Review bookings and update counselling session status.",
      icon: CalendarCheck,
      button: "Bookings",
    },
  ];

  return (
    <section className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">
            <ShieldCheck size={13} /> Admin Control
          </p>

          <h1>
            Welcome back, <span>Admin.</span>
          </h1>

          <p>
            Manage products, orders, customers, and counselling bookings from
            one clean dashboard.
          </p>
        </div>

        <div className="admin-header-actions">
          <button type="button" onClick={loadStats} className="refresh-btn">
            <RefreshCw size={14} /> Refresh
          </button>

          <Link to="/admin/products">
            <Button>
              <Plus size={14} /> Add Product
            </Button>
          </Link>
        </div>
      </header>

      {status && <p className="admin-status">{status}</p>}

      <div className="admin-stats-grid">
        {statCards.map((item) => {
          const Icon = item.icon;

          const content = (
            <>
              <div className="stat-icon">
                <Icon size={18} />
              </div>

              <div>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            </>
          );

          return item.link ? (
            <Link
              key={item.label}
              to={item.link}
              className={`admin-stat-card ${item.tone}`}
            >
              {content}
            </Link>
          ) : (
            <article
              key={item.label}
              className={`admin-stat-card ${item.tone}`}
            >
              {content}
            </article>
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
                  <div className="action-icon">
                    <Icon size={18} />
                  </div>

                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>

                  <Link to={item.to} className="action-link">
                    {item.button}
                    <ArrowRight size={14} />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="admin-panel summary-panel">
          <div className="panel-head">
            <h2>Store Summary</h2>
            <p>Current platform snapshot.</p>
          </div>

          <div className="summary-list">
            <div>
              <span>Total Users</span>
              <strong>{stats?.users ?? 0}</strong>
            </div>

            <div>
              <span>Active Products</span>
              <strong>{stats?.products ?? 0}</strong>
            </div>

            <div>
              <span>Total Orders</span>
              <strong>{stats?.orders ?? 0}</strong>
            </div>

            <div>
              <span>Bookings</span>
              <strong>{stats?.bookings ?? 0}</strong>
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        .admin-page {
          padding: 18px 0 42px;
          font-family: Inter, "DM Sans", system-ui, sans-serif;
        }

        .admin-header {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px;
          align-items: end;
          margin-bottom: 14px;
          padding: 20px;
          border-radius: 22px;
          background:
            linear-gradient(135deg, rgba(22,163,74,0.1), rgba(245,216,0,0.045)),
            var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .admin-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin: 0 0 8px;
          padding: 5px 8px;
          border-radius: 999px;
          background: rgba(22, 163, 74, 0.12);
          color: #16a34a;
          border: 1px solid rgba(22,163,74,0.18);
          font-size: 0.62rem;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .admin-header h1 {
          margin: 0;
          font-size: clamp(1.9rem,3.8vw,3rem);
          line-height: 1;
          font-weight: 950;
          color: var(--text);
        }

        .admin-header h1 span {
          background: linear-gradient(120deg,#16a34a,#d6b300);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .admin-header p {
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

        .refresh-btn,
        .admin-header-actions .btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 12px;
          font-size: 0.82rem;
          white-space: nowrap;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--text);
          cursor: pointer;
          font-weight: 850;
        }

        .admin-status {
          margin: 0 0 12px;
          color: var(--muted);
          font-weight: 700;
          font-size: 0.84rem;
        }

        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(5,minmax(0,1fr));
          gap: 12px;
          margin-bottom: 14px;
        }

        .admin-stat-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px;
          border-radius: 18px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: 0 6px 18px rgba(0,0,0,0.04);
          text-decoration: none;
          color: inherit;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .admin-stat-card:hover {
          transform: translateY(-2px);
          border-color: rgba(22,163,74,0.3);
        }

        .stat-icon {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: rgba(22,163,74,0.12);
          color: #16a34a;
          flex-shrink: 0;
        }

        .admin-stat-card.gold .stat-icon {
          background: rgba(214,179,0,0.14);
          color: #b89400;
        }

        .admin-stat-card strong {
          font-size: 1.35rem;
          color: var(--text);
          display: block;
          line-height: 1;
        }

        .admin-stat-card span {
          display: block;
          margin-top: 4px;
          font-size: 0.72rem;
          font-weight: 850;
          color: var(--muted);
        }

        .admin-content-grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 14px;
        }

        .admin-panel {
          padding: 16px;
          border-radius: 20px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .panel-head {
          margin-bottom: 12px;
        }

        .panel-head h2 {
          margin: 0;
          font-size: 1.12rem;
        }

        .panel-head p {
          margin: 4px 0 0;
          font-size: 0.82rem;
          color: var(--muted);
          line-height: 1.4;
        }

        .admin-actions-grid {
          display: grid;
          gap: 10px;
        }

        .admin-action-card {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 10px;
          padding: 12px;
          border-radius: 16px;
          background: var(--bg);
          border: 1px solid var(--border);
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .admin-action-card:hover {
          transform: translateY(-1px);
          border-color: rgba(22,163,74,0.28);
        }

        .action-icon {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: rgba(22,163,74,0.12);
          color: #16a34a;
        }

        .admin-action-card h3 {
          margin: 0;
          font-size: 0.96rem;
        }

        .admin-action-card p {
          margin: 4px 0 0;
          font-size: 0.82rem;
          color: var(--muted);
        }

        .action-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          font-weight: 900;
          color: #16a34a;
          text-decoration: none;
        }

        .summary-list {
          display: grid;
          gap: 8px;
        }

        .summary-list div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          padding: 10px 0;
          border-bottom: 1px solid var(--border);
        }

        .summary-list div:last-child {
          border-bottom: 0;
        }

        .summary-list span {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--muted);
        }

        .summary-list strong {
          font-size: 0.92rem;
          color: #16a34a;
        }

        @media (max-width:1060px) {
          .admin-stats-grid {
            grid-template-columns: repeat(3,1fr);
          }

          .admin-content-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width:760px) {
          .admin-header {
            grid-template-columns: 1fr;
            padding: 18px;
          }

          .admin-header-actions {
            justify-content: flex-start;
          }

          .admin-stats-grid {
            grid-template-columns: repeat(2,1fr);
          }

          .admin-action-card {
            grid-template-columns: auto 1fr;
          }

          .action-link {
            grid-column: 1 / -1;
          }
        }

        @media (max-width:520px) {
          .admin-stats-grid {
            grid-template-columns: 1fr;
          }

          .admin-header-actions .btn,
          .refresh-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default AdminDashboard;