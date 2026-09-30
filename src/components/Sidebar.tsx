import React from 'react';
import { PageView } from '../types/index.ts';

interface SidebarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  savedCount: number;
  historyCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  savedCount,
  historyCount,
}) => {
  const sections = [
    {
      heading: 'Workspace',
      items: [
        { label: 'Dashboard Overview', view: 'dashboard' as PageView },
        { label: 'Recommendation History', view: 'history' as PageView, count: historyCount },
        { label: 'Saved Recommendations', view: 'saved' as PageView, count: savedCount },
      ],
    },
    {
      heading: 'AI Budget Planners',
      items: [
        { label: 'Home Interior Planner', view: 'home-planner' as PageView },
        { label: 'Party & Event Planner', view: 'party-planner' as PageView },
        { label: 'Jewelry Planner', view: 'jewelry-planner' as PageView },
      ],
    },
    {
      heading: 'Account & Proof',
      items: [
        { label: 'Client Testimonials', view: 'testimonials' as PageView },
        { label: 'Profile & Settings', view: 'profile' as PageView },
      ],
    },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 shrink-0 border-r border-slate-200 bg-white min-h-[calc(100vh-4rem)] p-6 justify-between no-print">
      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.heading} className="space-y-2">
            <p className="px-3 text-xs font-semibold text-slate-400 tracking-wide">
              {section.heading}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive =
                  currentPage === item.view ||
                  (item.view === 'home-planner' && currentPage === 'home-recommendations') ||
                  (item.view === 'party-planner' && currentPage === 'party-recommendations') ||
                  (item.view === 'jewelry-planner' && currentPage === 'jewelry-recommendations');
                return (
                  <button
                    key={item.view}
                    type="button"
                    onClick={() => onNavigate(item.view)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <span className="truncate">{item.label}</span>
                    {typeof item.count === 'number' && (
                      <span
                        className={`font-mono text-xs tabular-nums ${
                          isActive ? 'text-slate-300' : 'text-slate-400'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-slate-200 space-y-2">
        <p className="text-xs font-semibold text-slate-700">Strict Budget Guard</p>
        <p className="text-xs text-slate-500 leading-relaxed">
          All generated plans are automatically validated to ensure total estimated spend never exceeds your cap.
        </p>
      </div>
    </aside>
  );
};
