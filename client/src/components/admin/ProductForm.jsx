import { useRef, useState } from "react";
import { ImagePlus, Trash2, UploadCloud } from "lucide-react";
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
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(initialState);
  const [preview, setPreview] = useState("");
  const [thumbnailName, setThumbnailName] = useState("");
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

  const resetThumbnail = () => {
    update("thumbnail", null);
    setPreview("");
    setThumbnailName("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      resetThumbnail();
      return;
    }

    update("thumbnail", file);
    setThumbnailName(file.name);
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
      resetThumbnail();
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

      <div className="thumbnail-field">
        <span>Thumbnail Image</span>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="thumbnail-input"
          onChange={handleThumbnailChange}
        />

        <div
          className={`thumbnail-uploader ${preview ? "has-preview" : ""}`}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          {preview ? (
            <img src={preview} alt="Thumbnail preview" />
          ) : (
            <div className="thumbnail-empty">
              <div className="thumbnail-icon">
                <UploadCloud size={25} />
              </div>

              <div className="thumbnail-text">
                <strong>Upload product thumbnail</strong>
                <small>PNG, JPG, WEBP supported</small>
              </div>

              <div className="thumbnail-choose-btn">
                <ImagePlus size={16} />
                Choose Image
              </div>
            </div>
          )}

          {preview && (
            <div className="thumbnail-change-btn">
              <ImagePlus size={16} />
              Change Image
            </div>
          )}
        </div>

        {thumbnailName && (
          <div className="thumbnail-meta">
            <p>{thumbnailName}</p>

            <button type="button" onClick={resetThumbnail}>
              <Trash2 size={13} />
              Remove
            </button>
          </div>
        )}
      </div>

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
          gap: 12px;
        }

        .admin-product-form label,
        .thumbnail-field {
          display: grid;
          gap: 6px;
        }

        .admin-product-form span,
        .thumbnail-field > span {
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

        .thumbnail-input {
          display: none;
        }

        .thumbnail-uploader {
          width: 100%;
          min-height: 250px;
          overflow: hidden;
          border-radius: 18px;
          border: 1px dashed rgba(22, 163, 74, 0.45);
          background:
            radial-gradient(circle at top left, rgba(22, 163, 74, 0.16), transparent 34%),
            radial-gradient(circle at bottom right, rgba(214, 179, 0, 0.14), transparent 30%),
            var(--bg);
          cursor: pointer;
          display: grid;
          place-items: center;
          padding: 26px 18px;
          transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
        }

        .thumbnail-uploader:hover {
          transform: translateY(-1px);
          border-color: rgba(22, 163, 74, 0.8);
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.08);
        }

        .thumbnail-uploader.has-preview {
          position: relative;
          padding: 0;
          border-style: solid;
        }

        .thumbnail-uploader img {
          width: 100%;
          height: 250px;
          object-fit: cover;
          display: block;
        }

        .thumbnail-empty {
          width: 100%;
          display: grid;
          place-items: center;
          gap: 18px;
          text-align: center;
        }

        .thumbnail-icon {
          width: 78px;
          height: 78px;
          display: grid;
          place-items: center;
          border-radius: 22px;
          color: #16a34a;
          background: rgba(22, 163, 74, 0.12);
          border: 1px solid rgba(22, 163, 74, 0.22);
        }

        .thumbnail-text {
          display: grid;
          gap: 8px;
        }

        .thumbnail-text strong {
          color: var(--text);
          font-size: 1rem;
          font-weight: 950;
          letter-spacing: -0.02em;
        }

        .thumbnail-text small {
          color: var(--muted);
          font-size: 0.76rem;
          font-weight: 800;
        }

        .thumbnail-choose-btn,
        .thumbnail-change-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: min(100%, 340px);
          min-height: 46px;
          padding: 10px 18px;
          border-radius: 999px;
          background: rgba(3, 9, 5, 0.72);
          color: #fff;
          font-size: 0.86rem;
          font-weight: 950;
          backdrop-filter: blur(12px);
        }

        .thumbnail-change-btn {
          position: absolute;
          left: 16px;
          right: 16px;
          bottom: 16px;
          width: auto;
        }

        .thumbnail-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 9px 11px;
          border-radius: 12px;
          background: var(--bg);
          border: 1px solid var(--border);
        }

        .thumbnail-meta p {
          margin: 0;
          color: var(--muted);
          font-size: 0.78rem;
          font-weight: 800;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .thumbnail-meta button {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          border: 0;
          background: rgba(220, 38, 38, 0.09);
          color: #dc2626;
          padding: 6px 9px;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 900;
          cursor: pointer;
          white-space: nowrap;
        }

        .free-note,
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

          .thumbnail-uploader {
            min-height: 230px;
            padding: 22px 14px;
          }

          .thumbnail-uploader img {
            height: 230px;
          }

          .thumbnail-icon {
            width: 66px;
            height: 66px;
            border-radius: 18px;
          }
        }
      `}</style>
    </form>
  );
};

export default ProductForm;