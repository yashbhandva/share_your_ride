import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import RoleRoute from "./components/common/RoleRoute.jsx";
import RouteTransition from "./components/common/RouteTransition.jsx";
import LoadingScreen from "./components/common/LoadingScreen.jsx";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const VerifyOTP = lazy(() => import("./pages/VerifyOTP.jsx"));
const DashboardPassenger = lazy(() => import("./pages/DashboardPassenger.jsx"));
const DashboardDriver = lazy(() => import("./pages/DashboardDriver.jsx"));
const DashboardAdmin = lazy(() => import("./pages/DashboardAdmin.jsx"));
const Notifications = lazy(() => import("./pages/Notifications.jsx"));
const PaymentHistory = lazy(() => import("./pages/PaymentHistory.jsx"));
const Emergency = lazy(() => import("./pages/Emergency.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const PrivacyPolicy = lazy(() => import("./pages/Privacy-Policy.jsx"));
const TermOfService = lazy(() => import("./pages/Terms.jsx"));
const Faq = lazy(() => import("./pages/faq.jsx"));
const Careers = lazy(() => import("./pages/careers.jsx"));


const App = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [previousLocation, setPreviousLocation] = useState(location);

  // Handle route changes
  useEffect(() => {
    if (location !== previousLocation) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setPreviousLocation(location);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [location, previousLocation]);

  // Page transition animations
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    in: {
      opacity: 1,
      y: 0,
    },
    out: {
      opacity: 0,
      y: -20,
    },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.3,
  };

  return (
    <div className="app-shell">
      {/* Main Navigation */}
      <Navbar />

      {/* Loading Overlay */}
      {isLoading && <LoadingScreen />}

      {/* Main Content Area */}
      <main className="app-main">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="page-container"
          >
            <Suspense fallback={<LoadingScreen />}>
              <Routes location={location}>
                {/* Public Routes */}
                <Route
                  path="/"
                  element={
                    <RouteTransition>
                      <Home />
                    </RouteTransition>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <RouteTransition>
                      <About />
                    </RouteTransition>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <RouteTransition>
                      <Contact />
                    </RouteTransition>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <RouteTransition>
                      <Login />
                    </RouteTransition>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <RouteTransition>
                      <Register />
                    </RouteTransition>
                  }
                />
                <Route
                  path="/verify-otp"
                  element={
                    <RouteTransition>
                      <VerifyOTP />
                    </RouteTransition>
                  }
                />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route
                    path="/profile"
                    element={
                      <RouteTransition>
                        <Profile />
                      </RouteTransition>
                    }
                  />

                  <Route
                    path="/notifications"
                    element={
                      <RouteTransition>
                        <Notifications />
                      </RouteTransition>
                    }
                  />

                  <Route
                    path="/payments"
                    element={
                      <RouteTransition>
                        <PaymentHistory />
                      </RouteTransition>
                    }
                  />

                  <Route
                    path="/emergency"
                    element={
                      <RouteTransition>
                        <Emergency />
                      </RouteTransition>
                    }
                  />

                  {/* Role-based Dashboard Routes */}
                  <Route
                    element={<RoleRoute allowedRoles={["PASSENGER", "ADMIN"]} />}
                  >
                    <Route
                      path="/dashboard/passenger"
                      element={
                        <RouteTransition>
                          <DashboardPassenger />
                        </RouteTransition>
                      }
                    />
                  </Route>

                  <Route
                    element={<RoleRoute allowedRoles={["DRIVER", "ADMIN"]} />}
                  >
                    <Route
                      path="/dashboard/driver"
                      element={
                        <RouteTransition>
                          <DashboardDriver />
                        </RouteTransition>
                      }
                    />
                  </Route>

                  <Route
                    element={<RoleRoute allowedRoles={["ADMIN"]} />}
                  >
                    <Route
                      path="/dashboard/admin"
                      element={
                        <RouteTransition>
                          <DashboardAdmin />
                        </RouteTransition>
                      }
                    />
                  </Route>

                  <Route
                    path="/privacy-policy"
                    element={
                      <RouteTransition>
                        <PrivacyPolicy />
                      </RouteTransition>
                    }
                  />

                   <Route
                     path="/terms"
                     element={
                       <RouteTransition>
                            <TermOfService />
                        </RouteTransition>
                              }
                   />

                <Route
                    path="/faq"
                    element={
                        <RouteTransition>
                            <Faq />
                        </RouteTransition>
                    }
                />

                <Route
                      path="/careers"
                      element={
                          <RouteTransition>
                              <Careers />
                          </RouteTransition>
                      }
                  />

                </Route>

                {/* 404 - Not Found */}
                <Route
                  path="*"
                  element={
                    <RouteTransition>
                      <NotFound />
                    </RouteTransition>
                  }
                />
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />

      {/* Back to Top Button */}
      <BackToTopButton />
    </div>
  );
};

// Back to Top Button Component
const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className={`back-to-top-btn ${isVisible ? "visible" : ""}`}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
};

export default App;