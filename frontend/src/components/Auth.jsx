import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup, login } from '../services/apiService';
import { Lock, Mail, Building, User, CreditCard, ChevronRight } from 'lucide-react';
import { BUSINESS_CATEGORIES } from './BusinessPresets';

export function Signup() {
  const navigate = useNavigate();
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

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await signup(formData);
      localStorage.setItem('token', res.token);
      localStorage.setItem('userStatus', res.user.status);
      localStorage.setItem('createdAt', res.user.created_at);
      localStorage.setItem('subscriptionEndsAt', res.user.subscription_ends_at || '');
      localStorage.setItem('userEmail', res.user.email);
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
            Create Your Account
          </h2>
          <p className="text-sm text-slate-400">
            Start Your 7-Day Free Trial
          </p>
        </div>

        {error && <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl">{error}</div>}

        <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Owner Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input required type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-white text-sm focus:border-amber-500/50 focus:outline-none" placeholder="Enter Your Name" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Business Name</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input required type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-white text-sm focus:border-amber-500/50 focus:outline-none" placeholder="Enter Your Business Name" />
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
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-white text-sm focus:border-amber-500/50 focus:outline-none" placeholder="Enter Your Email" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-white text-sm focus:border-amber-500/50 focus:outline-none" placeholder="••••••••" />
              </div>
            </div>

            <button disabled={loading} type="submit" className="w-full mt-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
              {loading ? 'Creating Account...' : 'Start Free Trial'} <ChevronRight className="w-4 h-4" />
            </button>
            <p className="text-center text-xs text-slate-500 mt-4">Already have an account? <span onClick={() => navigate('/login')} className="text-amber-500 cursor-pointer">Login</span></p>
          </form>
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
      localStorage.setItem('createdAt', res.user.created_at);
      localStorage.setItem('subscriptionEndsAt', res.user.subscription_ends_at || '');
      localStorage.setItem('userEmail', res.user.email);
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
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-white text-sm focus:border-amber-500/50 focus:outline-none" placeholder="Enter Your Email" />
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
