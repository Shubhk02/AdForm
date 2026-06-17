import React, { useState } from 'react';
import Checkbox from './Checkbox';

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
  products,
  updateProductAudience,
  errors
}) {
  const [selectedProducts, setSelectedProducts] = useState(['All Products']);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Derive the current data from the first selected product as the source of truth for the UI
  const currentData = audience.productAudiences?.[selectedProducts[0]] || {
    personas: [],
    customPersonas: [],
    ageRange: [25, 44],
    lifestyleContext: ''
  };

  const minVal = currentData.ageRange[0];
  const maxVal = currentData.ageRange[1];

  const handleMinChange = (e) => {
    const val = Math.min(parseInt(e.target.value), maxVal - 1);
    updateProductAudience(selectedProducts, 'ageRange', [val, maxVal]);
  };

  const handleMaxChange = (e) => {
    const val = Math.max(parseInt(e.target.value), minVal + 1);
    updateProductAudience(selectedProducts, 'ageRange', [minVal, val]);
  };

  const togglePersona = (personaId) => {
    const currentPersonas = currentData.personas;
    const newPersonas = currentPersonas.includes(personaId)
      ? currentPersonas.filter(p => p !== personaId)
      : [...currentPersonas, personaId];
    updateProductAudience(selectedProducts, 'personas', newPersonas);
  };

  const totalRange = 65 - 18;
  const leftPct = ((minVal - 18) / totalRange) * 100;
  const rightPct = ((maxVal - 18) / totalRange) * 100;

  // Options for the dropdown include 'All Products' plus any specifically selected products from Step 2
  const productOptions = ['All Products', ...(products || [])];

  const toggleProductSelection = (prod) => {
    if (selectedProducts.includes(prod)) {
      if (selectedProducts.length === 1) return; // Keep at least one
      setSelectedProducts(selectedProducts.filter(p => p !== prod));
    } else {
      setSelectedProducts([...selectedProducts, prod]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <span className="text-[11px] font-bold text-cyan-600 uppercase tracking-widest block mb-1">Section 3</span>
        <h2 className="text-xl font-bold text-slate-900">Who should see your ads?</h2>
        <p className="text-sm text-slate-500 mt-1">
          Define the audience you want to reach across gyms, offices, supermarkets, and sports arenas.
        </p>
      </div>

      {/* Product Selector Multi-Select Dropdown */}
      <div className="flex flex-col mb-4 relative z-50">
        <label className="text-sm font-semibold text-slate-700 mb-1.5">
          Select Product(s) to Configure Audience For
        </label>
        
        <div 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-semibold cursor-pointer flex justify-between items-center transition-all hover:bg-white hover:border-blue-300"
        >
          <span className="truncate pr-4 text-slate-700">
            {selectedProducts.length === productOptions.length ? 'All Available Products' : selectedProducts.join(', ')}
          </span>
          <span className="text-slate-400 text-xs">{dropdownOpen ? '▲' : '▼'}</span>
        </div>
        
        {dropdownOpen && (
          <div className="absolute top-[76px] left-0 w-full bg-white border border-slate-200 shadow-xl rounded-xl p-2 flex flex-col gap-1 max-h-60 overflow-y-auto">
            {productOptions.map((opt) => {
              const isSel = selectedProducts.includes(opt);
              return (
                <div 
                  key={opt} 
                  onClick={() => toggleProductSelection(opt)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${isSel ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                >
                  <div className="pointer-events-none">
                    <Checkbox checked={isSel} onChange={() => {}} id={`dd-${opt.replace(/\s+/g, '-')}`} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{opt}</span>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-xs text-slate-500 mt-2">
          Select multiple products to apply the exact same audience settings to all of them at once.
        </p>
      </div>

      {/* Personas Chips */}
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-slate-700 mb-1">
          Audience Personas <span className="text-blue-600">*</span>
        </label>
        <p className="text-xs text-slate-500 mb-3">Select all that apply for <strong>{selectedProducts.join(', ')}</strong>.</p>
        
        <div className="flex flex-wrap gap-2">
          {PERSONAS_LIST.map((p) => {
            const isSelected = currentData.personas.includes(p.id);
            return (
              <button
                type="button"
                key={p.id}
                onClick={() => togglePersona(p.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/10'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
        {errors.productAudiences && <span className="text-xs text-red-500 mt-1 flex items-center gap-1">⚠ {errors.productAudiences}</span>}
      </div>

      {/* Custom Double Range Slider */}
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-slate-700 mb-1">
          Age Range <span className="text-blue-600">*</span>
        </label>
        <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-4 bg-slate-50 py-1.5 px-3.5 rounded-xl border border-slate-200/50">
          <span>Min: {minVal} years</span>
          <span className="text-blue-600 font-extrabold font-mono">{minVal} — {maxVal === 65 ? '65+' : maxVal} years</span>
          <span>Max: {maxVal === 65 ? '65+' : `${maxVal} years`}</span>
        </div>

        <div className="relative w-full h-7 flex items-center">
          {/* Slider track background */}
          <div className="absolute left-0 right-0 h-1.5 bg-slate-200 rounded-lg pointer-events-none z-0" />
          
          {/* Active colored range */}
          <div
            className="absolute h-1.5 bg-gradient-to-r from-blue-900 to-blue-600 rounded-lg pointer-events-none z-10"
            style={{
              left: `${leftPct}%`,
              width: `${rightPct - leftPct}%`
            }}
          />

          {/* Double Range Sliders overlays */}
          <input
            type="range"
            min="18"
            max="65"
            value={minVal}
            onChange={handleMinChange}
            className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none focus:outline-none z-20 pointer-events-auto [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
          />

          <input
            type="range"
            min="18"
            max="65"
            value={maxVal}
            onChange={handleMaxChange}
            className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none focus:outline-none z-20 pointer-events-auto [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
          />
        </div>
      </div>

      {/* Target Lifestyle/Context */}
      <div className="flex flex-col">
        <label htmlFor="lifestyle" className="text-sm font-semibold text-slate-700 mb-1.5">
          Audience Lifestyle &amp; Context
        </label>
        <textarea
          id="lifestyle"
          value={currentData.lifestyleContext || ''}
          onChange={(e) => updateProductAudience(selectedProducts, 'lifestyleContext', e.target.value)}
          placeholder="Describe hobbies, behaviors, or details (e.g. loves outdoor sports, commutes daily, values clean labels)..."
          rows={3}
          className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10"
        />
      </div>
    </div>
  );
}
