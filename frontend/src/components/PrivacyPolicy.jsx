import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8 font-sans text-slate-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
      >
        <div className="bg-indigo-600 p-8 text-white relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-indigo-100">Last updated: September 16, 2026</p>
          </div>
        </div>

        <div className="p-8 prose prose-slate max-w-none">
          <h2 className="text-xl font-bold text-slate-800 mb-4 mt-6">1. Introduction</h2>
          <p className="text-slate-600 mb-4">
            Welcome to Smart QR. We respect your privacy and are committed to protecting your personal data. 
            This Privacy Policy explains how we collect, use, and share information when you use our application.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mb-4 mt-6">2. Google API Services User Data Policy Compliance</h2>
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-6">
            <p className="text-indigo-900 font-medium mb-2">
              <strong>Google API Limited Use Disclosure:</strong>
            </p>
            <p className="text-indigo-800 text-sm">
              Our application's use and transfer to any other app of information received from Google APIs will adhere to the 
              <a href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline mx-1">
                Google API Services User Data Policy
              </a>, 
              including the Limited Use requirements. We do not use Google Workspace APIs to develop, improve, or train generalized AI and/or ML models.
            </p>
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-4 mt-6">3. What Data We Collect</h2>
          <p className="text-slate-600 mb-2">When you connect your Google My Business account, we request access to:</p>
          <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-1">
            <li><strong>Basic Profile Information:</strong> Your name and email address to create and manage your account.</li>
            <li><strong>Google Business Profile Data:</strong> Information about your business location(s) to provide local SEO analytics.</li>
            <li><strong>Google Reviews Data:</strong> Your business reviews, which are used to generate automated AI replies and improve your online reputation.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-800 mb-4 mt-6">4. How We Use Your Data</h2>
          <p className="text-slate-600 mb-4">
            We use the data we collect exclusively to provide the core functionality of our service:
          </p>
          <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-1">
            <li>To display your Google Reviews in your dashboard.</li>
            <li>To utilize AI (OpenAI) to generate draft responses to your customer reviews. (Note: Data sent to OpenAI is strictly for generating replies for your specific business and is not used to train OpenAI's generalized models).</li>
            <li>To analyze your business's local SEO presence and provide actionable insights.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-800 mb-4 mt-6">5. Data Sharing and Disclosure</h2>
          <p className="text-slate-600 mb-4">
            We do not sell, rent, or trade your personal information. Your Google user data is strictly used to provide the service 
            you requested and is not shared with third parties for marketing or advertising purposes.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mb-4 mt-6">6. Data Security</h2>
          <p className="text-slate-600 mb-4">
            We implement industry-standard security measures to protect your data. Your Google OAuth tokens are securely stored and encrypted. 
            You can revoke our access to your Google account at any time through your Google Account Security settings.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mb-4 mt-6">7. Contact Us</h2>
          <p className="text-slate-600 mb-4">
            If you have any questions or concerns about this Privacy Policy, please contact us at <strong>debugdetective.codes@gmail.com</strong>.
          </p>
        </div>
        
        <div className="bg-slate-50 p-6 border-t border-slate-100 text-center">
          <button 
            onClick={() => window.history.back()} 
            className="text-slate-500 hover:text-slate-800 font-medium transition-colors"
          >
            ← Back to Application
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;
