import React from 'react';
import { QrCode, LayoutDashboard, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HeaderNav({ activeView, setActiveView }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const createdAt = localStorage.getItem('createdAt');
  const subscriptionEndsAt = localStorage.getItem('subscriptionEndsAt');

  let trialDaysLeft = null;
  let hasActiveSubscription = false;

  if (createdAt) {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const trialEndDate = new Date(createdDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    hasActiveSubscription = subscriptionEndsAt && new Date(subscriptionEndsAt) > now;

    if (!hasActiveSubscription) {
      const msLeft = trialEndDate.getTime() - now.getTime();
      trialDaysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/20">
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              ReviewPulse AI <span className="text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">SaaS Platform</span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">Smart AI Review Generator & Google Rating Gatekeeper</p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-center">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeView === 'dashboard'
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Client Admin Dashboard
          </button>

          <button
            onClick={() => setActiveView('qr')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeView === 'qr'
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            <Printer className="w-4 h-4" /> QR Standee Studio
          </button>
        </div>

        {/* Status & Logout */}
        <div className="hidden lg:flex items-center gap-4">
          {!hasActiveSubscription && trialDaysLeft !== null && trialDaysLeft > 0 && (
            <div className="text-[11px] font-bold px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-700">
              {trialDaysLeft} Days Trial Left
            </div>
          )}
          {hasActiveSubscription && (
            <div className="text-[11px] font-bold px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700">
              Pro Active
            </div>
          )}
          <button onClick={handleLogout} className="text-xs font-bold text-slate-500 hover:text-rose-500 transition-colors bg-slate-50 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-rose-200">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
