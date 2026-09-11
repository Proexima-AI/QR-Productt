import React, { useState } from 'react';
import { Building, Tag, Search, Link2, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { BUSINESS_CATEGORIES } from './BusinessPresets';
import { completeBusinessSetup } from '../services/apiService';

export default function OnboardingSetup({ onComplete }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    category: BUSINESS_CATEGORIES[0].id,
    tagline: '',
    google_review_url: '',
    target_keywords: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setError('Business Name is required');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const res = await completeBusinessSetup(formData);
      if (res.success && res.token) {
        // Update local storage with new active token
        localStorage.setItem('token', res.token);
        localStorage.setItem('userStatus', 'active');
        localStorage.setItem('createdAt', res.user.created_at);
        localStorage.setItem('subscriptionEndsAt', res.user.subscription_ends_at || '');
        // Notify parent to refresh
        if (onComplete) onComplete();
      }
    } catch (err) {
      setError('Failed to complete setup. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-indigo-300" />
              Welcome to ReviewPulse AI
            </h1>
            <p className="mt-2 text-indigo-100 font-medium">
              Let's set up your business profile so we can start capturing 5-star reviews and intercepting the rest.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-bold border border-rose-100">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <Building className="w-4 h-4" /> Business Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all font-medium"
                placeholder="e.g. Joe's Coffee"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <Tag className="w-4 h-4" /> Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all font-medium"
              >
                {BUSINESS_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-sm font-bold text-slate-700">Business Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all font-medium"
                placeholder="e.g. The best coffee in downtown"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <Link2 className="w-4 h-4" /> Google Review Link
              </label>
              <input
                type="text"
                value={formData.google_review_url}
                onChange={(e) => setFormData({ ...formData, google_review_url: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all font-mono text-sm"
                placeholder="https://g.page/r/.../review"
              />
              <p className="text-xs text-slate-500 mt-1">This is where 4 & 5 star reviews will be redirected.</p>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <Search className="w-4 h-4" /> SEO Target Keywords
              </label>
              <input
                type="text"
                value={formData.target_keywords}
                onChange={(e) => setFormData({ ...formData, target_keywords: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all font-medium"
                placeholder="e.g. craft coffee, fresh pastries, friendly staff"
              />
              <p className="text-xs text-slate-500 mt-1">Our AI will weave these keywords into generated 5-star reviews to boost your Google ranking.</p>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:hover:bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Finalizing Setup...
                </>
              ) : (
                <>
                  Complete Setup <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
