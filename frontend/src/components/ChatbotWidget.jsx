import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, MoreHorizontal, ArrowUp, Sparkles } from 'lucide-react';
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
    const filteredHistory = savedHistory.filter(msg => !msg.message.includes("Hi there! I'm"));
    setHistory(filteredHistory);
  }, []);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(history));
    scrollToBottom();
  }, [history, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    
    const userMessage = { role: 'user', message: text.trim() };
    const currentHistory = [...history, userMessage];
    
    setHistory(currentHistory);
    setMessage('');
    setLoading(true);

    try {
      const response = await sendChatMessage({
        sessionId,
        message: userMessage.message,
        history: history.filter(h => h.role !== 'system')
      });
      
      setHistory(prev => [...prev, { role: 'model', message: response.reply }]);
    } catch (error) {
      setHistory(prev => [...prev, { role: 'model', message: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendMessage(message);
  };

  const suggestionChips = [
    "How to get more Google Reviews?",
    "Generate a custom QR code",
    "Tips for handling negative feedback"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white border border-slate-200 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] rounded-[2rem] w-[360px] sm:w-[420px] h-[650px] max-h-[85vh] flex flex-col mb-4 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-6 duration-300 origin-bottom-right relative">
          
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-slate-50 bg-white z-20 sticky top-0">
            <button onClick={() => setIsOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center">
              <span className="text-[#1A56DB] font-bold italic text-xl tracking-tight">lyra.AI<sup className="text-[10px] font-medium not-italic ml-0.5">beta</sup></span>
            </div>
            <button className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Content */}
          <div className="flex-1 overflow-y-auto bg-white p-5 space-y-6 scrollbar-hide flex flex-col">
            
            {/* Greeting & Chips Area */}
            {history.length === 0 && (
              <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-[#3B82F6] text-4xl font-bold mb-3 tracking-tight">Hi, There</h2>
                <p className="text-slate-800 text-base font-medium leading-relaxed mb-8">
                  I'm <span className="font-bold">Lyra</span> — your personal review assistant. Let's grow your business together.
                </p>

                <div className="flex flex-col gap-3">
                  {suggestionChips.map((chip, idx) => (
                    <button 
                      key={idx}
                      onClick={() => sendMessage(chip)}
                      className="text-left px-5 py-4 bg-white border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] rounded-[1.25rem] hover:border-blue-100 hover:shadow-md transition-all duration-300 text-slate-700 font-medium text-sm group"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {history.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                {msg.role === 'model' && (
                  <div className="flex items-center gap-1.5 mb-2 ml-1">
                    <span className="text-[#1A56DB] font-bold text-sm">Lyra</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#1A56DB]" />
                  </div>
                )}
                <div className={`max-w-[85%] px-5 py-3.5 text-[14.5px] leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-[#F3F4F6] text-slate-800 rounded-[1.5rem] rounded-tr-sm' 
                    : 'bg-white text-slate-800 rounded-[1.25rem] border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]'
                }`}>
                  {msg.message}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex flex-col items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-1.5 mb-2 ml-1">
                  <span className="text-[#1A56DB] font-bold text-sm">Lyra</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#1A56DB]" />
                </div>
                <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] px-5 py-4 flex gap-1.5 items-center h-[46px]">
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white z-20">
            <form onSubmit={handleSend} className="flex gap-2 items-center bg-slate-50 border border-slate-200 rounded-[2rem] p-1.5 pl-5 focus-within:ring-2 ring-blue-500/20 transition-all duration-300">
              <input 
                type="text" 
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Ask me anything"
                className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-800 placeholder:text-slate-400 font-medium"
              />
              <button 
                type="submit" 
                disabled={!message.trim() || loading}
                className="w-10 h-10 shrink-0 bg-[#3B82F6] hover:bg-blue-600 disabled:opacity-50 text-white rounded-full transition-all active:scale-95 flex items-center justify-center shadow-sm"
              >
                <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <div className="relative group">
          <button 
            onClick={() => setIsOpen(true)}
            className="relative bg-[#1A56DB] text-white p-4 rounded-full shadow-[0_4px_14px_rgba(26,86,219,0.4)] hover:shadow-[0_6px_20px_rgba(26,86,219,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center"
          >
            <MessageCircle className="w-7 h-7" />
          </button>
        </div>
      )}
    </div>
  );
}
