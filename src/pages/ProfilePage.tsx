import React, { useEffect, useState } from 'react';
import { CheckCircle2, LogOut } from 'lucide-react';
import { ExternalPlatformStatus, UserProfile } from '../types/index.ts';
import { ApiService } from '../services/api.ts';

interface ProfilePageProps {
  user: UserProfile | null;
  onUpdateUser: (user: UserProfile) => void;
  onLogout: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  onUpdateUser,
  onLogout,
}) => {
  const [fullName, setFullName] = useState(user?.fullName || 'Aarav Sharma');
  const [email, setEmail] = useState(user?.email || 'demo@pocketsmart.ai');
  const [defaultStyle, setDefaultStyle] = useState(user?.defaultStyle || 'Modern');
  const [savedToast, setSavedToast] = useState(false);
  const [platforms, setPlatforms] = useState<ExternalPlatformStatus[]>([]);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setEmail(user.email);
      setDefaultStyle(user.defaultStyle || 'Modern');
    }
  }, [user]);

  useEffect(() => {
    ApiService.getPlatformsStatus().then(setPlatforms);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await ApiService.updateProfile({
      id: user?.id,
      fullName,
      email,
      defaultStyle,
    });
    onUpdateUser(updated);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-emerald-700">
            Account Preferences & Integrations
          </p>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-slate-900">
            Profile & Settings
          </h1>
          <p className="text-sm text-slate-600">
            Manage your planning defaults and inspect external retail/vendor integration status.
          </p>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Profile Form */}
      <form
        onSubmit={handleSave}
        className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 space-y-6"
      >
        <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">
          Personal Planning Profile
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800">
              Default Interior Style
            </label>
            <select
              value={defaultStyle}
              onChange={(e) => setDefaultStyle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-slate-900"
            >
              <option value="Modern">Modern</option>
              <option value="Minimalist">Minimalist</option>
              <option value="Traditional">Traditional</option>
              <option value="Scandinavian">Scandinavian</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedToast ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              Profile preferences updated successfully.
            </span>
          ) : (
            <span className="text-xs text-slate-500">
              Default currency: INR (₹)
            </span>
          )}

          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Save Profile Settings
          </button>
        </div>
      </form>

      {/* External Platform Integration Architecture Status */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 space-y-1">
          <h2 className="text-sm font-semibold text-slate-900">
            External Vendor & Marketplace Service Architecture
          </h2>
          <p className="text-xs text-slate-500">
            Per PocketSmart AI product data integrity rules, when external partner APIs are not configured, recommendations are clearly labeled as AI Estimated Recommendations rather than live marketplace listings.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                <th className="py-3 px-4 font-semibold">Service Adapter</th>
                <th className="py-3 px-4 font-semibold">Planner Module</th>
                <th className="py-3 px-4 font-semibold">Active Data Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {platforms.map((p) => (
                <tr key={p.platform}>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {p.platform}
                  </td>
                  <td className="py-3 px-4 capitalize text-slate-600">
                    {p.domain} Planner
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {p.mode}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
