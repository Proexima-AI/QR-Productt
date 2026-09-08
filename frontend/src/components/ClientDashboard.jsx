import React, { useState } from 'react';
import { Building, Key, Star, BarChart3, MessageSquare, ExternalLink, Settings, Save, CheckCircle2, ShieldAlert, Sparkles, Filter, ChevronRight, Share2 } from 'lucide-react';
import { BUSINESS_CATEGORIES } from './BusinessPresets';
import { getGoogleAuthUrl } from '../services/apiService';

export default function ClientDashboard({ business, onUpdateBusiness, internalFeedback, googleReviews = [], onResolveFeedback }) {
  const [activeTab, setActiveTab] = useState('analytics');
  const [formData, setFormData] = useState({ ...business });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [filterRating, setFilterRating] = useState('all');

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
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl overflow-hidden shrink-0">
            {business.logoUrl ? (
              <img src={business.logoUrl} alt={business.name} className="w-full h-full object-cover" />
            ) : (
              business.name.substring(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{business.name}</h2>
              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
                ACTIVE
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1 font-medium flex items-center gap-2">
              <span>Owner: {business.ownerName}</span> • <span>Category: {business.category}</span>
            </p>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200 self-start md:self-auto shadow-inner">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'analytics' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Overview
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 relative transition-all ${
              activeTab === 'feedback' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Inbox
            {internalFeedback.length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1 font-bold">
                {internalFeedback.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('google_sync')}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 relative transition-all ${
              activeTab === 'google_sync' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Share2 className="w-4 h-4" /> Google AI Sync
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'settings' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" /> Settings
          </button>
        </div>
      </div>

      {/* TAB 1: ANALYTICS & STATS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
              <span className="text-sm text-slate-500 font-bold tracking-tight">Total Scans</span>
              <div className="text-3xl font-black text-slate-900 flex items-baseline justify-between mt-2">
                <span>{business.totalScans}</span>
                <span className="text-xs text-emerald-500 font-bold bg-emerald-50 px-2 py-1 rounded-lg">+18%</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <span className="text-sm text-slate-500 font-bold tracking-tight">AI 5-Star Reviews</span>
              <div className="text-3xl font-black text-indigo-600 flex items-baseline justify-between mt-2">
                <span>{business.googleReviewCount}</span>
                <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded-lg">★ 4.9</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <span className="text-sm text-slate-500 font-bold tracking-tight">Low-Stars Blocked</span>
              <div className="text-3xl font-black text-rose-500 flex items-baseline justify-between mt-2">
                <span>{business.interceptedBadReviews}</span>
                <span className="text-xs text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded-lg">Safe</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <span className="text-sm text-slate-500 font-bold tracking-tight">Google Place ID</span>
              <div className="text-sm font-mono text-slate-700 truncate mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                {business.googlePlaceId}
              </div>
            </div>
          </div>

          {/* Business ROI Banner */}
          <div className="bg-gradient-to-r from-indigo-50 via-white to-white border border-indigo-100 p-8 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />
            <div className="space-y-2 z-10">
              <div className="flex items-center gap-2 text-indigo-600 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> Smart Gatekeeper Impact
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Your Google Reputation is Protected!</h3>
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed font-medium">
                By routing 4 & 5 stars to Google and capturing 1-3 star feedback internally, your public Google rating increased from <strong className="text-slate-900">4.2 ★ to 4.9 ★</strong>!
              </p>
            </div>

            <a
              href={business.googleReviewUrl}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all shrink-0 z-10"
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
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-50 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-black text-sm">{'★'.repeat(fb.rating)}</span>
                      <span className="text-sm font-bold text-slate-900">{fb.customerName}</span>
                      <span className="text-xs text-slate-400 font-medium">({fb.customerContact})</span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">{fb.date}</span>
                  </div>

                  <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 font-medium leading-relaxed">
                    "{fb.message}"
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
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
                          : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm'
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <label className="block text-slate-700 font-bold mb-2">Business Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-2">Business Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-2">Google Business Review Link</label>
              <input
                type="text"
                value={formData.googleReviewUrl}
                onChange={(e) => setFormData({ ...formData, googleReviewUrl: e.target.value })}
                placeholder="https://search.google.com/local/writereview?placeid=..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-700 font-bold mb-2">Target SEO Keywords (For AI Gen)</label>
              <input
                type="text"
                value={formData.targetKeywords}
                onChange={(e) => setFormData({ ...formData, targetKeywords: e.target.value })}
                placeholder="e.g. best Italian restaurant, fresh pasta, romantic dinner"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
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
    </div>
  );
}
