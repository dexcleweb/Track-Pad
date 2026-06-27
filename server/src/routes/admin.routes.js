const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const { upload } = require("../middleware/upload");

const {
  getAdminUsers,
  updateAdminUser,
  suspendAdminUser,
  unsuspendAdminUser,
  deleteAdminUser,
} = require("../controllers/adminUser.controller");

const {
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const {
  getAdminStats,
  getAdminOrders,
  deleteAdminOrder,
  clearAdminOrders,
} = require("../controllers/admin.controller");

const {
  getAdminBookings,
  updateBooking,
} = require("../controllers/counselling.controller");

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

const productUpload = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "tutorialImage", maxCount: 1 },
]);

// Dashboard
router.get("/stats", getAdminStats);

// Orders
router.get("/orders", getAdminOrders);
router.delete("/orders/:id", deleteAdminOrder);
router.delete("/orders", clearAdminOrders);

// Users
router.get("/users", getAdminUsers);
router.put("/users/:id", updateAdminUser);
router.patch("/users/:id/suspend", suspendAdminUser);
router.patch("/users/:id/unsuspend", unsuspendAdminUser);
router.delete("/users/:id", deleteAdminUser);

// Products
router.post("/products", productUpload, createProduct);
router.put("/products/:id", productUpload, updateProduct);
router.delete("/products/:id", deleteProduct);

// Counselling
router.get("/counselling", getAdminBookings);
router.put("/counselling/:id", updateBooking);

module.exports = router;