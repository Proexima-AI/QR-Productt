import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import { Signup, Login } from './components/Auth';
import ClientDashboard from './components/ClientDashboard';
import CustomerReviewPage from './components/CustomerReviewPage';
import HeaderNav from './components/HeaderNav';
import QRCodeGenerator from './components/QRCodeGenerator';
import { getMyBusiness, getMyFeedback, getBusinessById, submitFeedback, resolveFeedback, updateMyBusiness } from './services/apiService';
import { ShieldCheck, Clock } from 'lucide-react';

function ProtectedDashboard() {
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');

  const status = localStorage.getItem('userStatus');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    if (status === 'active') {
      const fetchData = async () => {
        try {
          const bData = await getMyBusiness();
          const fData = await getMyFeedback();
          setBusiness(bData);
          setFeedbacks(fData);
        } catch (err) {
          console.error('Failed to load dashboard data', err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setLoading(false);
    }
  }, [navigate, status]);

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-indigo-600">Loading...</div>;

  if (status === 'pending_setup') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
          <Clock className="w-10 h-10 text-indigo-600 animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Account Setup in Progress</h1>
        <p className="text-slate-600 max-w-md mx-auto mb-8 leading-relaxed">
          Thank you for purchasing ReviewPulse AI! Our team has received your order and is currently provisioning your business profile, optimizing your keywords, and preparing your dashboard.
          <br /><br />
          We will contact you shortly once setup is complete.
        </p>
        <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="px-6 py-2 border border-slate-300 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition">
          Logout
        </button>
      </div>
    );
  }

  if (!business) return <div className="text-center text-slate-900 p-10">No business found. Please contact support.</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <HeaderNav activeView={activeView} setActiveView={setActiveView} />
      
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {activeView === 'dashboard' && (
          <ClientDashboard 
            business={business} 
            onUpdateBusiness={async (data) => {
              await updateMyBusiness(data);
              setBusiness(data);
            }} 
            internalFeedback={feedbacks}
            onResolveFeedback={async (id) => {
              await resolveFeedback(id);
              setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status: 'Resolved' } : f));
            }}
          />
        )}
        {activeView === 'qr' && (
          <QRCodeGenerator business={business} />
        )}
      </main>
    </div>
  );
}

// Wrapper for the Customer Review flow (Public page)
import { useParams } from 'react-router-dom';
function PublicReviewPage() {
  const { businessId } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBiz = async () => {
      try {
        const data = await getBusinessById(businessId);
        setBusiness(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBiz();
  }, [businessId]);

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-indigo-600">Loading profile...</div>;
  if (!business) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-rose-500">Business not found.</div>;

  return (
    <CustomerReviewPage 
      business={business} 
      onAddInternalFeedback={async (fb) => {
        await submitFeedback({ ...fb, business_id: business.id });
      }} 
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedDashboard />} />
        <Route path="/r/:businessId" element={<PublicReviewPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
