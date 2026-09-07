import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup, login } from '../services/apiService';
import { Lock, Mail, Building, User, CreditCard, ChevronRight } from 'lucide-react';
import { BUSINESS_CATEGORIES } from './BusinessPresets';

export function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    businessName: '',
    ownerName: '',
    category: 'restaurant'
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePurchase = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Simulate Payment Delay
      await new Promise(r => setTimeout(r, 1500));
      
      const res = await signup(formData);
      localStorage.setItem('token', res.token);
      localStorage.setItem('userStatus', res.user.status);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Decor */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-2xl rounded-full pointer-events-none" />

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {step === 1 ? 'Create Your Account' : 'Complete Purchase'}
          </h2>
          <p className="text-sm text-slate-400">
            {step === 1 ? 'Step 1 of 2: Business Details' : 'Step 2 of 2: Secure Payment'}
          </p>
        </div>

        {error && <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl">{error}</div>}

        {step === 1 ? (
          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Owner Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input required type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-white text-sm focus:border-amber-500/50 focus:outline-none" placeholder="John Doe" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Business Name</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input required type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-white text-sm focus:border-amber-500/50 focus:outline-none" placeholder="Joe's Pizza" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white text-sm focus:border-amber-500/50 focus:outline-none">
                {BUSINESS_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-white text-sm focus:border-amber-500/50 focus:outline-none" placeholder="john@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-white text-sm focus:border-amber-500/50 focus:outline-none" placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" className="w-full mt-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
              Continue to Payment <ChevronRight className="w-4 h-4" />
            </button>
            <p className="text-center text-xs text-slate-500 mt-4">Already have an account? <span onClick={() => navigate('/login')} className="text-amber-500 cursor-pointer">Login</span></p>
          </form>
        ) : (
          <form onSubmit={handlePurchase} className="space-y-5">
            <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-4 flex justify-between items-center text-sm">
              <div className="text-slate-300">
                <p>Setup Fee: ₹1999</p>
                <p>6-Month Plan: ₹1800</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Total Today</p>
                <p className="text-xl font-bold text-white">₹3799</p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4" /> Mock Payment Method
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                Since this is a demo environment, no actual payment is required. Clicking the button below will simulate a successful ₹3799 transaction and create your account.
              </p>
            </div>

            <button disabled={loading} type="submit" className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
              {loading ? 'Processing Transaction...' : 'Pay ₹3799 & Setup Account'}
            </button>
            <button type="button" onClick={() => setStep(1)} className="w-full py-2 text-xs text-slate-400 hover:text-white transition">
              Back to Details
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(email, password);
      localStorage.setItem('token', res.token);
      localStorage.setItem('userStatus', res.user.status);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-sm text-slate-400">Login to your SaaS Dashboard</p>
        </div>

        {error && <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-white text-sm focus:border-amber-500/50 focus:outline-none" placeholder="john@example.com" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-white text-sm focus:border-amber-500/50 focus:outline-none" placeholder="••••••••" />
            </div>
          </div>

          <button disabled={loading} type="submit" className="w-full mt-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Don't have an account? <span onClick={() => navigate('/signup')} className="text-amber-500 cursor-pointer">Get Started</span>
        </p>
      </div>
    </div>
  );
}
