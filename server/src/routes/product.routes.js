const express = require("express");

const {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const { upload } = require("../middleware/upload");

const router = express.Router();

router.get("/", getProducts);
router.get("/:slug", getProductBySlug);

router.post("/", upload.single("thumbnail"), createProduct);
router.patch("/:id", upload.single("thumbnail"), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;