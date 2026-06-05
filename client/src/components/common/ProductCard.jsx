import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getImageUrl = (thumbnail) => {
  if (!thumbnail) return null;

  if (thumbnail.startsWith("http")) {
    return thumbnail;
  }

  return `${API_URL}${thumbnail}`;
};

const ProductCard = ({ product }) => {
  const imageUrl = getImageUrl(product.thumbnail);

  return (
    <article className="product-card">
      <Link to={`/products/${product.slug}`} className="product-card-link">
        <div className="product-media">
          {imageUrl ? (
            <img src={imageUrl} alt={product.title} />
          ) : (
            <div className="product-placeholder">
              {product.title?.slice(0, 1)}
            </div>
          )}
        </div>

        <div className="product-body">
          <div className="product-meta">
            <span>{product.type?.replaceAll("_", " ")}</span>
            <strong>₹{product.price}</strong>
          </div>

          <h3>{product.title}</h3>

          <p>{product.description}</p>

          <div className="product-bottom">
            <span>{product.deliveryType?.replaceAll("_", " ")}</span>

            <div>
              View
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </Link>

      <style>{`
        .product-card {
          overflow: hidden;
          border-radius: 20px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.055);
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .product-card:hover {
          transform: translateY(-3px);
          border-color: rgba(22, 163, 74, 0.34);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.09);
        }

        .product-card-link {
          display: block;
          color: inherit;
          text-decoration: none;
        }

        .product-media {
          height: 160px;
          background:
            linear-gradient(135deg, rgba(22, 163, 74, 0.13), rgba(245, 216, 0, 0.08)),
            var(--bg);
          border-bottom: 1px solid var(--border);
          overflow: hidden;
        }

        .product-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.25s ease;
        }

        .product-card:hover .product-media img {
          transform: scale(1.04);
        }

        .product-placeholder {
          height: 100%;
          display: grid;
          place-items: center;
          color: #16a34a;
          font-size: 3rem;
          font-weight: 950;
          letter-spacing: -0.08em;
        }

        .product-body {
          padding: 16px;
        }

        .product-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 10px;
        }

        .product-meta span {
          color: #16a34a;
          font-size: 0.68rem;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .product-meta strong {
          color: var(--text);
          font-size: 0.98rem;
          white-space: nowrap;
        }

        .product-body h3 {
          margin: 0;
          color: var(--text);
          font-size: 1.08rem;
          line-height: 1.25;
          letter-spacing: -0.035em;
        }

        .product-body p {
          min-height: 46px;
          margin: 9px 0 14px;
          color: var(--muted);
          font-size: 0.86rem;
          line-height: 1.5;
        }

        .product-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--border);
          color: var(--muted);
          font-size: 0.82rem;
          font-weight: 800;
        }

        .product-bottom div {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #16a34a;
          font-weight: 900;
        }
      `}</style>
    </article>
  );
};

export default ProductCard;