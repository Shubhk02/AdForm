import React from 'react';

export default function ConfirmationPage({ briefId }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-4 animate-fadeIn">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center text-3xl mb-6 shadow-xl shadow-blue-500/30">
        🎉
      </div>
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Brief Submitted!</h2>
      <p className="text-sm text-slate-500 mt-2 max-w-[420px] leading-relaxed">
        Your campaign brief has been received. Our team will review it and get back to you within 1–2 business days.
      </p>

      <div className="my-6 px-6 py-3 border border-slate-200 bg-white rounded-2xl shadow-sm text-base font-bold font-mono text-cyan-600">
        {briefId}
      </div>
      <p className="text-[11px] text-slate-400 font-semibold mb-8">Save this reference number for your records.</p>

      <div className="w-full max-w-[460px] text-left p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4">What happens next?</h3>
        
        <div className="space-y-4">
          <div className="flex gap-3.5">
            <div className="w-[22px] h-[22px] rounded-full bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[10px] font-bold text-blue-600 flex-shrink-0 mt-0.5">
              1
            </div>
            <div className="text-xs text-slate-500 leading-relaxed">
              <strong className="text-slate-800">Brief review</strong> — Our campaign ops team reviews your brief for completeness and fit.
            </div>
          </div>

          <div className="flex gap-3.5">
            <div className="w-[22px] h-[22px] rounded-full bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[10px] font-bold text-blue-600 flex-shrink-0 mt-0.5">
              2
            </div>
            <div className="text-xs text-slate-500 leading-relaxed">
              <strong className="text-slate-800">Strategy planning</strong> — We create a custom distribution strategy for your target cities.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
