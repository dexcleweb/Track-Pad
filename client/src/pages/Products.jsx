import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { getProducts } from "../services/productApi";
import ProductGrid from "../components/products/ProductGrid";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("Loading products...");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("ALL");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProducts();
        setProducts(Array.isArray(data) ? data : []);
        setStatus("");
      } catch {
        setProducts([]);
        setStatus("Failed to load products.");
      }
    };
    load();
  }, []);

  const productTypes = useMemo(() => {
    const uniqueTypes = [...new Set(products.map((p) => p.type).filter(Boolean))];
    return ["ALL", ...uniqueTypes];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const cleanQuery = query.toLowerCase().trim();
    return products.filter((p) => {
      const matchesQuery =
        !cleanQuery ||
        p.title?.toLowerCase().includes(cleanQuery) ||
        p.description?.toLowerCase().includes(cleanQuery);
      const matchesType = type === "ALL" || p.type === type;
      return matchesQuery && matchesType;
    });
  }, [products, query, type]);

  const clearFilters = () => { setQuery(""); setType("ALL"); };
  const hasFilters = query.trim() || type !== "ALL";

  return (
    <section className="products-page">
      <header className="products-header">
        <div className="products-heading">
          <p className="products-eyebrow">Digital Store</p>
          <h1>Products for <span>better routines.</span></h1>
          <p>Clean templates, habit systems, planners, and counselling products for organizing life without creating a second mess.</p>
        </div>
        <div className="products-total">
          <strong>{products.length}</strong>
          <span>items</span>
        </div>
      </header>

      <div className="catalog-bar">
        <div className="catalog-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search products…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button type="button" className="clear-search" onClick={() => setQuery("")} aria-label="Clear search">
              <X size={13} />
            </button>
          )}
        </div>

        <div className="catalog-filter">
          <SlidersHorizontal size={15} />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {productTypes.map((item) => (
              <option key={item} value={item}>
                {item === "ALL" ? "All Categories" : item.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="catalog-meta">
        {status ? (
          <span className="meta-loading">{status}</span>
        ) : (
          <span>
            Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products
          </span>
        )}
        {hasFilters && (
          <button type="button" className="clear-btn" onClick={clearFilters}>
            <X size={12} /> Clear filters
          </button>
        )}
      </div>

      {!status && filteredProducts.length === 0 ? (
        <div className="empty-products">
          <Search size={30} />
          <h3>No matching products</h3>
          <p>Try another search term or category.</p>
          {hasFilters && <button type="button" className="clear-btn-lg" onClick={clearFilters}>Clear filters</button>}
        </div>
      ) : (
        !status && <ProductGrid products={filteredProducts} />
      )}

      <style>{`
        * { scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
        *::-webkit-scrollbar { width: 6px; height: 6px; }
        *::-webkit-scrollbar-track { background: transparent; }
        *::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
        *::-webkit-scrollbar-corner { background: transparent; }

        .products-page {
          padding: 14px 0 44px;
          font-family: Inter, "DM Sans", system-ui, sans-serif;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .products-header {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: end;
          gap: 18px;
          padding: 22px;
          border-radius: 22px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .products-heading { max-width: 640px; }

        .products-eyebrow {
          display: inline-flex;
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

        .products-header h1 {
          margin: 0;
          font-size: clamp(1.9rem, 3.6vw, 3.1rem);
          line-height: 1;
          letter-spacing: -0.055em;
          font-weight: 950;
          color: var(--text);
        }

        .products-header h1 span {
          background: linear-gradient(120deg, #16a34a, #d6b300);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .products-header p {
          max-width: 540px;
          margin: 10px 0 0;
          color: var(--muted);
          font-size: 0.88rem;
          line-height: 1.55;
        }

        .products-total {
          min-width: 100px;
          padding: 14px;
          border-radius: 16px;
          background: var(--bg);
          border: 1px solid var(--border);
          text-align: right;
        }

        .products-total strong {
          display: block;
          color: #16a34a;
          font-size: 1.8rem;
          line-height: 1;
          letter-spacing: -0.06em;
          font-weight: 950;
        }

        .products-total span {
          display: block;
          margin-top: 5px;
          color: var(--muted);
          font-size: 0.7rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        .catalog-bar {
          display: grid;
          grid-template-columns: 1fr 230px;
          gap: 10px;
        }

        .catalog-search,
        .catalog-filter {
          height: 46px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 0 14px;
          border-radius: 14px;
          background: var(--card);
          border: 1px solid var(--border);
          color: #16a34a;
          transition: border-color 0.18s, box-shadow 0.18s;
        }

        .catalog-search:focus-within,
        .catalog-filter:focus-within {
          border-color: rgba(22,163,74,0.55);
          box-shadow: 0 0 0 3px rgba(22,163,74,0.08);
        }

        .catalog-search input,
        .catalog-filter select {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--text);
          font-size: 0.86rem;
          font-weight: 700;
        }

        .catalog-filter select { cursor: pointer; }

        .clear-search {
          width: 22px;
          height: 22px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 50%;
          background: rgba(22,163,74,0.12);
          color: #16a34a;
          cursor: pointer;
        }

        .catalog-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          color: var(--muted);
          font-size: 0.8rem;
          font-weight: 700;
          min-height: 22px;
        }

        .catalog-meta strong { color: #16a34a; }

        .meta-loading { color: var(--muted); }

        .clear-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          border: 0;
          background: transparent;
          color: #16a34a;
          cursor: pointer;
          font-weight: 900;
          font-size: 0.8rem;
        }

        .empty-products {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 40px 16px;
          border-radius: 18px;
          background: var(--card);
          border: 1px solid var(--border);
          text-align: center;
        }

        .empty-products svg { color: var(--muted); opacity: 0.3; margin-bottom: 4px; }

        .empty-products h3 {
          margin: 0;
          font-size: 1.1rem;
          letter-spacing: -0.03em;
          color: var(--text);
        }

        .empty-products p {
          margin: 0;
          color: var(--muted);
          font-size: 0.86rem;
        }

        .clear-btn-lg {
          margin-top: 4px;
          padding: 8px 16px;
          border-radius: 999px;
          border: 1px solid rgba(22,163,74,0.2);
          background: rgba(22,163,74,0.1);
          color: #16a34a;
          font-size: 0.82rem;
          font-weight: 900;
          cursor: pointer;
        }

        @media (max-width: 760px) {
          .products-header { grid-template-columns: 1fr; padding: 18px; }
          .products-total { width: 100%; text-align: left; }
          .catalog-bar { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
};

export default Products;