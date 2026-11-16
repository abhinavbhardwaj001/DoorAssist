import { Routes, Route } from "react-router-dom";

import PublicLayout from "../components/layout/PublicLayout";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import RoleRoute from "../components/auth/RoleRoute";

// Public pages
import Home from "../pages/public/Home";
import Services from "../pages/public/Services";
import ServiceDetails from "../pages/public/ServiceDetails";
import ProviderDetails from "../pages/public/ProviderDetails";
import Categories from "../pages/public/Categories";
import NotFound from "../pages/public/NotFound";

// Auth pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// Customer pages
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import CustomerProfile from "../pages/customer/CustomerProfile";
import MyBookings from "../pages/customer/MyBookings";
import BookingDetails from "../pages/customer/BookingDetails";
import RequestBooking from "../pages/customer/RequestBooking";
import BecomeProvider from "../pages/customer/BecomeProvider";
import MyPayments from "../pages/customer/MyPayments";
import ProviderApplicationStatus from "../pages/customer/ProviderApplicationStatus";

// Provider pages
import ProviderDashboard from "../pages/provider/ProviderDashboard";
import ProviderProfile from "../pages/provider/ProviderProfile";
import ProviderServices from "../pages/provider/ProviderServices";
import CreateService from "../pages/provider/CreateService";
import EditService from "../pages/provider/EditService";
import ProviderBookings from "../pages/provider/ProviderBookings";
import ProviderAvailability from "../pages/provider/ProviderAvailability";

// Admin pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminProviders from "../pages/admin/AdminProviders";
import AdminCategories from "../pages/admin/AdminCategories";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public & Auth pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:serviceId" element={<ServiceDetails />} />
        <Route path="/providers/:providerId" element={<ProviderDetails />} />
        <Route path="/categories" element={<Categories />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Authenticated dashboard routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Shared profile */}
          <Route path="/profile" element={<CustomerProfile />} />

          {/* Customer routes */}
          <Route element={<RoleRoute allowedRoles={["customer"]} />}>
            <Route path="/dashboard" element={<CustomerDashboard />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/bookings/:bookingId" element={<BookingDetails />} />
            <Route
              path="/services/:serviceId/book"
              element={<RequestBooking />}
            />
            <Route path="/become-provider" element={<BecomeProvider />} />
            <Route path="/payments" element={<MyPayments />} />
          </Route>

          {/* Provider routes */}
          <Route element={<RoleRoute allowedRoles={["provider"]} />}>
            <Route path="/provider/dashboard" element={<ProviderDashboard />} />
            <Route path="/provider/profile" element={<ProviderProfile />} />
            <Route path="/provider/services" element={<ProviderServices />} />
            <Route
              path="/provider/services/create"
              element={<CreateService />}
            />
            <Route
              path="/provider/services/:serviceId/edit"
              element={<EditService />}
            />
            <Route path="/provider/bookings" element={<ProviderBookings />} />
            <Route
              path="/provider/availability"
              element={<ProviderAvailability />}
            />
          </Route>

          {/* Shared Customer & Provider routes */}
          <Route
            element={<RoleRoute allowedRoles={["customer", "provider"]} />}
          >
            <Route
              path="/provider-application"
              element={<ProviderApplicationStatus />}
            />
          </Route>

          {/* Admin routes */}
          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/providers" element={<AdminProviders />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
