import { useEffect, useMemo, useState } from "react";
import {
  Package,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Tag,
  TrendingUp,
} from "lucide-react";
import ProductForm from "../components/admin/ProductForm";
import Button from "../components/common/Button";
import { createProduct, deleteProduct } from "../services/adminApi";
import { getProducts } from "../services/productApi";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("Loading products...");
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const load = async () => {
    try {
      setStatus("Loading products...");
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
      setStatus("");
    } catch {
      setProducts([]);
      setStatus("Failed to load products.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (payload) => {
    await createProduct(payload);
    await load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Disable this product?")) return;
    try {
      setDeletingId(id);
      await deleteProduct(id);
      await load();
    } finally {
      setDeletingId("");
    }
  };

  const filteredProducts = useMemo(() => {
    const clean = query.toLowerCase().trim();
    if (!clean) return products;
    return products.filter((p) =>
      p.title?.toLowerCase().includes(clean) ||
      p.type?.toLowerCase().includes(clean) ||
      p.deliveryType?.toLowerCase().includes(clean)
    );
  }, [products, query]);

  const stats = useMemo(() => {
    const types = [...new Set(products.map((p) => p.type).filter(Boolean))];
    return { total: products.length, types: types.length };
  }, [products]);

  return (
    <section className="admin-products-page">
      <header className="admin-products-header">
        <div>
          <p className="eyebrow"><Package size={13} /> Admin Products</p>
          <h1>Product <span>Manager</span></h1>
          <p>Add, manage, and disable digital products, templates, files, and booking-based offers.</p>
        </div>
        <div className="header-stats">
          <div className="header-stat">
            <TrendingUp size={15} className="hstat-icon" />
            <div>
              <strong>{stats.total}</strong>
              <span>Active Products</span>
            </div>
          </div>
          <div className="header-stat">
            <Tag size={15} className="hstat-icon" />
            <div>
              <strong>{stats.types}</strong>
              <span>Categories</span>
            </div>
          </div>
        </div>
      </header>

      <div className="admin-products-layout">
        <div className="product-form-panel">
          <div className="panel-head">
            <h2><Plus size={15} /> Add Product</h2>
            <p>Create a new product for the store.</p>
          </div>
          <ProductForm onSubmit={handleCreate} />
        </div>

        <div className="products-table-panel">
          <div className="products-toolbar">
            <div>
              <h2><Package size={15} /> Products</h2>
              <p>{status || `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""} listed`}</p>
            </div>
            <div className="toolbar-actions">
              <div className="product-search">
                <Search size={14} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products…"
                />
              </div>
              <button type="button" className="refresh-btn" onClick={load}>
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          <div className="admin-products-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Type</th>
                  <th>Delivery</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-cell">
                        <div className="product-thumb">
                          {product.thumbnail ? (
                            <img src={product.thumbnail} alt={product.title} />
                          ) : (
                            <span>{product.title?.slice(0, 1) || "P"}</span>
                          )}
                        </div>
                        <div>
                          <strong>{product.title || "Untitled product"}</strong>
                          <small>{product.slug || "no-slug"}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="price-val">₹{Number(product.price || 0).toLocaleString("en-IN")}</span>
                    </td>
                    <td>
                      <span className="type-pill">
                        {product.type?.replaceAll("_", " ") || "Product"}
                      </span>
                    </td>
                    <td>
                      <span className="delivery-text">
                        {product.deliveryType?.replaceAll("_", " ") || "N/A"}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="disable-btn"
                        title="Disable product"
                        disabled={deletingId === product.id}
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {!filteredProducts.length && !status && (
                  <tr>
                    <td colSpan="5">
                      <div className="empty-row">
                        <Package size={26} />
                        No products found.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        * { scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
        *::-webkit-scrollbar { width: 6px; height: 6px; }
        *::-webkit-scrollbar-track { background: transparent; }
        *::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
        *::-webkit-scrollbar-corner { background: transparent; }

        .admin-products-page {
          padding: 18px 0 42px;
          font-family: Inter, "DM Sans", system-ui, sans-serif;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .admin-products-header {
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

        .admin-products-header h1 {
          margin: 0;
          color: var(--text);
          font-size: clamp(1.9rem, 3.8vw, 3rem);
          line-height: 1;
          letter-spacing: -0.055em;
          font-weight: 950;
        }

        .admin-products-header h1 span {
          background: linear-gradient(120deg, #16a34a, #d6b300);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .admin-products-header > div > p {
          max-width: 570px;
          margin: 8px 0 0;
          color: var(--muted);
          font-size: 0.86rem;
          line-height: 1.55;
        }

        .header-stats {
          display: flex;
          gap: 8px;
        }

        .header-stat {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 11px 14px;
          border-radius: 14px;
          background: var(--bg);
          border: 1px solid var(--border);
        }

        .hstat-icon { color: #16a34a; }

        .header-stat strong {
          display: block;
          color: #16a34a;
          font-size: 1.2rem;
          font-weight: 950;
          letter-spacing: -0.04em;
          line-height: 1;
        }

        .header-stat span {
          display: block;
          margin-top: 3px;
          color: var(--muted);
          font-size: 0.68rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .admin-products-layout {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 12px;
          align-items: start;
        }

        .product-form-panel,
        .products-table-panel {
          border-radius: 20px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .product-form-panel { padding: 18px; }

        .panel-head { margin-bottom: 14px; }

        .panel-head h2,
        .products-toolbar h2 {
          display: flex;
          align-items: center;
          gap: 7px;
          margin: 0;
          color: var(--text);
          font-size: 1rem;
          font-weight: 900;
        }

        .panel-head h2 svg,
        .products-toolbar h2 svg { color: #16a34a; }

        .panel-head p,
        .products-toolbar p {
          margin: 4px 0 0;
          color: var(--muted);
          font-size: 0.78rem;
          font-weight: 700;
        }

        .products-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-bottom: 1px solid var(--border);
        }

        .toolbar-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .product-search {
          width: 210px;
          height: 38px;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 0 11px;
          border-radius: 11px;
          background: var(--bg);
          border: 1px solid var(--border);
          color: #16a34a;
        }

        .product-search:focus-within {
          border-color: rgba(22,163,74,0.55);
          box-shadow: 0 0 0 3px rgba(22,163,74,0.08);
        }

        .product-search input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--text);
          font-size: 0.81rem;
          font-weight: 700;
        }

        .refresh-btn {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--text);
          cursor: pointer;
        }

        .refresh-btn:hover { border-color: rgba(22,163,74,0.4); color: #16a34a; }

        .admin-products-table-wrap { overflow-x: auto; }

        .products-table-panel table {
          width: 100%;
          min-width: 680px;
          border-collapse: collapse;
        }

        .products-table-panel th,
        .products-table-panel td {
          padding: 11px 14px;
          border-bottom: 1px solid var(--border);
          text-align: left;
          font-size: 0.8rem;
          vertical-align: middle;
        }

        .products-table-panel th {
          color: var(--muted);
          background: rgba(22,163,74,0.04);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .products-table-panel tr:last-child td { border-bottom: none; }

        .products-table-panel tbody tr { transition: background 0.15s ease; }
        .products-table-panel tbody tr:hover { background: rgba(22,163,74,0.025); }

        .product-cell {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 200px;
        }

        .product-thumb {
          width: 36px;
          height: 36px;
          overflow: hidden;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 11px;
          background: rgba(22,163,74,0.12);
          color: #16a34a;
          font-size: 0.9rem;
          font-weight: 950;
        }

        .product-thumb img { width: 100%; height: 100%; object-fit: cover; }

        .product-cell strong {
          display: block;
          color: var(--text);
          font-size: 0.84rem;
          font-weight: 800;
          line-height: 1.2;
        }

        .product-cell small {
          display: block;
          margin-top: 3px;
          color: var(--muted);
          font-size: 0.7rem;
          font-family: monospace;
        }

        .price-val {
          font-size: 0.88rem;
          font-weight: 900;
          color: #16a34a;
        }

        .type-pill {
          display: inline-flex;
          padding: 4px 9px;
          border-radius: 999px;
          background: rgba(22,163,74,0.1);
          color: #16a34a;
          border: 1px solid rgba(22,163,74,0.18);
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          white-space: nowrap;
        }

        .delivery-text {
          color: var(--muted);
          font-size: 0.8rem;
          font-weight: 800;
          white-space: nowrap;
        }

        .disable-btn {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          border: 0;
          background: rgba(239,68,68,0.1);
          color: #ef4444;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.1s;
        }

        .disable-btn:hover { opacity: 0.8; transform: scale(1.07); }
        .disable-btn:active { transform: scale(0.95); }
        .disable-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

        .empty-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 28px;
          text-align: center;
          color: var(--muted);
          font-size: 0.84rem;
          font-weight: 800;
        }

        .empty-row svg { opacity: 0.3; }

        @media (max-width: 1100px) {
          .admin-products-layout { grid-template-columns: 1fr; }
        }

        @media (max-width: 760px) {
          .admin-products-header { grid-template-columns: 1fr; padding: 18px; }
          .header-stats { flex-direction: column; }
          .header-stat { width: 100%; }
          .products-toolbar { flex-direction: column; align-items: stretch; }
          .toolbar-actions { flex-direction: column; }
          .product-search { width: 100%; }
          .refresh-btn { width: 100%; border-radius: 11px; }
        }
      `}</style>
    </section>
  );
};

export default AdminProducts;