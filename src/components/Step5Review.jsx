import React from 'react';

const BUDGET_MAP = {
  '10k-25k': '₹10K – ₹25K',
  '25k-50k': '₹25K – ₹50K',
  '50k-1l': '₹50K – ₹1L',
  '1l+': '₹1L+'
};

const CREATIVES_MAP = {
  'ready': '✅ Yes — I\'ll upload them',
  'need_help': '🎨 No — need help',
  'rough_idea': '💡 Have a rough idea'
};

export default function Step5Review({ state, goToStep, onSubmit, isSubmitting }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (_) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <span className="text-[11px] font-bold text-cyan-600 uppercase tracking-widest block mb-1">Section 5</span>
        <h2 className="text-xl font-bold text-slate-900">Review &amp; Submit</h2>
        <p className="text-sm text-slate-500 mt-1">Check everything looks correct before sending your brief to our team.</p>
      </div>

      <div className="space-y-5">
        {/* Section 1: Brand */}
        <div className="p-4 bg-slate-50/50 border border-slate-200/60 rounded-xl space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/40">
            <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-wider">🏷 Brand</span>
            <button
              type="button"
              onClick={() => goToStep(1)}
              className="text-xs font-bold text-blue-605 hover:underline cursor-pointer"
            >
              Edit
            </button>
          </div>
          <div className="grid grid-cols-[110px_1fr] gap-x-2 text-xs">
            <div className="text-slate-400 font-semibold">Brand Name</div>
            <div className="text-slate-800 font-semibold">{state.brand.name || '—'}</div>
          </div>
          <div className="grid grid-cols-[110px_1fr] gap-x-2 text-xs">
            <div className="text-slate-400 font-semibold">Website</div>
            <div className="text-slate-800 font-semibold break-all">{state.brand.url || '—'}</div>
          </div>
          <div className="grid grid-cols-[110px_1fr] gap-x-2 text-xs">
            <div className="text-slate-400 font-semibold">Industries</div>
            <div className="flex flex-wrap gap-1">
              {state.brand.industries.map((ind) => (
                <span key={ind} className="bg-slate-100 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-bold">
                  {ind}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-[110px_1fr] gap-x-2 text-xs">
            <div className="text-slate-400 font-semibold">Description</div>
            <div className="text-slate-700 leading-relaxed">{state.brand.description || '—'}</div>
          </div>
        </div>

        {/* Section 2: Products */}
        <div className="p-4 bg-slate-50/50 border border-slate-200/60 rounded-xl space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/40">
            <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-wider">📦 Product</span>
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="text-xs font-bold text-blue-605 hover:underline cursor-pointer"
            >
              Edit
            </button>
          </div>
          <div className="grid grid-cols-[110px_1fr] gap-x-2 text-xs">
            <div className="text-slate-400 font-semibold">Selected Offering</div>
            <div className="flex flex-col gap-1.5">
              {state.products.selected.map((p) => (
                <span key={p} className="text-slate-800 font-semibold">
                  • {p}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-[110px_1fr] gap-x-2 text-xs">
            <div className="text-slate-400 font-semibold">Active Offer</div>
            <div className="text-slate-700 leading-relaxed">
              {state.products.offer.hasOffer ? state.products.offer.description || 'Yes (Offer details not specified)' : 'No'}
            </div>
          </div>
        </div>

        {/* Section 3: Audience */}
        <div className="p-4 bg-slate-50/50 border border-slate-200/60 rounded-xl space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/40">
            <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-wider">👥 Target Audience</span>
            <button
              type="button"
              onClick={() => goToStep(3)}
              className="text-xs font-bold text-blue-605 hover:underline cursor-pointer"
            >
              Edit
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {Object.entries(state.audience.productAudiences || {}).map(([prod, aud]) => {
              const hasPersonas = aud.personas?.length > 0 || aud.customPersonas?.length > 0;
              const hasContext = aud.lifestyleContext?.trim();
              if (!hasPersonas && !hasContext) return null;

              return (
                <div key={prod} className="bg-white border border-slate-200 rounded-lg p-3 space-y-2">
                  <div className="text-[11px] font-bold text-slate-800 border-b border-slate-100 pb-1 mb-2">
                    {prod === 'All Products' ? '🌐 All Products' : `📦 ${prod}`}
                  </div>
                  
                  <div className="grid grid-cols-[90px_1fr] gap-x-2 text-xs">
                    <div className="text-slate-400 font-semibold">Personas</div>
                    <div className="flex flex-wrap gap-1">
                      {[...(aud.personas || []), ...(aud.customPersonas || [])].map((p) => (
                        <span key={p} className="bg-slate-50 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-bold">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-[90px_1fr] gap-x-2 text-xs">
                    <div className="text-slate-400 font-semibold">Age Target</div>
                    <div className="text-slate-800 font-bold">
                      {(aud.ageRange || [25, 44])[0]} — {(aud.ageRange || [25, 44])[1] === 65 ? '65+' : (aud.ageRange || [25, 44])[1]} years
                    </div>
                  </div>
                  
                  {hasContext && (
                    <div className="grid grid-cols-[90px_1fr] gap-x-2 text-xs">
                      <div className="text-slate-400 font-semibold">Lifestyle</div>
                      <div className="text-slate-700 leading-relaxed break-words">{aud.lifestyleContext}</div>
                    </div>
                  )}
                </div>
              );
            })}
            
            {(!state.audience.productAudiences || Object.keys(state.audience.productAudiences).length === 0) && (
              <span className="text-xs text-slate-500">—</span>
            )}
          </div>
        </div>

        {/* Section 4: Geography & Settings */}
        <div className="p-4 bg-slate-50/50 border border-slate-200/60 rounded-xl space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/40">
            <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-wider">📍 Settings</span>
            <button
              type="button"
              onClick={() => goToStep(4)}
              className="text-xs font-bold text-blue-605 hover:underline cursor-pointer"
            >
              Edit
            </button>
          </div>
          <div className="grid grid-cols-[110px_1fr] gap-x-2 text-xs">
            <div className="text-slate-400 font-semibold">Target Cities</div>
            <div className="flex flex-wrap gap-1">
              {state.geography.cities.map((c) => (
                <span key={c} className="bg-slate-100 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-bold">
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-[110px_1fr] gap-x-2 text-xs">
            <div className="text-slate-400 font-semibold">Locality Areas</div>
            <div className="text-slate-800 font-semibold">{state.geography.specificAreas || 'All select neighborhoods'}</div>
          </div>
          <div className="grid grid-cols-[110px_1fr] gap-x-2 text-xs">
            <div className="text-slate-400 font-semibold">Budget</div>
            <div className="text-slate-800 font-bold">{BUDGET_MAP[state.geography.budgetRange] || '—'} / month</div>
          </div>
          <div className="grid grid-cols-[110px_1fr] gap-x-2 text-xs">
            <div className="text-slate-400 font-semibold">Setup Start Date</div>
            <div className="text-slate-800 font-semibold">{formatDate(state.geography.goLiveDate)}</div>
          </div>
          <div className="grid grid-cols-[110px_1fr] gap-x-2 text-xs">
            <div className="text-slate-400 font-semibold">Creative Ready</div>
            <div className="text-slate-800 font-semibold">{CREATIVES_MAP[state.geography.creativesStatus] || '—'}</div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200/60 flex justify-end">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-8 py-3 bg-gradient-to-r from-blue-950 to-blue-600 hover:shadow-lg hover:shadow-blue-500/15 disabled:bg-slate-300 disabled:shadow-none text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center min-w-[140px]"
        >
          {isSubmitting ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Submitting...
            </>
          ) : (
            'Submit Campaign Brief ✓'
          )}
        </button>
      </div>
    </div>
  );
}
