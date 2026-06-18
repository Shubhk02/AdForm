import React from 'react';

export default function CardProgressBar({ currentStep, stepsCount, stepNames, goToStep }) {
  return (
    <div className="relative mb-6 pb-4">
      {/* Step Dots indicator bar */}
      <div className="flex items-center justify-center w-full max-w-[450px] mx-auto mt-4 px-2">
        {Array.from({ length: stepsCount }).map((_, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <React.Fragment key={stepNum}>
              <div className="flex flex-col items-center relative">
                {/* Chevron over active step */}
                {isActive && (
                  <div className="absolute -top-4 text-slate-500 text-xs">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="2 2 6 6 10 2"></polyline>
                    </svg>
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={() => goToStep(stepNum)}
                  className="focus:outline-none flex items-center justify-center cursor-pointer z-20"
                  disabled={stepNum > currentStep && !isCompleted}
                  aria-label={`Go to Step ${stepNum}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold transition-all duration-300 ${
                      isCompleted || isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                        : 'bg-white border-2 border-slate-300 text-slate-400'
                    }`}
                  >
                    {isCompleted ? (
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="1.5 5.5 4.5 8.5 10.5 1.5"></polyline>
                      </svg>
                    ) : (
                      stepNum
                    )}
                  </div>
                </button>
                <span className={`absolute top-9 text-[11px] font-bold tracking-wide whitespace-nowrap ${
                  isActive || isCompleted ? 'text-slate-700' : 'text-slate-400'
                }`}>
                  {stepNames[i]}
                </span>
              </div>
              
              {/* Connecting Line */}
              {i < stepsCount - 1 && (
                <div
                  className={`h-[2.5px] flex-1 mx-1 transition-all duration-300 ${
                    stepNum < currentStep ? 'bg-blue-600' : 'bg-slate-300'
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
