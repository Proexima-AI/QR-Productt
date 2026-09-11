import React, { useState } from 'react';
import { Building, Key, Star, BarChart3, MessageSquare, ExternalLink, Settings, Save, CheckCircle2, ShieldAlert, Sparkles, Filter, ChevronRight, Share2, CreditCard } from 'lucide-react';
import { BUSINESS_CATEGORIES } from './BusinessPresets';
import { getGoogleAuthUrl } from '../services/apiService';

export default function ClientDashboard({ business, onUpdateBusiness, internalFeedback, googleReviews = [], onResolveFeedback }) {
  const [activeTab, setActiveTab] = useState('analytics');
  const [formData, setFormData] = useState({ ...business });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [filterRating, setFilterRating] = useState('all');

  const createdAt = localStorage.getItem('createdAt');
  const subscriptionEndsAt = localStorage.getItem('subscriptionEndsAt');
  
  let trialDaysLeft = null;
  let hasActiveSubscription = false;
  let subEndDate = null;
  
  if (createdAt) {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const trialEndDate = new Date(createdDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    hasActiveSubscription = subscriptionEndsAt && new Date(subscriptionEndsAt) > now;

    if (!hasActiveSubscription) {
      const msLeft = trialEndDate.getTime() - now.getTime();
      trialDaysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
    } else {
      subEndDate = new Date(subscriptionEndsAt);
    }
  }

  const handleSaveSettings = (e) => {
    e.preventDefault();
    onUpdateBusiness(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const filteredFeedback = internalFeedback.filter(fb => {
    if (filterRating === 'all') return true;
    return fb.rating === Number(filterRating);
  });

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6">
        {/* Business Profile Card */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-10"></div>
          <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-indigo-600 font-black text-2xl overflow-hidden mb-3 z-10">
            {business.logoUrl ? (
              <img src={business.logoUrl} alt={business.name} className="w-full h-full object-cover" />
            ) : (
              business.name.substring(0, 2).toUpperCase()
            )}
          </div>
          <div className="z-10 w-full">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight truncate">{business.name}</h2>
            <div className="mt-1 flex justify-center">
              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border border-emerald-200/50">
                Active Account
              </span>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2 text-xs font-medium text-slate-500">
              <div className="flex justify-between items-center">
                <span>Owner</span>
                <span className="text-slate-900">{business.ownerName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Category</span>
                <span className="text-slate-900 capitalize">{business.category}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="bg-white border border-slate-200 shadow-sm rounded-2xl p-3 flex flex-col gap-1">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${
              activeTab === 'analytics' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-5 h-5" /> Overview
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between transition-all ${
              activeTab === 'feedback' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5" /> Inbox
            </div>
            {internalFeedback.length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black shadow-sm">
                {internalFeedback.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('google_sync')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${
              activeTab === 'google_sync' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Share2 className="w-5 h-5" /> Google Sync
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${
              activeTab === 'settings' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Settings className="w-5 h-5" /> Settings
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${
              activeTab === 'billing' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-5 h-5" /> Billing & Plan
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 space-y-6">

      {/* TAB 1: ANALYTICS & STATS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Performance Overview</h3>
            <span className="text-sm font-medium text-slate-500">Updated just now</span>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <BarChart3 className="w-16 h-16 text-indigo-600" />
              </div>
              <span className="text-sm text-slate-500 font-bold uppercase tracking-wider block mb-2 relative z-10">Total Scans</span>
              <div className="text-4xl font-black text-slate-900 relative z-10 flex items-center gap-3">
                {business.totalScans}
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100 flex items-center gap-1">
                  ↗ +18%
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Star className="w-16 h-16 text-indigo-600" />
              </div>
              <span className="text-sm text-slate-500 font-bold uppercase tracking-wider block mb-2 relative z-10">AI 5-Star Reviews</span>
              <div className="text-4xl font-black text-slate-900 relative z-10 flex items-center gap-3">
                {business.googleReviewCount}
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                  ★ 4.9 Avg
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShieldAlert className="w-16 h-16 text-rose-500" />
              </div>
              <span className="text-sm text-slate-500 font-bold uppercase tracking-wider block mb-2 relative z-10">Low-Stars Blocked</span>
              <div className="text-4xl font-black text-slate-900 relative z-10 flex items-center gap-3">
                {business.interceptedBadReviews}
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md border border-rose-100">
                  Reputation Safe
                </span>
              </div>
            </div>
          </div>

          {/* Business ROI Banner */}
          <div className="bg-slate-900 p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />
            <div className="space-y-3 z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 text-indigo-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/5">
                <Sparkles className="w-3 h-3" /> Smart Gatekeeper Impact
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">Your Google Reputation is Protected!</h3>
              <p className="text-sm text-slate-400 max-w-2xl leading-relaxed font-medium">
                By routing 4 & 5 stars to Google and capturing 1-3 star feedback internally, your public Google rating increased from <strong className="text-white">4.2 ★ to 4.9 ★</strong>!
              </p>
            </div>

            <a
              href={business.googleReviewUrl}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all shrink-0 z-10 w-full md:w-auto"
            >
              View Google Profile <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* TAB 2: INTERNAL FEEDBACK INBOX */}
      {activeTab === 'feedback' && (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                Private Customer Inbox
              </h3>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                These 1-3 star reviews were kept off Google. Resolve them privately here.
              </p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 text-sm">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500 font-bold">Filter:</span>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg text-slate-900 px-3 py-1.5 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="all">All Stars</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
              </select>
            </div>
          </div>

          {filteredFeedback.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-xl border border-slate-100 text-slate-500 font-medium text-sm">
              No unresolved customer complaints! Your satisfaction is running high. 🎉
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFeedback.map((fb) => (
                <div key={fb.id} className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 space-y-4 hover:border-indigo-200 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                        {fb.customerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{fb.customerName}</span>
                          <span className="text-xs text-slate-400 font-medium">{fb.customerContact}</span>
                        </div>
                        <div className="text-amber-400 text-xs tracking-widest mt-0.5">{'★'.repeat(fb.rating)}</div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">{fb.date}</span>
                  </div>

                  <p className="text-sm text-slate-700 bg-slate-50/50 p-4 rounded-xl font-medium leading-relaxed border border-slate-100">
                    "{fb.message}"
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-50">
                    <div className="flex gap-2">
                      {fb.chips && fb.chips.map(chip => (
                         <span key={chip} className="text-[10px] font-bold uppercase tracking-wide bg-rose-50 text-rose-600 px-2.5 py-1 rounded-md border border-rose-100">
                           {chip}
                         </span>
                      ))}
                    </div>

                    <button
                      onClick={() => onResolveFeedback(fb.id)}
                      className={`text-xs px-4 py-2 rounded-lg font-bold transition-all ${
                        fb.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                      }`}
                    >
                      {fb.status === 'Resolved' ? '✓ Resolved' : 'Mark as Resolved'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2.5: GOOGLE AI SYNC */}
      {activeTab === 'google_sync' && (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
                <Share2 className="w-5 h-5 text-indigo-500" />
                Google Reviews & AI Auto-Reply
              </h3>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                View your actual Google Maps reviews and the dynamic AI responses we automatically generated and posted.
              </p>
            </div>
            
            {!business.google_access_token ? (
              <button 
                onClick={async () => {
                  try {
                    const url = await getGoogleAuthUrl();
                    window.location.href = url;
                  } catch (e) {
                    alert("Could not connect to Google at this time.");
                  }
                }}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg shadow hover:bg-indigo-700 transition"
              >
                Connect Google Account
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" /> Google Connected
              </div>
            )}
          </div>

          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <h4 className="font-bold text-slate-900">Enable AI Auto-Reply</h4>
              <p className="text-xs text-slate-500">Automatically reply to new Google Maps reviews using Gemini AI.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={business.auto_reply_enabled === 1 || business.auto_reply_enabled === true}
                onChange={async (e) => {
                  const updated = { ...business, auto_reply_enabled: e.target.checked };
                  await onUpdateBusiness(updated);
                }}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {googleReviews.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-xl border border-slate-100 text-slate-500 font-medium text-sm">
              No synced Google reviews found yet. Turn on Auto-Reply and wait for new reviews!
            </div>
          ) : (
            <div className="space-y-4">
              {googleReviews.map((rev) => (
                <div key={rev.review_id} className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-black text-sm">{'★'.repeat(rev.rating)}</span>
                      <span className="text-sm font-bold text-slate-900">{rev.reviewer_name}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">{new Date(rev.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">
                    "{rev.comment}"
                  </p>
                  
                  {rev.ai_reply && (
                    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl mt-4 relative">
                      <div className="absolute -top-3 left-4 bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Auto-Replied
                      </div>
                      <p className="text-sm text-indigo-900 font-medium mt-1">
                        {rev.ai_reply}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CLIENT BUSINESS SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 space-y-8">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Business Profile Settings</h3>
            {savedSuccess && (
              <span className="text-sm text-emerald-600 font-bold flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-4 h-4" /> Saved Successfully!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-sm">
            
            {/* Section 1: Basic Info */}
            <div className="md:col-span-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Basic Details</h4>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-2">Business Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-2">Business Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all shadow-sm"
              >
                {BUSINESS_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-2">Owner Name</label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all shadow-sm"
              />
            </div>

            {/* Section 2: Integrations & AI */}
            <div className="md:col-span-2 mt-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Integrations & AI Settings</h4>
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-700 font-bold mb-2">Google Business Review Link</label>
              <input
                type="text"
                value={formData.googleReviewUrl}
                onChange={(e) => setFormData({ ...formData, googleReviewUrl: e.target.value })}
                placeholder="https://search.google.com/local/writereview?placeid=..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all shadow-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-700 font-bold mb-2">Target SEO Keywords (For AI Gen)</label>
              <input
                type="text"
                value={formData.targetKeywords}
                onChange={(e) => setFormData({ ...formData, targetKeywords: e.target.value })}
                placeholder="e.g. best Italian restaurant, fresh pasta, romantic dinner"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all shadow-sm"
              />
              <p className="text-xs text-slate-500 mt-2 font-medium">
                The Gemini AI will seamlessly integrate these SEO keywords when drafting positive 5-star reviews for your customers.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-700 font-bold mb-2">Promotional Customer Incentive Banner</label>
              <input
                type="text"
                value={formData.offerBanner}
                onChange={(e) => setFormData({ ...formData, offerBanner: e.target.value })}
                placeholder="e.g. 🎉 Thank you for visiting! Rate your experience & get a 10% coupon!"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all hover:-translate-y-0.5"
            >
              <Save className="w-4 h-4" /> Save Configuration
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: BILLING & PLAN */}
      {activeTab === 'billing' && (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Billing & Subscription</h3>
            <p className="text-sm text-slate-500 mt-1 font-medium">Manage your plan and billing details.</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-black text-slate-900">
                  {hasActiveSubscription ? 'Premium Plan' : 'Free Trial'}
                </h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  hasActiveSubscription ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
                }`}>
                  {hasActiveSubscription ? 'Active' : 'Trialing'}
                </span>
              </div>
              <p className="text-sm text-slate-600 font-medium">
                {hasActiveSubscription 
                  ? `Your premium subscription is active until ${subEndDate ? subEndDate.toLocaleDateString() : 'N/A'}.` 
                  : `You have ${trialDaysLeft && trialDaysLeft > 0 ? trialDaysLeft : 0} days left on your free trial.`}
              </p>
            </div>
            
            <button 
              className="px-6 py-3 bg-white text-slate-900 border border-slate-200 font-bold rounded-xl text-sm shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all shrink-0"
              onClick={() => alert("To change your plan, please contact support or wait until your current period ends.")}
            >
              {hasActiveSubscription ? 'Manage Plan' : 'Upgrade Now'}
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">Billing History</h4>
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-100 text-slate-500 font-medium text-sm">
              No previous invoices found.
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}
