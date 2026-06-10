import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock,
  IndianRupee,
  ReceiptText,
  RefreshCw,
  Search,
  TrendingUp,
  XCircle,
} from "lucide-react";
import OrdersTable from "../components/admin/OrdersTable";
import { getAdminOrders } from "../services/adminApi";
import Button from "../components/common/Button";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("Loading orders...");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");

  const load = async () => {
    try {
      setStatus("Loading orders...");
      const data = await getAdminOrders();
      setOrders(Array.isArray(data) ? data : []);
      setStatus("");
    } catch {
      setOrders([]);
      setStatus("Failed to load orders.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const paid = orders.filter((o) => o.status === "PAID");
    return {
      total: orders.length,
      paid: paid.length,
      pending: orders.filter((o) => o.status === "PENDING").length,
      failed: orders.filter((o) => o.status === "FAILED").length,
      revenue: paid.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0),
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const clean = query.toLowerCase().trim();
    return orders
      .filter((o) => filter === "ALL" || o.status === filter)
      .filter((o) => {
        if (!clean) return true;
        const email = o.user?.email?.toLowerCase() || "";
        const s = o.status?.toLowerCase() || "";
        const products = o.items?.map((i) => i.product?.title).filter(Boolean).join(" ").toLowerCase() || "";
        return email.includes(clean) || s.includes(clean) || products.includes(clean);
      });
  }, [orders, query, filter]);

  const filterTabs = [
    { key: "ALL", label: "All", count: stats.total },
    { key: "PAID", label: "Paid", count: stats.paid },
    { key: "PENDING", label: "Pending", count: stats.pending },
    { key: "FAILED", label: "Failed", count: stats.failed },
  ];

  return (
    <section className="admin-orders-page">
      <header className="admin-orders-header">
        <div>
          <p className="eyebrow"><ReceiptText size={13} /> Admin Orders</p>
          <h1>Customer <span>Orders</span></h1>
          <p>Track payment status, purchased products, and customer order history from one clean admin view.</p>
        </div>
        <div className="header-summary">
          <div className="summary-card">
            <TrendingUp size={16} className="summary-icon" />
            <div>
              <strong>₹{stats.revenue.toLocaleString("en-IN")}</strong>
              <span>Paid Revenue</span>
            </div>
          </div>
          <button type="button" className="header-btn" onClick={load}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </header>

      <div className="orders-stats-row">
        {[
          { label: "Total Orders", value: stats.total, icon: ReceiptText, tone: "green" },
          { label: "Paid", value: stats.paid, icon: CheckCircle2, tone: "green" },
          { label: "Pending", value: stats.pending, icon: Clock, tone: "gold" },
          { label: "Failed", value: stats.failed, icon: XCircle, tone: "red" },
          { label: "Revenue", value: `₹${stats.revenue.toLocaleString("en-IN")}`, icon: IndianRupee, tone: "green" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="orders-stat-card">
              <div className={`orders-stat-icon ${s.tone}`}><Icon size={16} /></div>
              <div>
                <p className="orders-stat-label">{s.label}</p>
                <p className="orders-stat-val">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="orders-toolbar">
        <div className="filter-tabs">
          {filterTabs.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`filter-tab ${filter === t.key ? "active" : ""}`}
              onClick={() => setFilter(t.key)}
            >
              {t.label}
              <em>{t.count}</em>
            </button>
          ))}
        </div>
        <div className="orders-search">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search by email, status, product…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {status && <p className="admin-orders-status">{status}</p>}

      {!status && <OrdersTable orders={filteredOrders} />}

      <style>{`
        * { scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
        *::-webkit-scrollbar { width: 6px; height: 6px; }
        *::-webkit-scrollbar-track { background: transparent; }
        *::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
        *::-webkit-scrollbar-corner { background: transparent; }

        .admin-orders-page {
          padding: 18px 0 42px;
          font-family: Inter, "DM Sans", system-ui, sans-serif;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .admin-orders-header {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: end;
          gap: 16px;
          padding: 22px;
          border-radius: 22px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .eyebrow {
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

        .admin-orders-header h1 {
          margin: 0;
          color: var(--text);
          font-size: clamp(1.9rem, 3.8vw, 3rem);
          line-height: 1;
          letter-spacing: -0.055em;
          font-weight: 950;
        }

        .admin-orders-header h1 span {
          background: linear-gradient(120deg, #16a34a, #d6b300);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .admin-orders-header > div > p {
          max-width: 570px;
          margin: 8px 0 0;
          color: var(--muted);
          font-size: 0.86rem;
          line-height: 1.55;
        }

        .header-summary {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }

        .summary-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 14px;
          background: var(--bg);
          border: 1px solid var(--border);
        }

        .summary-icon { color: #16a34a; }

        .summary-card strong {
          display: block;
          color: #16a34a;
          font-size: 1.25rem;
          font-weight: 950;
          letter-spacing: -0.04em;
          line-height: 1;
        }

        .summary-card span {
          display: block;
          margin-top: 3px;
          color: var(--muted);
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .header-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          font-size: 0.78rem;
          white-space: nowrap;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--text);
          cursor: pointer;
          font-weight: 850;
        }

        .orders-stats-row {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 10px;
        }

        .orders-stat-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 14px;
          border-radius: 14px;
          background: var(--card);
          border: 1px solid var(--border);
        }

        .orders-stat-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        .orders-stat-icon.green { background: rgba(22,163,74,0.12); color: #16a34a; }
        .orders-stat-icon.gold  { background: rgba(214,179,0,0.14); color: #b89400; }
        .orders-stat-icon.red   { background: rgba(239,68,68,0.12); color: #ef4444; }

        .orders-stat-label {
          margin: 0;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--muted);
        }

        .orders-stat-val {
          margin: 2px 0 0;
          font-size: 1.2rem;
          font-weight: 950;
          color: var(--text);
          letter-spacing: -0.04em;
        }

        .orders-toolbar {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .filter-tabs {
          display: flex;
          gap: 4px;
          padding: 4px;
          border-radius: 13px;
          background: var(--card);
          border: 1px solid var(--border);
        }

        .filter-tab {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 9px;
          border: 0;
          background: transparent;
          color: var(--muted);
          font-size: 0.78rem;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }

        .filter-tab.active {
          background: #16a34a;
          color: #fff;
        }

        .filter-tab em {
          font-style: normal;
          font-size: 10px;
          padding: 1px 5px;
          border-radius: 99px;
          background: rgba(255,255,255,0.2);
        }

        .filter-tab:not(.active) em {
          background: rgba(22,163,74,0.12);
          color: #16a34a;
        }

        .orders-search {
          flex: 1;
          min-width: 260px;
          height: 42px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 14px;
          border-radius: 13px;
          background: var(--card);
          border: 1px solid var(--border);
          color: #16a34a;
        }

        .orders-search:focus-within {
          border-color: rgba(22,163,74,0.55);
          box-shadow: 0 0 0 3px rgba(22,163,74,0.08);
        }

        .orders-search input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--text);
          font-size: 0.84rem;
          font-weight: 700;
        }

        .admin-orders-status {
          padding: 10px 14px;
          border-radius: 12px;
          background: rgba(22,163,74,0.1);
          color: #16a34a;
          font-size: 0.8rem;
          font-weight: 700;
          margin: 0;
        }

        @media (max-width: 1050px) {
          .orders-stats-row { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 760px) {
          .admin-orders-header { grid-template-columns: 1fr; padding: 18px; }
          .header-summary { align-items: flex-start; }
          .summary-card { width: 100%; }
          .header-btn { width: 100%; justify-content: center; }
          .orders-stats-row { grid-template-columns: repeat(2, 1fr); }
          .orders-toolbar { flex-direction: column; align-items: stretch; }
          .filter-tabs { overflow-x: auto; }
          .orders-search { min-width: 100%; }
        }
      `}</style>
    </section>
  );
};

export default AdminOrders;