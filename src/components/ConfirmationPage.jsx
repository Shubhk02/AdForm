import React from 'react';

export default function ConfirmationPage({ briefId, onViewDashboard }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-4 animate-fadeIn">
      {/* Success Icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center text-3xl shadow-xl shadow-blue-500/30">
          🎉
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 5 4.5 8.5 11 1" />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Brief Submitted!</h2>
      <p className="text-sm text-slate-500 mt-2 max-w-[420px] leading-relaxed">
        Your campaign brief has been received. Our team will review it and get back to you within 1–2 business days.
      </p>

      <div className="my-6 px-6 py-3 border border-slate-200 bg-white rounded-2xl shadow-sm text-base font-bold font-mono text-cyan-600">
        {briefId}
      </div>
      <p className="text-[11px] text-slate-400 font-semibold mb-8">Save this reference number for your records.</p>

      {/* Auto-redirect notice */}
      <p className="text-xs text-slate-400 mb-6 flex items-center gap-1.5">
        <span className="inline-block w-3 h-3 border-2 border-blue-400/40 border-t-blue-500 rounded-full animate-spin"></span>
        Taking you to your campaign dashboard in a few seconds…
      </p>

      {/* Steps */}
      <div className="w-full max-w-[460px] text-left p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm mt-2">
        <h3 className="text-sm font-bold text-slate-900 mb-4">What happens next?</h3>
        <div className="space-y-4">
          <div className="flex gap-3.5">
            <div className="w-[22px] h-[22px] rounded-full bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[10px] font-bold text-blue-600 flex-shrink-0 mt-0.5">1</div>
            <div className="text-xs text-slate-500 leading-relaxed">
              <strong className="text-slate-800">Brief review</strong> — Our campaign ops team reviews your brief for completeness and fit.
            </div>
          </div>
          <div className="flex gap-3.5">
            <div className="w-[22px] h-[22px] rounded-full bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[10px] font-bold text-blue-600 flex-shrink-0 mt-0.5">2</div>
            <div className="text-xs text-slate-500 leading-relaxed">
              <strong className="text-slate-800">Strategy planning</strong> — We create a custom distribution strategy for your target cities.
            </div>
          </div>
          <div className="flex gap-3.5">
            <div className="w-[22px] h-[22px] rounded-full bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[10px] font-bold text-blue-600 flex-shrink-0 mt-0.5">3</div>
            <div className="text-xs text-slate-500 leading-relaxed">
              <strong className="text-slate-800">Campaign launch</strong> — Your ads go live on our premium DOOH network across Delhi NCR.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
