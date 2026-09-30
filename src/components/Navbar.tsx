import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { PageView, UserProfile } from '../types/index.ts';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  user: UserProfile | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  user,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; view: PageView }[] = [
    { label: 'Dashboard', view: 'dashboard' },
    { label: 'Home Planner', view: 'home-planner' },
    { label: 'Party Planner', view: 'party-planner' },
    { label: 'Jewelry Planner', view: 'jewelry-planner' },
    { label: 'History', view: 'history' },
  ];

  const handleNav = (view: PageView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 no-print">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 h-16">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => handleNav('landing')}
          className="font-display text-xl font-semibold tracking-tight text-slate-900 hover:text-slate-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          PocketSmart AI
        </button>

        {/* Zone 2: 5 clean text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          {navItems.map((item) => {
            const isActive =
              currentPage === item.view ||
              (item.view === 'home-planner' && currentPage === 'home-recommendations') ||
              (item.view === 'party-planner' && currentPage === 'party-recommendations') ||
              (item.view === 'jewelry-planner' && currentPage === 'jewelry-recommendations');
            return (
              <button
                key={item.view}
                type="button"
                onClick={() => handleNav(item.view)}
                className={`py-1 transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
                  isActive
                    ? 'text-slate-900 border-slate-900 font-semibold'
                    : 'border-transparent hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <button
                type="button"
                onClick={() => handleNav('profile')}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer"
              >
                {user.fullName}
              </button>
              <button
                type="button"
                onClick={() => handleNav('home-planner')}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
              >
                Start Planning
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleNav('login')}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => handleNav('register')}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
              >
                Start Planning
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          className="md:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-6 py-4 space-y-3">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <button
                key={item.view}
                type="button"
                onClick={() => handleNav(item.view)}
                className={`text-left py-2 text-sm font-medium ${
                  currentPage === item.view ? 'text-slate-900 font-semibold' : 'text-slate-600'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleNav('saved')}
              className="text-left py-2 text-sm font-medium text-slate-600"
            >
              Saved Recommendations
            </button>
            <button
              type="button"
              onClick={() => handleNav('testimonials')}
              className="text-left py-2 text-sm font-medium text-slate-600"
            >
              Testimonials
            </button>
            <button
              type="button"
              onClick={() => handleNav('profile')}
              className="text-left py-2 text-sm font-medium text-slate-600"
            >
              Profile & Settings
            </button>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
            {user ? (
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg"
              >
                Sign Out ({user.fullName})
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleNav('login')}
                  className="flex-1 py-2.5 text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('register')}
                  className="flex-1 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg"
                >
                  Create Account
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
