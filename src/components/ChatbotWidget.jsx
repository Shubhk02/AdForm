import React, { useState, useRef, useEffect } from 'react';

const getBotFallbackReply = (msg) => {
  const lower = msg.toLowerCase();
  if (lower.includes('brand name') || lower.includes('what is brand')) return "Your brand name is what your company or product is called — e.g. \"Nike\", \"Zepto\", or \"Acme Health\". Enter it in the first field on this step.";
  if (lower.includes('industry') || lower.includes('category')) return "Industry helps us match you with the right audience segments and inventory. Select all that apply to your brand — F&B, Health & Wellness, Fashion, etc.";
  if (lower.includes('budget')) return "Your monthly budget determines how many impressions and locations we can cover. Choose the range closest to your planned spend. You can always adjust this later.";
  if (lower.includes('creatives') || lower.includes('creative')) return "Creatives are your ad visuals — images, banners, or videos. If you already have them, great! If not, our design team can help create them for you.";
  if (lower.includes('age') || lower.includes('audience')) return "Age range lets you target the specific age group most likely to buy your product. Drag the sliders to set your min and max. Most brands target 25–44 for premium products.";
  if (lower.includes('cities') || lower.includes('location') || lower.includes('geo')) return "We currently cover Delhi NCR (Gurgaon, Noida, South Delhi) and other major metros. Select all areas where you want your ads to run.";
  if (lower.includes('timeline') || lower.includes('how long')) return "Campaign setup takes a minimum of 3 business days from your go-live date. Most campaigns go live within 1 week of brief approval.";
  if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) return "Our plans start at ₹10K/month. The budget you choose determines reach and frequency. Higher budgets unlock premium placements and wider geography.";
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) return "Hi there! 👋 I'm here to help you fill out your campaign brief. Ask me about any field, or tell me about your brand and I'll guide you through!";
  return "Great question! I'm here to help guide you through the campaign brief. Could you be more specific? For example, you can ask about any field like \"What does age range mean?\" or \"How do I choose my budget?\"";
};

export default function ChatbotWidget({
  isOpen,
  toggleChat,
  state,
  applySuggestedUpdates,
  addToast
}) {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: "👋 Hi! I'm your Campaign Assistant. I can help you fill out this brief, explain any field, or suggest targeting options. What would you like to know?"
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addMessage = (role, content, suggestions = null) => {
    setMessages((prev) => [...prev, { role, content, suggestions }]);
  };

  const handleSend = async () => {
    const text = inputVal.trim();
    if (!text) return;
    setInputVal('');
    addMessage('user', text);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: state.sessionId,
          message: text,
          formState: state,
          history: messages.slice(-10).map((m) => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.content }))
        }),
        signal: AbortSignal.timeout(10000)
      });

      setIsTyping(false);

      if (res.ok) {
        const data = await res.json();
        addMessage('bot', data.reply, data.suggestedFieldUpdates);
      } else {
        throw new Error();
      }
    } catch (_) {
      setIsTyping(false);
      const fallback = getBotFallbackReply(text);
      addMessage('bot', fallback);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleApply = (updates) => {
    applySuggestedUpdates(updates);
    addToast('✓ Suggestion applied!', 'success');
  };

  return (
    <>
      {/* Floating Trigger button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-7 right-7 z-[200] w-[52px] h-[52px] rounded-full bg-gradient-to-br from-blue-900 to-blue-600 text-white shadow-xl shadow-blue-500/35 hover:scale-105 active:scale-[0.98] transition-all flex items-center justify-center text-xl cursor-pointer"
        aria-label="Toggle AI assistant"
      >
        {isOpen ? '✕' : '💬'}
        {!isOpen && <div className="absolute -top-[2px] -right-[2px] w-[13px] h-[13px] rounded-full bg-rose-500 border-2 border-white" />}
      </button>

      {/* Slide-in Chat panel */}
      <div
        className={`fixed bottom-0 right-0 z-[300] w-full sm:w-[375px] h-[550px] bg-white/95 border border-slate-200/80 rounded-t-3xl sm:rounded-t-3xl shadow-2xl shadow-slate-900/10 backdrop-blur-3xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/50 rounded-t-3xl">
          <div className="flex items-center gap-2.5">
            <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-blue-900 to-blue-600 text-white flex items-center justify-center font-bold text-xs">
              ✦
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Campaign Assistant</div>
              <div className="text-[10px] text-emerald-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" /> Online
              </div>
            </div>
          </div>
          <button onClick={toggleChat} className="text-slate-400 hover:text-slate-600 cursor-pointer text-sm">
            ✕
          </button>
        </div>

        {/* Message area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5" id="chatMessages">
          {messages.map((m, idx) => {
            const isBot = m.role === 'bot';
            return (
              <div key={idx} className={`flex gap-2.5 ${isBot ? '' : 'flex-row-reverse'}`}>
                <div className={`w-[28px] h-[28px] rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${
                  isBot ? 'bg-gradient-to-br from-blue-900 to-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {isBot ? '✦' : '👤'}
                </div>
                <div className={`flex flex-col max-w-[80%] space-y-1.5`}>
                  <div
                    className={`text-xs px-4 py-2.5 rounded-2xl leading-relaxed ${
                      isBot
                        ? 'bg-slate-50 border border-slate-200/50 text-slate-800'
                        : 'bg-gradient-to-br from-blue-900 to-blue-600 text-white'
                    }`}
                  >
                    {m.content}

                    {/* Actionable update recommendations */}
                    {m.suggestions && (
                      <div className="mt-3 p-3 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-sm text-left">
                        <div className="text-[10px] font-bold text-cyan-600">💡 Suggested update</div>
                        <div className="text-[11px] text-slate-600 font-semibold uppercase tracking-wider">
                          {Object.keys(m.suggestions).join(', ')}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleApply(m.suggestions)}
                          className="w-full py-1.5 bg-cyan-50/50 border border-cyan-100 hover:bg-cyan-100/50 text-cyan-600 font-bold rounded-lg text-[10px] cursor-pointer transition-all"
                        >
                          Apply suggestion ✓
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator bubble */}
          {isTyping && (
            <div className="flex gap-2.5">
              <div className="w-[28px] h-[28px] rounded-full bg-gradient-to-br from-blue-900 to-blue-600 text-white flex items-center justify-center text-[10px]">
                ✦
              </div>
              <div className="bg-slate-50 border border-slate-200/50 px-4 py-3 rounded-2xl flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <div className="p-3 border-t border-slate-100 bg-white/50 flex gap-2 items-center">
          <textarea
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            rows={1}
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-blue-600 resize-none max-h-20"
          />
          <button
            onClick={handleSend}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-900 to-blue-600 text-white flex items-center justify-center text-xs hover:scale-105 active:scale-95 transition-all flex-shrink-0 cursor-pointer"
            aria-label="Send message"
          >
            ➤
          </button>
        </div>
      </div>
    </>
  );
}
