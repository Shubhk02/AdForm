import React from 'react';

const INDUSTRIES_LIST = [
  'F&B',
  'Health & Wellness',
  'Fashion',
  'Beauty',
  'Finance',
  'EdTech',
  'Retail',
  'SaaS / Tech'
];

export default function Step1Brand({
  brand,
  updateBrandField,
  errors,
  triggerScrape,
  scraperState,
  toggleIndustry
}) {
  const charCount = brand.description?.length || 0;

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <span className="text-[11px] font-bold text-cyan-600 uppercase tracking-widest block mb-1">Section 1</span>
        <h2 className="text-xl font-bold text-slate-900">Tell us about your brand</h2>
        <p className="text-sm text-slate-500 mt-1">
          Share your website and brand details so we can shape a campaign brief for the right premium spaces.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Brand Name */}
        <div className="flex flex-col">
          <label htmlFor="brandName" className="text-sm font-semibold text-slate-700 mb-1.5">
            Brand Name <span className="text-blue-600">*</span>
          </label>
          <input
            type="text"
            id="brandName"
            value={brand.name}
            onChange={(e) => updateBrandField('name', e.target.value)}
            placeholder="e.g. Acme Co"
            className={`w-full px-4 py-2.5 bg-slate-50/50 border rounded-xl text-sm transition-all focus:outline-none focus:bg-white focus:ring-3 ${
              errors.name
                ? 'border-red-500 focus:ring-red-500/10'
                : 'border-slate-200 focus:border-blue-600 focus:ring-blue-600/10'
            }`}
          />
          {errors.name && <span className="text-xs text-red-500 mt-1 flex items-center gap-1">⚠ {errors.name}</span>}
        </div>

        {/* Website URL */}
        <div className="flex flex-col">
          <label htmlFor="brandUrl" className="text-sm font-semibold text-slate-700 mb-1.5">
            Website URL <span className="text-blue-600">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="brandUrl"
              value={brand.url}
              onChange={(e) => updateBrandField('url', e.target.value)}
              placeholder="e.g. yourbrand.com"
              className={`flex-1 px-4 py-2.5 bg-slate-50/50 border rounded-xl text-sm transition-all focus:outline-none focus:bg-white focus:ring-3 ${
                errors.url
                  ? 'border-red-500 focus:ring-red-500/10'
                  : 'border-slate-200 focus:border-blue-600 focus:ring-blue-600/10'
              }`}
            />
            <button
              type="button"
              onClick={triggerScrape}
              disabled={scraperState.loading}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-350 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2"
            >
              {scraperState.loading ? (
                <>
                  <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Fetching
                </>
              ) : (
                'Fetch ✦'
              )}
            </button>
          </div>
          {errors.url && <span className="text-xs text-red-500 mt-1 flex items-center gap-1">⚠ {errors.url}</span>}
          {scraperState.message && (
            <div className={`mt-2.5 text-xs font-semibold px-3 py-2 rounded-lg ${
              scraperState.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200/50' : 'bg-emerald-50 text-emerald-600 border border-emerald-200/50'
            }`}>
              {scraperState.message}
            </div>
          )}
        </div>
      </div>

      {/* Industries */}
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-slate-700 mb-1">
          Industry / Category <span className="text-blue-600">*</span>
        </label>
        <p className="text-xs text-slate-500 mb-3">Select all that apply to your business</p>
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES_LIST.map((ind) => {
            const isSelected = brand.industries.includes(ind);
            return (
              <button
                type="button"
                key={ind}
                onClick={() => toggleIndustry(ind)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/10'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350'
                }`}
              >
                {ind}
              </button>
            );
          })}
        </div>
        {errors.industries && <span className="text-xs text-red-500 mt-1 flex items-center gap-1">⚠ {errors.industries}</span>}
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-1.5">
          <label htmlFor="brandDesc" className="text-sm font-semibold text-slate-700">
            Brand Description <span className="text-blue-600">*</span>
          </label>
          <span className={`text-[10px] font-bold ${charCount >= 160 ? 'text-red-500 font-extrabold' : 'text-slate-400'}`}>
            {charCount}/160 chars
          </span>
        </div>
        <textarea
          id="brandDesc"
          value={brand.description}
          onChange={(e) => updateBrandField('description', e.target.value.slice(0, 160))}
          placeholder="Briefly describe what your brand does, target offering, or brand values..."
          rows={2}
          className={`w-full px-4 py-2 bg-slate-50/50 border rounded-xl text-sm transition-all focus:outline-none focus:bg-white focus:ring-3 ${
            errors.description
              ? 'border-red-500 focus:ring-red-500/10'
              : 'border-slate-200 focus:border-blue-600 focus:ring-blue-600/10'
          }`}
        />
        {errors.description && <span className="text-xs text-red-500 mt-1 flex items-center gap-1">⚠ {errors.description}</span>}
      </div>
    </div>
  );
}
