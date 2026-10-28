import React, { useState, useEffect } from 'react';
import { Star, Sparkles, Copy, ExternalLink, Send, ShieldCheck, CheckCircle2, MessageSquareHeart, RefreshCw, AlertTriangle, QrCode, Loader2, MapPin, Package, Tag, Check, Plus, X, ChevronDown, Search, Globe } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';
import { generateReviewBackend, recordScan, recordGoogleReview } from '../services/apiService';
import { BUSINESS_CATEGORIES, getCategoryDefaultProducts } from './BusinessPresets';

export default function CustomerReviewPage({ business, onAddInternalFeedback }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedChips, setSelectedChips] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [customProductInput, setCustomProductInput] = useState('');
  const [showCustomProductInput, setShowCustomProductInput] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tone, setTone] = useState('Enthusiastic');
  const [reviewLanguage, setReviewLanguage] = useState(business?.language || 'en');
  const [copied, setCopied] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  // Parse business products or fallback to category presets
  let businessProducts = [];
  if (Array.isArray(business?.top_selling_items)) {
    businessProducts = business.top_selling_items;
  } else if (typeof business?.top_selling_items === 'string' && business.top_selling_items.trim()) {
    try {
      const parsed = JSON.parse(business.top_selling_items);
      if (Array.isArray(parsed)) businessProducts = parsed;
    } catch (e) {
      businessProducts = business.top_selling_items.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  const defaultCategoryProducts = getCategoryDefaultProducts(business?.category);
  const availableProducts = businessProducts.length > 0 ? businessProducts : defaultCategoryProducts;

  // GPS Location state
  const [detectedLocation, setDetectedLocation] = useState(business?.business_location || '');
  const [isLocating, setIsLocating] = useState(false);

  // Find category details
  const categoryObj = BUSINESS_CATEGORIES.find(c => c.id === business.category) || BUSINESS_CATEGORIES.find(c => c.id === 'others') || BUSINESS_CATEGORIES[0];
  const chipsList = categoryObj.chips;

  // Toggle Chip selection
  const toggleChip = (chip) => {
    if (selectedChips.includes(chip)) {
      setSelectedChips(selectedChips.filter(c => c !== chip));
    } else {
      setSelectedChips([...selectedChips, chip]);
    }
  };

  // Toggle Product selection
  const toggleProduct = (prod) => {
    if (selectedProducts.includes(prod)) {
      setSelectedProducts(selectedProducts.filter(p => p !== prod));
    } else {
      setSelectedProducts([...selectedProducts, prod]);
    }
  };

  // Auto-detect GPS Location on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            if (res.ok) {
              const data = await res.json();
              const cityFound = data.city || data.locality || data.principalSubdivision || '';
              if (cityFound) {
                setDetectedLocation(cityFound);
              }
            }
          } catch (err) {
            console.warn('Geolocation reverse geocoding error:', err);
          } finally {
            setIsLocating(false);
          }
        },
        (error) => {
          console.warn('Geolocation access not granted or unavailable:', error.message);
          setIsLocating(false);
        },
        { timeout: 8000, maximumAge: 300000, enableHighAccuracy: false }
      );
    }
  }, []);

  // Auto-generate AI review when rating, chips, selectedProducts, tone, or detected location change
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const activeLoc = detectedLocation || business?.business_location || '';

      // Clean target keywords: replace any literal [Your City] with detected city or strip it cleanly
      let cleanKeywords = (business?.target_keywords || '');
      if (activeLoc) {
        cleanKeywords = cleanKeywords.replace(/\[(?:Your\s*)?(?:City|Location|Area)\]/gi, activeLoc);
      } else {
        cleanKeywords = cleanKeywords.replace(/\s*(?:in|at|around)?\s*\[(?:Your\s*)?(?:City|Location|Area)\]/gi, '');
      }

      const result = await generateReviewBackend({
        businessName: business.name,
        category: business.category,
        rating,
        topics: selectedChips,
        selectedProducts,
        allProducts: availableProducts,
        instructions: tone + ' tone. Keywords: ' + cleanKeywords,
        language: reviewLanguage || business?.language || 'en',
        location: activeLoc,
        city: activeLoc,
        business_id: business.id
      });

      // Extra client-side safety guarantee: ensure no bracketed placeholders remain in the review
      let sanitizedResult = (result || '');
      if (activeLoc) {
        sanitizedResult = sanitizedResult.replace(/\[(?:Your\s*)?(?:City|Location|Area)\]/gi, activeLoc);
      } else {
        sanitizedResult = sanitizedResult.replace(/\s*(?:in|at|around)?\s*\[(?:Your\s*)?(?:City|Location|Area)\]/gi, '');
      }
      sanitizedResult = sanitizedResult.replace(/\[.*?\]/g, '').replace(/\s{2,}/g, ' ').trim();

      setReviewText(sanitizedResult);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    handleGenerate();
  }, [rating, selectedChips, selectedProducts, tone, detectedLocation, reviewLanguage]);

  // Record scan on mount
  useEffect(() => {
    if (business?.id) {
      recordScan(business.id).catch(console.error);
    }
  }, [business?.id]);

  // Handle Copy & Redirect to Google Review page
  const handleCopyAndGoToGoogle = () => {
    // Copy text to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(reviewText);
    }
    setCopied(true);

    // Fire festive celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Reset copied toast state after 3s
    setTimeout(() => setCopied(false), 4000);

    setTimeout(() => {
      let finalUrl = business.google_review_url;
      if (finalUrl && finalUrl.startsWith('ChIJ')) {
        finalUrl = `https://search.google.com/local/writereview?placeid=${finalUrl}`;
      } else if (!finalUrl) {
        finalUrl = `https://search.google.com/local/writereview?placeid=${business.google_place_id}`;
      }
      window.open(finalUrl, '_blank');

      // Record Google Review click in backend
      if (business?.id) {
        recordGoogleReview(business.id).catch(console.error);
      }

      // Trigger UPI Payment Screen if configured
      if (business.upi_id) {
        setTimeout(() => {
          setShowPayment(true);
        }, 800);
      }
    }, 600);
  };

  // Handle Private 1-3 star feedback submission
  const handleSubmitPrivateFeedback = async (e) => {
    e.preventDefault();
    setIsSubmittingFeedback(true);
    setFeedbackError(null);

    const safeMessage = reviewText && reviewText.trim() ? reviewText.trim() : 'Customer left feedback without comments.';
    const finalCustomerName = customerName && customerName.trim() ? customerName.trim() : 'Anonymous Customer';
    const finalCustomerContact = customerContact && customerContact.trim() ? customerContact.trim() : 'N/A';

    const newFeedback = {
      id: `fb_${Date.now()}`,
      business_id: business?.id,
      date: new Date().toLocaleString(),
      rating,
      customerName: finalCustomerName,
      customerContact: finalCustomerContact,
      customer_name: finalCustomerName,
      customer_contact: finalCustomerContact,
      chips: selectedChips,
      product: selectedProducts.join(', '),
      products: selectedProducts,
      message: safeMessage,
      status: 'Unresolved'
    };

    try {
      if (onAddInternalFeedback) {
        await onAddInternalFeedback(newFeedback);
      }
      setFeedbackSubmitted(true);
    } catch (err) {
      console.error('Failed to submit private feedback:', err);
      setFeedbackError('Could not send feedback. Please try again.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  if (showPayment) {
    const upiUrl = `upi://pay?pa=${encodeURIComponent(business.upi_id)}&pn=${encodeURIComponent(business.name)}&cu=INR`;
    return (
      <div className="min-h-screen bg-slate-950 p-4 sm:p-6 md:p-8 flex items-center justify-center font-sans text-slate-100 relative overflow-x-hidden">
        {/* Background Decorative Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-72 bg-gradient-to-b from-emerald-500/20 via-indigo-600/10 to-transparent blur-3xl pointer-events-none -z-10" />
        
        <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl relative">
          {/* Header */}
          <div className="p-6 sm:p-8 text-center border-b border-slate-800 relative bg-gradient-to-r from-emerald-600/20 via-indigo-600/10 to-slate-900">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl overflow-hidden border-2 border-emerald-400/40 shadow-lg shadow-emerald-500/10 bg-slate-800 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Review Copied!</h1>
            <p className="text-sm text-slate-400 mt-2">Thank you! You can now complete your payment below.</p>
          </div>

          {/* QR Code Section */}
          <div className="p-6 sm:p-8 flex flex-col items-center text-center">
            <div className="bg-white p-4 rounded-3xl shadow-lg border-4 border-slate-100 flex items-center justify-center">
              <QRCodeSVG 
                value={upiUrl} 
                size={220}
                level="M"
                includeMargin={false}
              />
            </div>
            <p className="text-slate-300 font-bold mt-6 tracking-wide">Scan to Pay via any UPI App</p>
            <div className="flex items-center gap-4 mt-4 opacity-60">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">GPay</span>
              <span className="w-1 h-1 rounded-full bg-slate-700"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">PhonePe</span>
              <span className="w-1 h-1 rounded-full bg-slate-700"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Paytm</span>
            </div>

            <a 
              href={upiUrl}
              className="mt-8 w-full py-4 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <QrCode className="w-5 h-5" />
              Pay via UPI App Now
            </a>
            <button 
              onClick={() => setShowPayment(false)}
              className="mt-4 text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-3 sm:p-6 font-sans relative overflow-x-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-72 bg-gradient-to-b from-amber-500/20 via-indigo-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Main Container Simulated Mobile Frame */}
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden my-auto transition-all">
        
        {/* Business Header & Branding Banner */}
        <div className="relative bg-gradient-to-r from-amber-600/25 via-purple-600/15 to-slate-900 px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl overflow-hidden border border-amber-400/40 shadow-md shadow-amber-500/10 bg-slate-800 flex items-center justify-center text-base font-black text-amber-400 shrink-0">
              {business.logo_url ? (
                <img src={business.logo_url} alt={business.name} className="w-full h-full object-cover" />
              ) : (
                business.name.substring(0, 2).toUpperCase()
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-base font-black text-white tracking-tight truncate max-w-[210px] sm:max-w-[250px]">
                  {business.name}
                </h1>
                <span className="inline-flex items-center gap-0.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                  <ShieldCheck className="w-3 h-3 text-amber-400" /> Verified
                </span>
              </div>

              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                {business.tagline && <span className="truncate max-w-[140px] text-slate-400 text-[11px]">{business.tagline}</span>}
                {(detectedLocation || isLocating) && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60">
                    <MapPin className="w-2.5 h-2.5 text-rose-400 shrink-0" />
                    <span className="truncate max-w-[90px]">{isLocating && !detectedLocation ? 'Locating...' : detectedLocation}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {business.offer_banner && (
            <div className="mt-2 text-[11px] bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-lg py-1 px-2.5 font-medium flex items-center justify-between">
              <span className="truncate">{business.offer_banner}</span>
              <span className="text-[9px] uppercase tracking-wider font-bold bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded ml-2 shrink-0">Promo</span>
            </div>
          )}
        </div>

        {/* Step 1: Star Rating Selector & Review Controls */}
        <div className="p-3.5 sm:p-5 space-y-3">
          <div className="text-center space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="font-bold uppercase tracking-wider text-[10px]">Your Rating</span>
              <div className="text-xs font-bold">
                {rating === 5 && <span className="text-emerald-400">🌟 5-Star Experience</span>}
                {rating === 4 && <span className="text-emerald-400">😊 Great (4 Stars)</span>}
                {rating === 3 && <span className="text-amber-400">😐 Good (3 Stars)</span>}
                {rating <= 2 && <span className="text-rose-400">🙏 Needs Improvement</span>}
              </div>
            </div>

            {/* Interactive Stars */}
            <div className="flex justify-center items-center gap-1.5 pt-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-amber-400 transition-transform duration-150 transform hover:scale-125 focus:outline-none"
                  aria-label={`Rate ${star} star`}
                >
                  <Star
                    className={`w-7 h-7 sm:w-8 sm:h-8 ${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                        : 'text-slate-700 fill-slate-800'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: What did you purchase or experience today? (Compact Swipe Ribbon / Expander) */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-amber-400" />
                What did you get?
              </span>

              <div className="flex items-center gap-1.5">
                {selectedProducts.length > 0 && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold px-2 py-0.5 rounded-full">
                    {selectedProducts.length} selected
                  </span>
                )}
                {availableProducts.length > 4 && (
                  <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-0.5 transition-colors"
                  >
                    {isExpanded ? 'Collapse' : `All (${availableProducts.length})`}
                    <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
            </div>

            {/* Optional search when expanded */}
            {isExpanded && availableProducts.length > 5 && (
              <div className="relative">
                <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Filter products/services..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-7 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                {productSearch && (
                  <button 
                    onClick={() => setProductSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {/* Products Ribbon: Single-row horizontal swipe when collapsed, compact scroll when expanded */}
            <div className={isExpanded 
              ? "flex flex-wrap gap-1.5 max-h-44 overflow-y-auto no-scrollbar pr-1 pt-1 border-t border-slate-800/60" 
              : "flex gap-1.5 overflow-x-auto no-scrollbar py-1 snap-x scroll-smooth"
            }>
              {(isExpanded 
                ? (productSearch.trim() ? availableProducts.filter(p => p.toLowerCase().includes(productSearch.toLowerCase())) : availableProducts)
                : availableProducts
              ).map((prod) => {
                const isSelected = selectedProducts.includes(prod);
                return (
                  <button
                    key={prod}
                    type="button"
                    onClick={() => toggleProduct(prod)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 border shrink-0 text-left flex items-center gap-1.5 snap-start ${
                      isSelected
                        ? rating >= 4
                          ? 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-md shadow-amber-500/15'
                          : 'bg-rose-500/25 border-rose-400 text-rose-200 shadow-md shadow-rose-500/15'
                        : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {isSelected ? <Check className="w-3 h-3 text-amber-400 shrink-0" /> : <Tag className="w-2.5 h-2.5 text-slate-500 shrink-0" />}
                    <span className="truncate max-w-[160px]">{prod}</span>
                  </button>
                );
              })}

              {/* Custom item button */}
              {!showCustomProductInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomProductInput(true)}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-medium border border-dashed border-slate-700 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3 h-3" /> Other
                </button>
              ) : (
                <div className="flex items-center gap-1.5 shrink-0">
                  <input
                    type="text"
                    value={customProductInput}
                    onChange={(e) => setCustomProductInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (customProductInput.trim()) {
                          toggleProduct(customProductInput.trim());
                          setCustomProductInput('');
                          setShowCustomProductInput(false);
                        }
                      }
                    }}
                    placeholder="Item name..."
                    className="w-28 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-amber-400"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customProductInput.trim()) {
                        toggleProduct(customProductInput.trim());
                        setCustomProductInput('');
                      }
                      setShowCustomProductInput(false);
                    }}
                    className="px-2 py-1 bg-amber-500 text-slate-950 text-xs font-bold rounded-lg"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCustomProductInput(false)}
                    className="p-1 text-slate-400 hover:text-slate-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Active Selected Feedback Hint */}
            {selectedProducts.length > 0 && (
              <div className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 truncate">
                  <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="truncate">Review focused on: <strong>{selectedProducts.join(', ')}</strong></span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setSelectedProducts([])}
                  className="text-[10px] text-slate-400 hover:text-rose-400 shrink-0 font-medium underline"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Step 3: What stood out? Feature Chips (Horizontal Swipeable Ribbon) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {rating >= 4 ? 'What stood out?' : 'Areas to improve?'}
              </span>
              <span className="text-[10px] text-slate-500">Swipe to view more</span>
            </div>

            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5 snap-x">
              {chipsList.map((chip) => {
                const isSelected = selectedChips.includes(chip);
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => toggleChip(chip)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-150 border shrink-0 snap-start ${
                      isSelected
                        ? rating >= 4
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-xs'
                          : 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-xs'
                        : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                    }`}
                  >
                    {chip} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: AI Review Assistant Generator Box */}
          <div className="bg-slate-950/70 rounded-2xl border border-slate-800 p-4 space-y-3 relative shadow-inner">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-400 min-w-0">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">
                  {rating >= 4 
                    ? (selectedProducts.length > 0 
                        ? `AI Review: ${selectedProducts.slice(0, 2).join(', ')}${selectedProducts.length > 2 ? ` +${selectedProducts.length - 2}` : ''}` 
                        : 'AI Google Review Assistant') 
                    : (selectedProducts.length > 0 
                        ? `Private Feedback: ${selectedProducts.slice(0, 2).join(', ')}` 
                        : 'AI Internal Feedback Drafter')}
                </span>
              </div>
            </div>

            {/* Language & Tone Selection Ribbon */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
              {/* Language Switcher */}
              <div className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {[
                  { code: 'en', label: 'English' },
                  { code: 'or', label: 'Odia (ଓଡ଼ିଆ)' },
                  { code: 'hi', label: 'Hindi' }
                ].map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setReviewLanguage(l.code)}
                    className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition-all ${
                      reviewLanguage === l.code
                        ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 shadow-sm'
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              {/* Tone Selection Pills */}
              <div className="flex items-center gap-1 shrink-0">
                {['Enthusiastic', 'Short & Sweet', 'Detailed'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition-all ${
                      tone === t 
                        ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 shadow-sm' 
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Generated Review Textarea - Expanded for complete readability */}
            <div className="relative">
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={5}
                className="w-full min-h-[145px] bg-slate-900/95 border border-slate-700/80 focus:border-amber-500/70 rounded-xl p-3.5 text-sm sm:text-base leading-relaxed text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 resize-y transition-all shadow-inner"
                placeholder="Generating tailored review..."
              />
            </div>

            {/* Textarea Bottom Controls: Clear status + Non-overlapping Regenerate button */}
            <div className="flex items-center justify-between pt-0.5">
              <span className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1.5">
                {isGenerating ? (
                  <span className="text-amber-400 flex items-center gap-1 font-medium">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Drafting custom review...
                  </span>
                ) : (
                  <span>✏️ You can edit the text before copying</span>
                )}
              </span>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:text-white bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/40 rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50"
                title="Regenerate review"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin text-amber-400' : 'text-amber-400'}`} />
                <span>Regenerate</span>
              </button>
            </div>
          </div>

          {/* Step 5: Action Buttons (Gated based on Rating) */}
          {rating >= 4 ? (
            /* 4-5 STAR FLOW: COPY & POST TO GOOGLE */
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleCopyAndGoToGoogle}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 group"
              >
                <Copy className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
                <span>Copy & Post to Google Reviews</span>
                <ExternalLink className="w-4 h-4 text-slate-950 ml-1" />
              </button>

              {copied && (
                <div className="p-2 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-center text-xs text-emerald-300 flex items-center justify-center gap-1.5 animate-bounce">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Review copied! Opening Google Review page...
                </div>
              )}

              <p className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-400" /> 1-Tap Copy auto-opens Google Business listing.
              </p>
            </div>
          ) : (
            /* 1-3 STAR FLOW: PRIVATE INTERNAL FEEDBACK FORM */
            <div>
              {feedbackSubmitted ? (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-center space-y-3">
                  <MessageSquareHeart className="w-10 h-10 text-amber-400 mx-auto" />
                  <h3 className="text-base font-bold text-white">Thank You for Helping Us Improve</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Your message has been sent directly to <strong className="text-white">{business.owner_name || 'Management'}</strong>. We take every comment seriously and appreciate your honest feedback.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitPrivateFeedback} className="space-y-3">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2.5 text-xs text-amber-300">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Direct Manager Communication:</strong> This note goes directly to owner {business.owner_name || 'Management'} to ensure your concerns are handled personally.
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Your Name (Optional)"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                    />
                    <input
                      type="text"
                      placeholder="Email or Phone (Optional)"
                      value={customerContact}
                      onChange={(e) => setCustomerContact(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  {feedbackError && (
                    <div className="p-2.5 bg-rose-500/20 border border-rose-500/40 rounded-xl text-center text-xs text-rose-300">
                      {feedbackError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingFeedback}
                    className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold text-xs border border-amber-500/30 shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingFeedback ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                        <span>Sending Feedback to Owner...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Private Feedback to Owner</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950/80 px-6 py-3 border-t border-slate-800/80 text-center text-[10px] text-slate-500">
          Powered by <strong className="text-slate-400">ReviewPulse AI System</strong> • Helping businesses grow.
        </div>
      </div>
    </div>
  );
}
