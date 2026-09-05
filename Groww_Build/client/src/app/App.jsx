import React, { useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext.jsx';
import { AuthModal } from '../features/auth/components/AuthModal.jsx';
import { Button } from '../components/ui/Button.jsx';
import { BrandLogo } from '../components/common/BrandLogo.jsx';
import { CentralLoader } from '../components/common/CentralLoader.jsx';
import { useGlobalLoader } from '../context/LoadingContext.jsx';
import {
  IoLogOutOutline,
  IoTrendingUpOutline,
  IoTrendingDownOutline,
  IoSearchOutline,
  IoShieldCheckmarkOutline,
} from 'react-icons/io5';

const AppContent = () => {
  const { user, isAuthenticated, isLoading: isAuthLoading, logout, openAuthModal } = useAuth();
  const { triggerRouteLoading } = useGlobalLoader();
  const navigate = useNavigate();
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  // Watch for route changes and trigger the global loader
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      triggerRouteLoading();
    }
  }, [location.pathname, triggerRouteLoading]);

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      // Already on home — just scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED] flex flex-col text-[#370A00] font-sans antialiased selection:bg-[#FFD6A7] selection:text-[#370A00]">
      <CentralLoader />

      <header className="border-b border-[#FFD6A7] bg-[#FEECD3]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-2 overflow-hidden">
          {/* Logo & Live Indian Market Tickers */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 shrink-0">
            <a href="/" onClick={handleLogoClick} aria-label="Go to home" className="outline-none">
              <BrandLogo size="sm" className="shrink-0" />
            </a>

            {/* Indian Indices Pill Tickers – hidden below md to save space */}
            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-[#FFD6A7] text-xs font-mono">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#FFF7ED] border border-[#FFD6A7] shadow-sm">
                <span className="text-[#7C2808] font-bold text-[11px]">NIFTY 50</span>
                <span className="font-bold text-[#370A00] text-[11px]">24,852.15</span>
                <span className="text-[#006044] font-bold text-[11px] flex items-center">
                  <IoTrendingUpOutline className="w-3 h-3 mr-0.5" />+0.42%
                </span>
              </div>

              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#FFF7ED] border border-[#FFD6A7] shadow-sm">
                <span className="text-[#7C2808] font-bold text-[11px]">SENSEX</span>
                <span className="font-bold text-[#370A00] text-[11px]">81,340.20</span>
                <span className="text-[#006044] font-bold text-[11px] flex items-center">
                  <IoTrendingUpOutline className="w-3 h-3 mr-0.5" />+0.38%
                </span>
              </div>
            </div>
          </div>

          {/* Right Header Navigation: User Session & Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {isAuthLoading ? (
              <div className="w-16 sm:w-24 h-8 bg-[#FEECD3] animate-pulse rounded-xl" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-1.5 sm:gap-3">
                <div className="flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-3.5 py-1.5 rounded-xl bg-[#FFF7ED] border border-[#FFD6A7] text-xs shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-[#8C3F27]/15 border border-[#8C3F27]/30 text-[#8C3F27] flex items-center justify-center font-bold text-[11px] shrink-0">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="font-bold text-[#370A00] max-w-[60px] sm:max-w-[140px] truncate uppercase tracking-tight hidden xs:inline">
                    {user?.name}
                  </span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={logout}
                  icon={IoLogOutOutline}
                  className="text-xs font-semibold text-[#7C2808] hover:text-[#370A00] px-2 sm:px-3"
                >
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => openAuthModal('register')}
                  className="text-xs font-bold text-[#FFF7ED] px-3 sm:px-4 py-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all rounded-xl shrink-0"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <AuthModal />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-12">
        <Outlet />
      </main>

      <footer className="border-t border-[#FFD6A7] py-5 sm:py-8 text-xs text-[#7C2808] bg-[#FEECD3]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <BrandLogo size="sm" />
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-medium text-[#7C2808]">
            <span className="font-mono">NSE · BSE Real-Time</span>
            <span className="text-[#FFD6A7]">|</span>
            <span>Catalyst Intelligence</span>
            <span className="text-[#FFD6A7]">|</span>
            <span>OHLCV Charts</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
