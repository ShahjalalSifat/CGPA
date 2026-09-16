'use client';

import React from 'react';
import { useCgpa } from '@/context/CgpaContext';
import {
  BarChart3,
  Award,
  TrendingUp,
  FileText,
  Printer,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';

interface AnalyticsTabProps {
  onOpenTranscript: () => void;
}

export default function AnalyticsTab({ onOpenTranscript }: AnalyticsTabProps) {
  const { profile, summary, semesters } = useCgpa();

  const chartData = summary.semesterCalculations
    .filter(s => s.totalCredits > 0)
    .map((s, idx, arr) => {
      const subSemesters = arr.slice(0, idx + 1);
      const totalPoints = subSemesters.reduce((acc, curr) => acc + curr.totalGradePoints, 0);
      const totalCreds = subSemesters.reduce((acc, curr) => acc + curr.totalCredits, 0);
      const progressiveCgpa = totalCreds > 0 ? Number((totalPoints / totalCreds).toFixed(2)) : s.gpa;

      return {
        label: `L${s.level} S${s.semester === 1 ? '1' : '2'}`,
        fullLabel: s.label,
        gpa: s.gpa,
        cgpa: progressiveCgpa,
        credits: s.totalCredits,
      };
    });

  // Calculate highest & lowest GPA
  const gradedSemesters = summary.semesterCalculations.filter(s => s.gpa > 0);
  const highestGpa = gradedSemesters.length > 0 ? Math.max(...gradedSemesters.map(s => s.gpa)) : 0;
  const lowestGpa = gradedSemesters.length > 0 ? Math.min(...gradedSemesters.map(s => s.gpa)) : 0;

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-slate-800" />
            <span>Academic Performance Analytics</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistical breakdown of credit hours, semester trends, and academic progress.
          </p>
        </div>

        <button
          onClick={onOpenTranscript}
          type="button"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <FileText className="w-4 h-4" />
          <span>View Full Transcript</span>
        </button>
      </div>

      {/* Top Statistical Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Overall CGPA
          </span>
          <div className="text-2xl font-extrabold text-slate-900">
            {summary.cgpa > 0 ? summary.cgpa.toFixed(2) : '0.00'}
          </div>
          <span className="text-xs text-slate-500">Target: {profile.targetCgpa.toFixed(2)}</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Completed Credits
          </span>
          <div className="text-2xl font-extrabold text-slate-900">
            {summary.totalCreditsEarned}
          </div>
          <span className="text-xs text-slate-500">of {profile.programTotalCredits} Total</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Highest Semester GPA
          </span>
          <div className="text-2xl font-extrabold text-slate-900">
            {highestGpa > 0 ? highestGpa.toFixed(2) : '—'}
          </div>
          <span className="text-xs text-emerald-600 font-medium">Peak performance</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Degree Completion
          </span>
          <div className="text-2xl font-extrabold text-slate-900">
            {summary.creditCompletionPercentage}%
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {summary.requiredGpaForRemaining?.remainingCredits || 0} Credits Left
          </span>
        </div>
      </div>

      {/* Bar Chart: Semester-by-Semester GPA */}
      <section className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            Semester GPA vs Target Comparison
          </h3>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-slate-900 rounded" />
              <span className="text-slate-600">Semester GPA</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-500" />
              <span className="text-slate-600">Target Line ({profile.targetCgpa})</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="label"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                  domain={[0, 4.0]}
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  ticks={[1.0, 2.0, 3.0, 3.5, 4.0]}
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
                  stroke="#10b981"
                  strokeDasharray="4 4"
                />
                <Bar dataKey="gpa" radius={[6, 6, 0, 0]} maxBarSize={48}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.gpa >= profile.targetCgpa ? '#0f172a' : '#64748b'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No semesters recorded yet.
            </div>
          )}
        </div>
      </section>

      {/* Detailed Semester Table */}
      <section className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            Semester-by-Semester Progression Ledger
          </h3>
          <span className="text-xs text-slate-500">
            {profile.universityName}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-800 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Semester</th>
                <th className="py-3 px-4 text-center">Courses</th>
                <th className="py-3 px-4 text-right">Attempted Credits</th>
                <th className="py-3 px-4 text-right">Earned Credits</th>
                <th className="py-3 px-4 text-right">Total Points</th>
                <th className="py-3 px-4 text-right">Semester GPA</th>
                <th className="py-3 px-4 text-right">Cumulative CGPA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {summary.semesterCalculations.map((sem, idx, arr) => {
                const subSemesters = arr.slice(0, idx + 1);
                const totalPoints = subSemesters.reduce((acc, curr) => acc + curr.totalGradePoints, 0);
                const totalCreds = subSemesters.reduce((acc, curr) => acc + curr.totalCredits, 0);
                const progressiveCgpa = totalCreds > 0 ? (totalPoints / totalCreds).toFixed(2) : sem.gpa.toFixed(2);
                const isGraded = sem.courseResults.some(c => c.scorePercent > 0 || c.gradePoint > 0);

                return (
                  <tr key={sem.semesterId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {sem.label}
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-500">
                      {sem.courseResults.length}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-700">
                      {sem.totalCredits.toFixed(1)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-700">
                      {sem.earnedCredits.toFixed(1)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-700">
                      {sem.totalGradePoints.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {isGraded ? (
                        <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {sem.gpa.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {isGraded ? (
                        <span className="font-extrabold text-slate-900">
                          {progressiveCgpa}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-50/80 font-bold text-slate-900 border-t border-slate-200">
              <tr>
                <td className="py-3.5 px-4">Program Totals</td>
                <td className="py-3.5 px-4 text-center">
                  {summary.semesterCalculations.reduce((acc, s) => acc + s.courseResults.length, 0)}
                </td>
                <td className="py-3.5 px-4 text-right">{summary.totalCreditsAttempted.toFixed(1)}</td>
                <td className="py-3.5 px-4 text-right">{summary.totalCreditsEarned.toFixed(1)}</td>
                <td className="py-3.5 px-4 text-right font-mono">
                  {summary.semesterCalculations.reduce((acc, s) => acc + s.totalGradePoints, 0).toFixed(2)}
                </td>
                <td className="py-3.5 px-4 text-right text-slate-400">—</td>
                <td className="py-3.5 px-4 text-right text-sm font-extrabold text-slate-900">
                  {summary.cgpa.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
}
