import React from 'react';

export default function CardProgressBar({ currentStep, stepsCount, stepNames, goToStep }) {
  const pct = Math.round((currentStep / stepsCount) * 100);

  return (
    <div className="relative mb-8 pb-4 border-b border-slate-200/50">
      {/* Progress Bar at the top edge of the card */}
      <div className="absolute top-0 left-0 right-0 h-[4.5px] bg-slate-200/40 z-10">
        <div
          className="h-full bg-gradient-to-r from-blue-900 via-blue-600 to-cyan-600 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Step Dots indicator bar */}
      <div className="flex items-center justify-center w-full max-w-[420px] mx-auto mt-4 px-2">
        {Array.from({ length: stepsCount }).map((_, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <React.Fragment key={stepNum}>
              <div className="flex flex-col items-center relative">
                <button
                  type="button"
                  onClick={() => goToStep(stepNum)}
                  className="focus:outline-none flex items-center justify-center cursor-pointer z-20"
                  disabled={stepNum > currentStep && !isCompleted}
                  aria-label={`Go to Step ${stepNum}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
                      isCompleted
                        ? 'bg-gradient-to-br from-blue-950 to-blue-600 text-white shadow-md shadow-blue-500/30 border-transparent'
                        : isActive
                        ? 'bg-white border-2 border-blue-600 text-blue-600 shadow-sm shadow-blue-500/10'
                        : 'bg-white/50 border border-slate-200 text-slate-450 font-medium'
                    }`}
                  >
                    {isCompleted ? '✓' : stepNum}
                  </div>
                </button>
                <span className={`absolute top-8 text-[9px] font-bold tracking-tight uppercase whitespace-nowrap ${
                  isActive ? 'text-blue-600' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                }`}>
                  {stepNames[i]}
                </span>
              </div>
              {i < stepsCount - 1 && (
                <div
                  className={`h-[2px] flex-1 mx-2 transition-all duration-300 ${
                    stepNum < currentStep ? 'bg-blue-600' : 'bg-slate-200/70'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="h-6" /> {/* Spacer for labels */}
    </div>
  );
}
