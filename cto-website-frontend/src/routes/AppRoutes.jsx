import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';

import HomePage from '../pages/HomePage';
import AboutUs from '../pages/AboutUs';
import FAQs from '../components/faqspage/FAQs';

import RequestDashboardAdmin from '../pages/RequestDashboardAdmin';
import RequestDashboardInternal from '../pages/RequestDashboardInternal';
import InventoryDashboard from '../pages/InventoryDashboard';

import RequestForm from '../components/formspage/RequestForm'
import InventoryForm from '../components/formspage/InventoryForm';

import GuidelinePolicy from '../pages/GuidelinePolicy';
import DocumentLibrary from '../pages/DocumentLibrary';

import RequestOperation from '../pages/RequestOperation';
import InventoryOperation from '../pages/InventoryOperation';

import NewsForm from '../components/formspage/NewsForm';
import NewsPage from '../components/newspage/NewsPage';
import ScrollToTop from '../components/ScrollToTop';
import RegisterForm from '../components/authpage/RegisterForm';
import LoginForm from '../components/authpage/LoginForm';
import ProtectedRoute from '../components/ProtectedRoute';
import Profile from '../components/homepage/Profile';
import ForgotPasswordForm from '../components/authpage/ForgotPasswordForm';

import NewsList from '../components/newspage/NewsList';

function AppRoutesWrapper() {
  const location = useLocation();
  const marginTopClass =
    location.pathname === "/home" ||
    location.pathname === "/about-us" ||
    location.pathname === "/request-operation" ||
    location.pathname === "/inventory-operation" ? "mt-20" : "mt-30";
  const marginXClass = location.pathname === "/home" || location.pathname === "/about-us" ? "" : "mx-4";
  const hideLayout = ["/login", "/register", "/reset-password"].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {!hideLayout && <Header />}
      <main className={`flex-grow ${!hideLayout ? `${marginTopClass} mb-10 ${marginXClass}` : ""}`}>
        <Routes>
          <Route
            path="/"
            element={
              localStorage.getItem("token")
                ? <Navigate to="/home" />
                : <Navigate to="/login" />
            }
          />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/reset-password" element={<ForgotPasswordForm />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/admin/request-dashboard"
            element={
              <ProtectedRoute roles={["admin"]}>
                <RequestDashboardAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/internal/request-dashboard"
            element={
              <ProtectedRoute roles={["internal"]}>
                <RequestDashboardInternal />
              </ProtectedRoute>
            }
          />
          <Route path="/inventory-dashboard" element={<InventoryDashboard />} />
          <Route
            path="/request-form"
            element={
              <ProtectedRoute roles={["internal"]}>
                <RequestForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory-form"
            element={
              <ProtectedRoute roles={["internal"]}>
                <InventoryForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/request-operation"
            element={
              <ProtectedRoute roles={["admin"]}>
                <RequestOperation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory-operation"
            element={
              <ProtectedRoute roles={["admin"]}>
                <InventoryOperation />
              </ProtectedRoute>
            }
          />
          <Route path="/news-form" element={<NewsForm />} />
          <Route path="/news/:slug" element={<NewsPage />} />
          <Route path="/news-list" element={<NewsList />} />
          <Route path="/guideline-policy" element={<GuidelinePolicy />} />
          <Route path="/document-library" element={<DocumentLibrary />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Router>
      <ScrollToTop />
      <AppRoutesWrapper />
    </Router>
  );
}
