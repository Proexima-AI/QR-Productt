import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { sendChatMessage } from '../services/apiService';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
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
        <div className="bg-slate-50/90 backdrop-blur-2xl border border-white/50 shadow-2xl shadow-slate-900/10 rounded-3xl w-[360px] sm:w-[420px] h-[600px] flex flex-col mb-4 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-6 duration-300 origin-bottom-right">
          {/* Header */}
          <div className="bg-white/60 backdrop-blur-md p-5 border-b border-slate-200/50 flex justify-between items-center z-10 relative">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/30">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base leading-tight">Proexima Assistant</h3>
                <p className="text-xs text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-500 p-2 rounded-full transition-all hover:scale-105 active:scale-95">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-transparent">
            {history.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md mr-3 flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-3xl px-5 py-3.5 text-[14px] leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-slate-900 text-white rounded-br-sm shadow-slate-900/10' 
                    : 'bg-white border border-slate-100/50 text-slate-700 rounded-bl-sm shadow-black/5'
                }`}>
                  {msg.message}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md mr-3 flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-slate-100/50 rounded-3xl rounded-bl-sm px-5 py-4 shadow-sm flex gap-1.5 items-center h-[46px]">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white/60 backdrop-blur-md border-t border-slate-200/50">
            <form onSubmit={handleSend} className="flex gap-2 items-center bg-white border border-slate-200 shadow-sm rounded-full p-1.5 pl-5 focus-within:border-indigo-500 focus-within:ring-4 ring-indigo-500/10 transition-all duration-300">
              <input 
                type="text" 
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-700 placeholder:text-slate-400 font-medium"
              />
              <button 
                type="submit" 
                disabled={!message.trim() || loading}
                className="bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 disabled:opacity-50 text-white p-2.5 rounded-full transition-all shadow-md shadow-indigo-500/20 active:scale-95"
              >
                <Send className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <div className="relative group">
          <div className="absolute inset-0 bg-indigo-500 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300 animate-pulse"></div>
          <button 
            onClick={() => setIsOpen(true)}
            className="relative bg-gradient-to-tr from-indigo-600 to-violet-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center border border-white/20"
          >
            <MessageCircle className="w-8 h-8" />
            {/* Notification dot */}
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-bounce" />
          </button>
        </div>
      )}
    </div>
  );
}
