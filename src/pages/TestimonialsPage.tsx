import React from 'react';
import { ArrowRight } from 'lucide-react';
import { PageView } from '../types/index.ts';

interface TestimonialsPageProps {
  onNavigate: (page: PageView) => void;
}

export const TestimonialsPage: React.FC<TestimonialsPageProps> = ({ onNavigate }) => {
  const testimonials = [
    {
      name: 'Priya Nair',
      role: 'Senior Product Designer',
      organization: 'Studio Kora, Bengaluru',
      planner: 'Home Interior Planner',
      budget: '₹1,00,000',
      actualSpend: '₹84,200',
      savingsPercent: '15.8% Reserve Saved',
      quote:
        'Our initial carpenter and lighting quotes totaled ₹1,38,000 for our 2BHK living room. PocketSmart AI broke down our 5 item groups, suggested BLDC fans and warm 3000K recessed LEDs, and delivered a complete plan at ₹84,200.',
    },
    {
      name: 'Rohan Deshmukh',
      role: 'Operations Lead',
      organization: 'Apex Logistics, Pune',
      planner: 'Party & Event Planner',
      budget: '₹75,000',
      actualSpend: '₹66,000',
      savingsPercent: '₹660 / Guest Achieved',
      quote:
        'Planning a 100-guest milestone birthday at a banquet hall usually spirals out of control on catering and decor. PocketSmart AI locked our buffet cost at ₹350/plate and focused decor on the stage backdrop, saving ₹9,000 for emergencies.',
    },
    {
      name: 'Ananya Verma',
      role: 'Postgraduate Researcher',
      organization: 'IIT Delhi',
      planner: 'Jewelry Recommendation Planner',
      budget: '₹30,000',
      actualSpend: '₹25,800',
      savingsPercent: '14% Under Budget',
      quote:
        'I uploaded a photo of my crimson Banarasi silk saree with gold zari border. Gemini analyzed the neckline and zari weave, recommending a 92.5 gold-plated temple choker set and pearl-edged kadas that matched effortlessly within ₹25,800.',
    },
    {
      name: 'Vikramaditya Rao',
      role: 'Founder',
      organization: 'Veloce Labs, Hyderabad',
      planner: 'Home Interior Planner',
      budget: '₹60,000',
      actualSpend: '₹52,400',
      savingsPercent: '12.6% Reserve Saved',
      quote:
        'Setting up a home office with ergonomic seating, task lighting, and acoustic curtains on a strict ₹60,000 budget was effortless. The "Find Alternatives" button helped me swap an overpriced desk for an engineered oak option.',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-semibold text-emerald-700">
            Verified Budget Outcomes
          </p>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-slate-900">
            How Planners Stay Within Cap Using PocketSmart AI
          </h1>
          <p className="text-sm text-slate-600">
            Concrete before-and-after outcomes across Home Interiors, Event Planning, and Bridal/Festive Jewelry.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap self-start md:self-auto"
        >
          <span>Create Your Own Plan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((item) => (
          <article
            key={item.name}
            className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 flex flex-col justify-between gap-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
                <span>{item.planner}</span>
                <span className="font-mono font-semibold text-emerald-700 tabular-nums">
                  {item.actualSpend} / {item.budget} ({item.savingsPercent})
                </span>
              </div>

              <blockquote className="text-sm text-slate-700 leading-relaxed">
                “{item.quote}”
              </blockquote>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-slate-900">{item.name}</p>
                <p className="text-slate-500">
                  {item.role} · {item.organization}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
