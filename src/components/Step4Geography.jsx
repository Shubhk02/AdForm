import React, { useEffect } from 'react';

const CITIES_LIST = ['Gurgaon', 'Noida', 'South Delhi'];
const BUDGET_LIST = [
  { id: '10k-25k', label: '₹10K – ₹25K / month' },
  { id: '25k-50k', label: '₹25K – ₹50K / month' },
  { id: '50k-1l', label: '₹50K – ₹1L / month' },
  { id: '1l+', label: '₹1L+ / month' }
];

const CREATIVES_LIST = [
  { id: 'ready', label: '✅ Yes — I\'ll upload them' },
  { id: 'need_help', label: '🎨 No — I need help creating them' },
  { id: 'rough_idea', label: '💡 I have a rough idea to discuss' }
];

const getMinDateString = () => {
  const today = new Date();
  today.setDate(today.getDate() + 4); // ~3 business days
  while ([0, 6].includes(today.getDay())) {
    today.setDate(today.getDate() + 1);
  }
  return today.toISOString().split('T')[0];
};

export default function Step4Geography({
  geography,
  updateGeographyField,
  toggleCity,
  errors
}) {
  const minDate = getMinDateString();

  // Set default goLiveDate if empty
  useEffect(() => {
    if (!geography.goLiveDate) {
      updateGeographyField('goLiveDate', minDate);
    }
  }, [geography.goLiveDate, minDate]);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <span className="text-[11px] font-bold text-cyan-600 uppercase tracking-widest block mb-1">Section 4</span>
        <h2 className="text-xl font-bold text-slate-900">Locations, budget &amp; launch plan</h2>
        <p className="text-sm text-slate-500 mt-1">
          Choose where your campaign should run and how soon you want to go live.
        </p>
      </div>

      {/* Target Cities Chips */}
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-slate-700 mb-1">
          Target Cities <span className="text-blue-600">*</span>
        </label>
        <p className="text-xs text-slate-500 mb-3">Delhi NCR areas are pre-selected by default</p>
        
        <div className="flex flex-wrap gap-2">
          {CITIES_LIST.map((city) => {
            const isSelected = geography.cities.includes(city);
            return (
              <button
                type="button"
                key={city}
                onClick={() => toggleCity(city)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/10'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350'
                }`}
              >
                📍 {city}
              </button>
            );
          })}
        </div>
        {errors.cities && <span className="text-xs text-red-500 mt-1 flex items-center gap-1">⚠ {errors.cities}</span>}
      </div>

      {/* Specific Areas Input */}
      <div className="flex flex-col">
        <label htmlFor="specificAreas" className="text-sm font-semibold text-slate-700 mb-1.5">
          Specific Localities or Neighborhoods
        </label>
        <input
          type="text"
          id="specificAreas"
          value={geography.specificAreas}
          onChange={(e) => updateGeographyField('specificAreas', e.target.value)}
          placeholder="e.g. DLF Phase 3, Sector 62, GK 2, or leave blank for all"
          className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10"
        />
      </div>

      {/* Budget Radios */}
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-slate-700 mb-1">
          Monthly Budget Range <span className="text-blue-600">*</span>
        </label>
        <p className="text-xs text-slate-500 mb-3">Choose the bracket closest to your planned advertising spend</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {BUDGET_LIST.map((budget) => {
            const isSelected = geography.budgetRange === budget.id;
            return (
              <div
                key={budget.id}
                onClick={() => updateGeographyField('budgetRange', budget.id)}
                className={`flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-50/40 border-blue-600 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-350'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                  isSelected ? 'border-blue-600' : 'border-slate-300'
                }`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                </div>
                <span className="text-xs text-slate-700 font-semibold">{budget.label}</span>
              </div>
            );
          })}
        </div>
        {errors.budgetRange && <span className="text-xs text-red-500 mt-1 flex items-center gap-1">⚠ {errors.budgetRange}</span>}
      </div>

      {/* Target Go-Live Date */}
      <div className="flex flex-col">
        <label htmlFor="goLiveDate" className="text-sm font-semibold text-slate-700 mb-1.5">
          Target Campaign Go-Live Date <span className="text-blue-600">*</span>
        </label>
        <input
          type="date"
          id="goLiveDate"
          min={minDate}
          value={geography.goLiveDate}
          onChange={(e) => updateGeographyField('goLiveDate', e.target.value)}
          className="w-full max-w-[240px] px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10"
        />
        <span className="text-[10px] text-slate-450 font-bold mt-1">Requires min. 3 business days for setup (earliest available: {minDate})</span>
        {errors.goLiveDate && <span className="text-xs text-red-500 mt-1 flex items-center gap-1">⚠ {errors.goLiveDate}</span>}
      </div>

      {/* Creatives Readiness */}
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-slate-700 mb-1">
          Do you have ad creatives ready? <span className="text-blue-600">*</span>
        </label>
        <p className="text-xs text-slate-500 mb-3">Creatives refer to image banners or videos to show in the campaign</p>
        <div className="space-y-2.5">
          {CREATIVES_LIST.map((c) => {
            const isSelected = geography.creativesStatus === c.id;
            return (
              <div
                key={c.id}
                onClick={() => updateGeographyField('creativesStatus', c.id)}
                className={`flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-50/40 border-blue-600 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-350'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                  isSelected ? 'border-blue-600' : 'border-slate-300'
                }`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                </div>
                <span className="text-xs text-slate-700 font-semibold">{c.label}</span>
              </div>
            );
          })}
        </div>
        {errors.creativesStatus && <span className="text-xs text-red-500 mt-1 flex items-center gap-1">⚠ {errors.creativesStatus}</span>}
      </div>
    </div>
  );
}
