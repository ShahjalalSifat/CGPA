'use client';

import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  BarChart3,
  Settings2,
} from 'lucide-react';

export type TabType = 'dashboard' | 'semesters' | 'simulator' | 'analytics' | 'settings';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export default function BottomNav({ activeTab, onChangeTab }: BottomNavProps) {
  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'semesters' as TabType, label: 'Semesters', icon: BookOpen },
    { id: 'simulator' as TabType, label: 'Simulator', icon: Sparkles },
    { id: 'analytics' as TabType, label: 'Analytics', icon: BarChart3 },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings2 },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] no-print">
      <div className="max-w-md mx-auto px-4 py-2">
        <nav className="flex items-center justify-between" aria-label="Main Navigation">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => onChangeTab(tab.id)}
                type="button"
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-slate-950 font-semibold scale-105'
                    : 'text-slate-400 hover:text-slate-600 font-medium'
                }`}
              >
                <div
                  className={`p-1 rounded-lg transition-colors ${
                    isActive ? 'bg-slate-100 text-slate-900 shadow-sm' : ''
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[11px] tracking-tight mt-0.5">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
