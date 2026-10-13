import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, QrCode, Sparkles, CheckCircle2, ShieldCheck, Share2 } from 'lucide-react';

export default function QRCodeGenerator({ business }) {
  const [frameText, setFrameText] = useState('SCAN TO LEAVE A REVIEW');
  const [frameColor, setFrameColor] = useState('#4f46e5'); // Indigo 600
  const [accentColor, setAccentColor] = useState('#0f172a'); // Slate 900
  const [offerText, setOfferText] = useState('🎁 Rate us & get a surprise gift!');
  const printRef = useRef(null);

  // Dynamic scanning target URL
  const qrUrl = window.location.origin + `/r/${business.id || 'bizz_101'}`;

  // Handle PNG Download
  const handleDownloadQR = () => {
    const svgElement = document.getElementById('qr-code-svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 100, 100, 800, 800);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${business.name.replace(/\s+/g, '_')}_Google_Review_QR.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handlePrintStandee = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 shadow-sm p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
            <QrCode className="w-5 h-5 text-indigo-600" />
            QR Code & Standee Studio
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Download high-res QR codes to display on tables, receipts, counters, or business cards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadQR}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4" /> Download PNG
          </button>
          <button
            onClick={handlePrintStandee}
            className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-sm border border-slate-200 flex items-center gap-2 transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" /> Print Standee
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Standee Live Preview */}
        <div className="lg:col-span-7 flex justify-center py-4 bg-slate-50/50 rounded-3xl border border-slate-100">
          <div
            ref={printRef}
            className="w-full max-w-[340px] bg-slate-50 text-slate-900 rounded-[2rem] shadow-2xl shadow-slate-300/50 border-[10px] border-white flex flex-col items-center text-center relative overflow-hidden"
          >
            {/* Top Colored Wave/Header */}
            <div 
              className="absolute top-0 left-0 w-full h-28 rounded-t-[1.5rem] opacity-90" 
              style={{ background: `linear-gradient(135deg, ${frameColor}, ${accentColor})` }} 
            />

            {/* Content Container */}
            <div className="relative z-10 w-full px-6 pt-16 pb-8 flex flex-col items-center">
              {/* Header Brand */}
              <div className="w-24 h-24 mx-auto rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-white flex items-center justify-center font-bold text-3xl text-indigo-600 mb-5 ring-1 ring-slate-100 relative group">
                {business.logo_url ? (
                  <img src={business.logo_url} alt={business.name} className="w-full h-full object-cover" />
                ) : (
                  business.name.substring(0, 2).toUpperCase()
                )}
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{business.name}</h3>
              <p className="text-xs text-slate-500 font-bold mt-1 opacity-80">{business.tagline || 'Your Business Tagline'}</p>

              {/* Call to Action Badge */}
              <div
                className="mt-6 mb-5 px-6 py-2.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase text-white shadow-lg w-max"
                style={{ backgroundColor: frameColor }}
              >
                {frameText}
              </div>

              {/* QR Code Container with Frame */}
              <div className="p-4 bg-white rounded-3xl border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] relative">
                {/* Scanner corners decorations */}
                <div className="absolute top-2 left-2 w-5 h-5 border-t-4 border-l-4 rounded-tl-lg transition-colors" style={{ borderColor: frameColor }}></div>
                <div className="absolute top-2 right-2 w-5 h-5 border-t-4 border-r-4 rounded-tr-lg transition-colors" style={{ borderColor: frameColor }}></div>
                <div className="absolute bottom-2 left-2 w-5 h-5 border-b-4 border-l-4 rounded-bl-lg transition-colors" style={{ borderColor: frameColor }}></div>
                <div className="absolute bottom-2 right-2 w-5 h-5 border-b-4 border-r-4 rounded-br-lg transition-colors" style={{ borderColor: frameColor }}></div>
                
                <QRCodeSVG
                  id="qr-code-svg"
                  value={qrUrl}
                  size={200}
                  bgColor="#ffffff"
                  fgColor={accentColor}
                  level="H"
                  includeMargin={true}
                  {...(business.logo_url && {
                    imageSettings: {
                      src: business.logo_url,
                      x: undefined,
                      y: undefined,
                      height: 48,
                      width: 48,
                      excavate: true,
                    }
                  })}
                />
              </div>

              {/* Subtext and Incentives */}
              <div className="mt-8 space-y-4 max-w-[260px]">
                <p className="text-[15px] font-black text-slate-800 leading-snug">{offerText}</p>
                <div className="inline-flex items-center justify-center gap-1 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3" /> Secure AI Review System
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customization Controls */}
        <div className="lg:col-span-5 bg-white border border-slate-200 shadow-sm p-6 rounded-2xl space-y-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            Customization Settings
          </h3>

          <div className="space-y-5 text-sm">
            <div>
              <label className="block text-slate-700 font-bold mb-2">Top Headline Banner</label>
              <input
                type="text"
                value={frameText}
                onChange={(e) => setFrameText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-2">Customer Incentive Subtext</label>
              <input
                type="text"
                value={offerText}
                onChange={(e) => setOfferText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-3">Banner Theme Color</label>
              <div className="flex gap-3">
                {['#4f46e5', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#0f172a'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setFrameColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform shadow-sm hover:scale-110 ${
                      frameColor === c ? 'scale-110 border-slate-900' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 mt-4">
              <span className="font-bold text-slate-700 block">Scannable URL Endpoint:</span>
              <code className="text-xs text-indigo-600 bg-white border border-indigo-100 p-2.5 rounded-lg block break-all font-mono shadow-sm">
                {qrUrl}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
