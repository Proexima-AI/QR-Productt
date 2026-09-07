import React, { useState, useEffect } from 'react';
import { Star, Sparkles, Copy, ExternalLink, Send, ShieldCheck, CheckCircle2, MessageSquareHeart, RefreshCw, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateReviewBackend } from '../services/apiService';
import { BUSINESS_CATEGORIES } from './BusinessPresets';

export default function CustomerReviewPage({ business, onAddInternalFeedback }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedChips, setSelectedChips] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tone, setTone] = useState('Enthusiastic');
  const [copied, setCopied] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Find category details
  const categoryObj = BUSINESS_CATEGORIES.find(c => c.id === business.category) || BUSINESS_CATEGORIES[0];
  const chipsList = categoryObj.chips;

  // Toggle Chip selection
  const toggleChip = (chip) => {
    if (selectedChips.includes(chip)) {
      setSelectedChips(selectedChips.filter(c => c !== chip));
    } else {
      setSelectedChips([...selectedChips, chip]);
    }
  };

  // Auto-generate AI review when rating, chips, or tone change
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateReviewBackend({
        businessName: business.name,
        category: business.category,
        rating,
        topics: selectedChips,
        instructions: tone + ' tone. Keywords: ' + (business.targetKeywords || '')
      });
      setReviewText(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    handleGenerate();
  }, [rating, selectedChips, tone]);

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

    // Open direct Google Review Link
    setTimeout(() => {
      window.open(business.googleReviewUrl || `https://search.google.com/local/writereview?placeid=${business.googlePlaceId}`, '_blank');
    }, 600);
  };

  // Handle Private 1-3 star feedback submission
  const handleSubmitPrivateFeedback = (e) => {
    e.preventDefault();
    const newFeedback = {
      id: `fb_${Date.now()}`,
      date: new Date().toLocaleString(),
      rating,
      customerName: customerName || 'Anonymous Customer',
      customerContact: customerContact || 'N/A',
      chips: selectedChips,
      message: reviewText,
      status: 'Unresolved'
    };

    if (onAddInternalFeedback) {
      onAddInternalFeedback(newFeedback);
    }
    setFeedbackSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-3 sm:p-6 font-sans relative overflow-x-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-72 bg-gradient-to-b from-amber-500/20 via-indigo-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Main Container Simulated Mobile Frame */}
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden my-auto transition-all">
        
        {/* Business Header & Branding Banner */}
        <div className="relative bg-gradient-to-r from-amber-600/30 via-purple-600/20 to-slate-900 p-6 text-center border-b border-slate-800">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full px-3 py-1 text-xs font-semibold text-amber-400 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> Official Review Assistant
          </div>

          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-lg shadow-amber-500/10 bg-slate-800 flex items-center justify-center text-2xl font-bold text-amber-400">
            {business.logoUrl ? (
              <img src={business.logoUrl} alt={business.name} className="w-full h-full object-cover" />
            ) : (
              business.name.substring(0, 2).toUpperCase()
            )}
          </div>

          <h1 className="text-xl font-bold text-white tracking-tight">{business.name}</h1>
          <p className="text-xs text-slate-400 mt-1">{business.tagline}</p>

          {business.offerBanner && (
            <div className="mt-3 text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl py-1.5 px-3 font-medium animate-pulse">
              {business.offerBanner}
            </div>
          )}
        </div>

        {/* Step 1: Star Rating Selector */}
        <div className="p-5 sm:p-6 space-y-6">
          <div className="text-center space-y-2">
            <label className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              How was your experience today?
            </label>

            {/* Interactive Stars */}
            <div className="flex justify-center items-center gap-2 pt-1">
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
                    className={`w-9 h-9 ${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                        : 'text-slate-700 fill-slate-800'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Dynamic Sentiment Status Label */}
            <div className="text-xs font-semibold h-5">
              {rating === 5 && <span className="text-emerald-400">🌟 Outstanding! We love to hear it.</span>}
              {rating === 4 && <span className="text-emerald-400">😊 Great! Thank you so much.</span>}
              {rating === 3 && <span className="text-amber-400">😐 Good. Help us make it a 5-star next time.</span>}
              {rating <= 2 && <span className="text-rose-400">🙏 We apologize for falling short.</span>}
            </div>
          </div>

          {/* Step 2: What stood out? Feature Chips */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {rating >= 4 ? 'What did you enjoy most?' : 'What needed improvement?'}
              </span>
              <span className="text-[10px] text-slate-500">Tap to select</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {chipsList.map((chip) => {
                const isSelected = selectedChips.includes(chip);
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => toggleChip(chip)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                      isSelected
                        ? rating >= 4
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10'
                          : 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-md shadow-rose-500/10'
                        : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                    }`}
                  >
                    {chip} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: AI Review Assistant Generator Box */}
          <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-4 space-y-3 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                <Sparkles className="w-4 h-4 animate-spin-slow" />
                {rating >= 4 ? 'AI Google Review Assistant' : 'AI Internal Feedback Drafter'}
              </div>

              {/* Tone Selection Pills */}
              <div className="flex gap-1">
                {['Enthusiastic', 'Short & Sweet', 'Detailed'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                      tone === t ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40' : 'text-slate-500 hover:text-slate-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Generated Review Textarea */}
            <div className="relative">
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 resize-none transition-all"
                placeholder="Generating review..."
              />

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="absolute bottom-3 right-3 p-1.5 text-slate-400 hover:text-amber-400 bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-colors"
                title="Regenerate review"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin text-amber-400' : ''}`} />
              </button>
            </div>

            <p className="text-[11px] text-slate-500 text-right">
              ✏️ Feel free to edit or personalize any text above.
            </p>
          </div>

          {/* Step 4: Action Buttons (Gated based on Rating) */}
          {rating >= 4 ? (
            /* 4-5 STAR FLOW: COPY & POST TO GOOGLE */
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleCopyAndGoToGoogle}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 group"
              >
                <Copy className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
                <span>Copy & Post to Google Reviews</span>
                <ExternalLink className="w-4 h-4 text-slate-950 ml-1" />
              </button>

              {copied && (
                <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-center text-xs text-emerald-300 flex items-center justify-center gap-2 animate-bounce">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Review copied! Opening Google Review page...
                </div>
              )}

              <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> 1-Tap Copy auto-opens Google Business listing.
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
                    Your message has been sent directly to <strong className="text-white">{business.ownerName || 'Management'}</strong>. We take every comment seriously and appreciate your honest feedback.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitPrivateFeedback} className="space-y-3">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2.5 text-xs text-amber-300">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Direct Manager Communication:</strong> This note goes directly to owner {business.ownerName} to ensure your concerns are handled personally.
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

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold text-xs border border-amber-500/30 shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Private Feedback to Owner</span>
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
