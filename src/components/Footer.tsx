import React from 'react';
import { PageView } from '../types/index.ts';

interface FooterProps {
  onNavigate: (page: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 px-6 no-print">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="space-y-1.5 max-w-md">
          <p className="font-display text-lg font-semibold text-slate-900">
            PocketSmart AI
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your Smart Budget & Recommendation Assistant. Product prices and allocations are AI-generated estimates unless a verified partner API is connected.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-600">
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => onNavigate('home-planner')}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Home Planner
          </button>
          <button
            type="button"
            onClick={() => onNavigate('party-planner')}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Party Planner
          </button>
          <button
            type="button"
            onClick={() => onNavigate('jewelry-planner')}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Jewelry Planner
          </button>
          <button
            type="button"
            onClick={() => onNavigate('testimonials')}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Testimonials
          </button>
          <button
            type="button"
            onClick={() => onNavigate('history')}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            History
          </button>
        </div>
      </div>
    </footer>
  );
};
