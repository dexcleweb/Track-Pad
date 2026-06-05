import { useEffect, useMemo, useState } from "react";
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

const getImageUrl = (thumbnail) => {
  if (!thumbnail) return null;
  if (thumbnail.startsWith("http")) return thumbnail;
  return `${API_URL}${thumbnail}`;
};

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("Loading product...");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProductBySlug(slug);
        setProduct(data);
        setStatus("");
      } catch {
        setStatus("Product not found.");
      }
    };

    load();
  }, [slug]);

  const imageUrl = getImageUrl(product?.thumbnail);
  const price = Number(product?.price || 0);
  const oldPrice = Math.round(price * 1.5);

  const productType = useMemo(() => {
    return product?.type ? product.type.replaceAll("_", " ") : "";
  }, [product]);

  const deliveryLabel = useMemo(() => {
    const labels = {
      LINK: "Private access link",
      FILE: "Downloadable file",
      BOTH: "Link + file delivery",
      BOOKING: "Paid booking",
    };

    return labels[product?.deliveryType] || product?.deliveryType || "";
  }, [product]);

  const DeliveryIcon =
    product?.deliveryType === "FILE"
      ? Download
      : product?.deliveryType === "LINK"
      ? ExternalLink
      : FileText;

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuy = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setPaying(true);

    try {
      const loaded = await loadRazorpay();

      if (!loaded) {
        alert("Razorpay failed to load.");
        return;
      }

      const data = await createPaymentOrder([product.id]);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.razorpayOrder.amount,
        currency: data.razorpayOrder.currency,
        name: "TrackPad",
        description: product.title,
        order_id: data.razorpayOrder.id,

        method: {
          upi: true,
        },

        handler: async function (response) {
          await verifyPayment({
            orderId: data.order.id,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          navigate("/checkout-success");
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

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      alert(error.response?.data?.message || "Payment failed.");
    } finally {
      setPaying(false);
    }
  };

  if (status) {
    return (
      <section className="product-detail-page">
        <div className="state-card">
          <p>{status}</p>

          {status === "Product not found." && (
            <Link to="/products">
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
            <img src={imageUrl} alt={product.title} />
          ) : (
            <div className="media-placeholder">
              <span>{product.title?.slice(0, 1)}</span>
            </div>
          )}
        </div>

        <article className="info-card">
          <div className="top-row">
            <span className="type-pill">{productType}</span>

            <span className="secure-pill">
              <ShieldCheck size={15} />
              Secure UPI
            </span>
          </div>

          <h1>{product.title}</h1>

          <p className="description">{product.description}</p>

          <div className="purchase-box">
            <div>
              <span>One-time payment</span>

              <div className="detail-price-stack">
                <span className="detail-old-price">₹{oldPrice}</span>
                <strong>₹{price}</strong>
                <span className="discount-badge">50% OFF</span>
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
              Delivered after payment
            </div>

            <div>
              <Lock size={16} />
              Stored in your account
            </div>
          </div>

          <Button onClick={handleBuy} disabled={paying}>
            {paying ? (
              "Opening Payment..."
            ) : (
              <>
                <ShoppingBag size={16} />
                Buy with UPI
              </>
            )}
          </Button>

          {!user && (
            <p className="login-note">
              Login with email OTP before payment.
            </p>
          )}
        </article>
      </div>

      <div className="detail-extra">
        <div>
          <h3>After purchase</h3>
          <p>
            This product appears in your purchases page with lifetime access
            after successful payment.
          </p>
        </div>

        <div>
          <h3>Delivery</h3>
          <p>
            Delivery type: <strong>{deliveryLabel}</strong>. Access details stay
            hidden until payment is verified.
          </p>
        </div>
      </div>

      <style>{`
        .product-detail-page {
          padding: 28px 0 56px;
          font-family: Inter, "DM Sans", system-ui, sans-serif;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 18px;
          color: var(--muted);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 800;
        }

        .back-link:hover {
          color: #16a34a;
        }

        .detail-shell {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 22px;
          align-items: stretch;
        }

        .media-card {
          min-height: 430px;
          overflow: hidden;
          border-radius: 24px;
          background:
            linear-gradient(135deg, rgba(22, 163, 74, 0.14), rgba(245, 216, 0, 0.08)),
            var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .media-card img {
          width: 100%;
          height: 100%;
          min-height: 430px;
          object-fit: cover;
          display: block;
        }

        .media-placeholder {
          min-height: 430px;
          display: grid;
          place-items: center;
        }

        .media-placeholder span {
          color: #16a34a;
          font-size: 5rem;
          font-weight: 950;
        }

        .info-card {
          padding: 26px;
          border-radius: 24px;
          background:
            linear-gradient(135deg, rgba(22, 163, 74, 0.1), rgba(245, 216, 0, 0.04)),
            var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .top-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }

        .type-pill,
        .secure-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 10px;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 900;
        }

        .type-pill {
          color: #16a34a;
          background: rgba(22, 163, 74, 0.11);
          border: 1px solid rgba(22, 163, 74, 0.18);
          text-transform: uppercase;
        }

        .secure-pill {
          color: var(--muted);
          background: var(--bg);
          border: 1px solid var(--border);
        }

        .secure-pill svg {
          color: #16a34a;
        }

        .info-card h1 {
          margin: 0;
          color: var(--text);
          font-size: clamp(2.1rem, 4.2vw, 3.9rem);
          line-height: 0.98;
          font-weight: 950;
        }

        .description {
          margin: 14px 0 20px;
          color: var(--muted);
          font-size: 0.96rem;
          line-height: 1.65;
        }

        .purchase-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 18px;
          padding: 16px;
          border-radius: 18px;
          background: var(--bg);
          border: 1px solid var(--border);
        }

        .purchase-box span {
          display: block;
          margin-bottom: 4px;
          color: var(--muted);
          font-size: 0.78rem;
          font-weight: 800;
        }

        .detail-price-stack {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .detail-old-price {
          color: var(--muted);
          font-size: 1rem;
          font-weight: 850;
          text-decoration: line-through;
          opacity: 0.75;
        }

        .detail-price-stack strong {
          color: #16a34a;
          font-size: 2rem;
          line-height: 1;
          font-weight: 950;
        }

        .discount-badge {
          padding: 5px 8px;
          border-radius: 999px;
          background: rgba(22, 163, 74, 0.13);
          color: #16a34a;
          border: 1px solid rgba(22, 163, 74, 0.2);
          font-size: 0.68rem;
          font-weight: 950;
        }

        .delivery-box {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 12px;
          border-radius: 999px;
          background: var(--card);
          border: 1px solid var(--border);
          color: var(--text);
          font-size: 0.84rem;
          font-weight: 850;
          white-space: nowrap;
        }

        .delivery-box svg {
          color: #16a34a;
        }

        .benefits-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 18px;
        }

        .benefits-list div {
          display: flex;
          align-items: center;
          gap: 8px;
          min-height: 48px;
          padding: 10px;
          border-radius: 14px;
          background: var(--bg);
          border: 1px solid var(--border);
          color: var(--muted);
          font-size: 0.8rem;
          font-weight: 800;
        }

        .benefits-list svg {
          color: #16a34a;
        }

        .info-card .btn {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 18px;
        }

        .login-note {
          margin: 12px 0 0;
          color: var(--muted);
          text-align: center;
          font-size: 0.84rem;
          font-weight: 700;
        }

        .detail-extra {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-top: 18px;
        }

        .detail-extra div {
          padding: 18px;
          border-radius: 20px;
          background: var(--card);
          border: 1px solid var(--border);
        }

        .detail-extra h3 {
          margin: 0 0 8px;
          font-size: 1.05rem;
        }

        .detail-extra p {
          margin: 0;
          color: var(--muted);
          font-size: 0.9rem;
          line-height: 1.6;
        }

        .state-card {
          max-width: 460px;
          margin: 50px auto;
          padding: 24px;
          border-radius: 22px;
          background: var(--card);
          border: 1px solid var(--border);
          text-align: center;
          box-shadow: var(--shadow);
        }

        @media (max-width: 900px) {
          .detail-shell {
            grid-template-columns: 1fr;
          }

          .media-card,
          .media-card img,
          .media-placeholder {
            min-height: 300px;
          }

          .benefits-list,
          .detail-extra {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 560px) {
          .info-card {
            padding: 20px;
          }

          .top-row,
          .purchase-box {
            align-items: flex-start;
            flex-direction: column;
          }

          .delivery-box {
            white-space: normal;
          }
        }
      `}</style>
    </section>
  );
};

export default ProductDetails;