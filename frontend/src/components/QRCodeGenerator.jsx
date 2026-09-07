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
        <div className="lg:col-span-7 flex justify-center">
          <div
            ref={printRef}
            className="w-full max-w-sm bg-white text-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200/50 border-4 border-slate-100 flex flex-col items-center text-center space-y-6 relative overflow-hidden"
          >
            {/* Header Brand */}
            <div className="space-y-1">
              <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-indigo-50 flex items-center justify-center font-bold text-2xl text-indigo-600 mb-3">
                {business.logoUrl ? (
                  <img src={business.logoUrl} alt={business.name} className="w-full h-full object-cover" />
                ) : (
                  business.name.substring(0, 2).toUpperCase()
                )}
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{business.name}</h3>
              <p className="text-xs text-slate-500 font-medium">{business.tagline || 'Your Business Tagline'}</p>
            </div>

            {/* Call to Action Badge */}
            <div
              className="px-5 py-2 rounded-full text-xs font-black tracking-wider uppercase text-white shadow-md"
              style={{ backgroundColor: frameColor }}
            >
              {frameText}
            </div>

            {/* QR Code Container with Frame */}
            <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] inline-block relative">
              <QRCodeSVG
                id="qr-code-svg"
                value={qrUrl}
                size={220}
                bgColor="#ffffff"
                fgColor={accentColor}
                level="H"
                includeMargin={true}
              />
            </div>

            {/* Subtext and Incentives */}
            <div className="space-y-3 max-w-xs pt-2">
              <p className="text-sm font-bold text-slate-700">{offerText}</p>
              <div className="inline-flex items-center gap-1.5 text-[10px] text-slate-500 font-bold bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Powered by AI Review Assistant
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
