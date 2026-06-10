import { useState } from "react";
import Button from "../common/Button";

const initialState = {
  title: "",
  description: "",
  pricingType: "PAID",
  price: 499,
  type: "DIGITAL_PRODUCT",
  deliveryType: "LINK",
  thumbnail: null,
  deliveryUrl: "",
  fileUrl: "",
  isActive: true,
};

const ProductForm = ({ onSubmit }) => {
  const [form, setForm] = useState(initialState);
  const [preview, setPreview] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const isFree = form.pricingType === "FREE";

  const isLinkDelivery =
    form.deliveryType === "LINK" || form.deliveryType === "BOTH";

  const isFileDelivery =
    form.deliveryType === "FILE" || form.deliveryType === "BOTH";

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePricingTypeChange = (value) => {
    setForm((prev) => ({
      ...prev,
      pricingType: value,
      price: value === "FREE" ? 0 : prev.price || 499,
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      update("thumbnail", null);
      setPreview("");
      return;
    }

    update("thumbnail", file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setStatus("");

    try {
      const formData = new FormData();

      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("price", isFree ? 0 : Number(form.price));
      formData.append("type", form.type);
      formData.append("deliveryType", form.deliveryType);
      formData.append("isActive", form.isActive);

      if (form.thumbnail) {
        formData.append("thumbnail", form.thumbnail);
      }

      if (isLinkDelivery) {
        formData.append("deliveryUrl", form.deliveryUrl.trim());
      }

      if (isFileDelivery) {
        formData.append("fileUrl", form.fileUrl.trim());
      }

      await onSubmit(formData);

      setForm(initialState);
      setPreview("");
      setStatus("Product saved successfully.");
    } catch (error) {
      setStatus(error.response?.data?.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="admin-product-form" onSubmit={handleSubmit}>
      <label>
        <span>Title</span>
        <input
          placeholder="Product title"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          required
        />
      </label>

      <label>
        <span>Description</span>
        <textarea
          placeholder="Short product description"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          required
        />
      </label>

      <div className="form-row">
        <label>
          <span>Pricing</span>
          <select
            value={form.pricingType}
            onChange={(e) => handlePricingTypeChange(e.target.value)}
          >
            <option value="PAID">Paid</option>
            <option value="FREE">Free</option>
          </select>
        </label>

        <label className={isFree ? "field-muted" : ""}>
          <span>Price</span>
          <input
            type="number"
            min="0"
            placeholder="499"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            disabled={isFree}
            required={!isFree}
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          <span>Type</span>
          <select
            value={form.type}
            onChange={(e) => update("type", e.target.value)}
          >
            <option value="NOTION_TEMPLATE">Notion</option>
            <option value="HABIT_TRACKER">Habit</option>
            <option value="DIGITAL_PRODUCT">Digital</option>
            <option value="COUNSELLING">Counselling</option>
            <option value="OTHER">Other</option>
          </select>
        </label>

        <label>
          <span>Delivery Type</span>
          <select
            value={form.deliveryType}
            onChange={(e) => update("deliveryType", e.target.value)}
          >
            <option value="LINK">Link</option>
            <option value="FILE">File</option>
            <option value="BOTH">Both</option>
            <option value="BOOKING">Booking</option>
          </select>
        </label>
      </div>

      <label>
        <span>Thumbnail Image</span>
        <input type="file" accept="image/*" onChange={handleThumbnailChange} />
      </label>

      {preview && (
        <div className="thumbnail-preview">
          <img src={preview} alt="Thumbnail preview" />
        </div>
      )}

      <div className="form-row">
        <label className={!isLinkDelivery ? "field-muted" : ""}>
          <span>Delivery URL</span>
          <input
            type="url"
            placeholder="Private product link"
            value={form.deliveryUrl}
            onChange={(e) => update("deliveryUrl", e.target.value)}
            disabled={!isLinkDelivery}
          />
        </label>

        <label className={!isFileDelivery ? "field-muted" : ""}>
          <span>File URL</span>
          <input
            type="url"
            placeholder="Download file URL"
            value={form.fileUrl}
            onChange={(e) => update("fileUrl", e.target.value)}
            disabled={!isFileDelivery}
          />
        </label>
      </div>

      {isFree && (
        <p className="free-note">
          This product will be saved as free with price ₹0.
        </p>
      )}

      {status && <p className="form-status">{status}</p>}

      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save Product"}
      </Button>

      <style>{`
        .admin-product-form {
          display: grid;
          gap: 10px;
        }

        .admin-product-form label {
          display: grid;
          gap: 5px;
        }

        .admin-product-form span {
          color: var(--text);
          font-size: 0.74rem;
          font-weight: 900;
          letter-spacing: 0.01em;
        }

        .admin-product-form input,
        .admin-product-form textarea,
        .admin-product-form select {
          width: 100%;
          min-height: 42px;
          border: 1px solid var(--border);
          outline: none;
          border-radius: 12px;
          background: var(--bg);
          color: var(--text);
          padding: 9px 11px;
          font-size: 0.84rem;
          font-weight: 700;
          transition: border-color 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
        }

        .admin-product-form input[type="file"] {
          padding: 8px;
          cursor: pointer;
        }

        .admin-product-form textarea {
          min-height: 76px;
          resize: vertical;
          line-height: 1.45;
        }

        .admin-product-form select {
          cursor: pointer;
        }

        .admin-product-form input:focus,
        .admin-product-form textarea:focus,
        .admin-product-form select:focus {
          border-color: rgba(22, 163, 74, 0.55);
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.09);
        }

        .admin-product-form input:disabled {
          opacity: 0.48;
          cursor: not-allowed;
        }

        .field-muted span {
          color: var(--muted);
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .thumbnail-preview {
          width: 100%;
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
          background: var(--bg);
        }

        .thumbnail-preview img {
          width: 100%;
          max-height: 220px;
          object-fit: cover;
          display: block;
        }

        .free-note {
          margin: 0;
          padding: 9px 11px;
          border-radius: 11px;
          background: rgba(22, 163, 74, 0.1);
          color: #16a34a;
          font-size: 0.8rem;
          font-weight: 800;
          line-height: 1.45;
        }

        .form-status {
          margin: 0;
          padding: 9px 11px;
          border-radius: 11px;
          background: rgba(22, 163, 74, 0.1);
          color: #16a34a;
          font-size: 0.8rem;
          font-weight: 800;
          line-height: 1.45;
        }

        .admin-product-form .btn {
          width: 100%;
          margin-top: 2px;
          padding: 11px 14px;
          font-size: 0.86rem;
        }

        @media (max-width: 560px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </form>
  );
};

export default ProductForm;