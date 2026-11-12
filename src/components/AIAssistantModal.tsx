import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, Bot, User, ArrowRight, CornerDownLeft, RefreshCcw, Search, Check } from 'lucide-react';
import { CategoryId } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  suggestedChips?: string[];
  recommendedCategory?: CategoryId | null;
  searchKeyword?: string;
}

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  onApplySearchKeyword: (keyword: string, category?: CategoryId | null) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  initialPrompt,
  onApplySearchKeyword,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I'm your **BASKT AI Concierge**. 

Need an item but haven't settled on a specific brand or model? I will help you narrow down the key features (like **silent vs. gaming** for a mouse, **automatic vs. quartz** for a watch, or **notes & sillage** for perfumes).

What everyday item are you looking for today?`,
      suggestedChips: [
        '🖱️ I need a mouse',
        '⌚ Looking for an everyday watch',
        '✨ Signature office perfume',
        '🎒 Leather commuter bag',
        '🍵 Ceremonial matcha & food',
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.reply || 'Here are my personalized recommendations based on your preferences.',
        suggestedChips: data.suggestedChips || [],
        recommendedCategory: data.recommendedCategory,
        searchKeyword: data.searchKeyword,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      // Fallback response
      const fallbackReply = generateClientFallback(text);
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateClientFallback = (query: string): Message => {
    const q = query.toLowerCase();
    if (q.includes('mouse')) {
      return {
        id: Date.now().toString(),
        sender: 'assistant',
        text: `To narrow down your mouse selection:
- **Silent & Ergonomic for Work**: The **Logitech MX Master 3S** (~$119) with MagSpeed scrolling and 8000 DPI sensor.
- **Ultra-lightweight for Gaming**: Look at Razer Viper or DeathAdder series (~$140–$220).
- **Vertical Ergonomic**: For wrist strain relief, consider the Logitech Lift.

Would you prefer a silent productivity mouse or high-performance gaming?`,
        suggestedChips: ['Silent / Ergonomic Work', 'Competitive Gaming', 'Under $120', 'Show Logitech MX Master 3S'],
        recommendedCategory: 'electronics',
        searchKeyword: 'Logitech MX Master 3S',
      };
    }

    if (q.includes('watch')) {
      return {
        id: Date.now().toString(),
        sender: 'assistant',
        text: `For elevated watches between $150 and $1,200:
- **Everyday Swiss Mechanical**: **Tissot PRX Powermatic 80** (~$760) with 80 hours power reserve.
- **Japanese GMT Automatic**: **Seiko 5 Sports GMT** (~$445).
- **Heritage Field**: **Hamilton Khaki Field Mechanical** (~$598).

Do you prefer a stainless steel integrated bracelet, a leather strap, or a rugged NATO strap?`,
        suggestedChips: ['Automatic Mechanical', 'Integrated Steel Bracelet', 'Under $500', 'Show Tissot PRX'],
        recommendedCategory: 'watches',
        searchKeyword: 'Tissot PRX',
      };
    }

    return {
      id: Date.now().toString(),
      sender: 'assistant',
      text: `Based on your request, I recommend comparing models in our curated elevated catalog. What is your preferred price point and primary use case?`,
      suggestedChips: ['Under $200', 'Best Value', 'Fastest SG Delivery', 'Top Rated'],
      recommendedCategory: null,
      searchKeyword: '',
    };
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[650px] max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/30 border border-blue-400/40 flex items-center justify-center text-amber-300 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">BASKT AI Concierge</h3>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                  Gemini Powered
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Helps suggest features and narrow down selection (PDF Page 2 Scenario)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat message stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2`}>
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-none prose-sm'
                    }`}
                  >
                    <div className="whitespace-pre-line">{m.text}</div>
                  </div>

                  {/* Recommendation action box if keyword present */}
                  {m.searchKeyword && (
                    <div className="bg-blue-50 border border-blue-200 p-2.5 rounded-xl flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="text-[11px] text-blue-600 font-semibold">Matched BASKT Item:</div>
                        <div className="font-bold text-blue-900">{m.searchKeyword}</div>
                      </div>
                      <button
                        onClick={() => {
                          onApplySearchKeyword(m.searchKeyword!, m.recommendedCategory);
                          onClose();
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition cursor-pointer"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>Filter Deals</span>
                      </button>
                    </div>
                  )}

                  {/* Interactive Quick Reply Suggestion Chips */}
                  {m.suggestedChips && m.suggestedChips.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {m.suggestedChips.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(chip)}
                          className="bg-white hover:bg-blue-50 text-blue-700 hover:text-blue-900 border border-blue-200 hover:border-blue-300 rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer shadow-2xs active:scale-95"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 p-3.5 rounded-2xl rounded-bl-none text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                <span>BASKT AI is narrowing down features and prices...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your need (e.g. 'I need a silent mouse for office', 'Mechanical watch under $500')..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl shadow-sm transition active:scale-95 cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
