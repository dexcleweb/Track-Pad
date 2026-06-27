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

const productUpload = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "tutorialImage", maxCount: 1 },
]);

router.get("/", getProducts);
router.get("/:slug", getProductBySlug);

router.post("/", productUpload, createProduct);
router.patch("/:id", productUpload, updateProduct);

router.delete("/:id", deleteProduct);

module.exports = router;
