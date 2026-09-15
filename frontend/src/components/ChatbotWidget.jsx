import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { sendChatMessage } from '../services/apiService';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Generate or retrieve a session ID for the chatbot
    let sid = localStorage.getItem('chatSessionId');
    if (!sid) {
      sid = 'session_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('chatSessionId', sid);
    }
    setSessionId(sid);
    
    // Load initial greeting if empty
    const savedHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    if (savedHistory.length > 0) {
      setHistory(savedHistory);
    } else {
      setHistory([{ role: 'model', message: "Hi there! I'm your Proexima Assistant. How can I help you grow your business with QR reviews today?" }]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(history));
    scrollToBottom();
  }, [history, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = { role: 'user', message: message.trim() };
    const currentHistory = [...history, userMessage];
    
    setHistory(currentHistory);
    setMessage('');
    setLoading(true);

    try {
      const response = await sendChatMessage({
        sessionId,
        message: userMessage.message,
        history: history.filter(h => h.role !== 'system') // exclude system messages if any
      });
      
      setHistory(prev => [...prev, { role: 'model', message: response.reply }]);
    } catch (error) {
      setHistory(prev => [...prev, { role: 'model', message: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-slate-50/90 backdrop-blur-2xl border border-white/50 shadow-2xl shadow-slate-900/10 rounded-[2rem] w-[360px] sm:w-[420px] h-[600px] flex flex-col mb-4 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-6 duration-300 origin-bottom-right relative">
          
          {/* Splash Screen */}
          {!hasStarted ? (
            <div className="absolute inset-0 z-50 flex flex-col justify-end p-8" style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%)' }}>
              {/* Decorative 3D Bubbles */}
              <div className="absolute top-[-10%] right-[-20%] w-72 h-72 rounded-full opacity-60 mix-blend-multiply" style={{ background: 'radial-gradient(circle at 30% 30%, #38bdf8, #0284c7)' }}></div>
              <div className="absolute top-[20%] left-[-20%] w-80 h-80 rounded-full opacity-60 mix-blend-multiply" style={{ background: 'radial-gradient(circle at 30% 30%, #7dd3fc, #0ea5e9)' }}></div>
              <div className="absolute bottom-[30%] right-[10%] w-24 h-24 rounded-full opacity-40 mix-blend-multiply" style={{ background: 'radial-gradient(circle at 30% 30%, #bae6fd, #0284c7)' }}></div>
              
              {/* Close Button on Splash Screen */}
              <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 bg-white/20 hover:bg-white/40 backdrop-blur-md text-[#0B1A30] p-2 rounded-full transition-all z-10">
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="relative z-10 mb-12">
                <h2 className="text-[#0B1A30] text-[2.5rem] leading-[1.1] font-bold tracking-tight mb-8">
                  ONE<br />
                  ASSISTANT.<br />
                  MANY WAYS<br />
                  TO HELP.
                </h2>
                <button 
                  onClick={() => setHasStarted(true)}
                  className="w-full bg-white text-[#0A39AB] font-bold py-4 rounded-full shadow-xl shadow-blue-900/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Get Started
                </button>
              </div>
            </div>
          ) : (
            <>
            <div className="absolute inset-0 flex flex-col z-10" style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%)' }}>
              {/* Decorative 3D Bubbles */}
              <div className="absolute top-[-10%] right-[-20%] w-72 h-72 rounded-full opacity-60 mix-blend-multiply pointer-events-none" style={{ background: 'radial-gradient(circle at 30% 30%, #38bdf8, #0284c7)' }}></div>
              <div className="absolute top-[40%] left-[-20%] w-80 h-80 rounded-full opacity-60 mix-blend-multiply pointer-events-none" style={{ background: 'radial-gradient(circle at 30% 30%, #7dd3fc, #0ea5e9)' }}></div>
              <div className="absolute bottom-[10%] right-[10%] w-32 h-32 rounded-full opacity-40 mix-blend-multiply pointer-events-none" style={{ background: 'radial-gradient(circle at 30% 30%, #bae6fd, #0284c7)' }}></div>

              {/* Header */}
              <div className="p-5 flex justify-between items-center z-20 relative">
                <div className="w-8"></div> {/* spacer for centering */}
                <h3 className="font-semibold text-slate-800 text-lg tracking-tight">Proexima AI Assistance</h3>
                <button onClick={() => { setIsOpen(false); setHasStarted(false); }} className="bg-white/40 hover:bg-white/60 text-[#0B1A30] p-2 rounded-full transition-all backdrop-blur-md">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6 z-20 relative scrollbar-hide">
                {history.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`max-w-[85%] rounded-[1.5rem] px-5 py-3.5 text-[14.5px] leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-white text-slate-800 rounded-br-sm' 
                        : 'bg-white text-slate-800 rounded-bl-sm'
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-white rounded-[1.5rem] rounded-bl-sm px-5 py-4 shadow-sm flex gap-1.5 items-center h-[46px]">
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-5 z-20 relative">
                <form onSubmit={handleSend} className="flex gap-2 items-center bg-white/90 backdrop-blur-md border border-white/50 shadow-lg rounded-[2rem] p-1.5 pl-6 focus-within:ring-4 ring-blue-500/20 transition-all duration-300">
                  <input 
                    type="text" 
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Your message..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-800 placeholder:text-slate-500 font-medium"
                  />
                  <button 
                    type="submit" 
                    disabled={!message.trim() || loading}
                    className="bg-[#0A39AB] hover:bg-blue-800 disabled:opacity-50 text-white p-3 rounded-full transition-all active:scale-95 flex items-center justify-center"
                  >
                    <Send className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" />
                  </button>
                </form>
              </div>
            </div>
            </>
          )}
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <div className="relative group">
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300 animate-pulse"></div>
          <button 
            onClick={() => setIsOpen(true)}
            className="relative bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 text-white p-4 rounded-full shadow-[0_10px_25px_rgba(37,99,235,0.5),inset_0_4px_8px_rgba(255,255,255,0.4),inset_0_-4px_8px_rgba(0,0,0,0.2)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center border border-blue-300/30"
          >
            <MessageCircle className="w-8 h-8 drop-shadow-md" />
            {/* Notification dot */}
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full shadow-md animate-bounce" />
          </button>
        </div>
      )}
    </div>
  );
}
