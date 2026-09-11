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
      setScrolled(window.scrollY > 20);
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
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm' : 'bg-transparent py-4'}`}>
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('home')}>
            <Star className="w-8 h-8 text-indigo-600 fill-indigo-600" />
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">Review<span className="text-indigo-600">Boost</span></span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('home')} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Home</button>
            <button onClick={() => scrollToSection('about')} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">About</button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">How it Works</button>
            <button onClick={() => scrollToSection('pricing')} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Pricing</button>
            <button onClick={() => scrollToSection('contact')} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Contact Us</button>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => navigate('/login')} className="hidden sm:block text-sm font-semibold text-slate-600 hover:text-slate-900 px-5 py-2.5 rounded-full border border-slate-300 transition-colors">
              Log In
            </button>
            <button onClick={() => navigate('/signup')} className="text-sm font-bold bg-indigo-600 text-white px-6 py-2.5 rounded-full shadow-md shadow-indigo-600/30 hover:shadow-lg hover:-translate-y-0.5 transition-all">
              Get Started
            </button>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden text-slate-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 py-4 px-6 flex flex-col gap-4 shadow-lg">
            <button onClick={() => scrollToSection('home')} className="text-left text-base font-semibold text-slate-700">Home</button>
            <button onClick={() => scrollToSection('about')} className="text-left text-base font-semibold text-slate-700">About</button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-left text-base font-semibold text-slate-700">How it Works</button>
            <button onClick={() => scrollToSection('pricing')} className="text-left text-base font-semibold text-slate-700">Pricing</button>
            <button onClick={() => scrollToSection('contact')} className="text-left text-base font-semibold text-slate-700">Contact Us</button>
            <hr className="border-slate-100" />
            <button onClick={() => navigate('/login')} className="text-left text-base font-semibold text-indigo-600">Client Login</button>
          </div>
        )}
      </nav>

      <main className="flex-1 flex flex-col items-center justify-start z-10 pt-24 pb-0 px-4">

        {/* Hero Section */}
        <div id="home" className="w-full max-w-[1400px] mx-auto text-left relative mt-2 sm:mt-4 scroll-mt-32 px-2 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-12">

          {/* Decorative Corner Blobs */}
          <div className="absolute -bottom-10 -right-10 w-[500px] h-[400px] bg-blue-300/30 rounded-[100%] blur-[100px] -z-10 pointer-events-none"></div>

          {/* Left side text content */}
          <div className="w-full md:w-1/2 flex flex-col items-start z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-xs font-bold text-indigo-600 mb-6 border border-indigo-100">
              <Rocket className="w-4 h-4 text-indigo-600 fill-indigo-600" /> Grow Your Business
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-5xl font-extrabold tracking-tight mb-6 leading-[1.1] text-slate-900">
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
                <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight text-white">We help good businesses get the reputation they've earned.</h2>
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
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#0B1A30] tracking-tight">How It Works</h2>
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
              <h2 className="text-4xl md:text-[2.75rem] font-extrabold mb-4 text-[#0B1A30] tracking-tight">Simple Pricing. More Reviews. More Growth.</h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-8">Choose a plan that fits your business. Start collecting more Google reviews today.</p>

              <div className="flex flex-col items-center justify-center">
                <span className="text-indigo-600 font-bold text-lg">Start with a 7-day free trial</span>
                <span className="text-slate-500 text-sm">No credit card required. Cancel anytime.</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto relative mt-8">

              {/* 6 Months Plan */}
              <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 flex flex-col relative z-10">
                <h3 className="text-2xl font-bold text-slate-900 mb-1">6 Months - ₹1,794</h3>
                <p className="text-slate-400 text-sm mb-6">Best for getting started</p>

                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-slate-300 text-lg line-through decoration-slate-300">₹2,094</span>
                  <span className="text-4xl font-extrabold text-slate-900">₹1,794</span>
                  <span className="text-slate-500 font-medium text-sm">total</span>
                </div>
                <div className="text-indigo-600 font-bold text-sm mb-8">₹299/month</div>

                <div className="h-px bg-slate-100 w-full mb-8"></div>

                <ul className="space-y-4 mb-auto">
                  <li className="flex items-start gap-3 text-slate-600 text-sm font-medium">
                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" strokeWidth={3} /></div>
                    Custom QR code design
                  </li>
                  <li className="flex items-start gap-3 text-slate-600 text-sm font-medium">
                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" strokeWidth={3} /></div>
                    Google Review collection
                  </li>
                  <li className="flex items-start gap-3 text-slate-600 text-sm font-medium">
                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" strokeWidth={3} /></div>
                    Customer review link
                  </li>
                  <li className="flex items-start gap-3 text-slate-600 text-sm font-medium">
                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" strokeWidth={3} /></div>
                    Review request tools
                  </li>
                  <li className="flex items-start gap-3 text-slate-600 text-sm font-medium">
                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" strokeWidth={3} /></div>
                    Basic business dashboard
                  </li>
                  <li className="flex items-start gap-3 text-slate-600 text-sm font-medium">
                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" strokeWidth={3} /></div>
                    Priority support
                  </li>
                  <li className="flex items-start gap-3 text-slate-600 text-sm font-medium">
                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" strokeWidth={3} /></div>
                    7 extra days FREE
                  </li>
                </ul>

                <p className="text-slate-400 text-xs mt-8 mb-4">Plus ₹1,499 one-time setup fee + 18% GST</p>
                <button onClick={() => navigate('/signup?plan=6m')} className="w-full py-3.5 rounded-xl bg-[#F0F5FF] text-indigo-600 font-bold hover:bg-[#E5EEFF] transition-colors">Start Free Trial</button>
              </div>

              {/* 1 Year Plan */}
              <div className="bg-white rounded-3xl p-10 shadow-xl shadow-indigo-600/5 border-2 border-indigo-500 flex flex-col relative z-10 scale-100 md:scale-[1.02]">
                <div className="absolute -top-4 right-8 bg-indigo-500 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-md shadow-indigo-500/30">
                  <Star className="w-3.5 h-3.5 fill-[#FBBC05] text-[#FBBC05]" /> Best Value
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-1">1 Year - ₹2,988</h3>
                <p className="text-slate-400 text-sm mb-6">Best Value</p>

                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-slate-300 text-lg line-through decoration-slate-300">₹3,588</span>
                  <span className="text-4xl font-extrabold text-slate-900">₹2,988</span>
                  <span className="text-slate-500 font-medium text-sm">total</span>
                </div>
                <div className="text-indigo-600 font-bold text-sm mb-8">₹291/month</div>

                <div className="h-px bg-slate-100 w-full mb-8"></div>

                <ul className="space-y-4 mb-auto">
                  <li className="flex items-start gap-3 text-slate-600 text-sm font-medium">
                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" strokeWidth={3} /></div>
                    Everything in 6 Months
                  </li>
                  <li className="flex items-start gap-3 text-slate-600 text-sm font-medium">
                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" strokeWidth={3} /></div>
                    Full-year access
                  </li>
                  <li className="flex items-start gap-3 text-slate-600 text-sm font-medium">
                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" strokeWidth={3} /></div>
                    Advanced review tracking
                  </li>
                  <li className="flex items-start gap-3 text-slate-600 text-sm font-medium">
                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" strokeWidth={3} /></div>
                    Review performance insights
                  </li>
                  <li className="flex items-start gap-3 text-slate-600 text-sm font-medium">
                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" strokeWidth={3} /></div>
                    Customer activity tracking
                  </li>
                  <li className="flex items-start gap-3 text-slate-600 text-sm font-medium">
                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" strokeWidth={3} /></div>
                    Priority support
                  </li>
                  <li className="flex items-start gap-3 text-slate-600 text-sm font-medium">
                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" strokeWidth={3} /></div>
                    8 extra days FREE
                  </li>
                </ul>

                <p className="text-slate-400 text-xs mt-8 mb-4">Plus ₹1,499 one-time setup fee + 18% GST</p>
                <button onClick={() => navigate('/signup?plan=1y')} className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all">Start Free Trial</button>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="w-full max-w-[1400px] mx-auto mt-8 mb-16 px-6 scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left Side: Accordion */}
            <div className="flex flex-col">
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#0B1A30] mb-4 tracking-tight">
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
        <div id="contact" className="w-[calc(100%+2rem)] lg:w-[calc(100%+10vw)] xl:w-[100vw] flex flex-col items-center py-16 px-4">
          <div className="w-full max-w-[1100px] mx-auto flex flex-col md:flex-row bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] overflow-hidden">

            {/* Left Panel */}
            <div className="w-full md:w-[45%] bg-gradient-to-br from-[#4F46E5] to-[#3730A3] p-12 md:p-16 flex flex-col justify-center relative overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 blur-3xl rounded-full pointer-events-none transform translate-x-1/4 -translate-y-1/4"></div>

              <div className="relative z-10">
                <div className="text-indigo-200 text-xs font-bold tracking-[0.2em] uppercase mb-6">Contact</div>
                <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-[1.1] font-bold">Got Questions?<br />We're Here.</h2>
                <p className="text-indigo-100 text-base md:text-lg leading-relaxed opacity-90 max-w-sm">
                  Ready to take control of your online reputation? Our team is available to help you set up and scale your business.
                </p>
              </div>
            </div>

            {/* Right Panel */}
            <div className="w-full md:w-[55%] bg-white p-10 md:p-16 flex flex-col justify-center">
              <div className="flex flex-col w-full">

                {/* Row 1 */}
                <div className="group flex items-center justify-between py-6 border-b border-slate-100 hover:border-indigo-100 transition-colors cursor-pointer">
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
                <div className="group flex items-center justify-between py-6 border-b border-slate-100 hover:border-indigo-100 transition-colors cursor-pointer">
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
                <div className="group flex items-center justify-between py-6 cursor-pointer">
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
      <footer className="w-full bg-[#16261F] text-[#F5F7F1]/60 pt-16 pb-8 border-t border-[#F5F7F1]/10 z-10">
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
              {/* Social Icons Placeholder */}
              <div className="w-8 h-8 rounded-full bg-[#16261F]/90 flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer"><span className="text-white text-xs">FB</span></div>
              <div className="w-8 h-8 rounded-full bg-[#16261F]/90 flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer"><span className="text-white text-xs">IG</span></div>
              <div className="w-8 h-8 rounded-full bg-[#16261F]/90 flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer"><span className="text-white text-xs">X</span></div>
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
              <li><button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">Contact</button></li>
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
