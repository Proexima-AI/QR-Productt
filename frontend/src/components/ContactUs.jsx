import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Send, Star, ArrowRight } from 'lucide-react';

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
      className="min-h-screen text-slate-900 font-sans flex flex-col items-center justify-center relative p-6 pt-32 md:pt-40"
      style={{ background: 'radial-gradient(ellipse 900px 500px at 50% -10%, #cfeaff, transparent), linear-gradient(180deg, #eaf6ff 0%, #f7fbff 60%, #ffffff 100%)' }}
    >
      
      {/* Navbar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1400px] z-50 transition-all duration-300 bg-[#0A39AB] rounded-full shadow-lg border border-transparent">
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
            <button onClick={() => navigate('/')} className="text-left text-base font-semibold text-white hover:text-white/80">Home</button>
            <button onClick={() => navigate('/')} className="text-left text-base font-semibold text-white hover:text-white/80">About</button>
            <button onClick={() => navigate('/')} className="text-left text-base font-semibold text-white hover:text-white/80">How it Works</button>
            <button onClick={() => navigate('/')} className="text-left text-base font-semibold text-white hover:text-white/80">Pricing</button>
            <button onClick={() => { navigate('/contact'); setMobileMenuOpen(false); }} className="text-left text-base font-semibold text-white hover:text-white/80">Contact Us</button>
            <hr className="border-white/20" />
            <button onClick={() => navigate('/login')} className="text-left text-base font-semibold text-white hover:text-white/80">Client Login</button>
          </div>
        )}
      </nav>

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center mt-20 md:mt-0">
        
        {/* Left Side */}
        <div className="flex flex-col justify-center h-full">
          <h1 className="text-4xl md:text-5xl font-serif text-[#0B1A30] font-bold mb-6">Get in Touch</h1>
          <p className="text-lg text-[#0A39AB] font-medium mb-6">We'd love to hear from you!</p>
          <p className="text-slate-500 leading-relaxed max-w-sm mb-16">
            If you have any inquiries, want to learn more about our platform, or just want to say hi, please use the contact form!
          </p>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 text-slate-600">
              <Mail className="w-5 h-5 text-slate-400" />
              <span className="font-medium underline decoration-slate-300 underline-offset-4">info@proeximaai.com</span>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full bg-transparent border border-slate-300 rounded-none p-3 focus:outline-none focus:border-[#0A39AB] transition-colors" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full bg-transparent border border-slate-300 rounded-none p-3 focus:outline-none focus:border-[#0A39AB] transition-colors" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Business Name</label>
            <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} required className="w-full bg-transparent border border-slate-300 rounded-none p-3 focus:outline-none focus:border-[#0A39AB] transition-colors" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Business Email *</label>
            <input type="email" name="businessEmail" value={formData.businessEmail} onChange={handleChange} required className="w-full bg-transparent border border-slate-300 rounded-none p-3 focus:outline-none focus:border-[#0A39AB] transition-colors" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full bg-transparent border border-slate-300 rounded-none p-3 focus:outline-none focus:border-[#0A39AB] transition-colors" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Message</label>
            <textarea name="message" value={formData.message} onChange={handleChange} rows="3" className="w-full bg-transparent border border-slate-300 rounded-none p-3 focus:outline-none focus:border-[#0A39AB] transition-colors resize-none"></textarea>
          </div>

          <div className="flex justify-end mt-4">
            <button type="submit" className="flex items-center gap-2 px-8 py-3.5 bg-[#0A39AB] text-white font-semibold rounded-xl shadow-lg shadow-[#0A39AB]/30 hover:bg-[#0A39AB]/90 hover:-translate-y-0.5 transition-all duration-300">
              Send <ArrowRight className="w-5 h-5 ml-1" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
