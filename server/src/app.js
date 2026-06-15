const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const paymentRoutes = require("./routes/payment.routes");
const purchaseRoutes = require("./routes/purchase.routes");
const counsellingRoutes = require("./routes/counselling.routes");
const adminRoutes = require("./routes/admin.routes");

const errorMiddleware = require("./middleware/error.middleware");

const app = express();

app.set("trust proxy", 1);

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://trackkpad.com",
  "https://www.trackkpad.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

/*
|--------------------------------------------------------------------------
| Security / Logs / Cookies
|--------------------------------------------------------------------------
*/
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

app.use(morgan("dev"));
app.use(cookieParser());

/*
|--------------------------------------------------------------------------
| Static File Serving
|--------------------------------------------------------------------------
*/
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/*
|--------------------------------------------------------------------------
| Razorpay Webhook
|--------------------------------------------------------------------------
| Must receive RAW body before express.json()
|--------------------------------------------------------------------------
*/
app.use(
  "/api/payments/webhook",
  express.raw({
    type: "application/json",
  })
);

/*
|--------------------------------------------------------------------------
| Body Parsers
|--------------------------------------------------------------------------
*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Digital product store API running.",
  });
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/counselling", counsellingRoutes);
app.use("/api/admin", adminRoutes);

/*
|--------------------------------------------------------------------------
| Error Handler
|--------------------------------------------------------------------------
*/
app.use(errorMiddleware);

module.exports = app;
