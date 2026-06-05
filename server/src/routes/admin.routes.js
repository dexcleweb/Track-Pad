const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

const { getAdminUsers } = require("../controllers/adminUser.controller");

const {
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const {
  getAdminStats,
  getAdminOrders,
} = require("../controllers/admin.controller");

const {
  getAdminBookings,
  updateBooking,
} = require("../controllers/counselling.controller");

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/stats", getAdminStats);
router.get("/orders", getAdminOrders);
router.get("/users", getAdminUsers);

router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

router.get("/counselling", getAdminBookings);
router.put("/counselling/:id", updateBooking);

module.exports = router;