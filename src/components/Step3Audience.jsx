import React, { useState, useRef, useEffect } from 'react';

const PERSONAS_LIST = [
  { id: 'Young professionals', label: '💼 Young Professionals' },
  { id: 'Students', label: '🎓 Students' },
  { id: 'Fitness enthusiasts', label: '💪 Fitness Enthusiasts' },
  { id: 'Parents', label: '👨‍👩‍👧 Parents' },
  { id: 'HNI / affluent consumers', label: '💎 HNI / Affluent' },
  { id: 'General audience', label: '🌐 General Audience' }
];

export default function Step3Audience({
  audience,
  products = [],
  updateProductAudience,
  errors
}) {
  const [activeProducts, setActiveProducts] = useState(['All Products']);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [customInput, setCustomInput] = useState('');
  
  const productDropdownRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (productDropdownRef.current && !productDropdownRef.current.contains(e.target)) setProductDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ensure active products are valid (in case products changed)
  useEffect(() => {
    setActiveProducts(prev => {
      const valid = prev.filter(p => p === 'All Products' || products.includes(p));
      return valid.length > 0 ? valid : ['All Products'];
    });
  }, [products]);

  const toggleProductSelection = (prod) => {
    setActiveProducts(prev => {
      if (prev.includes(prod)) {
        const next = prev.filter(p => p !== prod);
        return next.length > 0 ? next : ['All Products'];
      } else {
        return [...prev, prod];
      }
    });
  };

  // We read from the first selected product for display purposes
  const displayProduct = activeProducts[0] || 'All Products';
  const currentData = audience.productAudiences[displayProduct] || { personas: [], customPersonas: [], ageRange: [25, 44], lifestyleContext: '' };
  
  const personas = currentData.personas || [];
  const customPersonas = currentData.customPersonas || [];
  const ageRange = currentData.ageRange || [25, 44];

  const handleTogglePersona = (pId) => {
    updateProductAudience(activeProducts, 'personas', (prev = []) => {
      if (prev.includes(pId)) return prev.filter(p => p !== pId);
      return [...prev, pId];
    });
  };

  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !customPersonas.includes(trimmed)) {
      updateProductAudience(activeProducts, 'customPersonas', (prev = []) => [...prev, trimmed]);
      setCustomInput('');
    }
  };

  const handleRemoveCustom = (pId) => {
    updateProductAudience(activeProducts, 'customPersonas', (prev = []) => prev.filter(p => p !== pId));
  };

  const handleMinChange = (e) => {
    const val = Math.min(parseInt(e.target.value), ageRange[1] - 1);
    updateProductAudience(activeProducts, 'ageRange', [val, ageRange[1]]);
  };

  const handleMaxChange = (e) => {
    const val = Math.max(parseInt(e.target.value), ageRange[0] + 1);
    updateProductAudience(activeProducts, 'ageRange', [ageRange[0], val]);
  };

  const allPersonasOptions = [
    ...PERSONAS_LIST,
    ...customPersonas.map(p => ({ id: p, label: `✏️ ${p}` }))
  ];

  const minVal = ageRange[0];
  const maxVal = ageRange[1];
  const totalRange = 65 - 18;
  const leftPct = ((minVal - 18) / totalRange) * 100;
  const rightPct = ((maxVal - 18) / totalRange) * 100;

  const availableProducts = ['All Products', ...products];

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <span className="text-[11px] font-bold text-cyan-600 uppercase tracking-widest block mb-1">Section 3</span>
        <h2 className="text-xl font-bold text-slate-900">Target Audience</h2>
        <p className="text-sm text-slate-500 mt-1">Define your audience globally, or customize it for specific products.</p>
        {errors.productAudiences && <span className="text-xs text-red-500 mt-2 block font-medium">⚠ {errors.productAudiences}</span>}
      </div>

      <div className="space-y-8 bg-slate-50/50 p-5 rounded-xl border border-slate-200/50">
        
        {/* Product Multi-Select Dropdown */}
        <div className="flex flex-col relative" ref={productDropdownRef}>
          <label className="text-sm font-semibold text-slate-700 mb-1">
            Applying Audience To:
          </label>
          <p className="text-xs text-slate-500 mb-3">Select one or more products to update their audience settings simultaneously.</p>
          
          <div 
            className={`min-h-[46px] w-full bg-white border border-slate-200 rounded-xl p-2 flex flex-wrap gap-2 items-center cursor-pointer hover:border-slate-300 transition-colors relative z-20`}
            onClick={() => setProductDropdownOpen(!productDropdownOpen)}
          >
            {activeProducts.map(p => (
              <span key={p} className={`px-2 py-1 border rounded-md text-xs font-semibold flex items-center gap-1 ${p === 'All Products' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                {p === 'All Products' ? '🌐 All Products' : `📦 ${p}`}
                {activeProducts.length > 1 && (
                  <button type="button" onClick={(e) => { e.stopPropagation(); toggleProductSelection(p); }} className="hover:text-rose-500 ml-1">✕</button>
                )}
              </span>
            ))}
          </div>

          {productDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-30 overflow-hidden flex flex-col">
              <div className="max-h-[200px] overflow-y-auto p-2 flex flex-col gap-1">
                {availableProducts.map(p => {
                  const isSelected = activeProducts.includes(p);
                  return (
                    <label key={p} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => toggleProductSelection(p)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-slate-700">{p === 'All Products' ? '🌐 All Products' : `📦 ${p}`}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <hr className="border-slate-200/60" />

        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">
            Targeting Configuration
          </h3>
          {activeProducts.length > 1 && (
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
              Applying to {activeProducts.length} items
            </span>
          )}
        </div>

        {/* Personas Dropdown */}
        <div className="flex flex-col relative" ref={dropdownRef}>
          <label className="text-sm font-semibold text-slate-700 mb-1">
            Audience Personas
          </label>
          <div 
            className={`min-h-[46px] w-full bg-white border border-slate-200 rounded-xl p-2 flex flex-wrap gap-2 items-center cursor-pointer hover:border-slate-300 transition-colors relative z-20`}
            onClick={() => setDropdownOpen(true)}
          >
            {personas.length === 0 && customPersonas.length === 0 && (
              <span className="text-sm text-slate-400 pl-2">Select or type to add personas...</span>
            )}
            
            {personas.map(p => {
              const label = allPersonasOptions.find(x => x.id === p)?.label || p;
              return (
                <span key={p} className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1">
                  {label}
                  <button type="button" onClick={(e) => { e.stopPropagation(); handleTogglePersona(p); }} className="hover:text-rose-500 ml-1">✕</button>
                </span>
              );
            })}
            {customPersonas.map(p => (
              <span key={p} className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1">
                ✏️ {p}
                <button type="button" onClick={(e) => { e.stopPropagation(); handleRemoveCustom(p); }} className="hover:text-rose-500 ml-1">✕</button>
              </span>
            ))}
          </div>
          
          {dropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-30 overflow-hidden flex flex-col">
              <div className="p-2 border-b border-slate-100 bg-slate-50 flex gap-2">
                <input 
                  type="text" 
                  value={customInput} 
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { e.preventDefault(); handleAddCustom(); }
                  }}
                  placeholder="Type new persona and hit Add..." 
                  className="w-full text-sm px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                />
                <button 
                  type="button" 
                  onClick={handleAddCustom}
                  className="bg-blue-600 text-white px-3 rounded-lg text-xs font-bold hover:bg-blue-700 whitespace-nowrap"
                >
                  Add
                </button>
              </div>
              <div className="max-h-[200px] overflow-y-auto p-2 flex flex-col gap-1">
                {allPersonasOptions.map(p => {
                  const isSelected = personas.includes(p.id) || customPersonas.includes(p.id);
                  return (
                    <label key={p.id} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => {
                          if (customPersonas.includes(p.id)) handleRemoveCustom(p.id);
                          else handleTogglePersona(p.id);
                        }}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-slate-700">{p.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Age Slider */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-slate-700 mb-1">
            Age Range
          </label>
          <div className="flex justify-between items-center text-[11px] font-bold text-slate-700 bg-white py-2 px-3 rounded-xl border border-slate-200/50 mb-4 shadow-sm">
            <span>Min: {minVal} years</span>
            <span className="text-blue-600 font-extrabold font-mono text-sm">{minVal} — {maxVal === 65 ? '65+' : maxVal}</span>
            <span>Max: {maxVal === 65 ? '65+' : maxVal} years</span>
          </div>

          <div className="relative w-full h-7 flex items-center">
            <div className="absolute left-0 right-0 h-1.5 bg-slate-200 rounded-lg pointer-events-none z-0" />
            <div
              className="absolute h-1.5 bg-gradient-to-r from-blue-900 to-blue-600 rounded-lg pointer-events-none z-10"
              style={{ left: `${leftPct}%`, width: `${rightPct - leftPct}%` }}
            />
            <input
              type="range" min="18" max="65" value={minVal} onChange={handleMinChange}
              className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none focus:outline-none z-20 pointer-events-auto [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
            />
            <input
              type="range" min="18" max="65" value={maxVal} onChange={handleMaxChange}
              className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none focus:outline-none z-20 pointer-events-auto [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
            />
          </div>
        </div>

        {/* Lifestyle / Context */}
        <div className="flex flex-col">
          <label htmlFor="lifestyle" className="text-sm font-semibold text-slate-700 mb-1.5">
            Lifestyle &amp; Context
          </label>
          <textarea
            id="lifestyle"
            value={currentData.lifestyleContext || ''}
            onChange={(e) => updateProductAudience(activeProducts, 'lifestyleContext', e.target.value)}
            placeholder="Describe hobbies, behaviors, or details..."
            rows={3}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:border-blue-500 shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}
