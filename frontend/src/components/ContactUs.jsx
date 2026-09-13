import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Star, ArrowRight, MapPin, Phone } from 'lucide-react';

export default function ContactUs() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    businessName: '',
    businessEmail: '',
    location: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent successfully!');
    setFormData({ firstName: '', lastName: '', businessName: '', businessEmail: '', location: '', message: '' });
  };

  return (
    <div
      className="min-h-screen text-slate-900 font-sans flex flex-col relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse 900px 500px at 50% -10%, #cfeaff, transparent), linear-gradient(180deg, #eaf6ff 0%, #f7fbff 60%, #ffffff 100%)' }}
    >

      {/* Navbar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1400px] z-50 transition-all duration-300 bg-[#0A39AB] rounded-xl shadow-lg border border-transparent">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <Star className="w-8 h-8 text-white fill-white" />
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">Review<span className="text-white/80">Boost</span></span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            <button onClick={() => navigate('/')} className="text-sm font-medium text-white hover:text-white/80 transition-colors">Home</button>
            <button onClick={() => navigate('/')} className="text-sm font-medium text-white hover:text-white/80 transition-colors">About</button>
            <button onClick={() => navigate('/')} className="text-sm font-medium text-white hover:text-white/80 transition-colors">How it Works</button>
            <button onClick={() => navigate('/')} className="text-sm font-medium text-white hover:text-white/80 transition-colors">Pricing</button>
            <button onClick={() => navigate('/contact')} className="text-sm font-medium text-white hover:text-white/80 transition-colors">Contact Us</button>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => navigate('/login')} className="hidden sm:flex items-center gap-2 text-sm font-medium text-white hover:text-white/80 transition-colors">
              Login
            </button>
            <button onClick={() => navigate('/signup')} className="text-sm font-semibold bg-white text-[#0A39AB] px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
              Get Started
            </button>

            {/* Mobile Menu Toggle */}
            <button className="lg:hidden text-white p-2 rounded-xl hover:bg-white/10" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-[calc(100%+0.5rem)] left-0 w-full bg-[#0A39AB] rounded-xl py-4 px-6 flex flex-col gap-4 shadow-xl">
            <button onClick={() => navigate('/')} className="text-left text-base font-semibold text-white hover:text-white/80">Home</button>
            <button onClick={() => navigate('/')} className="text-left text-base font-semibold text-white hover:text-white/80">About</button>
            <button onClick={() => navigate('/')} className="text-left text-base font-semibold text-white hover:text-white/80">How it Works</button>
            <button onClick={() => navigate('/')} className="text-left text-base font-semibold text-white hover:text-white/80">Pricing</button>
            <button onClick={() => { navigate('/contact'); setMobileMenuOpen(false); }} className="text-left text-base font-semibold text-white hover:text-white/80">Contact Us</button>
            <hr className="border-white/20" />
            <button onClick={() => navigate('/login')} className="text-left text-base font-semibold text-white hover:text-white/80">Login</button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-6">
        <div className="w-full max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 items-start">

          {/* Left Side: Info */}
          <div className="lg:col-span-2 flex flex-col justify-start">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/50 backdrop-blur-sm text-xs font-bold text-blue-700 mb-8 border border-blue-200 w-fit">
              <Mail className="w-4 h-4 text-blue-600" /> Let's Connect
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-serif text-[#0B1A30] font-extrabold mb-6 leading-[1.1] tracking-tight">
              Get in Touch.
            </h1>

            <p className="text-slate-500 text-lg leading-relaxed mb-12">
              Have questions about how we can help grow your business? Want a demo? Our team is ready to help.
            </p>

            <div className="flex flex-col gap-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-[#0B1A30] font-semibold mb-1">Email Us</h4>
                  <a href="mailto:info@proeximaai.com" className="text-slate-500 hover:text-blue-600 transition-colors">info@proeximaai.com</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-[#0B1A30] font-semibold mb-1">Call Us</h4>
                  <a href="tel:+919876543210" className="text-slate-500 hover:text-blue-600 transition-colors">+91 98765 43210</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-[#0B1A30] font-semibold mb-1">Location</h4>
                  <p className="text-slate-500">Bangalore, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form Card */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#0B1A30]">First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="Enter Your First Name" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-4 focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#0B1A30]">Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Enter Your Last Name" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-4 focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#0B1A30]">Business Name</label>
                  <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} required placeholder="Enter Your Business Name" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-4 focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#0B1A30]">Business Email</label>
                  <input type="email" name="businessEmail" value={formData.businessEmail} onChange={handleChange} required placeholder="Enter Your Business Email" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-4 focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#0B1A30]">How can we help?</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows="4" placeholder="Tell us about your needs..." className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-4 focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none placeholder:text-slate-400"></textarea>
                </div>

                <button type="submit" className="w-full mt-2 flex items-center justify-center gap-2 px-8 py-4 bg-[#0A39AB] text-white font-bold rounded-xl shadow-lg shadow-[#0A39AB]/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-300">
                  Send Message <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
