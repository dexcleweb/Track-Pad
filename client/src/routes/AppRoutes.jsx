import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import Login from "../pages/Login";
import MyPurchases from "../pages/MyPurchases";
import Counselling from "../pages/Counselling";
import CheckoutSuccess from "../pages/CheckoutSuccess";
import AdminDashboard from "../pages/AdminDashboard";
import AdminProducts from "../pages/AdminProducts";
import AdminOrders from "../pages/AdminOrders";
import AdminBookings from "../pages/AdminBookings";
import AdminUsers from "../pages/AdminUsers";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:slug" element={<ProductDetails />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/my-purchases"
        element={
          <ProtectedRoute>
            <MyPurchases />
          </ProtectedRoute>
        }
      />

      <Route
        path="/counselling"
        element={
          <ProtectedRoute>
            <Counselling />
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout-success"
        element={
          <ProtectedRoute>
            <CheckoutSuccess />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/products"
        element={
          <AdminRoute>
            <AdminProducts />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <AdminRoute>
            <AdminOrders />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/bookings"
        element={
          <AdminRoute>
            <AdminBookings />
          </AdminRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;