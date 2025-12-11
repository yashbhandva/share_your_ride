import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VerifyOTP from "./pages/VerifyOTP.jsx";
import DashboardPassenger from "./pages/DashboardPassenger.jsx";
import DashboardDriver from "./pages/DashboardDriver.jsx";
import DashboardAdmin from "./pages/DashboardAdmin.jsx";
import Notifications from "./pages/Notifications.jsx";
import PaymentHistory from "./pages/PaymentHistory.jsx";
import Emergency from "./pages/Emergency.jsx";
import Profile from "./pages/Profile.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import RoleRoute from "./components/common/RoleRoute.jsx";

const App = () => {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />

            <Route path="/notifications" element={<Notifications />} />

            <Route path="/payments" element={<PaymentHistory />} />

            <Route path="/emergency" element={<Emergency />} />

            <Route
              element={<RoleRoute allowedRoles={["PASSENGER", "ADMIN"]} />}
            >
              <Route
                path="/dashboard/passenger"
                element={<DashboardPassenger />}
              />
            </Route>

            <Route element={<RoleRoute allowedRoles={["DRIVER", "ADMIN"]} />}>
              <Route path="/dashboard/driver" element={<DashboardDriver />} />
            </Route>

            <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/dashboard/admin" element={<DashboardAdmin />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
