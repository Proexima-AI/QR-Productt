import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Sparkles, QrCode, TrendingUp, Zap, Server, ChevronRight, Star, ArrowRight, BarChart3, MessageSquareText, CheckCircle2, Mail, Phone, MapPin, PlayCircle, Users, Rocket } from 'lucide-react';
import fullImage from '../assets/new review image.png';

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

      <main className="flex-1 flex flex-col items-center justify-start z-10 pt-24 pb-20 px-4">

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
        <div id="how-it-works" className="w-full max-w-7xl mx-auto mt-32 scroll-mt-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-900 tracking-tight">How the Engine Works.</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">A seamless 3-step process to engineer your public perception and protect your reputation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 relative">
              <div className="absolute -top-5 left-8 w-10 h-10 bg-[#16261F] text-white font-black text-xl flex items-center justify-center rounded-xl shadow-lg">1</div>
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 mt-4">
                <QrCode className="w-7 h-7 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Customer Scans QR Code</h3>
              <p className="text-slate-600 leading-relaxed">
                Place our custom-designed acrylic QR standees on your tables, counters, or receipts. Customers scan it with their smartphone camera to rate their experience.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 relative">
              <div className="absolute -top-5 left-8 w-10 h-10 bg-indigo-600 text-white font-black text-xl flex items-center justify-center rounded-xl shadow-lg">2</div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 flex items-center justify-center mb-6 mt-4">
                <ShieldCheck className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">The Smart Filter</h3>
              <p className="text-slate-600 leading-relaxed">
                The app asks for a star rating. If they select <strong>1 to 3 stars</strong>, they are sent to a private apology form that goes directly to your dashboard inbox.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 relative">
              <div className="absolute -top-5 left-8 w-10 h-10 bg-indigo-600 text-white font-black text-xl flex items-center justify-center rounded-xl shadow-lg">3</div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 flex items-center justify-center mb-6 mt-4">
                <Star className="w-7 h-7 text-indigo-600 fill-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">AI Generates the Review</h3>
              <p className="text-slate-600 leading-relaxed">
                If they select <strong>4 or 5 stars</strong>, our Gemini AI instantly writes a glowing, keyword-optimized review for them. They just tap "Post to Google" and you win.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div id="pricing" className="w-full max-w-5xl mx-auto mt-40 scroll-mt-24 relative">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-900 tracking-tight">Transparent, Powerful Pricing.</h2>
            <p className="text-slate-600 text-lg">One system. Unfair advantage for your local business.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white rounded-[2.5rem] p-4 shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden">

            {/* Left Info */}
            <div className="p-8 lg:p-12 space-y-8">
              <div>
                <h3 className="text-3xl font-bold text-slate-900 mb-2">ReviewPulse Pro</h3>
                <p className="text-slate-900/60">The complete review generation & reputation protection system.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-indigo-600/20 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-indigo-600" /></div>
                  <div>
                    <h4 className="font-bold text-slate-900">One-Time Setup</h4>
                    <p className="text-slate-600 text-sm">We configure your Google integration, build your dashboard, and generate your custom QR codes.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-indigo-600/20 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-indigo-600" /></div>
                  <div>
                    <h4 className="font-bold text-slate-900">AI Server Maintenance</h4>
                    <p className="text-slate-600 text-sm">A small recurring fee to power the Gemini AI generation engine and keep your dashboard online 24/7.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-[#16261F] p-8 sm:p-12 rounded-[2rem] text-white relative overflow-hidden h-full flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/80/20 blur-3xl rounded-full pointer-events-none" />

              <div className="relative z-10">
                <div className="space-y-1 mb-8">
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-black text-white">₹1999</span>
                    <span className="text-[#F5F7F1]/60 font-medium pb-1">One-time setup</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-[#F5F7F1]/60">+ ₹300</span>
                    <span className="text-[#F5F7F1]/60 text-sm pb-1">/mo (Billed half-yearly)</span>
                  </div>
                </div>

                <div className="w-full h-px bg-[#16261F]/90 mb-8" />

                <div className="bg-[#16261F]/90/80 rounded-2xl p-5 mb-8 flex justify-between items-center border border-[#F5F7F1]/20">
                  <span className="text-sm font-medium text-[#F5F7F1]/70">Total upfront today</span>
                  <span className="text-2xl font-black text-white">₹3799</span>
                </div>

                <button
                  onClick={() => navigate('/signup')}
                  className="w-full py-4 rounded-full bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 hover:-translate-y-1 transition-all flex justify-center items-center gap-2"
                >
                  Purchase System <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div id="contact" className="w-full max-w-5xl mx-auto mt-40 scroll-mt-24">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-16 shadow-xl shadow-slate-200/50 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-900 tracking-tight">Got Questions? We're Here.</h2>
            <p className="text-slate-600 text-lg mb-10 max-w-2xl mx-auto">
              Ready to take control of your online reputation? Our team is available to help you set up and scale your business.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 bg-indigo-600/20 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 mb-1">Email Us</h4>
                <p className="text-slate-900/60 text-sm">support@reviewpulseai.com</p>
              </div>

              <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 bg-indigo-600/20 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 mb-1">Call Us</h4>
                <p className="text-slate-900/60 text-sm">+91 98765 43210</p>
              </div>

              <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 bg-indigo-600/20 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 mb-1">Office</h4>
                <p className="text-slate-900/60 text-sm">Tech Park, Mumbai, India</p>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Expanded Footer Section */}
      <footer className="w-full bg-[#16261F] text-[#F5F7F1]/60 pt-16 pb-8 border-t border-[#F5F7F1]/10 mt-20 z-10">
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
