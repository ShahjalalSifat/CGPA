'use client';

import React from 'react';
import { useCgpa } from '@/context/CgpaContext';
import { TabType } from '@/components/BottomNav';
import {
  Award,
  TrendingUp,
  Target,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Sparkles,
  Sliders,
  Flame,
  Layers,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

interface DashboardTabProps {
  onNavigateTab: (tab: TabType) => void;
  onOpenTranscript: () => void;
}

export default function DashboardTab({ onNavigateTab, onOpenTranscript }: DashboardTabProps) {
  const { profile, summary, semesters } = useCgpa();

  // Prepare line chart data
  const trendData = summary.semesterCalculations
    .filter(s => s.totalCredits > 0 && s.courseResults.some(c => c.scorePercent > 0 || c.gradePoint > 0))
    .map((s, idx, arr) => {
      // Calculate progressive cumulative CGPA up to this semester
      const subSemesters = arr.slice(0, idx + 1);
      const totalPoints = subSemesters.reduce((acc, curr) => acc + curr.totalGradePoints, 0);
      const totalCreds = subSemesters.reduce((acc, curr) => acc + curr.totalCredits, 0);
      const progressiveCgpa = totalCreds > 0 ? Number((totalPoints / totalCreds).toFixed(2)) : s.gpa;

      return {
        label: s.label.replace('Level ', 'L').replace(' Semester ', 'S-').split(' (')[0],
        fullLabel: s.label,
        semesterGpa: s.gpa,
        cumulativeCgpa: progressiveCgpa,
        credits: s.totalCredits,
      };
    });

  // Prepare Grade distribution data for pie chart
  const gradeColors: Record<string, string> = {
    'A+': '#0f172a',
    'A': '#334155',
    'A-': '#475569',
    'B+': '#64748b',
    'B': '#94a3b8',
    'B-': '#cbd5e1',
    'C+': '#fbbf24',
    'C': '#f59e0b',
    'D': '#f97316',
    'F': '#ef4444',
  };

  const pieData = summary.gradeDistribution
    .filter(g => g.count > 0)
    .map(g => ({
      name: g.letterGrade,
      value: g.count,
      credits: g.creditTotal,
      percentage: g.percentage,
      color: gradeColors[g.letterGrade] || '#64748b',
    }));

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Hero CGPA & Target Card */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-slate-100/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main CGPA readout */}
          <div className="lg:col-span-6 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/80 border border-slate-200 text-xs font-semibold text-slate-700">
              <Award className="w-3.5 h-3.5 text-slate-700" />
              <span>Cumulative Grade Point Average</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900">
                {summary.cgpa > 0 ? summary.cgpa.toFixed(2) : '0.00'}
              </span>
              <span className="text-xl sm:text-2xl font-medium text-slate-400">/ 4.00</span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed max-w-md">
              Calculated across <strong className="text-slate-900 font-semibold">{summary.totalCreditsAttempted}</strong> credits in{' '}
              <strong className="text-slate-900 font-semibold">{profile.universityName}</strong> ({profile.departmentName}).
            </p>

            {/* Target Status pill */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border ${
                  summary.isTargetAchieved
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : summary.targetDifference >= -0.25
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                {summary.isTargetAchieved ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                )}
                <span>
                  {summary.targetDifference >= 0
                    ? `+${summary.targetDifference.toFixed(2)} Ahead of Target (${profile.targetCgpa.toFixed(2)})`
                    : `${Math.abs(summary.targetDifference).toFixed(2)} Below Target (${profile.targetCgpa.toFixed(2)})`}
                </span>
              </div>

              <button
                onClick={() => onNavigateTab('simulator')}
                type="button"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:underline cursor-pointer"
              >
                <span>Run Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Credits Completion Ring / Progress Block */}
          <div className="lg:col-span-6 bg-slate-50/80 rounded-2xl p-5 border border-slate-200/70 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Degree Progress
                </span>
              </div>
              <span className="text-xs font-bold text-slate-900">
                {summary.creditCompletionPercentage}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-slate-900 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(100, summary.creditCompletionPercentage)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500 font-medium">
                <span>Earned: {summary.totalCreditsEarned} Cr</span>
                <span>Total: {summary.programTotalCredits} Cr</span>
              </div>
            </div>

            {/* Required GPA advisory note */}
            {summary.requiredGpaForRemaining && (
              <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                  <Target className="w-3.5 h-3.5 text-slate-600" />
                  <span>Remaining Credits Goal ({summary.requiredGpaForRemaining.remainingCredits} Cr)</span>
                </div>
                <p className="text-xs text-slate-600 leading-normal">
                  {summary.requiredGpaForRemaining.statusText}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Semester GPA Quick Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-600" />
            <span>Semesters Overview</span>
          </h2>
          <button
            onClick={() => onNavigateTab('semesters')}
            type="button"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
          >
            <span>Manage Courses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {summary.semesterCalculations.slice(0, 8).map((semCalc, sIdx) => {
            const hasGrades = semCalc.courseResults.some(c => c.scorePercent > 0 || c.gradePoint > 0);
            return (
              <div
                key={semCalc.semesterId}
                onClick={() => onNavigateTab('semesters')}
                className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer hover:border-slate-300 hover:shadow-sm ${
                  hasGrades ? 'border-slate-200 shadow-[0_1px_4px_rgba(0,0,0,0.02)]' : 'border-slate-200/60 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-500">
                    L-{semCalc.level} S-{semCalc.semester === 1 ? 'I' : 'II'}
                  </span>
                  {hasGrades ? (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-900 text-white">
                      {semCalc.gpa.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                      Pending
                    </span>
                  )}
                </div>
                <div className="text-xs font-semibold text-slate-800 truncate">
                  {semCalc.totalCredits} Credits
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {semCalc.courseResults.length} courses
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CGPA & Semester GPA Trend */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_1px_6px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-600" />
              <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
                Performance Progression Trend
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-slate-900 rounded-full" />
                <span className="text-slate-600">CGPA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-slate-400 rounded-full" />
                <span className="text-slate-600">Semester GPA</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="label"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis
                    domain={[2.0, 4.0]}
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    ticks={[2.0, 2.5, 3.0, 3.5, 4.0]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      fontSize: '12px',
                    }}
                  />
                  <ReferenceLine
                    y={profile.targetCgpa}
                    stroke="#10b981"
                    strokeDasharray="4 4"
                    label={{ value: `Target ${profile.targetCgpa}`, fill: '#059669', fontSize: 10, position: 'right' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulativeCgpa"
                    name="CGPA"
                    stroke="#0f172a"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#0f172a' }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="semesterGpa"
                    name="Semester GPA"
                    stroke="#94a3b8"
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                    dot={{ r: 3, fill: '#94a3b8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Enter course grades in Semesters to generate progress chart.
              </div>
            )}
          </div>
        </div>

        {/* Grade Distribution Donut */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_1px_6px_rgba(0,0,0,0.02)] space-y-4">
          <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
            Grade Distribution
          </h3>

          <div className="h-44 w-full flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val, name, item) => [`${val} courses (${item.payload.credits} Cr)`, name]}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400">No grades recorded yet</p>
            )}
          </div>

          {/* Legend chips */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
            {pieData.slice(0, 6).map(g => (
              <div key={g.name} className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                <span className="font-semibold text-slate-800">{g.name}:</span>
                <span className="text-slate-500 font-medium">{g.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Action Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigateTab('simulator')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 mb-3 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-slate-800" />
          </div>
          <h4 className="font-semibold text-slate-900 text-sm mb-1">What-If Simulator</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Simulate expected marks in ongoing semesters to see instant CGPA impacts.
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('settings')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 mb-3 group-hover:scale-105 transition-transform">
            <Sliders className="w-5 h-5 text-slate-800" />
          </div>
          <h4 className="font-semibold text-slate-900 text-sm mb-1">Assessment Weights</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Configure Theory & Sessional percentage weights (Quiz, Mid, Lab, Viva, Final).
          </p>
        </div>

        <div
          onClick={onOpenTranscript}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 mb-3 group-hover:scale-105 transition-transform">
            <Award className="w-5 h-5 text-slate-800" />
          </div>
          <h4 className="font-semibold text-slate-900 text-sm mb-1">Academic Transcript</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Preview, print, or export an official academic grade sheet summary.
          </p>
        </div>
      </section>
    </div>
  );
}
