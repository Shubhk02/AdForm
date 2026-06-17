import React, { useState, useRef, useEffect } from 'react';
import botLogo from '../assets/bot-logo.svg';

// ──────────────────────────────────────────────
//  Constants mirroring the form options
// ──────────────────────────────────────────────
const INDUSTRIES_LIST = ['F&B', 'Health & Wellness', 'Fashion', 'Beauty', 'Finance', 'EdTech', 'Retail', 'SaaS / Tech'];
const PERSONAS_LIST = ['Young professionals', 'Students', 'Fitness enthusiasts', 'Parents', 'HNI / affluent consumers', 'General audience'];
const CITIES_LIST = ['Gurgaon', 'Noida', 'South Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune'];
const BUDGET_OPTIONS = ['10k-50k', '50k-2L', '2L-5L', '5L+'];
const CREATIVES_OPTIONS = ['have_creatives', 'need_help', 'in_progress'];

// ──────────────────────────────────────────────
//  Offline fallback replies
// ──────────────────────────────────────────────
const getFallbackReply = (msg) => {
  const l = msg.toLowerCase();
  if (l.includes('brand name') || l.includes('what is brand')) return "Your brand name is what your company or product is called — e.g. \"Nike\", \"Zepto\", or \"Acme Health\". Enter it in the first field.";
  if (l.includes('industry') || l.includes('category')) return "Industry helps us match you with the right audience segments. Select all that apply — F&B, Health & Wellness, Fashion, Beauty, Finance, EdTech, Retail, or SaaS / Tech.";
  if (l.includes('budget')) return "Your monthly budget determines reach & coverage. Options: ₹10k–50k, ₹50k–2L, ₹2L–5L, or ₹5L+. Higher budgets unlock premium placements.";
  if (l.includes('creative') || l.includes('banner') || l.includes('design')) return "Creatives are your ad visuals. Choose: 'I have creatives ready', 'I need help creating them', or 'In progress — will share soon'.";
  if (l.includes('age') || l.includes('audience')) return "Age range lets you target the specific age group most likely to buy your product. Most brands target 25–44 for premium products.";
  if (l.includes('cit') || l.includes('location') || l.includes('geo')) return "We cover Delhi NCR (Gurgaon, Noida, South Delhi) and major metros. Select all areas where you want your ads to run.";
  if (l.includes('product')) return "List the key products or services you want to advertise. You can select from auto-detected ones or add your own on Step 2.";
  if (l.includes('timeline') || l.includes('go.live') || l.includes('launch')) return "Campaign setup takes a minimum of 3 business days. Most campaigns go live within 1 week of brief approval.";
  if (l.includes('price') || l.includes('cost') || l.includes('how much')) return "Our plans start at ₹10K/month. The budget you choose determines reach and frequency.";
  if (l.includes('persona') || l.includes('target')) return "Personas help us find your ideal customer. Choose: Young Professionals, Students, Fitness Enthusiasts, Parents, HNI / Affluent Consumers, or General Audience.";
  if (l.includes('hello') || l.includes('hi') || l.includes('hey') || l.includes('start')) return "Hi there! 👋 I'm your Campaign Assistant. Tell me about your brand, target audience, budget, or cities — I'll fill the form for you automatically!";
  return "I'm here to help fill your campaign brief! Try saying something like: \"My brand is Nike, we sell sportswear, target young professionals in Mumbai and Bangalore, budget is 2L-5L\" — I'll auto-fill the form!";
};

// ──────────────────────────────────────────────
//  Quick reply chip sets per step
// ──────────────────────────────────────────────
const QUICK_REPLIES_BY_STEP = {
  1: ['Fill brand details from my website', 'What industry should I pick?', 'Help me write a brand description'],
  2: ['What products should I advertise?', 'I need help with offers', 'Add a product manually'],
  3: ['Who is my target audience?', 'What age range is best?', 'Suggest personas for fashion brand'],
  4: ['What cities should I target?', 'Help me pick a budget', 'Explain creatives options'],
  5: ['Review my brief', 'Anything I should change?', 'Looks good, submit!']
};

