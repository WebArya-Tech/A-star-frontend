import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import IGCSEHub from './pages/IGCSEHub';
import ASALevelHub from './pages/ASALevelHub';
import SubjectPage from './pages/SubjectPage';
import CounsellingHub from './pages/CounsellingHub';
import CounsellingRegion from './pages/CounsellingRegion';
import SATHub from './pages/SATHub';
import TestPage from './pages/TestPage';
import Testimonials from './pages/Testimonials';
import Blogs from './pages/Blogs.tsx';
import BlogAll from './pages/BlogAll.tsx';
import BlogDetail from './pages/BlogDetail.tsx';
import Ask from './pages/Ask';
import Contact from './pages/Contact';
import Tutors from './pages/Tutors';
import TutorsIGCSE from './pages/TutorsIGCSE';
import TutorsASLevel from './pages/TutorsASLevel';
import TutorsALevel from './pages/TutorsALevel';
import TutorsSAT from './pages/TutorsSAT';
import WhatsAppButton from './components/WhatsAppButton';
import TopBar from './components/top-bar';
import DemoForm from './components/DemoForm';
import { SubmitBlogPage } from './components/blog/SubmitBlogPage';
import { SubscribePage } from './components/blog/SubscribePage';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import AdminDashboardPage from './pages/AdminDashboard.tsx';
import { useAuth } from './context/AuthContext.tsx';
import RunningClasses from './pages/RunningClasses';
import WriteReview from './pages/WriteReview';
import Reviews from './pages/Reviews';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AdminRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-sm font-semibold text-blue-900">Loading admin panel...</div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin-dashboard') || location.pathname === '/admin-login';

  return (
    <div className={isAdminRoute ? 'min-h-screen bg-slate-100' : 'min-h-screen bg-gray-50'}>
      {!isAdminRoute && <TopBar />}
      {!isAdminRoute && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/demoform" element={<DemoForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/tutors" element={<Tutors />} />
          <Route path="/tutors/igcse" element={<TutorsIGCSE />} />
          <Route path="/tutors/as-level" element={<TutorsASLevel />} />
          <Route path="/tutors/a-level" element={<TutorsALevel />} />
          <Route path="/tutors/sat" element={<TutorsSAT />} />
          <Route path="/igcse" element={<IGCSEHub />} />
          <Route path="/igcse/:subject" element={<SubjectPage level="IGCSE" />} />
          <Route path="/as-a-level" element={<ASALevelHub />} />
          <Route path="/as-a-level/:subject" element={<SubjectPage level="AS/A Level" />} />
          <Route path="/counselling" element={<CounsellingHub />} />
          <Route path="/counselling/:region" element={<CounsellingRegion />} />
          <Route path="/sat-prep" element={<SATHub />} />
          <Route path="/sat-prep/:test" element={<TestPage />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/blog" element={<Blogs />} />
          <Route path="/blog/all" element={<BlogAll />} />
          <Route path="/blog/submit" element={<SubmitBlogPage />} />
          <Route path="/blog/subscribe" element={<SubscribePage />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/ask" element={<Ask />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/running-classes" element={<RunningClasses />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/write-review" element={<WriteReview />} />
          <Route
            path="/admin-dashboard"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin-dashboard/:section"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <WhatsAppButton />}
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppLayout />
    </Router>
  );
}

export default App;