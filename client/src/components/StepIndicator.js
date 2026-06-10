import React from 'react';

export default function StepIndicator({ steps, current }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((label, i) => {
        const num = i + 1;
        const isComplete = num < current;
        const isActive = num === current;

        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center">
              <div
                className={`step-indicator ${
                  isComplete
                    ? 'bg-[#1D9E75] text-white'
                    : isActive
                    ? 'bg-[#1D9E75] text-white ring-4 ring-[#1D9E75]/20'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isComplete ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  num
                )}
              </div>
              <span className={`mt-1 text-xs font-medium hidden sm:block ${isActive ? 'text-[#1D9E75]' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 w-12 sm:w-20 mb-4 mx-1 ${i + 1 < current ? 'bg-[#1D9E75]' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
