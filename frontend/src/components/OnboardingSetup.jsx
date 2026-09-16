import React, { useState, useEffect } from 'react';
import { Building, Tag, Search, Link2, Sparkles, ArrowRight, ArrowLeft, Loader2, MapPin, Check, Plus, X, TrendingUp, Star, Users, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BUSINESS_CATEGORIES } from './BusinessPresets';
import { completeBusinessSetup, getProductSuggestions, analyzeBusiness, getGoogleAuthUrl } from '../services/apiService';

export default function OnboardingSetup({ onComplete }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  
  const [formData, setFormData] = useState({
    mobile_number: '',
    name: '',
    category: BUSINESS_CATEGORIES[0].id,
    top_selling_items: [],
    business_location: '',
    google_review_url: '',
    target_keywords: '',
    ai_analysis_results: {}
  });

  const [customItem, setCustomItem] = useState('');
  const [suggestedItems, setSuggestedItems] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const [placeResults, setPlaceResults] = useState([]);
  const [searchingPlaces, setSearchingPlaces] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');

  // Restore state from localStorage if returning from Google Auth
  useEffect(() => {
    const savedState = localStorage.getItem('onboardingState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setFormData(parsed.formData);
        setStep(4); // Jump to analysis step after google auth
        localStorage.removeItem('onboardingState');
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  // Fetch suggestions when category changes and step is 2
  useEffect(() => {
    if (step === 2 && formData.category) {
      const fetchSuggestions = async () => {
        setLoadingSuggestions(true);
        try {
          const categoryName = BUSINESS_CATEGORIES.find(c => c.id === formData.category)?.name || formData.category;
          const suggestions = await getProductSuggestions(categoryName);
          setSuggestedItems(suggestions || []);
        } catch (err) {
          console.error('Failed to get suggestions', err);
        } finally {
          setLoadingSuggestions(false);
        }
      };
      fetchSuggestions();
    }
  }, [step, formData.category]);

  useEffect(() => {
    if (step === 3 && locationSearch && locationSearch.length > 2) {
      const delayFn = setTimeout(async () => {
        setSearchingPlaces(true);
        try {
          const categoryName = BUSINESS_CATEGORIES.find(c => c.id === formData.category)?.name || formData.category;
          const res = await fetch('http://localhost:5001/api/business/search-places', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              location: locationSearch, 
              category: categoryName, 
              businessName: formData.name || '' 
            })
          });
          const data = await res.json();
          setPlaceResults(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error(err);
          setPlaceResults([]);
        } finally {
          setSearchingPlaces(false);
        }
      }, 800);
      return () => clearTimeout(delayFn);
    } else {
      setPlaceResults([]);
    }
  }, [step, locationSearch, formData.category, formData.name]);

  const validateStep = () => {
    setError('');
    if (step === 1) {
      if (!formData.mobile_number || !/^\d{10,}$/.test(formData.mobile_number)) {
        setError('Please enter a valid mobile number (min 10 digits).');
        return false;
      }
      if (!formData.name) {
        setError('Business Name is required');
        return false;
      }
    }
    if (step === 3) {
      if (!formData.business_location) {
        setError('Business Location is required');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const handleAddItem = (item) => {
    if (item && !formData.top_selling_items.includes(item)) {
      setFormData(prev => ({
        ...prev,
        top_selling_items: [...prev.top_selling_items, item]
      }));
    }
    setCustomItem('');
  };

  const handleRemoveItem = (item) => {
    setFormData(prev => ({
      ...prev,
      top_selling_items: prev.top_selling_items.filter(i => i !== item)
    }));
  };

  const handleGoogleConnect = async () => {
    try {
      localStorage.setItem('onboardingState', JSON.stringify({ formData, step: 3 }));
      const url = await getGoogleAuthUrl();
      window.location.href = url;
    } catch (err) {
      setError('Failed to connect to Google');
    }
  };

  const runAnalysis = async () => {
    setAnalyzing(true);
    setStep(4);
    try {
      const categoryName = BUSINESS_CATEGORIES.find(c => c.id === formData.category)?.name || formData.category;
      const analysis = await analyzeBusiness(formData.name, categoryName, formData.business_location);
      setFormData(prev => ({
        ...prev,
        ai_analysis_results: analysis || {},
        target_keywords: analysis?.trendingKeywords?.join(', ') || ''
      }));
    } catch (err) {
      console.error(err);
      setError('Analysis failed. Please proceed.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await completeBusinessSetup(formData);
      if (res.success && res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('userStatus', 'active');
        localStorage.setItem('createdAt', res.user.created_at);
        localStorage.setItem('subscriptionEndsAt', res.user.subscription_ends_at || '');
        if (onComplete) onComplete();
      }
    } catch (err) {
      setError('Failed to complete setup. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const slideVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col min-h-[500px]">
        
        {/* Header */}
        <div className="bg-indigo-600 p-8 text-white relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-indigo-300" />
              Setup Your Business
            </h1>
            <div className="mt-4 flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(s => (
                <div key={s} className={`h-2 flex-1 rounded-full ${step >= s ? 'bg-indigo-300' : 'bg-indigo-800'}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex-1 flex flex-col relative overflow-hidden">
          {error && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-bold border border-rose-100 mb-6 shrink-0">
              {error}
            </div>
          )}

          <div className="flex-1 relative">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                  <h2 className="text-xl font-bold text-slate-800">Basic Information</h2>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">Mobile Number *</label>
                    <input
                      type="tel"
                      value={formData.mobile_number}
                      onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value.replace(/\\D/g, '') })}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all font-medium"
                      placeholder="e.g. 9876543210"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                      <Building className="w-4 h-4" /> Business Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all font-medium"
                      placeholder="e.g. Joe's Coffee"
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                  <h2 className="text-xl font-bold text-slate-800">Products & Services</h2>
                  
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

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Top Selling Items</label>
                    
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.top_selling_items.map((item, idx) => (
                        <span key={idx} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          {item}
                          <X className="w-3 h-3 cursor-pointer hover:text-indigo-900" onClick={() => handleRemoveItem(item)} />
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customItem}
                        onChange={(e) => setCustomItem(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddItem(customItem)}
                        className="flex-1 bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm"
                        placeholder="Add a product..."
                      />
                      <button type="button" onClick={() => handleAddItem(customItem)} className="bg-slate-900 text-white p-3 rounded-xl hover:bg-slate-800">
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    {loadingSuggestions ? (
                      <div className="text-sm text-slate-500 flex items-center gap-2 mt-4"><Loader2 className="w-4 h-4 animate-spin"/> Suggesting items via AI...</div>
                    ) : (
                      suggestedItems.length > 0 && (
                        <div className="mt-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                          <p className="text-xs font-bold text-indigo-800 mb-2">AI Suggestions for {BUSINESS_CATEGORIES.find(c => c.id === formData.category)?.name}</p>
                          <div className="flex flex-wrap gap-2">
                            {suggestedItems.map((item, idx) => (
                              <button 
                                key={idx} 
                                type="button"
                                onClick={() => handleAddItem(item)}
                                disabled={formData.top_selling_items.includes(item)}
                                className="text-xs bg-white border border-indigo-200 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-50 disabled:opacity-50 transition-colors"
                              >
                                + {item}
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                  <h2 className="text-xl font-bold text-slate-800">Business Location</h2>
                  
                  <div className="space-y-1 relative">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" /> Search Your Business on Google Maps
                    </label>
                    <input
                      type="text"
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all font-medium"
                      placeholder="Enter city or area to find your business..."
                    />
                    {searchingPlaces && (
                      <div className="absolute right-3 top-10 text-slate-400">
                        <Loader2 className="w-5 h-5 animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Selected Business */}
                  {formData.business_location && (
                    <div className="p-4 border border-indigo-200 rounded-xl bg-indigo-50 shadow-sm space-y-2 relative">
                      <div className="absolute top-2 right-2 cursor-pointer text-slate-400 hover:text-slate-600" onClick={() => setFormData({...formData, business_location: '', name: ''})}>
                        <X className="w-4 h-4" />
                      </div>
                      <div className="flex items-center gap-3 p-2">
                        <div className="bg-indigo-100 p-2 rounded-full">
                          <MapPin className="text-indigo-600 w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-indigo-900">{formData.name || 'Your Business'}</p>
                          <p className="text-xs text-indigo-700">{formData.business_location}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dropdown Results */}
                  {!formData.business_location && placeResults.length > 0 && (
                    <div className="border border-slate-200 rounded-xl bg-white shadow-lg overflow-hidden flex flex-col max-h-60 overflow-y-auto">
                      {placeResults.map((place, idx) => (
                        <div 
                          key={idx}
                          onClick={() => {
                            setFormData({ ...formData, business_location: place.address, name: place.name });
                            setPlaceResults([]);
                            setLocationSearch('');
                          }}
                          className="flex items-center gap-3 p-3 hover:bg-slate-50 border-b border-slate-100 cursor-pointer transition-colors"
                        >
                          <MapPin className="text-slate-400 w-5 h-5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-slate-800">{place.name}</p>
                            <p className="text-xs text-slate-500">{place.address}</p>
                            <p className="text-xs text-yellow-500 font-medium">★ {place.rating} ({place.reviewsCount} reviews)</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-6 border-t border-slate-100 flex flex-col items-center">
                    <p className="text-sm text-slate-500 mb-3">Can't find your business on the map?</p>
                    <button 
                      type="button" 
                      onClick={handleGoogleConnect}
                      className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white font-medium py-3 px-4 rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/><path fill="none" d="M1 1h22v22H1z"/></svg>
                      Connect with Google My Business
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center h-full py-10 space-y-6">
                  {analyzing ? (
                    <>
                      <motion.div 
                        animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center"
                      >
                        <Sparkles className="w-10 h-10 text-indigo-600" />
                      </motion.div>
                      <h2 className="text-2xl font-bold text-slate-800 text-center">Analyzing Your Business...</h2>
                      <p className="text-slate-500 text-center">Our AI is generating growth strategies, SEO keywords, and setup recommendations.</p>
                    </>
                  ) : (
                    <div className="w-full space-y-6">
                      <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                        <Check className="w-6 h-6" />
                        <h2 className="text-lg font-bold">Analysis Complete!</h2>
                      </div>

                      {/* Interactive Profile Analysis Dashboard */}
                      {formData.ai_analysis_results?.scores && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Current Footprint Card */}
                            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2"><MapPin className="w-4 h-4 text-indigo-500" /> Current Digital Health</h3>
                              
                              <div className="space-y-3">
                                <div>
                                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                                    <span>SEO Score</span>
                                    <span>{formData.ai_analysis_results.scores.currentSeoScore}/100</span>
                                  </div>
                                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${formData.ai_analysis_results.scores.currentSeoScore}%` }} transition={{ duration: 1, ease: "easeOut" }} className="bg-rose-500 h-2 rounded-full"></motion.div>
                                  </div>
                                </div>
                                <div>
                                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                                    <span>Local Visibility</span>
                                    <span>{formData.ai_analysis_results.scores.localVisibility}/100</span>
                                  </div>
                                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${formData.ai_analysis_results.scores.localVisibility}%` }} transition={{ duration: 1.2, ease: "easeOut" }} className="bg-amber-500 h-2 rounded-full"></motion.div>
                                  </div>
                                </div>
                              </div>
                              <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">{formData.ai_analysis_results.currentProfileAnalysis}</p>
                            </div>

                            {/* Improvement & Strategy Card */}
                            <div className="bg-gradient-to-br from-indigo-50 to-emerald-50 border border-indigo-100 rounded-xl p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                              <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-600" /> Projected Improvements</h3>
                              
                              <div className="space-y-3">
                                <div>
                                  <div className="flex justify-between text-xs font-bold text-indigo-800 mb-1">
                                    <span>Projected SEO Score</span>
                                    <span>{formData.ai_analysis_results.scores.projectedSeoScore}/100</span>
                                  </div>
                                  <div className="w-full bg-indigo-200/50 rounded-full h-2 overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${formData.ai_analysis_results.scores.projectedSeoScore}%` }} transition={{ duration: 1.5, ease: "easeOut" }} className="bg-emerald-500 h-2 rounded-full"></motion.div>
                                  </div>
                                </div>
                                <div>
                                  <div className="flex justify-between text-xs font-bold text-indigo-800 mb-1">
                                    <span>Reputation Trust</span>
                                    <span>{formData.ai_analysis_results.scores.reputationTrust}/100</span>
                                  </div>
                                  <div className="w-full bg-indigo-200/50 rounded-full h-2 overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${formData.ai_analysis_results.scores.reputationTrust}%` }} transition={{ duration: 1.7, ease: "easeOut" }} className="bg-indigo-600 h-2 rounded-full"></motion.div>
                                  </div>
                                </div>
                              </div>
                              <p className="text-xs text-indigo-800 leading-relaxed bg-white/60 p-3 rounded-lg border border-indigo-100">{formData.ai_analysis_results.improvementStrategy}</p>
                            </div>
                          </div>

                          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-start gap-3 hover:shadow-md transition-shadow">
                            <div className="bg-amber-100 p-2 rounded-full flex-shrink-0 mt-1">
                              <Tag className="w-4 h-4 text-amber-600" />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-slate-800 mb-1">SEO Feedback Mechanism</h3>
                              <p className="text-xs text-slate-600">{formData.ai_analysis_results.seoFeedbackStrategy}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {formData.ai_analysis_results?.topSearchItems && (
                        <div>
                          <h3 className="text-sm font-bold text-slate-700 mb-2">Top Search Items for {formData.name}</h3>
                          <div className="flex flex-wrap gap-2">
                            {formData.ai_analysis_results.topSearchItems.map((item, i) => (
                              <span key={i} className="text-xs bg-slate-100 border border-slate-200 px-2 py-1 rounded text-slate-700">{item}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {formData.ai_analysis_results?.trendingKeywords && (
                        <div>
                          <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-1"><Search className="w-4 h-4"/> Trending Keywords</h3>
                          <div className="flex flex-wrap gap-2">
                            {formData.ai_analysis_results.trendingKeywords.map((item, i) => (
                              <span key={i} className="text-xs bg-indigo-50 border border-indigo-100 px-2 py-1 rounded text-indigo-700">{item}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                          <h4 className="text-xs font-bold text-emerald-800 mb-2">Do's</h4>
                          <ul className="text-xs text-emerald-700 space-y-1 list-disc pl-4">
                            {formData.ai_analysis_results?.dos?.map((d, i) => <li key={i}>{d}</li>)}
                          </ul>
                        </div>
                        <div className="bg-rose-50 p-3 rounded-xl border border-rose-100">
                          <h4 className="text-xs font-bold text-rose-800 mb-2">Don'ts</h4>
                          <ul className="text-xs text-rose-700 space-y-1 list-disc pl-4">
                            {formData.ai_analysis_results?.donts?.map((d, i) => <li key={i}>{d}</li>)}
                          </ul>
                        </div>
                      </div>

                      {/* Projected Growth & ROI */}
                      <div className="mt-8 border-t border-slate-100 pt-8 pb-4">
                        <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-indigo-600" /> Projected Growth & ROI
                        </h3>
                        <p className="text-sm text-slate-500 mb-6">
                          Based on our analysis, leveraging smart QR code reviews will drastically improve <strong className="text-slate-700">{formData.name || 'your business'}</strong>'s digital footprint on Google.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-100 shadow-sm flex flex-col items-center text-center transform transition-transform hover:scale-105">
                            <div className="bg-white p-2 rounded-full mb-3 shadow-sm">
                              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                            </div>
                            <h4 className="text-3xl font-black text-indigo-900 mb-1">+40%</h4>
                            <p className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">More 5-Star Reviews</p>
                            <p className="text-[10px] text-indigo-500 mt-1">Expected in 30 days</p>
                          </div>

                          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-100 shadow-sm flex flex-col items-center text-center transform transition-transform hover:scale-105">
                            <div className="bg-white p-2 rounded-full mb-3 shadow-sm">
                              <Users className="w-6 h-6 text-emerald-500" />
                            </div>
                            <h4 className="text-3xl font-black text-emerald-900 mb-1">3x</h4>
                            <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Customer Trust</p>
                            <p className="text-[10px] text-emerald-600 mt-1">Higher conversion rate</p>
                          </div>

                          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-100 shadow-sm flex flex-col items-center text-center transform transition-transform hover:scale-105">
                            <div className="bg-white p-2 rounded-full mb-3 shadow-sm">
                              <Map className="w-6 h-6 text-amber-500" />
                            </div>
                            <h4 className="text-3xl font-black text-amber-900 mb-1">Top 3</h4>
                            <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Local Search Rank</p>
                            <p className="text-[10px] text-amber-600 mt-1">On Google Maps</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </motion.div>
              )}

              {step === 5 && (
                <motion.div key="step5" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Sparkles className="text-amber-500 w-6 h-6"/> Final Touch</h2>
                  
                  <div className="space-y-1">
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
                    <p className="text-xs text-slate-500 mt-1">This is where 4 & 5 star reviews will be redirected. (Optional)</p>
                  </div>

                  <div className="space-y-1">
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
                    <p className="text-xs text-slate-500 mt-1">We've pre-filled this based on our AI analysis.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 mt-auto flex items-center justify-between border-t border-slate-100">
            {step > 1 && !analyzing && (
              <button
                type="button"
                onClick={prevStep}
                className="text-slate-500 font-semibold py-2 px-4 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
            <div className="ml-auto">
              {step === 3 ? (
                <button
                  type="button"
                  onClick={runAnalysis}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  Analyze My Business <Sparkles className="w-4 h-4" />
                </button>
              ) : step === 4 ? (
                !analyzing && (
                  <button
                    type="button"
                    onClick={() => setStep(5)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all flex items-center gap-2"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                )
              ) : step === 5 ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Complete Setup'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
