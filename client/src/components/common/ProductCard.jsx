import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Download,
  FileText,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// --- Pure Utility Functions ---
const getImageUrl = (thumbnail) => {
  if (!thumbnail) return null;
  if (thumbnail.startsWith("http")) return thumbnail;
  return `${API_URL}${thumbnail}`;
};

const formatLabel = (value) => {
  if (!value) return "Digital Product";
  return String(value)
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatPrice = (price) => {
  const amount = Number(price || 0);
  return amount <= 0 ? "Free" : `₹${amount.toLocaleString("en-IN")}`;
};

const getOldPrice = (price) => {
  const amount = Number(price || 0);
  if (amount <= 0) return null;
  // Synced with details page calculation (Double price for 50% off visualization)
  return Math.round(amount * 2); 
};

const checkIsNewProduct = (createdAt) => {
  if (!createdAt) return false;
  const createdTime = new Date(createdAt).getTime();
  if (Number.isNaN(createdTime)) return false;

  const diffDays = (Date.now() - createdTime) / (1000 * 60 * 60 * 24);
  return diffDays <= 14;
};

// --- Component ---
const ProductCard = ({ product }) => {
  if (!product) return null;

  const imageUrl = useMemo(() => getImageUrl(product.thumbnail || product.image), [product.thumbnail, product.image]);
  const oldPrice = useMemo(() => getOldPrice(product.price), [product.price]);
  const isFree = useMemo(() => Number(product.price || 0) <= 0, [product.price]);
  const isNew = useMemo(() => checkIsNewProduct(product.createdAt), [product.createdAt]);

  const formattedType = useMemo(() => formatLabel(product.type), [product.type]);
  const formattedDelivery = useMemo(() => formatLabel(product.deliveryType), [product.deliveryType]);
  const displayPrice = useMemo(() => formatPrice(product.price), [product.price]);

  return (
    <article className="product-card">
      <Link to={`/products/${product.slug}`} className="product-card-link" aria-label={`View details for ${product.title || "product"}`}>
        <div className="product-media">
          <div className="product-badges">
            {product.isFeatured && (
              <span className="floating-badge featured">
                <Star size={11} fill="currentColor" />
                Featured
              </span>
            )}

            {isNew && (
              <span className="floating-badge new">
                <Sparkles size={11} fill="currentColor" />
                New
              </span>
            )}
          </div>

          {imageUrl ? (
            <img src={imageUrl} alt={product.title || "Product Workspace"} loading="lazy" />
          ) : (
            <div className="product-placeholder" Brass-field="true">
              <FileText size={38} strokeWidth={1.5} />
              <strong>{product.title?.trim()?.slice(0, 1)?.toUpperCase() || "P"}</strong>
            </div>
          )}

          <div className="media-overlay">
            <span>
              View details
              <ArrowRight size={13} strokeWidth={2.5} />
            </span>
          </div>
        </div>

        <div className="product-body">
          <div className="product-meta">
            <span className="type-pill">
              <Zap size={11} fill="currentColor" />
              {formattedType}
            </span>

            <div className="price-stack">
              {oldPrice && !isFree && (
                <span className="old-price">
                  ₹{oldPrice.toLocaleString("en-IN")}
                </span>
              )}
              <strong className={isFree ? "free-price" : ""}>
                {displayPrice}
              </strong>
            </div>
          </div>

          <h3>{product.title || "Untitled Product"}</h3>
          <p>{product.description || "No description available for this digital asset."}</p>

          <div className="product-info-row">
            <span>
              <Download size={13} />
              {formattedDelivery}
            </span>

            <span>
              <BadgeCheck size={13} />
              Instant access
            </span>
          </div>

          <div className="product-bottom">
            <span>Digital Assets</span>
            <div className="action-trigger">
              View product
              <ArrowRight size={14} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </Link>

      <style>{`
        .product-card {
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          background: linear-gradient(180deg, rgba(22,163,74,0.02), transparent 50%), var(--card, #ffffff);
          border: 1px solid var(--border, #e2e8f0);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .product-card::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(circle at top left, rgba(22,163,74,0.08), transparent 40%), radial-gradient(circle at bottom right, rgba(214,179,0,0.06), transparent 40%);
          opacity: 0;
          transition: opacity 0.25s ease;
          z-index: 1;
        }

        .product-card:hover {
          transform: translateY(-4px);
          border-color: rgba(22, 163, 74, 0.3);
          box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.07), 0 14px 20px -10px rgba(22, 163, 74, 0.04);
        }

        .product-card:hover::before {
          opacity: 1;
        }

        .product-card-link {
          position: relative;
          z-index: 2;
          display: block;
          color: inherit;
          text-decoration: none;
          height: 100%;
        }

        .product-media {
          position: relative;
          height: 180px;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(22, 163, 74, 0.08), rgba(214, 179, 0, 0.05)), var(--bg, #f8fafc);
          border-bottom: 1px solid var(--border, #e2e8f0);
        }

        .product-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .product-card:hover .product-media img {
          transform: scale(1.04);
        }

        .product-badges {
          position: absolute;
          top: 12px;
          left: 12px;
          right: 12px;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
          pointer-events: none;
        }

        .floating-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }

        .floating-badge.featured {
          color: #15803d;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(22, 163, 74, 0.2);
        }

        .floating-badge.new {
          margin-left: auto;
          color: #a16207;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(214, 179, 0, 0.25);
        }

        .product-placeholder {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          color: #16a34a;
          opacity: 0.85;
        }

        .product-placeholder strong {
          font-size: 2.8rem;
          font-weight: 900;
          letter-spacing: -0.05em;
          line-height: 1;
        }

        .media-overlay {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.15);
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          padding: 12px;
          opacity: 0;
          transition: opacity 0.2s ease;
          z-index: 2;
        }

        .product-card:hover .media-overlay {
          opacity: 1;
        }

        .media-overlay span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 999px;
          background: #0f172a;
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 700;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
        }

        .product-body {
          padding: 16px;
        }

        .product-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 10px;
        }

        .type-pill {
          min-width: 0;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #16a34a;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .price-stack {
          display: flex;
          align-items: baseline;
          gap: 6px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .old-price {
          color: var(--muted, #64748b);
          font-size: 0.75rem;
          font-weight: 600;
          text-decoration: line-through;
          opacity: 0.7;
        }

        .price-stack strong {
          color: var(--text, #0f172a);
          font-size: 1.05rem;
          font-weight: 800;
        }

        .price-stack .free-price {
          color: #16a34a;
        }

        .product-body h3 {
          margin: 0 0 6px 0;
          color: var(--text, #0f172a);
          font-size: 1.1rem;
          line-height: 1.3;
          font-weight: 800;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-body p {
          min-height: 38px;
          margin: 0 0 12px 0;
          color: var(--muted, #64748b);
          font-size: 0.85rem;
          line-height: 1.45;
          font-weight: 500;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-info-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 14px;
        }

        .product-info-row span {
          min-width: 0;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: 10px;
          background: var(--bg, #f8fafc);
          border: 1px solid var(--border, #e2e8f0);
          color: var(--muted, #64748b);
          font-size: 0.72rem;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .product-info-row svg {
          color: #16a34a;
          flex-shrink: 0;
        }

        .product-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding-top: 12px;
          border-top: 1px solid var(--border, #e2e8f0);
          color: var(--muted, #64748b);
          font-size: 0.78rem;
          font-weight: 700;
        }

        .product-bottom .action-trigger {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #16a34a;
          font-weight: 800;
          transition: transform 0.2s ease;
        }

        .product-card:hover .action-trigger {
          transform: translateX(3px);
        }

        @media (max-width: 520px) {
          .product-media { height: 160px; }
          .product-info-row { grid-template-columns: 1fr; gap: 6px; }
          .product-bottom { flex-direction: row; align-items: center; }
        }
      `}</style>
    </article>
  );
};

export default React.memo(ProductCard);