import React, { Suspense, useEffect } from 'react';
const Hero = React.lazy(() => import('./components/public/Hero').then(m => ({ default: m.Hero })));
const FeaturesSection = React.lazy(() => import('./components/public/FeaturesSection').then(m => ({ default: m.FeaturesSection })));
const AboutSection = React.lazy(() => import('./components/public/AboutSection').then(m => ({ default: m.AboutSection })));
const ProgramsSection = React.lazy(() => import('./components/public/ProgramsSection').then(m => ({ default: m.ProgramsSection })));
const TentorsSection = React.lazy(() => import('./components/public/TentorsSection').then(m => ({ default: m.TentorsSection })));
const TestimonialSection = React.lazy(() => import('./components/public/TestimonialSection').then(m => ({ default: m.TestimonialSection })));
const GallerySection = React.lazy(() => import('./components/public/GallerySection').then(m => ({ default: m.GallerySection })));
const GalleryPage = React.lazy(() => import('./components/public/GalleryPage').then(m => ({ default: m.GalleryPage })));
const FaqSection = React.lazy(() => import('./components/public/FaqSection').then(m => ({ default: m.FaqSection })));
const ContactSection = React.lazy(() => import('./components/public/ContactSection').then(m => ({ default: m.ContactSection })));
const CtaSection = React.lazy(() => import('./components/public/CtaSection').then(m => ({ default: m.CtaSection })));
const AdminDashboard = React.lazy(() => import('./components/portal/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const TentorDashboard = React.lazy(() => import('./components/portal/TentorDashboard').then(m => ({ default: m.TentorDashboard })));
const OrangTuaDashboard = React.lazy(() => import('./components/portal/OrangTuaDashboard').then(m => ({ default: m.OrangTuaDashboard })));

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { InstallPWA } from './components/InstallPWA';

// Public Components
import { Navbar } from './components/public/Navbar';
import { Footer } from './components/public/Footer';
import { RegisterModal } from './components/public/RegisterModal';
import { LoginModal } from './components/public/LoginModal';
import { FloatingWhatsApp } from './components/public/FloatingWhatsApp';

// Portal Components
import { PortalMobileHeader } from './components/portal/PortalMobileHeader';
import { PortalSidebar } from './components/portal/PortalSidebar';
import { PortalBottomNav } from './components/portal/PortalBottomNav';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAuthLoading, isPublicDataLoading } = useApp();
  const location = useLocation();
  const isFromPortal = location.state && (location.state as any).fromPortal;

  if (isAuthLoading || isPublicDataLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (currentUser && !isFromPortal) {
    return <Navigate to="/portal" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-purple-200 selection:text-purple-900 flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <RegisterModal />
      <LoginModal />
      <FloatingWhatsApp />
    </div>
  );
};

const PortalLayout: React.FC = () => {
  const { currentUser, isAuthLoading } = useApp();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="h-[100dvh] bg-slate-50 font-sans text-slate-900 flex flex-col pb-[calc(env(safe-area-inset-bottom)+70px)] lg:pb-0 overflow-hidden">
      <PortalMobileHeader />
      <div className="flex-1 flex max-w-[1280px] w-full mx-auto min-h-0">
        <PortalSidebar />
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 overflow-y-auto ${
            currentUser.role === 'admin' ? 'scrollbar-admin' :
            currentUser.role === 'tentor' ? 'scrollbar-tentor' :
            'scrollbar-orangtua'
          }`}>
          {currentUser.role === 'admin' && <AdminDashboard />}
          {currentUser.role === 'tentor' && <TentorDashboard />}
          {currentUser.role === 'orang_tua' && <OrangTuaDashboard />}
        </main>
      </div>
      <PortalBottomNav />
    </div>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const MainAppContent: React.FC = () => {
  const { currentView } = useApp();

  // If user explicitly clicks on portal, we navigate them there using standard logic or redirect
  // But since we use React Router now, we should handle navigation with Links, 
  // keeping currentView logic for now as a fallback or removing it if possible.

  return (
    <ErrorBoundary>
      <Router>
      <InstallPWA />
        <ScrollToTop />
        <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>}>
        <Routes>
        <Route path="/" element={
          <PublicLayout>
            <Hero />
            <FeaturesSection />
            <TestimonialSection />
            <GallerySection />
            <TentorsSection />
            <ProgramsSection />
            <CtaSection />
            <FaqSection />
          </PublicLayout>
        } />
        <Route path="/tentang" element={
          <PublicLayout>
            <AboutSection />
          </PublicLayout>
        } />
        <Route path="/program" element={
          <PublicLayout>
            <ProgramsSection />
          </PublicLayout>
        } />
        <Route path="/tentor" element={
          <PublicLayout>
            <TentorsSection />
          </PublicLayout>
        } />
        <Route path="/faq" element={
          <PublicLayout>
            <FaqSection />
          </PublicLayout>
        } />
        <Route path="/kontak" element={
          <PublicLayout>
            <ContactSection />
          </PublicLayout>
        } />
        
        <Route path="/galeri" element={
          <PublicLayout>
            <GalleryPage />
          </PublicLayout>
        } />
        
        {/* Portal route */}
        <Route path="/portal/*" element={<PortalLayout />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
    </Router>
    </ErrorBoundary>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
