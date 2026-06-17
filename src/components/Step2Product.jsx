import React, { useState } from 'react';

export default function Step2Product({
  products,
  toggleProduct,
  addManualProduct,
  updateOfferField,
  errors
}) {
  const [manualInput, setManualInput] = useState('');

  const handleAdd = () => {
    const val = manualInput.trim();
    if (!val) return;
    addManualProduct(val);
    setManualInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <span className="text-[11px] font-bold text-cyan-600 uppercase tracking-widest block mb-1">Section 2</span>
        <h2 className="text-xl font-bold text-slate-900">What should your campaign promote?</h2>
        <p className="text-sm text-slate-500 mt-1">
          Choose the product, service, offer, or message you want audiences to remember.
        </p>
      </div>

      {/* Product Selection List */}
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-slate-700 mb-1.5">
          Product / Offering to Advertise <span className="text-blue-600">*</span>
        </label>
        {products.isScraped && products.selected.length > 0 && (
          <div className="mb-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-600 bg-cyan-50 border border-cyan-200/60 rounded-full px-2.5 py-0.5">
              ✦ Auto-filled from your website
            </span>
          </div>
        )}

        <div className="space-y-2.5" id="productsList">
          {products.list.length === 0 ? (
            <div className="text-sm text-slate-500 py-3 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl px-4 text-center">
              No products yet — enter your website URL in Step 1 to fetch them automatically, or add products manually below.
            </div>
          ) : (
            products.list.map((p) => {
              const isSelected = products.selected.includes(p.name);
              return (
                <div
                  key={p.name}
                  onClick={() => toggleProduct(p.name)}
                  className={`flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/40 border-blue-600 shadow-sm shadow-blue-500/5'
                      : 'bg-white border-slate-200 hover:border-slate-350'
                  }`}
                >
                  <div className={`w-5 h-5 border rounded flex items-center justify-center transition-all ${
                    isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                  }`}>
                    {isSelected && '✓'}
                  </div>
                  <span className="text-sm text-slate-700 font-semibold">{p.name}</span>
                </div>
              );
            })
          )}
        </div>
        {errors.selected && <span className="text-xs text-red-500 mt-1 flex items-center gap-1">⚠ {errors.selected}</span>}
      </div>

      {/* Manual Product Input */}
      <div className="flex flex-col gap-2">
        <label htmlFor="manualProduct" className="text-sm font-semibold text-slate-700">
          Or add a custom product
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="manualProduct"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter product name..."
            className="flex-1 px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-200"
          >
            Add Product
          </button>
        </div>
      </div>

      {/* Active Offer Toggle */}
      <div className="flex flex-col border-t border-slate-200/60 pt-6 mt-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={products.offer.hasOffer}
            onChange={(e) => updateOfferField('hasOffer', e.target.checked)}
            className="w-4.5 h-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-semibold text-slate-800">Is there an active offer or coupon to highlight?</span>
        </label>

        {products.offer.hasOffer && (
          <div className="mt-4 flex flex-col animate-slideDown">
            <label htmlFor="offerDesc" className="text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
              Offer Description
            </label>
            <textarea
              id="offerDesc"
              value={products.offer.description}
              onChange={(e) => updateOfferField('description', e.target.value)}
              placeholder="e.g. Get 20% off with coupon HEALTH20, Buy 1 Get 1 Free, etc."
              rows={2}
              className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10"
            />
          </div>
        )}
      </div>
    </div>
  );
}
