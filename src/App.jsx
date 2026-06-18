import React, { useState, useEffect } from 'react';
import CardProgressBar from './components/CardProgressBar';
import Step1Brand from './components/Step1Brand';
import Step2Product from './components/Step2Product';
import Step3Audience from './components/Step3Audience';
import Step4Geography from './components/Step4Geography';
import Step5Review from './components/Step5Review';
import ChatbotWidget from './components/ChatbotWidget';
import ConfirmationPage from './components/ConfirmationPage';
import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import adometerLogoWhite from './assets/adometer-logo.png';
import adometerLogoBlack from './assets/adometer-logo-black.png';

// Helper to generate Session ID
const generateId = () => {
  return 'BRIEF-' + Math.random().toString(36).substr(2, 6).toUpperCase();
};

const normalizeUrl = (str) => {
  let val = str.trim();
  if (!val) return '';
  if (!/^https?:\/\//i.test(val)) {
    val = 'https://' + val;
  }
  return val;
};

const isValidUrl = (str) => {
  const normalized = normalizeUrl(str);
  try {
    const u = new URL(normalized);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

const defaultState = {
  brand: { name: '', url: '', industries: [], description: '', isScraped: false },
  products: { list: [], selected: [], offer: { hasOffer: false, description: '', isScraped: false }, isScraped: false },
  audience: { productAudiences: { 'All Products': { personas: [], customPersonas: [], ageRange: [25, 44], lifestyleContext: '' } } },
  geography: { cities: [], specificAreas: '', budgetRange: '', goLiveDate: '', creativesStatus: '' },
  sessionId: generateId()
};

export default function App() {
  const [state, setState] = useState(defaultState);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [briefId, setBriefId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastScrapedUrl, setLastScrapedUrl] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  // Scraper loading state
  const [scraperState, setScraperState] = useState({
    loading: false,
    type: '',
    message: ''
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Load state on startup (support Firebase resuming)
  useEffect(() => {
    const initSession = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const ses = params.get('session');
        if (ses) {
          const docRef = doc(db, 'drafts', ses);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data().formData;
            setState(data);
            setShowWelcome(false);
            addToast('📋 Resumed campaign intake session', 'info');
            return;
          }
        }
      } catch (_) { }
    };
    initSession();
  }, []);

  // Save state on changes
  const saveState = (newState) => {
    setState(newState);
    try {
      localStorage.setItem('adometer_state', JSON.stringify(newState));
    } catch (_) { }

    // Auto-save draft to Firestore
    try {
      setDoc(doc(db, 'drafts', newState.sessionId), {
        formData: newState,
        updatedAt: new Date().toISOString()
      });
    } catch (_) { }
  };

  const addToast = (msg, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // State modification helpers
  const updateBrandField = (field, value) => {
    const newState = {
      ...state,
      brand: { ...state.brand, [field]: value }
    };
    saveState(newState);

    // Clear validation error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const updateOfferField = (field, value) => {
    const newState = {
      ...state,
      products: {
        ...state.products,
        offer: { ...state.products.offer, [field]: value }
      }
    };
    saveState(newState);
  };

  const updateAudienceField = (field, value) => {
    const newState = {
      ...state,
      audience: { ...state.audience, [field]: value }
    };
    saveState(newState);

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const updateGeographyField = (field, value) => {
    const newState = {
      ...state,
      geography: { ...state.geography, [field]: value }
    };
    saveState(newState);

    // Dynamic chatbot trigger: if user chooses "need_help" for creatives, automatically open chatbot
    if (field === 'creativesStatus' && value === 'need_help') {
      setTimeout(() => {
        setChatOpen(true);
      }, 500);
    }

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const toggleCity = (city) => {
    const current = state.geography.cities;
    const newCities = current.includes(city)
      ? current.filter((c) => c !== city)
      : [...current, city];
    updateGeographyField('cities', newCities);
  };

  const toggleIndustry = (ind) => {
    const current = state.brand.industries;
    const newInds = current.includes(ind)
      ? current.filter((i) => i !== ind)
      : [...current, ind];
    updateBrandField('industries', newInds);
  };

  const toggleProduct = (name) => {
    const current = state.products.selected;
    const newSelected = current.includes(name)
      ? current.filter((n) => n !== name)
      : [...current, name];

    const newState = {
      ...state,
      products: { ...state.products, selected: newSelected }
    };
    saveState(newState);

    if (errors.selected) {
      setErrors((prev) => ({ ...prev, selected: '' }));
    }
  };

  const addManualProduct = (name) => {
    const currentList = state.products.list;
    const currentSelected = state.products.selected;

    // Avoid duplicates
    if (currentList.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      return;
    }

    const newState = {
      ...state,
      products: {
        ...state.products,
        list: [...currentList, { name }],
        selected: [...currentSelected, name]
      }
    };
    saveState(newState);

    if (errors.selected) {
      setErrors((prev) => ({ ...prev, selected: '' }));
    }
  };

  const updateProductAudience = (productNames, field, value) => {
    const products = Array.isArray(productNames) ? productNames : [productNames];

    setState((prevState) => {
      const currentAudiences = { ...prevState.audience.productAudiences };

      products.forEach((productName) => {
        const currentData = currentAudiences[productName] || { personas: [], customPersonas: [], ageRange: [25, 44], lifestyleContext: '' };
        
        let newValue = value;
        if (typeof value === 'function') {
          newValue = value(currentData[field]);
        }

        currentAudiences[productName] = {
          ...currentData,
          [field]: newValue
        };
      });

      return {
        ...prevState,
        audience: {
          ...prevState.audience,
          productAudiences: currentAudiences
        }
      };
    });

    if (errors.productAudiences) {
      setErrors((prev) => ({ ...prev, productAudiences: '' }));
    }
  };

  // Reset previously scraped information on URL change
  const resetScrapedData = (targetUrl) => {
    const newState = {
      ...state,
      brand: { ...state.brand, name: '', description: '', industries: [], isScraped: false, url: targetUrl },
      products: { list: [], selected: [], offer: { hasOffer: false, description: '', isScraped: false }, isScraped: false }
    };
    saveState(newState);
    setErrors({});
  };

  // Gemini API-based Scraper using AI Studio key
  const fetchGeminiScrapeData = async (urlVal, apiKey) => {
    let webText = '';

    // Helper: extract clean text from HTML string
    const extractText = (html) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      doc.querySelectorAll('script, style, noscript, svg, iframe, header, footer, nav, aside').forEach((el) => el.remove());
      return (doc.body?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 7000);
    };

    // CORS proxy list — tried sequentially with fallback
    const proxies = [
      {
        url: `https://corsproxy.io/?url=${encodeURIComponent(urlVal)}`,
        extract: async (res) => extractText(await res.text())
      },
      {
        url: `https://api.allorigins.win/get?url=${encodeURIComponent(urlVal)}`,
        extract: async (res) => extractText((await res.json()).contents || '')
      },
      {
        url: `https://thingproxy.freeboard.io/fetch/${encodeURIComponent(urlVal)}`,
        extract: async (res) => extractText(await res.text())
      },
      {
        url: `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(urlVal)}`,
        extract: async (res) => extractText(await res.text())
      }
    ];

    // Try first two in parallel, then fall back sequentially to the rest
    try {
      webText = await Promise.any(
        proxies.slice(0, 2).map(async ({ url, extract }) => {
          const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
          if (!res.ok) throw new Error('Proxy failed');
          const text = await extract(res);
          if (!text || text.length < 50) throw new Error('No useful content');
          return text;
        })
      );
    } catch (_) {
      // Sequential fallback through remaining proxies
      for (const { url, extract } of proxies.slice(2)) {
        try {
          const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
          if (!res.ok) continue;
          const text = await extract(res);
          if (text && text.length >= 50) {
            webText = text;
            break;
          }
        } catch (_) {
          continue;
        }
      }
    }

    if (!webText) {
      console.warn('All scraping proxies failed — using URL/domain only for AI inference.');
    }

    const prompt = `You are an expert campaign onboarding assistant. The user provided the following website URL or brand name: "${urlVal}".
Please use Google Search to find the official website and gather the most accurate and up-to-date information about this brand.

If needed, here is some text extracted from the URL as additional context:
---
${webText || "No text could be extracted."}
---

Extract details and return ONLY a valid JSON object matching the following structure. Do NOT include markdown code blocks (like \`\`\`json):
{
  "brandUrl": "The exact official website URL (e.g. https://brand.com)",
  "brandName": "Official name of the brand",
  "description": "Short description of what they do or sell (must be under 160 characters)",
  "industries": ["Strictly select ONLY the most relevant industry categories (usually 1, maximum 2) from this list that directly describe the brand: F&B, Health & Wellness, Fashion, Beauty, Finance, EdTech, Retail, SaaS / Tech. Do not select multiple unrelated industries."],
  "products": [
    { "name": "Exact or suggested main product 1", "url": "/products/1" },
    { "name": "Exact or suggested main product 2", "url": "/products/2" },
    { "name": "Exact or suggested main product 3", "url": "/products/3" }
  ],
  "activeOffers": [
    { "text": "Details of any active discount/coupon code/offer found on the site. If none found, write: Get 10% off your first order using code WELCOME10" }
  ]
}`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        tools: [{ googleSearch: {} }],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      }),
      signal: AbortSignal.timeout(20000)
    });

    if (!res.ok) throw new Error('Gemini API call failed: ' + res.status);
    const json = await res.json();
    const resultText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!resultText) throw new Error('Empty Gemini response');
    return JSON.parse(resultText);
  };

  // Website Scraper triggers
  const triggerScrape = async () => {
    let urlVal = state.brand.url.trim();
    if (!urlVal) return;
    
    // Attempt normalization but don't force it to be a valid URL if it's just a keyword
    if (isValidUrl(urlVal) || urlVal.includes('.')) {
      urlVal = normalizeUrl(urlVal);
    }
    updateBrandField('url', urlVal);

    if (urlVal !== lastScrapedUrl) {
      resetScrapedData(urlVal);
    }

    setScraperState({
      loading: true,
      type: 'loading',
      message: 'Fetching brand details from your website...'
    });

    try {
      // 1. Try real API scraper first
      let data;
      try {
        const res = await fetch('/api/scrape', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlVal }),
          signal: AbortSignal.timeout(8000)
        });
        if (res.ok) {
          const apiRes = await res.json();
          if (apiRes.status === 'success') {
            data = apiRes.data;
          }
        }
      } catch (_) { }

      // 2. Try Gemini API next if key is configured
      const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!data && geminiApiKey && geminiApiKey.trim() !== '') {
        try {
          data = await fetchGeminiScrapeData(urlVal, geminiApiKey);
        } catch (err) {
          console.error('Gemini scrape error:', err);
        }
      }

      // 3. Fallback to offline mock generator
      if (!data) {
        await new Promise((r) => setTimeout(r, 1800));
        data = generateMockScrapeData(urlVal);
      }

      // 3. Apply scraper outcomes
      const finalUrl = data.brandUrl || (isValidUrl(urlVal) ? urlVal : `https://${urlVal.replace(/\s+/g, '').toLowerCase()}.com`);
      
      const newState = {
        ...state,
        brand: {
          ...state.brand,
          name: data.brandName || urlVal,
          description: data.description || '',
          industries: data.industries || [],
          isScraped: true,
          url: finalUrl
        },
        products: {
          ...state.products,
          list: data.products || [],
          selected: data.products ? data.products.map((p) => p.name) : [],
          offer: data.activeOffers && data.activeOffers.length > 0 ? {
            hasOffer: true,
            description: data.activeOffers[0].text,
            isScraped: true
          } : {
            hasOffer: false,
            description: '',
            isScraped: false
          },
          isScraped: true
        }
      };

      saveState(newState);
      setLastScrapedUrl(urlVal);

      setScraperState({
        loading: false,
        type: 'success',
        message: '✓ Brand details fetched! Fields below have been auto-filled.'
      });
      addToast('✦ Auto-filled fields from your website', 'info');

    } catch (e) {
      setScraperState({
        loading: false,
        type: 'error',
        message: "⚠ Couldn't read this website — please fill in manually."
      });
      addToast('Could not read website — please fill in manually', 'error');
    }
  };

  const generateMockScrapeData = (input) => {
    let domain = input.toLowerCase().replace(/\s+/g, '');
    try {
      if (isValidUrl(input)) domain = new URL(input).hostname.replace('www.', '');
    } catch (_) {}
    
    const brandName = domain.split('.')[0] || input;
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    const name = capitalize(brandName);

    const lowerDomain = domain.toLowerCase();
    let industry = 'SaaS / Tech';
    let description = `${name} is an innovative software company providing premium solutions to help you optimize and scale your business operations.`;
    let products = [
      { name: `${name} Platform Subscription`, url: '/pricing' },
      { name: `${name} Core API Integration`, url: '/docs/api' },
      { name: `${name} Analytics Dashboard`, url: '/features/analytics' }
    ];
    let activeOffers = [{ text: 'Get a 14-day free trial on any premium plan — no credit card required', cta: 'Start Free Trial' }];

    if (/health|fit|gym|wellness|yoga|diet|nutri|supplement|active|sport|med|doctor|clinic|muscle|blaze|feed/i.test(lowerDomain)) {
      industry = 'Health & Wellness';
      description = `${name} offers premium quality health and wellness products designed to elevate your everyday physical performance and mental well-being.`;
      products = [
        { name: `${name} Protein Powder`, url: '/products/protein' },
        { name: `${name} Daily Vitamins`, url: '/products/vitamins' },
        { name: `${name} Recovery Shake`, url: '/products/recovery' }
      ];
      activeOffers = [{ text: 'Get 15% off your first health stack with code HEALTH15', cta: 'Shop Now' }];
    } else if (/fashion|wear|apparel|clothing|style|shirt|nike|adidas|store|brand|shop|wellbi/i.test(lowerDomain)) {
      industry = 'Fashion';
      description = `Discover the latest apparel collections from ${name}. We design premium and stylish streetwear tailored for comfort and modern aesthetics.`;
      products = [
        { name: `${name} Signature Hoodie`, url: '/collections/hoodies' },
        { name: `${name} Oversized Tee`, url: '/collections/tees' },
        { name: `${name} Premium Denim`, url: '/collections/denim' }
      ];
      activeOffers = [{ text: 'Free shipping on orders over ₹2,999 + 10% off sign-up', cta: 'Shop Collections' }];
    } else if (/food|pizza|burger|cafe|restaurant|drink|bake|kitchen|chef|delicious|order|eat/i.test(lowerDomain)) {
      industry = 'F&B';
      description = `Indulge in delicious, freshly-made culinary delights from ${name}. We source organic ingredients to serve you flavor-packed dishes daily.`;
      products = [
        { name: `${name} Gourmet Pizza`, url: '/menu/pizza' },
        { name: `${name} Classic Burger Combo`, url: '/menu/burgers' },
        { name: `${name} Fresh Brew Coffee`, url: '/menu/drinks' }
      ];
      activeOffers = [{ text: 'Get 20% off your first online food order with code EATFRESH', cta: 'Order Now' }];
    } else if (/beauty|cosmetic|skin|hair|glow|makeup|care|salon/i.test(lowerDomain)) {
      industry = 'Beauty';
      description = `Unveil your natural radiance with ${name}'s clean beauty, skincare, and organic cosmetics designed to nourish and protect.`;
      products = [
        { name: `${name} Hydrating Glow Serum`, url: '/shop/glow-serum' },
        { name: `${name} Organic Cleansing Oil`, url: '/shop/cleanser' },
        { name: `${name} Nourishing Lip Balm`, url: '/shop/balm' }
      ];
      activeOffers = [{ text: 'Receive a free luxury travel kit on all orders above ₹1,999', cta: 'Shop Beauty' }];
    } else if (/finance|pay|coin|bank|invest|fund|money|credit|wealth|capital/i.test(lowerDomain)) {
      industry = 'Finance';
      description = `Empower your financial future with ${name}. We offer secure, smart wealth management, investment insights, and modern digital banking.`;
      products = [
        { name: `${name} Wealth Planner`, url: '/services/wealth' },
        { name: `${name} High-Yield Investment Account`, url: '/services/savings' },
        { name: `${name} Secure Crypto Wallet`, url: '/services/crypto' }
      ];
      activeOffers = [{ text: 'Start investing today with zero brokerage fees for the first 30 days', cta: 'Get Started' }];
    } else if (/edu|learn|class|course|school|academy|code|study|university|train/i.test(lowerDomain)) {
      industry = 'EdTech';
      description = `Transform your career and learn in-demand skills with ${name}. Explore expert-led interactive courses and professional bootcamps.`;
      products = [
        { name: `${name} Full-Stack Web Development Bootcamp`, url: '/courses/web-dev' },
        { name: `${name} Data Science Foundation Course`, url: '/courses/data-science' },
        { name: `${name} 1-on-1 Mentorship Sessions`, url: '/mentorship' }
      ];
      activeOffers = [{ text: 'Claim your free introductory workshop session worth ₹999', cta: 'Enroll Free' }];
    } else if (/retail|buy|sell|market|mall|mart|grocery|supermarket|deal|discount|commerce|ecom/i.test(lowerDomain)) {
      industry = 'Retail';
      description = `Shop the best deals online at ${name}. We offer a wide range of top-tier consumer products with lightning-fast delivery.`;
      products = [
        { name: `${name} Smart Home Gadget`, url: '/shop/gadgets' },
        { name: `${name} Ergonomic Office Chair`, url: '/shop/furniture' },
        { name: `${name} Wireless Earbuds`, url: '/shop/audio' }
      ];
      activeOffers = [{ text: 'Enjoy 10% off your entire cart using code WELCOME10 at checkout', cta: 'Shop Deals' }];
    }

    return {
      brandName: name,
      description,
      industries: [industry],
      products,
      activeOffers
    };
  };

  // Validations per step
  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!state.brand.name.trim()) newErrors.name = 'Please enter your brand name';
      if (!state.brand.url.trim() || !isValidUrl(state.brand.url)) newErrors.url = 'Please enter a valid URL (e.g. yourbrand.com)';
      if (!state.brand.industries.length) newErrors.industries = 'Select at least one industry';
      if (!state.brand.description.trim()) newErrors.description = 'Please add a brief brand description';
    }

    if (step === 2) {
      if (!state.products.selected.length) newErrors.selected = 'Select at least one product';
    }

    if (step === 3) {
      // Validate that either 'All Products' has personas, or all selected products have their own audiences configured.
      const audiences = state.audience.productAudiences;
      const allSelectedProducts = state.products.selected;
      
      let isValid = false;
      
      const hasPersonas = (data) => data && (data.personas.length > 0 || data.customPersonas.length > 0);
      
      if (hasPersonas(audiences['All Products'])) {
        isValid = true;
      } else if (allSelectedProducts.length > 0 && allSelectedProducts.every(p => hasPersonas(audiences[p]))) {
        isValid = true;
      }

      if (!isValid) {
        newErrors.productAudiences = 'Select at least one persona in "All Products", or configure personas for each selected product.';
      }
    }

    if (step === 4) {
      if (!state.geography.cities.length) newErrors.cities = 'Select at least one target city';
      if (!state.geography.budgetRange) newErrors.budgetRange = 'Please select a budget range';
      if (!state.geography.goLiveDate) newErrors.goLiveDate = 'Please select a valid go-live date';
      if (!state.geography.creativesStatus) newErrors.creativesStatus = 'Please select your creatives status';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      setShowWelcome(true);
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToStep = (step) => {
    // Permitted if returning or if target validation is satisfied
    if (step < currentStep || validateStep(currentStep)) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Final brief submit flow linked to Firebase
  const submitBrief = async () => {
    setIsSubmitting(true);
    const generatedBriefId = 'BRIEF-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    try {
      // Save campaign brief into the "briefs" collection in Firestore
      await setDoc(doc(db, "briefs", state.sessionId), {
        briefId: generatedBriefId,
        sessionId: state.sessionId,
        brand: state.brand,
        products: state.products,
        audience: state.audience,
        geography: state.geography,
        submittedAt: new Date().toISOString()
      });

      addToast('✓ Saved campaign brief to database!', 'success');
    } catch (err) {
      console.error("Firebase write error:", err);
      addToast('⚠ Database error — saved locally instead.', 'error');
    }

    localStorage.removeItem('adometer_state');

    setBriefId(generatedBriefId);
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  // Copy save link to clipboard
  const saveAndContinue = () => {
    const url = window.location.href.split('?')[0] + '?session=' + state.sessionId;
    navigator.clipboard?.writeText(url).then(() => {
      addToast('✓ Progress saved! Link copied to clipboard.', 'success');
    }).catch(() => {
      addToast('✓ Progress saved locally.', 'success');
    });
  };

  // Apply suggested chatbot updates — deep clone first to avoid nested mutation
  const applySuggestedUpdates = (updates) => {
    let newState = JSON.parse(JSON.stringify(state));
    Object.entries(updates).forEach(([key, val]) => {
      const parts = key.split('.');
      let obj = newState;
      for (let i = 0; i < parts.length - 1; i++) {
        if (obj[parts[i]] === undefined || obj[parts[i]] === null) {
          obj[parts[i]] = {};
        }
        obj = obj[parts[i]];
      }
      obj[parts[parts.length - 1]] = val;
    });
    saveState(newState);
  };

  // Determine dynamic navbar theme
  const isNavbarDark = false; // Change this to toggle navbar theme

  return (
    <div className="relative min-h-screen z-10 overflow-hidden">
      {/* Blurred background blobs inspired by Adometer problem section */}
      <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
        <div className="absolute left-[-12%] top-[8%] h-[440px] w-[440px] rounded-full bg-blue-100/70 blur-[120px]" />
        <div className="absolute right-[-10%] top-[18%] h-[520px] w-[520px] rounded-full bg-cyan-100/60 blur-[130px]" />
        <div className="absolute left-[30%] bottom-[-20%] h-[420px] w-[420px] rounded-full bg-purple-100/40 blur-[130px]" />
      </div>
      {/* Toast notifications */}
      <div className="fixed top-[110px] right-5 z-[1000] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 border rounded-xl text-xs font-semibold shadow-lg backdrop-blur-md transition-all duration-300 pointer-events-auto flex items-center gap-2 ${t.type === 'success'
              ? 'bg-emerald-50/90 border-emerald-200 text-emerald-600'
              : t.type === 'error'
                ? 'bg-red-50/90 border-red-200 text-red-600'
                : 'bg-white/95 border-slate-200 text-blue-600'
              }`}
          >
            <span>{t.msg}</span>
          </div>
        ))}
      </div>

      <header className="fixed left-0 top-0 z-[999] w-full px-3 pt-3 sm:px-4 md:px-6 md:pt-5 pointer-events-none">
        <nav className={`relative mx-auto flex w-full max-w-7xl items-center justify-between rounded-full px-4 py-2.5 backdrop-blur-2xl transition-all duration-300 sm:px-5 md:px-6 md:py-3.5 pointer-events-auto shadow-[0_18px_55px_rgba(15,23,42,0.08)] ${isNavbarDark ? 'border border-white/10 bg-slate-950/65 text-white' : 'border border-slate-200/80 bg-white/85 text-slate-950'}`}>
          {/* Logo */}
          <div className="flex min-w-0 shrink-0 items-center cursor-pointer">
            <img src={isNavbarDark ? adometerLogoWhite : adometerLogoBlack} alt="Adometer" className="h-7 w-auto object-contain sm:h-8 md:h-10" />
          </div>

          {/* Right buttons */}
          <div className="flex shrink-0 items-center gap-4">
            {!isSubmitted && (
              <button
                onClick={saveAndContinue}
                className={`hidden rounded-full pl-3 pr-4 py-2 text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 border shadow-sm cursor-pointer sm:inline-flex items-center gap-1.5 ${isNavbarDark ? 'border-white/20 bg-white/10 text-white hover:bg-white/20' : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50'}`}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 3C1 1.89543 1.89543 1 3 1H11L15 5V13C15 14.1046 14.1046 15 13 15H3C1.89543 15 1 14.1046 1 13V3Z" fill="#3196D2"/>
                  <rect x="4" y="1" width="7" height="4" fill="#BCC8CE"/>
                  <rect x="8" y="2" width="2" height="3" fill="#2B363A"/>
                  <rect x="3" y="7" width="10" height="7" fill="#FFFFFF"/>
                  <rect x="4.5" y="8.5" width="7" height="1" fill="#CFD8DC"/>
                  <rect x="4.5" y="10.5" width="7" height="1" fill="#CFD8DC"/>
                  <rect x="4.5" y="12.5" width="7" height="1" fill="#CFD8DC"/>
                </svg>
                Save
              </button>
            )}
            
            {/* Profile Icon */}
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center cursor-pointer border transition-colors ${isNavbarDark ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Container */}
      <main className={`max-w-[780px] mx-auto px-4 w-full min-h-screen flex flex-col justify-center ${showWelcome ? 'pt-16 pb-0' : 'pt-28 pb-12'}`}>
        {showWelcome ? (
          <section className="glass-panel glass-panel-hover rounded-[1.75rem] p-10 md:p-14 text-center max-w-[850px] w-full animate-fadeIn relative z-10">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-950 leading-snug mb-6 max-w-[720px] mx-auto">
              Before we design the perfect campaign for you, <br />
              <span className="bg-gradient-to-r from-blue-900 via-blue-700 to-purple-500 bg-clip-text text-transparent">
                we would need a few more details
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 font-semibold max-w-[600px] leading-relaxed mb-10 mx-auto">
              Please fill out this short form or share your answers with our chatbot to get started!
            </p>

            <div className="flex gap-10 flex-wrap justify-center mb-10">
              <div className="text-center px-6 py-4 bg-white/50 rounded-2xl border border-slate-200/60 shadow-sm inline-block">
                <div className="text-2xl font-extrabold bg-gradient-to-r from-blue-900 to-cyan-600 bg-clip-text text-transparent">5 min</div>
                <div className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wide">Avg completion time</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => {
                  setShowWelcome(false);
                  setState(defaultState); // Starts with completely empty form
                }}
                className="px-8 py-3.5 bg-cyan-300 text-slate-950 font-bold rounded-full shadow-lg shadow-cyan-300/20 hover:bg-purple-200 transition-colors duration-500 cursor-pointer text-sm"
              >
                ✦ Start Campaign Brief →
              </button>
              <button
                onClick={() => {
                  setShowWelcome(false);
                  setState(defaultState); // Starts with completely empty form
                  setChatOpen(true);
                }}
                className="px-8 py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-full hover:bg-slate-50 hover:border-slate-300 transition-colors duration-500 text-sm cursor-pointer"
              >
                💬 Fill via chat instead
              </button>
            </div>
          </section>
        ) : isSubmitted ? (
          <div className="glass-panel rounded-3xl p-8">
            <ConfirmationPage briefId={briefId} />
          </div>
        ) : (
          <div className="glass-panel glass-panel-hover rounded-3xl p-8 transition-shadow duration-300 relative overflow-hidden">
            <CardProgressBar
              currentStep={currentStep}
              stepsCount={5}
              stepNames={['Brand', 'Product', 'Audience', 'Geography', 'Review']}
              goToStep={goToStep}
            />

            {/* Steps Container */}
            <div>
              {currentStep === 1 && (
                <Step1Brand
                  brand={state.brand}
                  updateBrandField={updateBrandField}
                  errors={errors}
                  triggerScrape={triggerScrape}
                  scraperState={scraperState}
                  toggleIndustry={toggleIndustry}
                />
              )}

              {currentStep === 2 && (
                <Step2Product
                  products={state.products}
                  toggleProduct={toggleProduct}
                  addManualProduct={addManualProduct}
                  updateOfferField={updateOfferField}
                  errors={errors}
                />
              )}

              {currentStep === 3 && (
                <Step3Audience
                  audience={state.audience}
                  products={state.products.selected}
                  updateProductAudience={updateProductAudience}
                  errors={errors}
                />
              )}

              {currentStep === 4 && (
                <Step4Geography
                  geography={state.geography}
                  updateGeographyField={updateGeographyField}
                  toggleCity={toggleCity}
                  errors={errors}
                />
              )}

              {currentStep === 5 && (
                <Step5Review
                  state={state}
                  goToStep={goToStep}
                  onSubmit={submitBrief}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>

            {/* Bottom Nav Row */}
            {currentStep < 5 && (
              <div className="flex justify-between items-center mt-9 pt-6 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-xs font-semibold text-slate-600 rounded-xl hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 transition-all cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-blue-600 text-white border-none text-xs font-bold rounded-xl hover:shadow-md hover:shadow-blue-500/10 cursor-pointer transition-all"
                >
                  Continue →
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Chatbot assistant */}
      {!isSubmitted && (
        <ChatbotWidget
          isOpen={chatOpen}
          toggleChat={() => setChatOpen(!chatOpen)}
          state={state}
          applySuggestedUpdates={applySuggestedUpdates}
          addToast={addToast}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          triggerScrape={triggerScrape}
          setShowWelcome={setShowWelcome}
        />
      )}
    </div>
  );
}
