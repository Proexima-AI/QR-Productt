import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Sparkles, QrCode, TrendingUp, Zap, Server, ChevronRight, Star, ArrowRight, BarChart3, MessageSquareText, CheckCircle2, Mail, Phone, MapPin, PlayCircle, Users, Rocket, Check, User, Share2, ArrowUpRight, ChevronDown, MessageCircleQuestion } from 'lucide-react';
import fullImage from '../assets/new review image.png';
import faqImage from '../assets/faq.png';

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { question: "How does the review request process work?", answer: "After registering, you'll get a QR code you can display in your store or share with anyone. When a customer scans it, a page opens where they choose a star rating. Based on that rating, an AI-generated review is created — customers can keep regenerating until they're happy with the wording. Once satisfied, they tap 'Copy & Continue,' which copies the review and redirects them to your Google review page with the text auto-filled. They just click submit, and the review is posted." },
    { question: "Are the reviews authentic?", answer: "Yes. All reviews are left by your actual customers on their own Google accounts. We simply make the process easier for them to leave a review." },
    { question: "Can I get notified when I receive a new review?", answer: "Absolutely. New reviews show up in your dashboard in real time so you always know when one comes in." },
    { question: "Is there a free trial?", answer: "Yes! We offer a 7-day free trial on all of our plans so you can test the platform and see the results for yourself before committing." },
    { question: "What payment methods do you accept?", answer: "We accept UPI, bank transfers, and Razorpay — including for annual plans. Your payment is processed securely through our payment gateway." },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col overflow-x-hidden">

      {/* Navbar */}
      <nav className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1400px] z-50 transition-all duration-500 rounded-full border ${scrolled ? 'bg-[#0A39AB]/60 backdrop-blur-md border-white/20 shadow-md' : 'bg-[#0A39AB] border-transparent shadow-lg'}`}>
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('home')}>
            <Star className="w-8 h-8 text-white fill-white" />
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">Review<span className="text-white/80">Boost</span></span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            <button onClick={() => scrollToSection('home')} className="text-sm font-medium text-white hover:text-white/80 transition-colors">Home</button>
            <button onClick={() => scrollToSection('about')} className="text-sm font-medium text-white hover:text-white/80 transition-colors">About</button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-sm font-medium text-white hover:text-white/80 transition-colors">How it Works</button>
            <button onClick={() => scrollToSection('pricing')} className="text-sm font-medium text-white hover:text-white/80 transition-colors">Pricing</button>
            <button onClick={() => navigate('/contact')} className="text-sm font-medium text-white hover:text-white/80 transition-colors">Contact Us</button>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => navigate('/login')} className="hidden sm:flex items-center gap-2 text-sm font-medium text-white hover:text-white/80 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              Login
            </button>
            <button onClick={() => navigate('/signup')} className="text-sm font-semibold bg-white text-[#0A39AB] px-5 sm:px-6 py-2 sm:py-2.5 rounded-full hover:bg-slate-50 transition-colors">
              Get Started
            </button>

            {/* Mobile Menu Toggle */}
            <button className="lg:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-[calc(100%+0.5rem)] left-0 w-full bg-[#0A39AB] rounded-2xl py-4 px-6 flex flex-col gap-4 shadow-xl">
            <button onClick={() => scrollToSection('home')} className="text-left text-base font-semibold text-white hover:text-white/80">Home</button>
            <button onClick={() => scrollToSection('about')} className="text-left text-base font-semibold text-white hover:text-white/80">About</button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-left text-base font-semibold text-white hover:text-white/80">How it Works</button>
            <button onClick={() => scrollToSection('pricing')} className="text-left text-base font-semibold text-white hover:text-white/80">Pricing</button>
            <button onClick={() => { navigate('/contact'); setMobileMenuOpen(false); }} className="text-left text-base font-semibold text-white hover:text-white/80">Contact Us</button>
            <hr className="border-white/20" />
            <button onClick={() => navigate('/login')} className="text-left text-base font-semibold text-white hover:text-white/80">Client Login</button>
          </div>
        )}
      </nav>
      <main className="flex-1 flex flex-col items-center justify-start z-20 pt-[104px] sm:pt-32 pb-0 px-4">

        {/* Hero Section */}
        <div id="home" className="w-full max-w-[1400px] mx-auto text-left relative mt-2 sm:mt-4 scroll-mt-32 px-2 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-12">

          {/* Decorative Corner Blobs */}
          <div className="absolute -bottom-10 -right-10 w-[500px] h-[400px] bg-blue-300/30 rounded-[100%] blur-[100px] -z-10 pointer-events-none"></div>

          {/* Left side text content */}
          <div className="w-full md:w-1/2 flex flex-col items-start z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-xs font-bold text-indigo-600 mb-6 border border-indigo-100">
              <Rocket className="w-4 h-4 text-indigo-600 fill-indigo-600" /> Grow Your Business
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-5xl font-serif font-extrabold tracking-tight mb-6 leading-[1.1] text-slate-900">
              Turn Happy Customers <br /> into <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Google Reviews, </span>
              automatically.
            </h1>

            <p className="text-lg md:text-xl font-bold text-slate-600 mb-10 leading-relaxed max-w-xl">
              Scan the QR code, choose your star rating, get a ready-to-use review, and share it on Google in just a few taps.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-start gap-4 mb-12 w-full">
              <button
                onClick={() => navigate('/signup')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30"
              >
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white border-2 border-indigo-200 text-slate-700 font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                <PlayCircle className="w-6 h-6 text-indigo-600 fill-indigo-600/20" /> Watch Demo
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 mt-2">
              {/* Item 1 */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center shrink-0 shadow-sm shadow-emerald-400/30">
                  <Zap className="w-5 h-5 text-white fill-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800">Simple Setup</span>
                  <span className="text-xs text-slate-500 font-medium">Get started in minutes</span>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-8 bg-slate-200"></div>

              {/* Item 2 */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/30">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800">100% Secure</span>
                  <span className="text-xs text-slate-500 font-medium">Your data is safe</span>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-8 bg-slate-200"></div>

              {/* Item 3 */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-400 flex items-center justify-center shrink-0 shadow-sm shadow-purple-400/30">
                  <Users className="w-5 h-5 text-white fill-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800">Real Customer Reviews</span>
                  <span className="text-xs text-slate-500 font-medium">Build trust & grow faster</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side image */}
          <div className="w-full md:w-1/2 relative mt-10 md:mt-0">
            <img src={fullImage} alt="Dashboard Design" className="w-full h-auto object-contain md:scale-[1.40] lg:scale-[1.35] transform translate-x-4 lg:translate-x-16 origin-right" />
          </div>
        </div>

        {/* About Section */}
        <div id="about" className="w-full max-w-[1400px] mx-auto px-6 mt-32 scroll-mt-24">
          <div className="bg-indigo-600 rounded-[2.5rem] px-8 py-12 md:px-16 md:py-16 text-white relative overflow-hidden shadow-2xl shadow-indigo-600/30">
            {/* Top Right Circular Shape */}
            <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-white/5 rounded-full pointer-events-none" />
            <div className="relative z-10 grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-16 items-center">
              <div className="flex flex-col items-start md:pr-8">
                <span className="text-white/80 text-sm font-bold uppercase tracking-wider mb-4 block">
                  Our Mission
                </span>
                <h2 className="text-3xl md:text-5xl font-serif font-extrabold mb-6 leading-tight text-white">We help good businesses get the reputation they've earned.</h2>
                <p className="text-white/90 text-lg leading-relaxed mb-8">
                  A single unfair review can outweigh years of good service. ReviewBoost makes it easy for satisfied customers to speak up, and routes private feedback to you first — so small issues get fixed before they become public ones.
                </p>
                <button className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold transition-colors shadow-sm">
                  Learn more
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col justify-center shadow-lg shadow-black/5 transition-transform hover:-translate-y-1">
                  <span className="text-3xl font-black text-white block mb-1">3.1x</span>
                  <span className="text-white/80 text-sm font-medium">average increase in review volume</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col justify-center shadow-lg shadow-black/5 transition-transform hover:-translate-y-1">
                  <span className="text-3xl font-black text-white block mb-1">6,300+</span>
                  <span className="text-white/80 text-sm font-medium">local businesses using ReviewBoost</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col justify-center shadow-lg shadow-black/5 transition-transform hover:-translate-y-1">
                  <span className="text-3xl font-black text-white block mb-1">10 min</span>
                  <span className="text-white/80 text-sm font-medium">typical setup time, no developer needed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How it Works Section */}
        <div id="how-it-works" className="w-full max-w-6xl mx-auto mt-32 scroll-mt-24 px-4">
          <div className="text-center mb-16 flex flex-col items-center">
            <div className="bg-blue-50 text-blue-500 font-bold px-4 py-1.5 rounded-full text-xs mb-4 tracking-wider uppercase border border-blue-100">
              Simple Process
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-extrabold mb-4 text-[#0B1A30] tracking-tight">How It Works</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Get more Google reviews in just 3 easy steps.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-6 lg:gap-10">

            {/* Step 1 */}
            <div className="flex flex-col items-center text-center max-w-[280px]">
              <div className="relative w-48 h-48 rounded-full bg-[#E8F8EE] flex items-center justify-center mb-8">
                {/* Decorative dashes */}
                <div className="absolute top-10 left-6 w-2.5 h-1.5 bg-[#10B981] rounded-full rotate-45 opacity-60"></div>
                <div className="absolute top-1/2 -left-3 w-2.5 h-1.5 bg-[#10B981] rounded-full opacity-60"></div>
                <div className="absolute bottom-12 right-6 w-2.5 h-1.5 bg-[#10B981] rounded-full -rotate-45 opacity-60"></div>

                {/* Clipboard */}
                <div className="w-24 h-32 bg-white border-[3px] border-[#10B981] rounded-2xl flex flex-col items-center pt-5 pb-3 px-3 shadow-sm relative z-10">
                  <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center mb-3">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="w-14 h-2 bg-[#E8F8EE] rounded-full mb-1.5"></div>
                  <div className="w-12 h-2 bg-[#E8F8EE] rounded-full mb-auto"></div>
                  <div className="w-full py-1.5 bg-[#10B981] text-[9px] font-bold text-white rounded-md uppercase tracking-wider">
                    Sign Up
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-2 right-4 w-10 h-10 bg-[#10B981] rounded-full border-[3px] border-white flex items-center justify-center z-20 shadow-sm">
                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                </div>

                {/* Number */}
                <div className="absolute -bottom-2 left-6 w-12 h-12 bg-[#10B981] rounded-full border-[3px] border-white flex items-center justify-center text-white font-black text-2xl z-20 shadow-sm">
                  1
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0B1A30]">Create Your Account</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Sign up in minutes and set up your business details.
              </p>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex mb-16">
              <ArrowRight className="w-6 h-6 text-slate-400" />
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center max-w-[280px]">
              <div className="relative w-48 h-48 rounded-full bg-[#EBF3FF] flex items-center justify-center mb-8">
                {/* Decorative dashes */}
                <div className="absolute top-10 left-6 w-2.5 h-1.5 bg-[#2563EB] rounded-full rotate-45 opacity-60"></div>
                <div className="absolute top-1/2 -left-3 w-2.5 h-1.5 bg-[#2563EB] rounded-full opacity-60"></div>
                <div className="absolute bottom-12 right-6 w-2.5 h-1.5 bg-[#2563EB] rounded-full -rotate-45 opacity-60"></div>

                {/* QR Square */}
                <div className="w-24 h-24 bg-white border-[3px] border-[#2563EB] rounded-2xl flex items-center justify-center shadow-sm relative z-10 -rotate-3">
                  <QrCode className="w-14 h-14 text-[#2563EB]" />
                </div>

                {/* Badges */}
                <div className="absolute top-2 right-8 w-10 h-10 bg-[#2563EB] rounded-full border-[3px] border-white flex items-center justify-center z-20 shadow-sm">
                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                </div>
                <div className="absolute bottom-6 -right-2 w-12 h-12 bg-[#2563EB] rounded-full border-[3px] border-white flex items-center justify-center z-20 shadow-sm">
                  <Share2 className="w-5 h-5 text-white" fill="currentColor" />
                </div>

                {/* Number */}
                <div className="absolute -bottom-2 left-6 w-12 h-12 bg-[#2563EB] rounded-full border-[3px] border-white flex items-center justify-center text-white font-black text-2xl z-20 shadow-sm">
                  2
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0B1A30]">Generate Your QR</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Generate your unique QR Code in just a few click and send your QR or display in store.
              </p>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex mb-16">
              <ArrowRight className="w-6 h-6 text-slate-400" />
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center max-w-[280px]">
              <div className="relative w-48 h-48 rounded-full bg-[#F4ECFF] flex items-center justify-center mb-8">
                {/* Decorative dashes */}
                <div className="absolute top-10 left-6 w-2.5 h-1.5 bg-[#9333EA] rounded-full rotate-45 opacity-60"></div>
                <div className="absolute top-1/2 -left-3 w-2.5 h-1.5 bg-[#9333EA] rounded-full opacity-60"></div>
                <div className="absolute bottom-12 right-2 w-2.5 h-1.5 bg-[#9333EA] rounded-full -rotate-45 opacity-60"></div>

                {/* Content */}
                <div className="flex flex-col items-center justify-center z-10 relative mt-4">
                  <svg viewBox="0 0 24 24" className="w-16 h-16 mb-2">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <div className="flex gap-1.5">
                    <Star className="w-5 h-5 text-[#FBBC05] fill-[#FBBC05]" />
                    <Star className="w-5 h-5 text-[#FBBC05] fill-[#FBBC05]" />
                    <Star className="w-5 h-5 text-[#FBBC05] fill-[#FBBC05]" />
                    <Star className="w-5 h-5 text-[#FBBC05] fill-[#FBBC05]" />
                    <Star className="w-5 h-5 text-[#FBBC05] fill-[#FBBC05]" />
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-2 right-8 w-10 h-10 bg-[#9333EA] rounded-full border-[3px] border-white flex items-center justify-center z-20 shadow-sm">
                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                </div>

                {/* Number */}
                <div className="absolute -bottom-2 left-6 w-12 h-12 bg-[#9333EA] rounded-full border-[3px] border-white flex items-center justify-center text-white font-black text-2xl z-20 shadow-sm">
                  3
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0B1A30]">Get More Google Reviews</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Watch your reviews grow and your business thrive!
              </p>
            </div>

          </div>
        </div>

        {/* Pricing Section */}
        <div id="pricing" className="w-[calc(100%+2rem)] lg:w-[calc(100%+10vw)] xl:w-[100vw] flex flex-col items-center mt-32 py-24" style={{ background: 'radial-gradient(ellipse 900px 500px at 50% -10%, #cfeaff, transparent), linear-gradient(180deg, #eaf6ff 0%, #f7fbff 60%, #ffffff 100%)' }}>
          <div className="max-w-[1000px] mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-[2.75rem] font-serif font-extrabold mb-4 text-[#0B1A30] tracking-tight">Simple Pricing. More Reviews. More Growth.</h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-8">Choose a plan that fits your business. Start collecting more Google reviews today.</p>

              <div className="flex flex-col items-center justify-center">
                <span className="text-indigo-600 font-bold text-lg">Start with a 7-day free trial</span>
                <span className="text-slate-500 text-sm">No credit card required. Cancel anytime.</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch max-w-4xl mx-auto relative mt-8">

              {/* 6 Months Plan */}
              <div className="bg-slate-50/80 backdrop-blur-sm rounded-[2rem] p-3 md:p-3 border border-slate-200 flex flex-col shadow-sm">
                {/* Top Inner Box */}
                <div className="bg-white rounded-[1.5rem] p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100">
                  <h3 className="text-xl font-semibold text-slate-800 mb-6">6 Months</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-5xl font-bold text-[#0B1A30] tracking-tight">₹299</span>
                    <span className="text-slate-500 font-medium">/month</span>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed mb-1">
                    Billed as ₹1,794 for 6 months. Best for getting started.
                  </p>
                  <p className="text-slate-400 text-xs">
                    Plus ₹1,499 one-time setup fee + 18% GST
                  </p>
                </div>
                
                {/* Bottom Inner Box */}
                <div className="bg-white rounded-[1.5rem] p-8 mt-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col flex-1">
                  <h4 className="text-[#0B1A30] font-medium mb-6">Features included:</h4>
                  
                  <div className="space-y-4 mb-10">
                    {[
                      'Custom QR code design',
                      'Google Review collection',
                      'Customer review link',
                      'Review request tools',
                      'Basic business dashboard',
                      'Priority support',
                      '7 extra days FREE'
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" strokeWidth={2.5} />
                        <span className="text-slate-600 text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button onClick={() => navigate('/signup?plan=6m')} className="mt-auto w-full py-4 rounded-xl bg-[#1A2E4C] text-white font-semibold hover:bg-[#112036] transition-colors shadow-sm">
                    Start 7 Days Free Trial
                  </button>
                </div>
              </div>

              {/* 1 Year Plan */}
              <div className="bg-slate-50/80 backdrop-blur-sm rounded-[2rem] p-3 md:p-3 border border-slate-200 flex flex-col shadow-sm">
                {/* Top Inner Box */}
                <div className="bg-white rounded-[1.5rem] p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 relative">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-slate-800">1 Year</h3>
                    <span className="bg-[#E91E63] text-white text-[11px] uppercase tracking-wider font-bold px-3 py-1 rounded-full">Popular</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-5xl font-bold text-[#0B1A30] tracking-tight">₹291</span>
                    <span className="text-slate-500 font-medium">/month</span>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed mb-1">
                    Billed as ₹2,988 for 1 year. Best value for your business.
                  </p>
                  <p className="text-slate-400 text-xs">
                    Plus ₹1,499 one-time setup fee + 18% GST
                  </p>
                </div>
                
                {/* Bottom Inner Box */}
                <div className="bg-white rounded-[1.5rem] p-8 mt-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col flex-1">
                  <h4 className="text-[#0B1A30] font-medium mb-6">Features included:</h4>
                  
                  <div className="space-y-4 mb-10">
                    {[
                      'Everything in 6 Months',
                      'Full-year access',
                      'Advanced review tracking',
                      'Review performance insights',
                      'Customer activity tracking',
                      'Priority support',
                      '8 extra days FREE'
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" strokeWidth={2.5} />
                        <span className="text-slate-600 text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button onClick={() => navigate('/signup?plan=1y')} className="mt-auto w-full py-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all">
                    Start 7 Days Free Trial
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="w-full max-w-[1400px] mx-auto mt-8 mb-16 px-6 scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left Side: Accordion */}
            <div className="flex flex-col">
              <h2 className="text-4xl md:text-5xl font-serif font-extrabold text-[#0B1A30] mb-4 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-500 text-lg mb-10">
                Find answers to the most common questions about our Google review platform.
              </p>

              <div className="flex flex-col gap-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-indigo-200 hover:shadow-md transition-all duration-300"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-5 text-left bg-white focus:outline-none"
                    >
                      <span className="font-bold text-slate-800 pr-8">{faq.question}</span>
                      <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${openFaq === index ? 'rotate-180 text-indigo-500' : ''}`} />
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                      <div className="p-5 pt-0 text-slate-500 text-sm leading-relaxed border-t border-slate-50 mt-2">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Illustration */}
            <div className="hidden lg:flex items-center justify-center relative w-full h-full min-h-[500px]">
              <img src={faqImage} alt="FAQ Illustration" className="w-full max-w-lg object-contain drop-shadow-sm scale-110" />
            </div>

          </div>
        </div>

        {/* Contact Section */}
        <div id="contact" className="w-[calc(100%+2rem)] lg:w-[calc(100%+10vw)] xl:w-[100vw] flex flex-col items-center pt-16 pb-0 px-4 relative z-20 -mb-24 md:-mb-40">
          <div className="w-full max-w-[1100px] mx-auto flex flex-col md:flex-row bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden">

            {/* Left Panel */}
            <div className="w-full md:w-[45%] bg-gradient-to-br from-[#4F46E5] to-[#3730A3] p-10 md:p-12 flex flex-col justify-center relative overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 blur-3xl rounded-full pointer-events-none transform translate-x-1/4 -translate-y-1/4"></div>

              <div className="relative z-10">
                <div className="text-indigo-200 text-xs font-bold tracking-[0.2em] uppercase mb-4">Contact</div>
                <h2 className="text-3xl md:text-4xl font-serif text-white mb-4 leading-[1.1] font-bold">Got Questions?<br />We're Here.</h2>
                <p className="text-indigo-100 text-sm md:text-base leading-relaxed opacity-90 max-w-sm">
                  Ready to take control of your online reputation? Our team is available to help you set up and scale your business.
                </p>
              </div>
            </div>

            {/* Right Panel */}
            <div className="w-full md:w-[55%] bg-white p-8 md:p-10 flex flex-col justify-center">
              <div className="flex flex-col w-full">

                {/* Row 1 */}
                <div onClick={() => window.location.href = 'mailto:info@proeximaai.com'} className="group flex items-center justify-between py-4 border-b border-slate-100 hover:border-indigo-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-8">
                    <span className="text-indigo-500 font-bold text-sm w-6 tracking-wider">01</span>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-slate-900 font-bold text-[1.1rem]">Email Us</span>
                      <span className="text-slate-500 text-sm">info@proeximaai.com</span>
                    </div>
                  </div>
                  <button className="w-10 h-10 rounded-full border border-indigo-100 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-300 shadow-sm shrink-0">
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Row 2 */}
                <div className="group flex items-center justify-between py-4 border-b border-slate-100 hover:border-indigo-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-8">
                    <span className="text-indigo-500 font-bold text-sm w-6 tracking-wider">02</span>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-slate-900 font-bold text-[1.1rem]">Call Us</span>
                      <span className="text-slate-500 text-sm">+91 7008021376</span>
                    </div>
                  </div>
                  <button className="w-10 h-10 rounded-full border border-indigo-100 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-300 shadow-sm shrink-0">
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Row 3 */}
                <div className="group flex items-center justify-between py-4 cursor-pointer">
                  <div className="flex items-center gap-8">
                    <span className="text-indigo-500 font-bold text-sm w-6 tracking-wider">03</span>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-slate-900 font-bold text-[1.1rem]">Office</span>
                      <span className="text-slate-500 text-sm">Tech Coridor, Bhubaneswar, India</span>
                    </div>
                  </div>
                  <button className="w-10 h-10 rounded-full border border-indigo-100 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-300 shadow-sm shrink-0">
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Expanded Footer Section */}
      <footer className="w-full bg-[#16261F] text-[#F5F7F1]/60 pt-36 md:pt-56 pb-8 border-t border-[#F5F7F1]/10 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={() => scrollToSection('home')}>
              <QrCode className="w-6 h-6 text-indigo-600" />
              <span className="font-bold text-white text-lg tracking-tight">ReviewPulse<span className="text-indigo-600">AI</span></span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              The industry-standard AI engine for generating authentic Google Reviews and protecting your local reputation.
            </p>
            <div className="flex gap-4">
              {/* Social Icons */}
              <a href="https://www.facebook.com/profile.php?id=61593399778411" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#16261F]/90 flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <div className="w-8 h-8 rounded-full bg-[#16261F]/90 flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </div>
              <a href="https://www.linkedin.com/company/112719291/admin/dashboard/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#16261F]/90 flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors">How it Works</button></li>
              <li><button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">Pricing</button></li>
              <li><button className="hover:text-white transition-colors">Features</button></li>
              <li><button className="hover:text-white transition-colors">Case Studies</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">Contact</button></li>
              <li><button className="hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button className="hover:text-white transition-colors">Terms of Service</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Ready to Grow?</h4>
            <p className="text-sm mb-4">Join hundreds of local businesses crushing their competition.</p>
            <button onClick={() => navigate('/signup')} className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 transition-colors">
              Get Started Now
            </button>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 border-t border-[#F5F7F1]/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs">
          <p>&copy; 2026 ReviewPulse AI. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Built for Local Business Growth.</p>
        </div>
      </footer>
    </div>
  );
}
