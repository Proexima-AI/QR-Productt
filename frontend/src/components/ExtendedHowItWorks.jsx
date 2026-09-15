import React from 'react';
import { Check, Star, Download, Copy, Info, Share, CheckCircle2, ChevronRight, MessageSquareText, Search } from 'lucide-react';
import choosePlanImg from '../assets/Choose_your_plan.png';
import qrCodeImg from '../assets/qr-code.png';
import scanQrCustomerImg from '../assets/scan_qr_customer.png';
import rateYourExperienceImg from '../assets/rate_your_experince.png';
import reviewContinueImg from '../assets/review_continue.png';

export default function ExtendedHowItWorks() {
  return (
    <div className="w-full max-w-[1400px] mx-auto mt-8 mb-12 px-6">
      
      <div className="text-center mb-16 flex flex-col items-center">
        <div className="bg-blue-50 text-blue-500 font-bold px-4 py-1.5 rounded-full text-xs mb-4 tracking-wider uppercase border border-blue-100">
          SIMPLE PROCESS
        </div>
        <h2 className="text-4xl md:text-[2.75rem] font-serif font-extrabold mb-4 text-[#0B1A30] tracking-tight">
          How It Works
        </h2>
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">
          From purchase to Google review — in just 6 simple steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {/* Step 1 */}
        <div className="flex flex-col bg-white rounded-[2.5rem] p-4 shadow-xl shadow-slate-200/40 border border-slate-100 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300">
          <div className="w-full aspect-[4/3] rounded-[2rem] bg-[#F0F5FA] relative flex items-center justify-center p-6 mb-6 overflow-hidden">
            {/* Number badge */}
            <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center z-20 shadow-md">
              1
            </div>
            
            {/* Illustration */}
            <div className="relative w-full max-w-[300px] z-10 flex items-center justify-center scale-125">
              <img src={choosePlanImg} alt="Choose Your Plan" className="w-full h-auto object-contain drop-shadow-xl relative z-10" />
            </div>
          </div>
          <div className="px-4 pb-6">
            <h3 className="text-xl md:text-2xl font-bold mb-3 text-[#0B1A30]">Choose Your Plan</h3>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              Purchase a ReviewBoost plan that fits your business needs. Complete the secure checkout and get started instantly.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col bg-white rounded-[2.5rem] p-4 shadow-xl shadow-slate-200/40 border border-slate-100 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300">
          <div className="w-full aspect-[4/3] rounded-[2rem] bg-[#F6F7FE] relative flex items-center justify-center p-6 mb-6 overflow-hidden">
            {/* Number badge */}
            <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center z-20 shadow-md">
              2
            </div>
            
            {/* Illustration */}
            <div className="relative w-full max-w-[300px] z-10 flex items-center justify-center scale-125">
              <img src={qrCodeImg} alt="Get Your QR Code" className="w-full h-auto object-contain drop-shadow-xl relative z-10" />
            </div>
          </div>
          <div className="px-4 pb-6">
            <h3 className="text-xl md:text-2xl font-bold mb-3 text-[#0B1A30]">Get Your QR Code</h3>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              After completing your purchase, we instantly generate a unique QR code for your business. You can download or print it.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col bg-white rounded-[2.5rem] p-4 shadow-xl shadow-slate-200/40 border border-slate-100 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300">
          <div className="w-full aspect-[4/3] rounded-[2rem] bg-[#EAF8F1] relative flex items-center justify-center p-6 mb-6 overflow-hidden">
            {/* Number badge */}
            <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center z-20 shadow-md">
              3
            </div>
            
            {/* Illustration */}
            <div className="relative w-full max-w-[300px] z-10 flex items-center justify-center scale-125">
              <img src={scanQrCustomerImg} alt="Customer Scans QR" className="w-full h-auto object-contain drop-shadow-xl relative z-10" />
            </div>
          </div>
          <div className="px-4 pb-6">
            <h3 className="text-xl md:text-2xl font-bold mb-3 text-[#0B1A30]">Customer Scans QR</h3>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              Your customer scans the QR code with their phone. A simple, mobile-friendly feedback screen opens.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex flex-col bg-white rounded-[2.5rem] p-4 shadow-xl shadow-slate-200/40 border border-slate-100 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300">
          <div className="w-full aspect-[4/3] rounded-[2rem] bg-[#F6EEFA] relative flex items-center justify-center p-6 mb-6 overflow-hidden">
            {/* Number badge */}
            <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center z-20 shadow-md">
              4
            </div>
            
            {/* Illustration */}
            <div className="relative w-full max-w-[300px] z-10 flex items-center justify-center scale-125">
              <img src={rateYourExperienceImg} alt="Rate Your Experience" className="w-full h-auto object-contain drop-shadow-xl relative z-10" />
            </div>
          </div>
          <div className="px-4 pb-6">
            <h3 className="text-xl md:text-2xl font-bold mb-3 text-[#0B1A30]">Rate Your Experience</h3>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              The customer selects their genuine rating and shares their feedback (optional).
            </p>
          </div>
        </div>

        {/* Step 5 */}
        <div className="flex flex-col bg-white rounded-[2.5rem] p-4 shadow-xl shadow-slate-200/40 border border-slate-100 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300">
          <div className="w-full aspect-[4/3] rounded-[2rem] bg-[#EEF5FC] relative flex items-center justify-center p-6 mb-6 overflow-hidden">
            {/* Number badge */}
            <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center z-20 shadow-md">
              5
            </div>
            
            {/* Illustration */}
            <div className="relative w-full max-w-[300px] z-10 flex items-center justify-center scale-125">
              <img src={reviewContinueImg} alt="Review and Continue" className="w-full h-auto object-contain drop-shadow-xl relative z-10" />
            </div>
          </div>
          <div className="px-4 pb-6">
            <h3 className="text-xl md:text-2xl font-bold mb-3 text-[#0B1A30]">Review & Continue</h3>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              The customer reviews their feedback, then clicks "Continue to Google" to be redirected to your business's original Google review page.
            </p>
          </div>
        </div>

        {/* Step 6 */}
        <div className="flex flex-col bg-white rounded-[2.5rem] p-4 shadow-xl shadow-slate-200/40 border border-slate-100 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300">
          <div className="w-full aspect-[4/3] rounded-[2rem] bg-[#F6EEFA] relative flex items-center justify-center p-4 mb-6 overflow-hidden">
            {/* Number badge */}
            <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center z-20 shadow-md">
              6
            </div>
            
            <div className="relative w-full z-10">
              {/* Browser Frame */}
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col h-40">
                {/* Browser Header */}
                <div className="h-6 bg-slate-100 border-b border-slate-200 flex items-center px-2 gap-1.5 shrink-0">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  </div>
                  <div className="bg-white rounded-md h-4 ml-2 flex-1 max-w-xs flex items-center px-2 text-[7px] text-slate-500">
                    <Search className="w-2 h-2 mr-1" /> google.com
                  </div>
                </div>
                
                {/* Browser Content */}
                <div className="p-3 relative flex-1 flex flex-col">
                  {/* Google header */}
                  <div className="flex items-center gap-1 mb-2">
                    <span className="font-serif font-bold text-blue-600 text-[10px]">Google</span>
                  </div>
                  
                  {/* Business listing skeleton */}
                  <h4 className="font-bold text-slate-800 text-[10px] mb-0.5">Your Business Name</h4>
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-[8px] font-bold text-slate-700">4.6</span>
                    <div className="flex gap-0">
                      <Star className="w-2 h-2 text-amber-400 fill-amber-400" />
                      <Star className="w-2 h-2 text-amber-400 fill-amber-400" />
                      <Star className="w-2 h-2 text-amber-400 fill-amber-400" />
                      <Star className="w-2 h-2 text-amber-400 fill-amber-400" />
                      <Star className="w-2 h-2 text-amber-400 fill-amber-400" />
                    </div>
                    <span className="text-[7px] text-slate-500">(128)</span>
                  </div>
                  
                  {/* Tabs */}
                  <div className="flex gap-3 border-b border-slate-200 mb-2">
                    <span className="text-[8px] text-slate-500 pb-1">Overview</span>
                    <span className="text-[8px] text-blue-600 font-bold border-b-2 border-blue-600 pb-1">Reviews</span>
                    <span className="text-[8px] text-slate-500 pb-1">Photos</span>
                  </div>
                  
                  {/* Review Modal UI overlay */}
                  <div className="absolute inset-x-2 bottom-2 bg-white rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] border border-slate-100 p-2 z-10 flex flex-col">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-bold text-slate-700">Share your experience</span>
                    </div>
                    <div className="flex gap-1 mb-1.5">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    </div>
                    <div className="w-full h-8 bg-slate-50 border border-slate-200 rounded p-1 mb-1.5 text-[7px] text-slate-700">
                      Great service and friendly staff!
                    </div>
                    <div className="flex justify-end gap-1">
                      <button className="px-2 py-0.5 rounded text-[7px] text-slate-500 hover:bg-slate-50">Cancel</button>
                      <button className="px-2 py-0.5 rounded bg-blue-600 text-[7px] text-white">Post</button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div className="px-4 pb-6">
            <h3 className="text-xl md:text-2xl font-bold mb-3 text-[#0B1A30]">Submit on Google</h3>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              They land on your business's official Google review page and paste/write their feedback in the review section, then click Submit.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
