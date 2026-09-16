'use client';

import React from 'react';
import { useCgpa } from '@/context/CgpaContext';
import { TabType } from '@/components/BottomNav';
import {
  Award,
  Target,
  ArrowRight,
  TrendingUp,
  FileText,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine,
} from 'recharts';

interface DashboardTabProps {
  onNavigateTab: (tab: TabType) => void;
  onOpenTranscript: () => void;
}

export default function DashboardTab({
  onNavigateTab,
  onOpenTranscript,
}: DashboardTabProps) {
  const { profile, summary } = useCgpa();

  const chartData = summary.semesterCalculations
    .filter(s => s.totalCredits > 0 && s.courseResults.some(c => c.scorePercent > 0 || c.gradePoint > 0))
    .map(s => ({
      label: `L${s.level}S${s.semester}`,
      fullLabel: s.label,
      gpa: s.gpa,
    }));

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-200 max-w-3xl mx-auto">
      {/* Primary CGPA Display Card (Clean iOS 26 Aesthetic) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Cumulative Grade Point Average
          </span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {profile.universityId === 'hstu' ? 'HSTU Civil' : profile.departmentName}
          </span>
        </div>

        {/* Big Hero Numbers */}
        <div className="flex items-baseline gap-2">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
            {summary.cgpa > 0 ? summary.cgpa.toFixed(2) : '0.00'}
          </h1>
          <span className="text-base font-semibold text-slate-400">/ 4.00</span>
        </div>

        {/* Minimal Sub-metrics Grid */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
          <div className="space-y-0.5">
            <span className="text-[11px] font-medium text-slate-400 uppercase">Target</span>
            <div className="text-sm font-bold text-slate-800">
              {profile.targetCgpa.toFixed(2)}
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] font-medium text-slate-400 uppercase">Credits</span>
            <div className="text-sm font-bold text-slate-800">
              {summary.totalCreditsEarned} <span className="text-xs font-normal text-slate-400">/ {profile.programTotalCredits}</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] font-medium text-slate-400 uppercase">Completed</span>
            <div className="text-sm font-bold text-slate-800">
              {summary.creditCompletionPercentage}%
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action Button to Enter Marks */}
      <button
        onClick={() => onNavigateTab('semesters')}
        type="button"
        className="w-full p-4 rounded-2xl bg-slate-900 text-white font-semibold text-xs flex items-center justify-between hover:bg-slate-800 shadow-sm transition-all cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-white" />
          <span>Input & Edit Semester Marks (Quiz, Mid, Final)</span>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-400" />
      </button>

      {/* Minimal Semester Trend Bar Chart */}
      {chartData.length > 0 && (
        <section className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_1px_6px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Semester GPA Progression
            </h3>
            <span className="text-[11px] text-slate-400">Target {profile.targetCgpa.toFixed(2)}</span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <XAxis
                  dataKey="label"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[0, 4.0]}
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  ticks={[2.0, 3.0, 3.5, 4.0]}
                />
                <Tooltip
                  formatter={(val: any) => [`${Number(val).toFixed(2)}`, 'GPA']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <ReferenceLine
                  y={profile.targetCgpa}
                  stroke="#94a3b8"
                  strokeDasharray="3 3"
                />
                <Bar dataKey="gpa" radius={[6, 6, 0, 0]} maxBarSize={36}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.gpa >= profile.targetCgpa ? '#0f172a' : '#64748b'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Minimal Footer Action */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onOpenTranscript}
          type="button"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>View Full Academic Transcript</span>
        </button>
      </div>
    </div>
  );
}
