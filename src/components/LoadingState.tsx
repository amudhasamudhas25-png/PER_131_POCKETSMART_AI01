import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  plannerLabel: string;
}

const STEPS = [
  'PocketSmart AI is analyzing your requirements...',
  'Calculating your budget and reserve buffer...',
  'Finding personalized recommendations within your cap...',
];

export const LoadingState: React.FC<LoadingStateProps> = ({ plannerLabel }) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % STEPS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-white border border-slate-200 rounded-xl p-10 text-center max-w-xl mx-auto my-8 space-y-6"
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
        <Loader2 className="w-6 h-6 text-slate-900 animate-spin" />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-500">
          {plannerLabel} · Gemini Analysis Active
        </p>
        <h3 className="font-display text-xl font-semibold text-slate-900">
          {STEPS[stepIndex]}
        </h3>
      </div>

      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div
          className="bg-slate-900 h-full transition-all duration-500 rounded-full"
          style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs text-slate-500 pt-2">
        <span className={stepIndex >= 0 ? 'text-slate-900 font-semibold' : ''}>
          01. Requirements
        </span>
        <span className={stepIndex >= 1 ? 'text-slate-900 font-semibold' : ''}>
          02. Allocation
        </span>
        <span className={stepIndex >= 2 ? 'text-slate-900 font-semibold' : ''}>
          03. Validation
        </span>
      </div>
    </div>
  );
};
