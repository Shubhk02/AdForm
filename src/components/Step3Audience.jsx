import React from 'react';

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
  updateAudienceField,
  togglePersona,
  errors
}) {
  const minVal = audience.ageRange[0];
  const maxVal = audience.ageRange[1];

  const handleMinChange = (e) => {
    const val = Math.min(parseInt(e.target.value), maxVal - 1);
    updateAudienceField('ageRange', [val, maxVal]);
  };

  const handleMaxChange = (e) => {
    const val = Math.max(parseInt(e.target.value), minVal + 1);
    updateAudienceField('ageRange', [minVal, val]);
  };

  const totalRange = 65 - 18;
  const leftPct = ((minVal - 18) / totalRange) * 100;
  const rightPct = ((maxVal - 18) / totalRange) * 100;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <span className="text-[11px] font-bold text-cyan-600 uppercase tracking-widest block mb-1">Section 3</span>
        <h2 className="text-xl font-bold text-slate-900">Target Audience</h2>
        <p className="text-sm text-slate-500 mt-1">Who should see your ads? Define your ideal customer profile.</p>
      </div>

      {/* Personas Chips */}
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-slate-700 mb-1">
          Audience Personas <span className="text-blue-600">*</span>
        </label>
        <p className="text-xs text-slate-500 mb-3">Select all that apply. Choosing a persona dynamically adjusts the age slider below.</p>
        
        <div className="flex flex-wrap gap-2">
          {PERSONAS_LIST.map((p) => {
            const isSelected = audience.personas.includes(p.id);
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
        {errors.personas && <span className="text-xs text-red-500 mt-1 flex items-center gap-1">⚠ {errors.personas}</span>}
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
          value={audience.lifestyleContext}
          onChange={(e) => updateAudienceField('lifestyleContext', e.target.value)}
          placeholder="Describe hobbies, behaviors, or details (e.g. loves outdoor sports, commutes daily, values clean labels)..."
          rows={3}
          className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10"
        />
      </div>
    </div>
  );
}
