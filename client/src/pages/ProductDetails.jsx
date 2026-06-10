import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Lock,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import Button from "../components/common/Button";
import { getProductBySlug } from "../services/productApi";
import { createPaymentOrder, verifyPayment } from "../services/paymentApi";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// --- Pure Utilities ---
const getImageUrl = (thumbnail) => {
  if (!thumbnail) return null;
  if (thumbnail.startsWith("http")) return thumbnail;
  return `${API_URL}${thumbnail}`;
};

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// --- Component ---
const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("Loading product details...");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const loadProduct = async () => {
      try {
        setStatus("Loading product details...");
        const data = await getProductBySlug(slug);
        if (isMounted) {
          if (data) {
            setProduct(data);
            setStatus("");
          } else {
            setStatus("Product not found.");
          }
        }
      } catch (err) {
        if (isMounted) setStatus("Product not found.");
      }
    };

    loadProduct();
    return () => { isMounted = false; };
  }, [slug]);

  // --- Calculations ---
  const imageUrl = useMemo(() => getImageUrl(product?.thumbnail), [product?.thumbnail]);
  const price = useMemo(() => Number(product?.price || 0), [product?.price]);
  const oldPrice = useMemo(() => Math.round(price * 2), [price]); // Perfectly mirrors a 50% discount baseline

  const productType = useMemo(() => {
    return product?.type ? product.type.replaceAll("_", " ").toLowerCase() : "digital product";
  }, [product?.type]);

  const deliveryLabel = useMemo(() => {
    const labels = {
      LINK: "Private access link",
      FILE: "Downloadable file",
      BOTH: "Link + file delivery",
      BOOKING: "Paid booking",
    };
    return labels[product?.deliveryType] || product?.deliveryType || "Instant Download";
  }, [product?.deliveryType]);

  const DeliveryIcon = useMemo(() => {
    if (product?.deliveryType === "FILE") return Download;
    if (product?.deliveryType === "LINK") return ExternalLink;
    return FileText;
  }, [product?.deliveryType]);

  // --- Payment Mechanism ---
  const handleBuy = useCallback(async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!product?.id) {
      alert("Invalid context initialization. Refresh the viewport asset.");
      return;
    }

    setPaying(true);

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert("Razorpay Engine interface failed to load securely. Check connectivity settings.");
        setPaying(false);
        return;
      }

      const orderPayload = await createPaymentOrder([product.id]);
      if (!orderPayload?.razorpayOrder) {
        throw new Error("Malformed validation signatures received from server.");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderPayload.razorpayOrder.amount,
        currency: orderPayload.razorpayOrder.currency,
        name: "TrackPad",
        description: product.title || "Premium Asset Purchase",
        order_id: orderPayload.razorpayOrder.id,
        method: { upi: true },
        handler: async function (response) {
          try {
            await verifyPayment({
              orderId: orderPayload.order.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            navigate("/checkout-success");
          } catch (err) {
            alert(err.response?.data?.message || "Verification routines rejected order status updates.");
          } finally {
            setPaying(false);
          }
        },
        modal: {
          ondismiss: function () {
            setPaying(false);
          },
        },
        prefill: {
          email: user.email,
          contact: user.phone || "9999999999",
        },
        theme: {
          color: "#16a34a",
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Payment compilation routines failed.");
      setPaying(false);
    }
  }, [user, product, navigate]);

  // --- View States ---
  if (status) {
    return (
      <section className="product-detail-page">
        <div className="state-card" role="alert">
          <p>{status}</p>
          {status === "Product not found." && (
            <Link to="/products" style={{ textDecoration: "none" }}>
              <Button variant="outline">Back to Products</Button>
            </Link>
          )}
        </div>
      </section>
    );
  }

  if (!product) return null;

  return (
    <section className="product-detail-page">
      <Link to="/products" className="back-link">
        <ArrowLeft size={16} />
        Back to products
      </Link>

      <div className="detail-shell">
        <div className="media-card">
          {imageUrl ? (
            <img src={imageUrl} alt={`Cover for ${product.title}`} />
          ) : (
            <div className="media-placeholder">
              <span>{product.title?.trim()?.slice(0, 1)?.toUpperCase() || "P"}</span>
            </div>
          )}
        </div>

        <article className="info-card">
          <div className="top-row">
            <span className="type-pill">{productType}</span>
            <span className="secure-pill">
              <ShieldCheck size={15} />
              Secure UPI Gateway
            </span>
          </div>

          <h1>{product.title || "Untitled Digital Blueprint"}</h1>
          <p className="description">{product.description || "No analytical breakdowns documented for this item."}</p>

          <div className="purchase-box">
            <div>
              <span>One-time investment</span>
              <div className="detail-price-stack">
                {price > 0 && <span className="detail-old-price">₹{oldPrice.toLocaleString("en-IN")}</span>}
                <strong>{price > 0 ? `₹${price.toLocaleString("en-IN")}` : "Free access"}</strong>
                {price > 0 && <span className="discount-badge">50% OFF</span>}
              </div>
            </div>

            <div className="delivery-box">
              <DeliveryIcon size={17} />
              {deliveryLabel}
            </div>
          </div>

          <div className="benefits-list">
            <div>
              <CheckCircle2 size={16} />
              Pay once, access forever
            </div>
            <div>
              <CheckCircle2 size={16} />
              Delivered instantly post-payment
            </div>
            <div>
              <Lock size={16} />
              Stored safely in account vault
            </div>
          </div>

          <Button onClick={handleBuy} disabled={paying} style={{ width: "100%" }}>
            {paying ? (
              "Opening Secured Network..."
            ) : (
              <>
                <ShoppingBag size={16} />
                {price > 0 ? "Buy with UPI Gateway" : "Claim Free Instant Access"}
              </>
            )}
          </Button>

          {!user && (
            <p className="login-note">
              Authentication required via email OTP prior to finalizing workspace processing.
            </p>
          )}
        </article>
      </div>

      <div className="detail-extra">
        <div>
          <h3>After purchase deployment</h3>
          <p>
            This operational bundle registers permanently to your private library dashboard profile instantly upon payment acknowledgement hooks.
          </p>
        </div>

        <div>
          <h3>Distribution Logistics</h3>
          <p>
            Delivery configuration runs via <strong>{deliveryLabel}</strong> verification filters. Access paths initialize within your vault environment automatically.
          </p>
        </div>
      </div>

      <style>{`
        .product-detail-page {
          padding: 24px 0 60px;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 20px;
          color: var(--muted, #64748b);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 700;
          transition: color 0.2s ease;
        }

        .back-link:hover {
          color: #16a34a;
        }

        .detail-shell {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 24px;
          align-items: start;
        }

        .media-card {
          min-height: 420px;
          overflow: hidden;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(22, 163, 74, 0.08), rgba(245, 216, 0, 0.04)), var(--card, #ffffff);
          border: 1px solid var(--border, #e2e8f0);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .media-card img {
          width: 100%;
          height: 100%;
          min-height: 420px;
          object-fit: cover;
          display: block;
        }

        .media-placeholder {
          min-height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
        }

        .media-placeholder span {
          color: #16a34a;
          font-size: 4.5rem;
          font-weight: 900;
        }

        .info-card {
          padding: 28px;
          border-radius: 20px;
          background: var(--card, #ffffff);
          border: 1px solid var(--border, #e2e8f0);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.02);
        }

        .top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .type-pill, .secure-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 700;
        }

        .type-pill {
          color: #16a34a;
          background: rgba(22, 163, 74, 0.08);
          border: 1px solid rgba(22, 163, 74, 0.15);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .secure-pill {
          color: var(--muted, #64748b);
          background: var(--bg, #f8fafc);
          border: 1px solid var(--border, #e2e8f0);
        }

        .secure-pill svg {
          color: #16a34a;
        }

        .info-card h1 {
          margin: 0 0 12px 0;
          color: var(--text, #0f172a);
          font-size: 2.2rem;
          line-height: 1.15;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .description {
          margin: 0 0 24px 0;
          color: var(--muted, #64748b);
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .purchase-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
          padding: 16px;
          border-radius: 14px;
          background: var(--bg, #f8fafc);
          border: 1px solid var(--border, #e2e8f0);
        }

        .purchase-box span {
          display: block;
          margin-bottom: 4px;
          color: var(--muted, #64748b);
          font-size: 0.75rem;
          font-weight: 700;
        }

        .detail-price-stack {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .detail-old-price {
          color: var(--muted, #64748b);
          font-size: 0.95rem;
          font-weight: 600;
          text-decoration: line-through;
          opacity: 0.65;
        }

        .detail-price-stack strong {
          color: #16a34a;
          font-size: 1.8rem;
          line-height: 1;
          font-weight: 800;
        }

        .discount-badge {
          padding: 3px 6px;
          border-radius: 6px;
          background: rgba(22, 163, 74, 0.1);
          color: #16a34a;
          border: 1px solid rgba(22, 163, 74, 0.15);
          font-size: 0.65rem;
          font-weight: 800;
        }

        .delivery-box {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 8px;
          background: var(--card, #ffffff);
          border: 1px solid var(--border, #e2e8f0);
          color: var(--text, #0f172a);
          font-size: 0.8rem;
          font-weight: 700;
        }

        .delivery-box svg {
          color: #16a34a;
        }

        .benefits-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }

        .benefits-list div {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          border-radius: 10px;
          background: var(--bg, #f8fafc);
          border: 1px solid var(--border, #e2e8f0);
          color: var(--muted, #64748b);
          font-size: 0.78rem;
          font-weight: 600;
          line-height: 1.3;
        }

        .benefits-list svg {
          color: #16a34a;
          flex-shrink: 0;
        }

        .login-note {
          margin: 12px 0 0 0;
          color: var(--muted, #64748b);
          text-align: center;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .detail-extra {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 24px;
        }

        .detail-extra div {
          padding: 20px;
          border-radius: 16px;
          background: var(--card, #ffffff);
          border: 1px solid var(--border, #e2e8f0);
        }

        .detail-extra h3 {
          margin: 0 0 6px 0;
          font-size: 1rem;
          color: var(--text, #0f172a);
          font-weight: 700;
        }

        .detail-extra p {
          margin: 0;
          color: var(--muted, #64748b);
          font-size: 0.88rem;
          line-height: 1.5;
        }

        .state-card {
          max-width: 420px;
          margin: 60px auto;
          padding: 32px 24px;
          border-radius: 16px;
          background: var(--card, #ffffff);
          border: 1px solid var(--border, #e2e8f0);
          text-align: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }
        
        .state-card p {
          margin: 0 0 16px 0;
          font-weight: 600;
          color: var(--text, #0f172a);
        }

        @media (max-width: 990px) {
          .detail-shell { grid-template-columns: 1fr; gap: 20px; }
          .media-card, .media-card img, .media-placeholder { min-height: 320px; }
          .benefits-list { grid-template-columns: 1fr; gap: 8px; }
          .detail-extra { grid-template-columns: 1fr; }
        }

        @media (max-width: 560px) {
          .info-card { padding: 20px; }
          .top-row { flex-direction: column; align-items: flex-start; gap: 8px; }
          .purchase-box { flex-direction: column; align-items: flex-start; gap: 12px; }
        }
      `}</style>
    </section>
  );
};

export default ProductDetails;