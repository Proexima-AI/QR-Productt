import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  FileText, 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  HelpCircle,
  Building,
  Lock,
  RefreshCw
} from 'lucide-react';

const TermsAndConditions = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('agreement');

  const handlePrint = () => {
    window.print();
  };

  const sections = [
    { id: 'agreement', title: '1. Agreement to Terms' },
    { id: 'services', title: '2. Description of Services' },
    { id: 'google-oauth', title: '3. Google API Services & Limited Use' },
    { id: 'accounts', title: '4. User Accounts & Responsibilities' },
    { id: 'reviews-policy', title: '5. Google Review Policy Compliance' },
    { id: 'subscriptions', title: '6. Subscriptions, Trials & Billing' },
    { id: 'intellectual-property', title: '7. Intellectual Property & AI Content' },
    { id: 'disclaimer', title: '8. Disclaimers & Limitation of Liability' },
    { id: 'termination', title: '9. Account Termination & Revocation' },
    { id: 'governing-law', title: '10. Governing Law' },
    { id: 'contact', title: '11. Contact Information' }
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')} 
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600 hover:text-slate-900 flex items-center gap-2 text-sm font-medium"
              title="Return to Home"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </button>
            <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>
            <span className="font-bold text-slate-900 text-sm hidden sm:inline flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-600" /> Terms of Service
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              to="/privacy" 
              className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Privacy Policy
            </Link>
            <button 
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors font-medium"
              title="Print Terms"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-sm transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#0B1A30] via-indigo-950 to-[#0A39AB] text-white py-14 sm:py-18 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 blur-3xl rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-200 text-xs font-semibold mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Official Legal Terms • Google API Compliant</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-3">
            Terms & Conditions
          </h1>
          <p className="text-indigo-200 text-sm sm:text-base max-w-2xl leading-relaxed">
            Please read these terms carefully before accessing or using ReviewBoost (also referred to as "Smart QR" or "ReviewPulse AI").
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-indigo-300">
            <span>Last Updated: October 28, 2026</span>
            <span>•</span>
            <span>Effective: Immediately upon use</span>
            <span>•</span>
            <span className="text-emerald-300 font-medium">Production Release v2.4</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sticky Table of Contents (Desktop) */}
          <div className="hidden lg:block lg:col-span-4 sticky top-24 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 px-2">
              Table of Contents
            </h3>
            <nav className="space-y-1 text-sm font-medium">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between text-xs font-semibold ${
                    activeSection === sec.id 
                      ? 'bg-indigo-50 text-indigo-600 font-bold' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="truncate">{sec.title}</span>
                  {sec.id === 'google-oauth' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 shrink-0 ml-1">
                      Google OAuth
                    </span>
                  )}
                </button>
              ))}
            </nav>

            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 text-xs text-slate-500">
                <p className="font-semibold text-slate-800 mb-1">Need Clarification?</p>
                <p className="mb-2">Our legal & compliance team is available to assist you.</p>
                <a 
                  href="mailto:info@zeriva.si" 
                  className="text-indigo-600 font-semibold hover:underline block"
                >
                  info@zeriva.si
                </a>
              </div>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10 space-y-10">

            {/* 1. Agreement to Terms */}
            <section id="agreement" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Agreement to Terms
                </h2>
              </div>
              <div className="space-y-3 text-slate-600 text-sm leading-relaxed pl-11">
                <p>
                  These Terms and Conditions ("Terms", "Agreement") constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("User", "you", "Business Owner") and <strong>ReviewBoost</strong> (operating also under <strong>Smart QR</strong>, <strong>ReviewPulse AI</strong>, "we", "us", or "our"), concerning your access to and use of our web application, mobile interfaces, QR code services, and automated Google Business Profile reputation management tools.
                </p>
                <p>
                  By creating an account, scanning a system QR code, generating customer review prompts, or connecting your Google Account via Google OAuth, you confirm that you have read, understood, and agreed to be bound by all of these Terms and our companion <Link to="/privacy" className="text-indigo-600 hover:underline font-semibold">Privacy Policy</Link>. If you do not agree with all of these terms, you are expressly prohibited from using the platform and must discontinue use immediately.
                </p>
              </div>
            </section>

            {/* 2. Description of Services */}
            <section id="services" className="scroll-mt-24 border-t border-slate-100 pt-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Description of Services
                </h2>
              </div>
              <div className="space-y-3 text-slate-600 text-sm leading-relaxed pl-11">
                <p>
                  ReviewBoost provides a cloud-based marketing and reputation acceleration platform designed for local businesses, clinics, cafes, salons, retail outlets, and service providers. Key capabilities include:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                    <h4 className="font-semibold text-slate-900 text-xs mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Dynamic Smart QR Codes
                    </h4>
                    <p className="text-xs text-slate-500">
                      Printable and digital QR codes that instantly route patrons to tailored product and service review flows.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                    <h4 className="font-semibold text-slate-900 text-xs mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Multi-Language AI Reviews
                    </h4>
                    <p className="text-xs text-slate-500">
                      Generates non-repetitive, natural customer review suggestions in English, Odia, and Hindi strictly aligned with chosen products.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                    <h4 className="font-semibold text-slate-900 text-xs mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Negative Review Interception
                    </h4>
                    <p className="text-xs text-slate-500">
                      Routes 1-3 star feedback privately to the business owner inbox to address customer concerns before public publication.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                    <h4 className="font-semibold text-slate-900 text-xs mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Google AI Sync & Auto-Reply
                    </h4>
                    <p className="text-xs text-slate-500">
                      Seamless OAuth integration with Google Business Profile to read published Google reviews and post authorized AI replies.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Google API Services & Limited Use (CRITICAL FOR GOOGLE OAUTH VERIFICATION) */}
            <section id="google-oauth" className="scroll-mt-24 border-t border-slate-100 pt-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  3
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                  Google API Services & Limited Use Disclosure
                </h2>
              </div>

              <div className="pl-11 space-y-4 text-sm leading-relaxed text-slate-600">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-600 text-white rounded-xl shrink-0 mt-0.5">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-slate-900 font-bold text-sm sm:text-base mb-1">
                        Google API Services User Data Policy Compliance
                      </h4>
                      <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-3">
                        ReviewBoost's use and transfer to any other app of information received from Google APIs will adhere strictly to the{' '}
                        <a 
                          href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-700 underline font-semibold inline-flex items-center gap-1 hover:text-blue-900"
                        >
                          Google API Services User Data Policy <ExternalLink className="w-3 h-3 inline" />
                        </a>, including the Limited Use requirements.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                        <div className="flex items-center gap-1.5 bg-white/70 p-2 rounded-lg border border-blue-100">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>No generalized AI/ML foundation model training</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/70 p-2 rounded-lg border border-blue-100">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Zero transfer or sale of Google user data to third parties</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="font-bold text-slate-800 text-sm mt-4">
                  3.1 Google Account Permissions Requested
                </h3>
                <p>
                  When you voluntarily connect your Google Account via Google OAuth 2.0 to utilize the "Google AI Sync" dashboard module, we request explicit, granular permissions:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
                  <li><strong>Account Profile & Email (openid, profile, email):</strong> Used solely to confirm ownership of the verified business profile and authenticate the session.</li>
                  <li><strong>Google Business Profile API (`https://www.googleapis.com/auth/business.manage`):</strong> Used exclusively to retrieve customer reviews for your authorized business location and post responses authored or approved by you.</li>
                </ul>

                <h3 className="font-bold text-slate-800 text-sm mt-4">
                  3.2 Prohibited AI & Advertising Uses
                </h3>
                <p>
                  We explicitly affirm:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
                  <li>We <strong>do NOT</strong> use data retrieved from Google APIs to train, retrain, or improve generalized machine learning or artificial intelligence models (such as LLMs or foundation models).</li>
                  <li>We <strong>do NOT</strong> sell, rent, license, or exchange Google user data with any advertising platforms, data brokers, or third-party marketing services.</li>
                  <li>Data is processed transiently and securely solely to execute the user-requested action (generating suggested replies and updating your dashboard).</li>
                </ul>

                <h3 className="font-bold text-slate-800 text-sm mt-4">
                  3.3 Revocation & Data Deletion
                </h3>
                <p>
                  You retain complete control over your Google credentials at all times:
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-2">
                  <p>
                    <strong>Revoke Google Access:</strong> You can disconnect your Google Account at any moment directly from your ReviewBoost Client Dashboard ("Google AI Sync" &rarr; "Disconnect Account") or via the official Google Security permissions dashboard at{' '}
                    <a 
                      href="https://myaccount.google.com/permissions" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-indigo-600 font-semibold underline inline-flex items-center gap-1"
                    >
                      myaccount.google.com/permissions <ExternalLink className="w-3 h-3" />
                    </a>.
                  </p>
                  <p>
                    <strong>Data Deletion Request:</strong> Upon disconnection or account termination, all stored OAuth access and refresh tokens are permanently purged from our database within 24 hours.
                  </p>
                </div>
              </div>
            </section>

            {/* 4. User Accounts & Responsibilities */}
            <section id="accounts" className="scroll-mt-24 border-t border-slate-100 pt-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  User Accounts & Responsibilities
                </h2>
              </div>
              <div className="space-y-3 text-slate-600 text-sm leading-relaxed pl-11">
                <p>
                  To access our administrative dashboard, you must register for an account. By registering, you agree to:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Provide true, accurate, current, and complete information during registration and setup.</li>
                  <li>Maintain the confidentiality of your password, API keys, and account credentials.</li>
                  <li>Promptly notify us of any unauthorized use or suspected security breach of your account.</li>
                  <li>Assume full legal responsibility for all activities, actions, and auto-replies dispatched from your account.</li>
                </ul>
              </div>
            </section>

            {/* 5. Google Review Policy Compliance */}
            <section id="reviews-policy" className="scroll-mt-24 border-t border-slate-100 pt-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                  5
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Google Review Policy & Anti-Spam Compliance
                </h2>
              </div>
              <div className="space-y-3 text-slate-600 text-sm leading-relaxed pl-11">
                <p>
                  ReviewBoost is committed to fostering authentic, high-quality consumer sentiment. Users of our platform agree to strictly abide by Google’s User Contributed Content Policy and Maps User Contributed Content Guidelines:
                </p>
                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Important Compliance Notice</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>You may not use the service to post fake, incentivized, or fabricated reviews.</li>
                    <li>You may not prevent customers from posting genuine feedback on external review sites. Private feedback collection for low-star ratings serves to collect internal resolution tickets and must not deceive consumers.</li>
                    <li>Review texts generated by AI represent suggestions reflecting actual customer purchases and must be verified by the customer before posting to Google Maps.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 6. Subscriptions, Trials & Billing */}
            <section id="subscriptions" className="scroll-mt-24 border-t border-slate-100 pt-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                  6
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Subscriptions, Free Trials & Billing
                </h2>
              </div>
              <div className="space-y-3 text-slate-600 text-sm leading-relaxed pl-11">
                <p>
                  <strong>7-Day Free Trial:</strong> All new business accounts are granted a complimentary 7-day unrestricted trial of the platform. No credit card is required to initiate the trial.
                </p>
                <p>
                  <strong>Paid Subscriptions:</strong> Upon conclusion of the trial period, continuous access to the dashboard, automated AI auto-replies, and QR code routing requires an active paid plan processed securely via our payment gateway (Razorpay).
                </p>
                <p>
                  <strong>Refund Policy:</strong> Due to the automated provisioning of cloud AI credits and server resources, payments are generally non-refundable once activated, except where required by applicable consumer law. You may cancel your subscription renewal at any time through the dashboard or by contacting support.
                </p>
              </div>
            </section>

            {/* 7. Intellectual Property & AI Content */}
            <section id="intellectual-property" className="scroll-mt-24 border-t border-slate-100 pt-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                  7
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Intellectual Property & AI-Generated Content
                </h2>
              </div>
              <div className="space-y-3 text-slate-600 text-sm leading-relaxed pl-11">
                <p>
                  <strong>Our Proprietary Rights:</strong> The ReviewBoost platform, website, UI components, code, database schemas, logo, trademarks, and documentation are the exclusive intellectual property of the service creators.
                </p>
                <p>
                  <strong>Your Content & Ownership:</strong> You retain ownership of all business profile data, logos, product catalogs, and customer feedback data uploaded to your dashboard. You grant us a limited, worldwide license solely to host, display, and process your data to operate the service on your behalf.
                </p>
                <p>
                  <strong>AI Suggestions:</strong> Suggested review text and draft reply responses generated by our AI engines (OpenAI / Google Gemini) are provided for your review and customization. We make no warranty that AI-generated copy will be error-free or perfectly suited for every scenario without human oversight.
                </p>
              </div>
            </section>

            {/* 8. Disclaimers & Limitation of Liability */}
            <section id="disclaimer" className="scroll-mt-24 border-t border-slate-100 pt-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                  8
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Disclaimers & Limitation of Liability
                </h2>
              </div>
              <div className="space-y-3 text-slate-600 text-sm leading-relaxed pl-11">
                <p>
                  THE PLATFORM AND SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
                </p>
                <p>
                  We do not guarantee specific ranking increases on Google Maps, specific star rating improvements, or immunity from algorithmic changes implemented independently by Google LLC or other review aggregators. Under no circumstances shall ReviewBoost, its founders, or affiliates be liable for indirect, incidental, special, or consequential damages resulting from platform downtime, Google account suspensions, or third-party service interruptions.
                </p>
              </div>
            </section>

            {/* 9. Account Termination & Revocation */}
            <section id="termination" className="scroll-mt-24 border-t border-slate-100 pt-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                  9
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Account Termination & Data Deletion
                </h2>
              </div>
              <div className="space-y-3 text-slate-600 text-sm leading-relaxed pl-11">
                <p>
                  You may terminate your account at any time by contacting our support desk. We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent review manipulation, or abuse automated system endpoints.
                </p>
                <p>
                  Upon account termination, access to your QR codes will cease, and all active Google OAuth tokens and associated credentials will be permanently deleted from our servers.
                </p>
              </div>
            </section>

            {/* 10. Governing Law */}
            <section id="governing-law" className="scroll-mt-24 border-t border-slate-100 pt-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                  10
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Governing Law & Dispute Resolution
                </h2>
              </div>
              <div className="space-y-3 text-slate-600 text-sm leading-relaxed pl-11">
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles. Any legal action or proceeding arising out of or related to these Terms shall be instituted exclusively in the competent courts situated in Uttar Pradesh, India.
                </p>
              </div>
            </section>

            {/* 11. Contact Information */}
            <section id="contact" className="scroll-mt-24 border-t border-slate-100 pt-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                  11
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Contact & Support Information
                </h2>
              </div>
              <div className="space-y-3 text-slate-600 text-sm leading-relaxed pl-11">
                <p>
                  For any inquiries regarding these Terms and Conditions, Google API compliance, or account support, please reach out to:
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block text-sm mb-1">Company Entity</span>
                    <p className="text-slate-600">ReviewBoost Technologies / Smart QR</p>
                    <p className="text-slate-600">Noida, Uttar Pradesh, India</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-sm mb-1">Electronic Support & Compliance</span>
                    <p className="text-slate-600">Email: <a href="mailto:info@zeriva.si" className="text-indigo-600 font-semibold hover:underline">info@zeriva.si</a></p>
                    <p className="text-slate-600">Compliance Desk: <a href="mailto:info@zeriva.si" className="text-indigo-600 font-semibold hover:underline">info@zeriva.si</a></p>
                    <p className="text-slate-600">Support Hotline: +91 9437113591</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer Navigation within Document */}
            <div className="border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                to="/privacy"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" /> View Privacy Policy &rarr;
              </Link>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors"
              >
                Back to Top ↑
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