// ──────────────────────────────────────────────
//  Main Component
// ──────────────────────────────────────────────
export default function ChatbotWidget({
  isOpen,
  toggleChat,
  state,
  applySuggestedUpdates,
  addToast,
  currentStep,
  setCurrentStep,
  triggerScrape,
  setShowWelcome
}) {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: "👋 Hi! I'm your Campaign Assistant. Tell me about your brand, target audience, cities, and budget — I'll fill the entire form for you!\n\nOr just ask me about any field and I'll explain it."
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addMessage = (role, content, suggestions = null, stepChange = null) => {
    setMessages((prev) => [...prev, { role, content, suggestions, stepChange }]);
  };

  // ──────────────────────────────────────────────
  //  Build a comprehensive system prompt
  // ──────────────────────────────────────────────
  const buildSystemPrompt = () => {
    return `You are an expert campaign onboarding assistant helping users fill out an advertising campaign brief form.

CURRENT FORM STATE:
${JSON.stringify(state, null, 2)}

CURRENT STEP: ${currentStep} of 5
Steps: 1=Brand Info, 2=Products, 3=Audience, 4=Geography & Budget, 5=Review

AVAILABLE FORM OPTIONS:
- industries: ${INDUSTRIES_LIST.join(', ')}
- personas: ${PERSONAS_LIST.join(', ')}
- cities: ${CITIES_LIST.join(', ')}
- budgetRange options: ${BUDGET_OPTIONS.join(', ')}
- creativesStatus options: "have_creatives" (I have creatives ready), "need_help" (Need help creating), "in_progress" (In progress)

YOUR TASK:
1. Parse what the user tells you about their brand/campaign
2. Extract as many field values as possible from their message
3. Return a friendly conversational reply AND any field updates you can make

FIELD MAPPING (use dot notation exactly as shown):
- brand.name → brand name
- brand.url → website URL
- brand.description → brand description (max 160 chars)
- brand.industries → array, pick from: ${INDUSTRIES_LIST.join(', ')}
- products.list → array of {name, url} objects
- products.selected → array of product names  
- products.offer.hasOffer → boolean
- products.offer.description → offer text
- audience.productAudiences → Object mapping product name (or "All Products") to audience config. E.g. {"All Products": {personas: ["Students"], ageRange: [18, 25], lifestyleContext: "..."}}
- geography.cities → array, pick from: ${CITIES_LIST.join(', ')}
- geography.specificAreas → more specific area details
- geography.budgetRange → one of: ${BUDGET_OPTIONS.join(', ')}
- geography.goLiveDate → ISO date string (YYYY-MM-DD), must be at least 3 days from today (${new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]})
- geography.creativesStatus → one of: "have_creatives", "need_help", "in_progress"

NAVIGATION:
If you've filled enough fields to advance to the next step or the user asks to move steps, include "navigateToStep": <step_number> (1-5) in your response.

IMPORTANT RULES:
- Be conversational, warm, and concise — max 3 sentences for reply
- Always acknowledge what you extracted
- If user says "fill everything" or gives a comprehensive brief, extract ALL possible fields at once
- If a field value is ambiguous, pick the closest match from the available options
- For go-live date, always pick at minimum 3 days from today
- Only suggest navigation when fields for that step are substantially filled
- Do NOT include markdown code blocks in your JSON output

Return ONLY this JSON structure, nothing else:
{
  "reply": "Friendly conversational reply (max 3 sentences)",
  "suggestedFieldUpdates": {
    "field.path": value
  },
  "navigateToStep": null
}`;
  };

  // ──────────────────────────────────────────────
  //  Send handler
  // ──────────────────────────────────────────────
  const handleSend = async (textOverride) => {
    const text = (textOverride || inputVal).trim();
    if (!text) return;
    setInputVal('');
    addMessage('user', text);
    setIsTyping(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error('No API key configured');

      // Build conversation history (last 12 messages)
      const chatHistory = messages.slice(-12).map((m) => ({
        role: m.role === 'bot' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      chatHistory.push({ role: 'user', parts: [{ text }] });

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: buildSystemPrompt() }] },
            contents: chatHistory,
            generationConfig: { responseMimeType: 'application/json' }
          }),
          signal: AbortSignal.timeout(20000)
        }
      );

      setIsTyping(false);

      if (!res.ok) throw new Error('API error ' + res.status);

      const json = await res.json();
      const resultText = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!resultText) throw new Error('Empty response');

      let data;
      try {
        data = JSON.parse(resultText);
      } catch (_) {
        // Try to extract JSON from response if it has extra text
        const match = resultText.match(/\{[\s\S]*\}/);
        if (match) data = JSON.parse(match[0]);
        else throw new Error('Invalid JSON');
      }

      const hasUpdates = data.suggestedFieldUpdates && Object.keys(data.suggestedFieldUpdates).length > 0;

      addMessage('bot', data.reply, hasUpdates ? data.suggestedFieldUpdates : null, data.navigateToStep || null);

    } catch (err) {
      setIsTyping(false);
      console.error('Chatbot error:', err);

      // Local fallback parser if API fails or key is missing
      const textLower = text.toLowerCase();
      let updates = {};
      let stepChange = null;

      // Brand
      if (textLower.includes('my brand is')) {
        const match = text.match(/my brand is\s+([^,.]+)/i);
        if (match) updates['brand.name'] = match[1].trim();
      }

      // Budget
      const budgetMatch = textLower.match(/(10k-50k|50k-2l|2l-5l|5l\+)/i);
      if (budgetMatch) updates['geography.budgetRange'] = budgetMatch[1];
      else if (textLower.includes('10k') || textLower.includes('50k')) updates['geography.budgetRange'] = '10k-50k';

      // Cities
      const foundCities = CITIES_LIST.filter(c => textLower.includes(c.toLowerCase()));
      if (foundCities.length > 0) updates['geography.cities'] = foundCities;

      // Industries
      const foundIndustries = INDUSTRIES_LIST.filter(i => textLower.includes(i.toLowerCase()));
      if (foundIndustries.length > 0) updates['brand.industries'] = foundIndustries;

      // Personas
      const foundPersonas = PERSONAS_LIST.filter(p => textLower.includes(p.toLowerCase()));
      let inferredPersonas = [];
      if (foundPersonas.length > 0) inferredPersonas = foundPersonas;
      else if (textLower.includes('student')) inferredPersonas = ['Students'];
      else if (textLower.includes('professional')) inferredPersonas = ['Young professionals'];

      // URL
      const urlMatch = text.match(/(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9.-]+\.(com|co|io|net|org))/i);
      if (urlMatch) updates['brand.url'] = urlMatch[0];

      // Age range fallback detection (e.g., "18 to 35" or "18-35")
      let inferredAgeRange = null;
      const ageMatch = text.match(/(\d{2})\s*(?:to|-)\s*(\d{2})/i);
      if (ageMatch) {
        inferredAgeRange = [parseInt(ageMatch[1]), parseInt(ageMatch[2])];
      }

      if (inferredPersonas.length > 0 || inferredAgeRange) {
        const productAudiences = { ...state.audience.productAudiences };
        const targetProducts = state.products.selected.length > 0 ? state.products.selected : ['All Products'];
        
        targetProducts.forEach(p => {
          if (!productAudiences[p]) {
            productAudiences[p] = { personas: [], customPersonas: [], ageRange: [25, 44], lifestyleContext: '' };
          }
          if (inferredPersonas.length > 0) productAudiences[p].personas = inferredPersonas;
          if (inferredAgeRange) productAudiences[p].ageRange = inferredAgeRange;
        });
        
        updates['audience.productAudiences'] = productAudiences;
      }

      const hasUpdates = Object.keys(updates).length > 0;

      let replyMsg = '';
      if (!import.meta.env.VITE_GEMINI_API_KEY && hasUpdates) {
        replyMsg = "I've extracted some details locally! (Add VITE_GEMINI_API_KEY to .env for smarter parsing)";
        if (updates['brand.url']) replyMsg += "\nI can also try fetching details from your website if you apply this!";
      } else if (hasUpdates) {
        replyMsg = "I found some details in your message. Would you like me to apply them?";
      } else {
        replyMsg = getFallbackReply(text);
      }

      addMessage('bot', replyMsg, hasUpdates ? updates : null, stepChange);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Apply updates and optionally navigate
  const handleApply = (updates, stepChange) => {
    applySuggestedUpdates(updates);
    addToast('✓ Form updated by assistant!', 'success');

    // Automatically hide welcome screen if user applies from chatbot
    if (setShowWelcome) {
      setShowWelcome(false);
    }

    // Auto-trigger scrape if a URL was extracted
    if (updates['brand.url'] && triggerScrape) {
      setTimeout(() => {
        triggerScrape();
      }, 300);
    }

    if (stepChange && stepChange !== currentStep) {
      setTimeout(() => {
        setCurrentStep(stepChange);
        addToast(`📍 Moved to Step ${stepChange}`, 'info');
      }, 600);
    }
  };

  const quickReplies = QUICK_REPLIES_BY_STEP[currentStep] || [];

  // ──────────────────────────────────────────────
  //  Render
  // ──────────────────────────────────────────────
  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-7 right-7 z-[200] w-[56px] h-[56px] rounded-full bg-white border border-slate-200 shadow-xl shadow-slate-900/10 hover:scale-105 active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer"
        aria-label="Toggle AI assistant"
      >
        {isOpen ? <span className="text-xl text-slate-500 font-bold">✕</span> : <img src={botLogo} alt="Bot" className="w-[40px] h-[40px]" />}
        {!isOpen && <div className="absolute top-1 right-1 w-[13px] h-[13px] rounded-full bg-rose-500 border-2 border-white" />}
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-0 right-0 z-[300] w-full sm:w-[390px] h-[600px] bg-white/95 border border-slate-200/80 rounded-t-3xl sm:rounded-t-3xl shadow-2xl shadow-slate-900/10 backdrop-blur-3xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/50 rounded-t-3xl flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-[34px] h-[34px] rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
              <img src={botLogo} alt="Bot" className="w-[24px] h-[24px]" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Campaign Assistant</div>
              <div className="text-[10px] text-emerald-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" /> Online 
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 bg-slate-50 rounded-full border border-slate-200">
              {['Brand', 'Product', 'Audience', 'Geography', 'Review'][currentStep - 1]}
            </div>
            <button onClick={toggleChat} className="text-slate-400 hover:text-slate-600 cursor-pointer text-sm">✕</button>
          </div>
        </div>

        {/* Message area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5" id="chatMessages">
          {messages.map((m, idx) => {
            const isBot = m.role === 'bot';
            return (
              <div key={idx} className={`flex gap-2.5 ${isBot ? '' : 'flex-row-reverse'}`}>
                <div className={`w-[28px] h-[28px] rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${
                  isBot ? 'bg-slate-50 border border-slate-100' : 'bg-slate-100 text-slate-500'
                }`}>
                  {isBot ? <img src={botLogo} alt="Bot" className="w-[20px] h-[20px]" /> : '👤'}
                </div>
                <div className="flex flex-col max-w-[82%] space-y-1.5">
                  <div
                    className={`text-xs px-4 py-2.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${isBot
                        ? 'bg-slate-50 border border-slate-200/50 text-slate-800'
                        : 'bg-gradient-to-r from-blue-900 via-blue-700 to-purple-500 text-white'
                      }`}
                  >
                    {m.content}
                  </div>

                  {/* Suggested field updates card */}
                  {m.suggestions && (
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200/60 rounded-2xl space-y-2 shadow-sm text-left">
                      <div className="text-[10px] font-bold text-blue-700 flex items-center gap-1">
                        ✦ Form fields ready to fill
                      </div>
                      <div className="space-y-1">
                        {Object.entries(m.suggestions).slice(0, 5).map(([key, val]) => (
                          <div key={key} className="flex items-start gap-1.5 text-[10px] text-slate-600">
                            <span className="text-emerald-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                            <span>
                              <span className="font-semibold text-slate-700">{key.split('.').pop()}:</span>{' '}
                              <span className="text-slate-500">
                                {Array.isArray(val) ? val.join(', ') : String(val).slice(0, 40)}
                              </span>
                            </span>
                          </div>
                        ))}
                        {Object.keys(m.suggestions).length > 5 && (
                          <div className="text-[10px] text-slate-400">+{Object.keys(m.suggestions).length - 5} more fields…</div>
                        )}
                      </div>
                      {m.stepChange && m.stepChange !== currentStep && (
                        <div className="text-[10px] text-blue-600 font-semibold flex items-center gap-1">
                          📍 Will navigate to Step {m.stepChange}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleApply(m.suggestions, m.stepChange)}
                        className="w-full py-2 bg-cyan-300 hover:bg-purple-200 text-slate-950 font-bold rounded-full text-[11px] cursor-pointer transition-colors shadow-sm flex items-center justify-center gap-1.5"
                      >
                        Apply to form ✦
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-2.5">
              <div className="w-[28px] h-[28px] rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                <img src={botLogo} alt="Bot" className="w-[20px] h-[20px]" />
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

        {/* Quick reply chips */}
        {!isTyping && (
          <div className="px-3 pb-2 flex gap-1.5 flex-wrap flex-shrink-0">
            {quickReplies.map((qr) => (
              <button
                key={qr}
                type="button"
                onClick={() => handleSend(qr)}
                className="px-2.5 py-1 bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-600 hover:text-blue-700 text-[10px] font-semibold rounded-full cursor-pointer transition-all whitespace-nowrap"
              >
                {qr}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div className="p-3 border-t border-slate-100 bg-white/50 flex gap-2 items-center flex-shrink-0">
          <textarea
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your brand, audience, budget, cities…"
            rows={1}
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 resize-none max-h-20 leading-relaxed"
          />
          <button
            onClick={() => handleSend()}
            disabled={isTyping || !inputVal.trim()}
            className="w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center text-xs hover:bg-cyan-600 transition-colors flex-shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            ✦
          </button>
        </div>
      </div>
    </>
  );
}
