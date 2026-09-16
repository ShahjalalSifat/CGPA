'use client';

import React, { useState, useMemo } from 'react';
import { useCgpa } from '@/context/CgpaContext';
import { calculateOverallCGPA } from '@/lib/calculations';
import { Semester, Course } from '@/types/cgpa';
import {
  Sparkles,
  Target,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sliders,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SimulatorTab() {
  const {
    profile,
    semesters,
    theoryComponents,
    sessionalComponents,
    gradingScale,
    summary,
    setTargetCgpa,
  } = useCgpa();

  const [selectedSemId, setSelectedSemId] = useState<string>(
    semesters.find(s => s.courses.some(c => c.componentScores.some(comp => comp.obtainedPercent === 0)))?.id ||
    semesters[2]?.id ||
    semesters[0]?.id ||
    ''
  );

  // Deep clone semesters for sandbox simulation
  const [simulatedSemesters, setSimulatedSemesters] = useState<Semester[]>(() => {
    return JSON.parse(JSON.stringify(semesters));
  });

  const [simTargetCgpa, setSimTargetCgpa] = useState<number>(profile.targetCgpa);

  // Sync when real semesters change
  const handleResetSimulation = () => {
    setSimulatedSemesters(JSON.parse(JSON.stringify(semesters)));
  };

  // Calculate simulated overall summary
  const simSummary = useMemo(() => {
    return calculateOverallCGPA(
      simulatedSemesters,
      theoryComponents,
      sessionalComponents,
      gradingScale,
      simTargetCgpa,
      profile.programTotalCredits
    );
  }, [simulatedSemesters, theoryComponents, sessionalComponents, gradingScale, simTargetCgpa, profile.programTotalCredits]);

  const activeSem = simulatedSemesters.find(s => s.id === selectedSemId);

  const handleUpdateSimulatedCourseScore = (courseId: string, scorePercent: number) => {
    setSimulatedSemesters(prev =>
      prev.map(sem => {
        if (sem.id === selectedSemId) {
          return {
            ...sem,
            courses: sem.courses.map(c => {
              if (c.id === courseId) {
                // Update component scores proportionally
                const compScores = c.componentScores.map(comp => ({
                  ...comp,
                  obtainedPercent: scorePercent,
                }));
                // Also update quizzes
                const updatedQuizzes = c.quizzes.map(q => ({
                  ...q,
                  marksObtained: (scorePercent / 100) * q.marksTotal,
                }));
                return {
                  ...c,
                  componentScores: compScores,
                  quizzes: updatedQuizzes,
                };
              }
              return c;
            }),
          };
        }
        return sem;
      })
    );
  };

  const handleSetAllCoursesInSem = (scorePercent: number) => {
    if (!selectedSemId) return;
    setSimulatedSemesters(prev =>
      prev.map(sem => {
        if (sem.id === selectedSemId) {
          return {
            ...sem,
            courses: sem.courses.map(c => ({
              ...c,
              componentScores: c.componentScores.map(comp => ({
                ...comp,
                obtainedPercent: scorePercent,
              })),
              quizzes: c.quizzes.map(q => ({
                ...q,
                marksObtained: (scorePercent / 100) * q.marksTotal,
              })),
            })),
          };
        }
        return sem;
      })
    );
  };

  const cgpaDelta = Number((simSummary.cgpa - summary.cgpa).toFixed(2));

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-slate-800" />
            <span>Target & What-If Simulator</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Test scenarios for upcoming courses and calculate required GPA to hit target.
          </p>
        </div>

        <button
          onClick={handleResetSimulation}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Simulation</span>
        </button>
      </div>

      {/* Target GPA Planner Section */}
      <section className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-slate-800" />
            <h3 className="font-bold text-slate-900 text-base">
              Target CGPA Feasibility Planner
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-600">Desired Target:</span>
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <input
                type="number"
                step="0.05"
                min="2.00"
                max="4.00"
                value={simTargetCgpa}
                onChange={e => {
                  const val = parseFloat(e.target.value) || 3.0;
                  setSimTargetCgpa(val);
                  setTargetCgpa(val);
                }}
                className="w-14 text-sm font-bold text-slate-900 bg-transparent focus:outline-none"
              />
              <span className="text-xs font-medium text-slate-400">/ 4.00</span>
            </div>
          </div>
        </div>

        {/* Feasibility metrics cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Completed Credits
            </span>
            <div className="text-2xl font-extrabold text-slate-900">
              {summary.totalCreditsAttempted}{' '}
              <span className="text-xs font-normal text-slate-500">/ {profile.programTotalCredits} Cr</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Current CGPA: <strong>{summary.cgpa.toFixed(2)}</strong>
            </span>
          </div>

          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Remaining Credits
            </span>
            <div className="text-2xl font-extrabold text-slate-900">
              {summary.requiredGpaForRemaining?.remainingCredits || 0}{' '}
              <span className="text-xs font-normal text-slate-500">Credits</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {(profile.programTotalCredits - summary.totalCreditsAttempted > 0)
                ? `${Math.round((profile.programTotalCredits - summary.totalCreditsAttempted) / 20)} Semesters remaining`
                : 'All semesters graded'}
            </span>
          </div>

          <div
            className={`p-4 rounded-2xl border space-y-1 ${
              summary.requiredGpaForRemaining?.isPossible
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}
          >
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${
              summary.requiredGpaForRemaining?.isPossible ? 'text-slate-400' : 'text-rose-600'
            }`}>
              Required Future GPA
            </span>
            <div className="text-2xl font-extrabold">
              {summary.requiredGpaForRemaining?.requiredGpa !== undefined
                ? summary.requiredGpaForRemaining.requiredGpa.toFixed(2)
                : '—'}
              <span className={`text-xs font-normal ml-1 ${summary.requiredGpaForRemaining?.isPossible ? 'text-slate-400' : 'text-rose-600'}`}>/ 4.00</span>
            </div>
            <span className={`text-xs font-medium ${summary.requiredGpaForRemaining?.isPossible ? 'text-slate-300' : 'text-rose-700'}`}>
              {summary.requiredGpaForRemaining?.isPossible ? 'Mathematically Achievable' : 'Above maximum 4.00'}
            </span>
          </div>
        </div>

        {/* Advisory banner */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
          <Info className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 leading-relaxed space-y-1">
            <span className="font-bold block text-slate-900">Advisory:</span>
            <p>{summary.requiredGpaForRemaining?.statusText}</p>
          </div>
        </div>
      </section>

      {/* What-If Semester Sandbox */}
      <section className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sliders className="w-4 h-4 text-slate-700" />
              <span>Interactive Semester Simulator</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select a semester and adjust course scores to project your new CGPA.
            </p>
          </div>

          {/* Semester Picker */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">Simulate:</label>
            <select
              value={selectedSemId}
              onChange={e => setSelectedSemId(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-slate-900"
            >
              {simulatedSemesters.map(sem => (
                <option key={sem.id} value={sem.id}>
                  {sem.label} ({sem.courses.length} courses)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Side-by-side CGPA Outcome Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current CGPA */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Current Baseline CGPA
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-800">
                {summary.cgpa.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400">/ 4.00</span>
            </div>
            <p className="text-xs text-slate-500">
              Across {summary.totalCreditsAttempted} graded credit hours
            </p>
          </div>

          {/* Simulated Projected CGPA */}
          <div className="p-4 rounded-2xl bg-white border border-slate-900 shadow-sm space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                Simulated Projected CGPA
              </span>
              {cgpaDelta !== 0 && (
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    cgpaDelta > 0
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {cgpaDelta > 0 ? `+${cgpaDelta.toFixed(2)} Boost` : `${cgpaDelta.toFixed(2)} Drop`}
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {simSummary.cgpa.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400">/ 4.00</span>
            </div>
            <p className="text-xs text-slate-600">
              Simulated Semester GPA: <strong>{simSummary.semesterCalculations.find(s => s.semesterId === selectedSemId)?.gpa.toFixed(2) || '0.00'}</strong>
            </p>
          </div>
        </div>

        {/* Quick Batch Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-600">Quick Batch Set:</span>
          <button
            onClick={() => {
              handleSetAllCoursesInSem(85);
              triggerCelebration();
            }}
            type="button"
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-800 transition-colors"
          >
            All A+ (85%)
          </button>
          <button
            onClick={() => handleSetAllCoursesInSem(76)}
            type="button"
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-800 transition-colors"
          >
            All A (76%)
          </button>
          <button
            onClick={() => handleSetAllCoursesInSem(71)}
            type="button"
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-800 transition-colors"
          >
            All A- (71%)
          </button>
          <button
            onClick={() => handleSetAllCoursesInSem(66)}
            type="button"
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-800 transition-colors"
          >
            All B+ (66%)
          </button>
        </div>

        {/* Course Sliders in selected semester */}
        {activeSem && (
          <div className="space-y-3 pt-2">
            {activeSem.courses.map(c => {
              const currentScore =
                c.componentScores.length > 0
                  ? Math.round(
                      c.componentScores.reduce((acc, comp) => acc + comp.obtainedPercent, 0) /
                        c.componentScores.length
                    )
                  : 0;

              return (
                <div
                  key={c.id}
                  className="p-3.5 bg-slate-50/60 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="sm:w-1/3">
                    <span className="text-xs font-bold text-slate-900 block">
                      {c.courseCode}
                    </span>
                    <span className="text-xs text-slate-600 truncate block">
                      {c.courseTitle} ({c.credit} Cr)
                    </span>
                  </div>

                  <div className="flex-1 flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={currentScore}
                      onChange={e =>
                        handleUpdateSimulatedCourseScore(c.id, Number(e.target.value))
                      }
                      className="flex-1 accent-slate-900 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                    />
                    <div className="w-16 text-right">
                      <span className="text-xs font-bold text-slate-900">
                        {currentScore}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
