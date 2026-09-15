import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, MoreHorizontal, ArrowUp, Sparkles, MapPin, Bookmark, ArrowDown, ChevronDown, ChevronUp } from 'lucide-react';
import { sendChatMessage } from '../services/apiService';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState(() => {
    try {
      const savedHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
      return savedHistory.filter(msg => !msg?.message?.includes("Hi there! I'm"));
    } catch {
      return [];
    }
  });
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

  // Helper to parse markdown-like text and extract [CARD: {}] JSON
  const parseMessage = (msgText) => {
    if (!msgText) return { parts: [], card: null, chips: [] };
    let text = msgText;
    let card = null;
    let chips = [];

    // 1. Extract [CHIPS: item1|item2]
    const chipsRegex = /\[CHIPS:\s*(.*?)\s*\]/is;
    const chipsMatch = text.match(chipsRegex);
    if (chipsMatch) {
      chips = chipsMatch[1].split('|').map(c => c.trim()).filter(Boolean);
      text = text.replace(chipsRegex, '');
    }

    // 2. Extract [CARD: JSON]
    const cardRegex = /\[CARD:\s*(\{.*?\})\s*\]/is;
    const match = text.match(cardRegex);
    if (match) {
      try {
        card = JSON.parse(match[1]);
        text = text.replace(cardRegex, ''); // Remove tag
      } catch (e) {
        console.error("Failed to parse card JSON", e);
      }
    }

    // 3. Parse **bold** and newlines
    const parts = text.split(/(\*\*.*?\*\*|\n)/g).filter(Boolean);
    return { parts, card, chips };
  };

  const LoadingAccordion = () => {
    const [step, setStep] = useState(0);
    const steps = [
      { title: "Moving ahead confidently", desc: "Gathering the best solutions for you." },
      { title: "Mapping the destination...", desc: "I'm organizing highlights by usefulness — what to do, where to stay oriented, and what to watch for." }
    ];

    useEffect(() => {
      const t1 = setTimeout(() => setStep(1), 1500);
      return () => clearTimeout(t1);
    }, []);

    return (
      <div className="flex flex-col items-start w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center gap-1.5 mb-2 ml-1">
          <span className="text-[#1A56DB] font-bold text-sm">Lyra</span>
          <Sparkles className="w-3.5 h-3.5 text-[#1A56DB]" />
        </div>
        <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-4 w-full sm:w-[90%]">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-[#1A56DB] animate-pulse" />
            <span className="font-semibold text-slate-800 text-[15px]">Working on your request...</span>
          </div>
          
          <div className="space-y-2">
            {steps.map((s, i) => (
              <div key={i} className="border-t border-slate-50 pt-2 transition-all duration-300">
                <div className="flex justify-between items-center text-[13.5px] font-medium text-slate-700">
                  <span className={i === step ? "text-slate-800" : "text-slate-500"}>{s.title}</span>
                  {i === step ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-300" />}
                </div>
                {i === step && (
                  <div className="mt-2 text-[12.5px] text-slate-500 leading-relaxed animate-in slide-in-from-top-1 duration-300">
                    {s.desc}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

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
            {history.map((msg, idx) => {
              const { parts, card, chips } = msg.role === 'model' ? parseMessage(msg.message) : { parts: [msg.message], card: null, chips: [] };
              
              return (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300 w-full`}>
                  {msg.role === 'model' && (
                    <div className="flex items-center gap-1.5 mb-2 ml-1">
                      <span className="text-[#1A56DB] font-bold text-sm">Lyra</span>
                      <Sparkles className="w-3.5 h-3.5 text-[#1A56DB]" />
                    </div>
                  )}
                  
                  <div className={`max-w-[90%] sm:max-w-[85%] ${
                    msg.role === 'user' 
                      ? 'bg-[#F3F4F6] text-slate-800 rounded-[1.5rem] rounded-tr-sm px-5 py-3.5 text-[14.5px] leading-relaxed' 
                      : 'bg-white text-slate-800 rounded-[1.25rem] border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] p-0'
                  }`}>
                    {msg.role === 'user' ? (
                      msg.message
                    ) : (
                      <div className="flex flex-col">
                        <div className="px-5 py-4 text-[14.5px] leading-relaxed">
                          {parts.map((part, i) => {
                            if (part === '\n') return <br key={i} />;
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
                            }
                            return <span key={i}>{part}</span>;
                          })}
                        </div>
                        
                        {card && (
                          <div className="px-5 pb-5 pt-2 border-t border-slate-50">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-6 h-6 rounded-full bg-[#06b6d4] flex items-center justify-center shadow-sm">
                                <MapPin className="w-3.5 h-3.5 text-white" />
                              </div>
                              <span className="font-bold text-[14px] text-slate-800">Business Overview</span>
                            </div>
                            
                            <div className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm group cursor-pointer hover:shadow-md transition-all duration-300">
                              <div className="h-[140px] w-full bg-slate-200 relative overflow-hidden">
                                <img src={card.image} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute top-3 right-3 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:bg-white">
                                  <Bookmark className="w-3.5 h-3.5 text-slate-700" />
                                </div>
                              </div>
                              <div className="p-4 bg-slate-50/50">
                                <h4 className="font-bold text-slate-800 text-[16px]">{card.title}</h4>
                                <div className="flex items-center gap-1.5 mt-1 mb-3 text-slate-500 text-[13px] font-medium">
                                  <MapPin className="w-3.5 h-3.5" />
                                  {card.subtitle}
                                </div>
                                <button className="w-full py-2 bg-white rounded-xl border border-slate-200 text-[#06b6d4] font-semibold text-[13.5px] flex items-center justify-center gap-1.5 shadow-sm hover:bg-[#06b6d4] hover:text-white hover:border-[#06b6d4] transition-all">
                                  {card.action} <ArrowDown className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Contextual Suggestion Chips (Only for the latest message) */}
                  {chips && chips.length > 0 && idx === history.length - 1 && !loading && (
                    <div className="flex flex-wrap gap-2 mt-3 ml-1 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150 fill-mode-both">
                      {chips.map((chip, i) => (
                        <button 
                          key={i}
                          onClick={() => sendMessage(chip)}
                          className="px-4 py-2 bg-white border border-[#1A56DB]/20 text-[#1A56DB] text-[13.5px] font-medium rounded-full shadow-[0_2px_8px_-2px_rgba(26,86,219,0.15)] hover:bg-[#1A56DB] hover:text-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {loading && <LoadingAccordion />}
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
