import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import { Signup, Login } from './components/Auth';
import ClientDashboard from './components/ClientDashboard';
import CustomerReviewPage from './components/CustomerReviewPage';
import HeaderNav from './components/HeaderNav';
import QRCodeGenerator from './components/QRCodeGenerator';
import OnboardingSetup from './components/OnboardingSetup';
import { getMyBusiness, getMyFeedback, getBusinessById, submitFeedback, resolveFeedback, updateMyBusiness, getGoogleReviews } from './services/apiService';
import { ShieldCheck, Clock } from 'lucide-react';

function ProtectedDashboard() {
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [googleReviews, setGoogleReviews] = useState([]);
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
          const gData = await getGoogleReviews();
          setBusiness(bData);
          setFeedbacks(fData);
          setGoogleReviews(gData);
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
    return <OnboardingSetup onComplete={() => navigate(0)} />;
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
            googleReviews={googleReviews}
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
