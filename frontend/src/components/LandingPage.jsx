import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Sparkles, QrCode, TrendingUp, Zap, Server, ChevronRight, Star, ArrowRight, BarChart3, MessageSquareText, CheckCircle2, Mail, Phone, MapPin } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 flex flex-col overflow-x-hidden">
      
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/20">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">ReviewPulse<span className="text-indigo-600">AI</span></span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('home')} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Home</button>
            <button onClick={() => scrollToSection('about')} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">About</button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">How it Works</button>
            <button onClick={() => scrollToSection('pricing')} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Pricing</button>
            <button onClick={() => scrollToSection('contact')} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Contact Us</button>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => navigate('/login')} className="hidden sm:block text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
              Login
            </button>
            <button onClick={() => navigate('/signup')} className="text-sm font-bold bg-slate-900 text-white px-5 py-2.5 rounded-full shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">
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

      <main className="flex-1 flex flex-col items-center justify-start z-10 pt-32 pb-20 px-4">
        
        {/* Hero Section */}
        <div id="home" className="w-full max-w-5xl mx-auto text-center relative mt-8 sm:mt-16 scroll-mt-32">
          {/* Decorative background blobs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] max-w-4xl bg-gradient-to-r from-indigo-100 to-blue-50 blur-3xl rounded-full -z-10 pointer-events-none opacity-70" />

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-600 mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-500" /> The Standard for Local Business Growth
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] text-slate-900">
            Turn Every Customer<br />
            Into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">5-Star Reputation.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            The industry-leading AI review engine. Automatically generate authentic, glowing 5-star Google Reviews from happy customers, while safely intercepting 1-3 star complaints into a private dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/signup')} 
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-indigo-600 text-white font-bold text-lg shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group"
            >
              Start Growing Today <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border border-slate-200 text-slate-700 font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center shadow-sm">
              See How It Works
            </button>
          </div>
        </div>

        {/* Dashboard Preview / Mockup */}
        <div className="w-full max-w-6xl mx-auto mt-24 relative perspective-1000">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent z-10 rounded-3xl" />
          <div className="bg-white border border-slate-200 rounded-3xl p-2 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden transform rotate-x-[4deg] hover:rotate-x-0 transition-transform duration-700">
            {/* Minimal browser UI mock */}
            <div className="w-full h-8 bg-slate-100 rounded-t-2xl border-b border-slate-200 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070" alt="Dashboard Preview" className="w-full h-auto rounded-b-xl opacity-90 transition-all duration-700" />
          </div>
        </div>

        {/* About Section */}
        <div id="about" className="w-full max-w-6xl mx-auto mt-32 scroll-mt-24">
          <div className="bg-indigo-600 rounded-[2.5rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-indigo-600/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 blur-3xl rounded-full pointer-events-none" />
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/50 border border-indigo-400 text-xs font-bold text-white mb-6 uppercase tracking-wider">
                  Our Mission
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">We protect businesses from unfair online ratings.</h2>
                <p className="text-indigo-100 text-lg leading-relaxed mb-6">
                  In today's local economy, a single 1-star review can cost you thousands of dollars in lost foot traffic. Meanwhile, happy customers rarely take the time to write a review. 
                </p>
                <p className="text-indigo-100 text-lg leading-relaxed">
                  ReviewPulse AI was built to solve this exact problem. By combining smart QR codes with Gemini AI, we capture the angry customers before they reach Google, and we do the hard work of writing glowing reviews for the happy ones.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-700/50 backdrop-blur border border-indigo-500/50 p-6 rounded-3xl">
                  <span className="text-4xl font-black text-white block mb-2">3x</span>
                  <span className="text-indigo-200 text-sm font-medium">Average Increase in 5-Star Reviews</span>
                </div>
                <div className="bg-indigo-700/50 backdrop-blur border border-indigo-500/50 p-6 rounded-3xl mt-8">
                  <span className="text-4xl font-black text-white block mb-2">99%</span>
                  <span className="text-indigo-200 text-sm font-medium">Negative Reviews Intercepted</span>
                </div>
                <div className="bg-indigo-700/50 backdrop-blur border border-indigo-500/50 p-6 rounded-3xl col-span-2">
                  <span className="text-4xl font-black text-white block mb-2">Zero</span>
                  <span className="text-indigo-200 text-sm font-medium">Effort required from your staff. The system works 24/7 on autopilot.</span>
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
              <div className="absolute -top-5 left-8 w-10 h-10 bg-slate-900 text-white font-black text-xl flex items-center justify-center rounded-xl shadow-lg">1</div>
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-6 mt-4">
                <QrCode className="w-7 h-7 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Customer Scans QR Code</h3>
              <p className="text-slate-600 leading-relaxed">
                Place our custom-designed acrylic QR standees on your tables, counters, or receipts. Customers scan it with their smartphone camera to rate their experience.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 relative">
              <div className="absolute -top-5 left-8 w-10 h-10 bg-indigo-600 text-white font-black text-xl flex items-center justify-center rounded-xl shadow-lg">2</div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 mt-4">
                <ShieldCheck className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">The Smart Filter</h3>
              <p className="text-slate-600 leading-relaxed">
                The app asks for a star rating. If they select <strong>1 to 3 stars</strong>, they are sent to a private apology form that goes directly to your dashboard inbox.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 relative">
              <div className="absolute -top-5 left-8 w-10 h-10 bg-emerald-500 text-white font-black text-xl flex items-center justify-center rounded-xl shadow-lg">3</div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 mt-4">
                <Star className="w-7 h-7 text-emerald-600 fill-emerald-600" />
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
                <p className="text-slate-500">The complete review generation & reputation protection system.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-indigo-100 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-indigo-600" /></div>
                  <div>
                    <h4 className="font-bold text-slate-900">One-Time Setup</h4>
                    <p className="text-slate-600 text-sm">We configure your Google integration, build your dashboard, and generate your custom QR codes.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-indigo-100 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-indigo-600" /></div>
                  <div>
                    <h4 className="font-bold text-slate-900">AI Server Maintenance</h4>
                    <p className="text-slate-600 text-sm">A small recurring fee to power the Gemini AI generation engine and keep your dashboard online 24/7.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-slate-900 p-8 sm:p-12 rounded-[2rem] text-white relative overflow-hidden h-full flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />
              
              <div className="relative z-10">
                <div className="space-y-1 mb-8">
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-black text-white">₹1999</span>
                    <span className="text-slate-400 font-medium pb-1">One-time setup</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-indigo-300">+ ₹300</span>
                    <span className="text-slate-400 text-sm pb-1">/mo (Billed half-yearly)</span>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-800 mb-8" />

                <div className="bg-slate-800/80 rounded-2xl p-5 mb-8 flex justify-between items-center border border-slate-700">
                  <span className="text-sm font-medium text-slate-300">Total upfront today</span>
                  <span className="text-2xl font-black text-white">₹3799</span>
                </div>

                <button 
                  onClick={() => navigate('/signup')} 
                  className="w-full py-4 rounded-full bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 hover:-translate-y-1 transition-all flex justify-center items-center gap-2"
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
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 mb-1">Email Us</h4>
                <p className="text-slate-500 text-sm">support@reviewpulseai.com</p>
              </div>
              
              <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 mb-1">Call Us</h4>
                <p className="text-slate-500 text-sm">+91 98765 43210</p>
              </div>

              <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 mb-1">Office</h4>
                <p className="text-slate-500 text-sm">Tech Park, Mumbai, India</p>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Expanded Footer Section */}
      <footer className="w-full bg-slate-900 text-slate-400 pt-16 pb-8 border-t border-slate-800 mt-20 z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={() => scrollToSection('home')}>
              <QrCode className="w-6 h-6 text-indigo-500" />
              <span className="font-bold text-white text-lg tracking-tight">ReviewPulse<span className="text-indigo-500">AI</span></span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              The industry-standard AI engine for generating authentic Google Reviews and protecting your local reputation.
            </p>
            <div className="flex gap-4">
              {/* Social Icons Placeholder */}
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer"><span className="text-white text-xs">FB</span></div>
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer"><span className="text-white text-xs">IG</span></div>
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer"><span className="text-white text-xs">X</span></div>
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
        
        <div className="max-w-7xl mx-auto px-6 border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs">
          <p>&copy; 2026 ReviewPulse AI. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Built for Local Business Growth.</p>
        </div>
      </footer>
    </div>
  );
}
