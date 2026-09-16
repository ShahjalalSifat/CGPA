'use client';

import React, { useState, useMemo } from 'react';
import { useCgpa } from '@/context/CgpaContext';
import { calculateOverallCGPA } from '@/lib/calculations';
import { Semester, Course } from '@/types/cgpa';
import {
  Sparkles,
  Target,
  RotateCcw,
  Sliders,
} from 'lucide-react';

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
    semesters[0]?.id || ''
  );

  const [simulatedSemesters, setSimulatedSemesters] = useState<Semester[]>(() => {
    return JSON.parse(JSON.stringify(semesters));
  });

  const [simTargetCgpa, setSimTargetCgpa] = useState<number>(profile.targetCgpa);

  const handleResetSimulation = () => {
    setSimulatedSemesters(JSON.parse(JSON.stringify(semesters)));
  };

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
                const compScores = c.componentScores.map(comp => ({
                  ...comp,
                  obtainedPercent: scorePercent,
                }));
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

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-200 max-w-3xl mx-auto">
      {/* Target Planner Card */}
      <section className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_1px_6px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Target Goal Calculator
          </span>
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
            <span className="text-xs text-slate-500 font-medium">Target:</span>
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
              className="w-12 text-xs font-bold text-slate-900 bg-transparent focus:outline-none"
            />
          </div>
        </div>

        {/* Required Future GPA Metric */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Required Future GPA
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {summary.requiredGpaForRemaining?.requiredGpa !== undefined
                ? summary.requiredGpaForRemaining.requiredGpa.toFixed(2)
                : '—'}{' '}
              <span className="text-xs font-normal text-slate-400">/ 4.00</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold text-slate-700 block">
              {summary.requiredGpaForRemaining?.remainingCredits || 0} Credits Left
            </span>
            <span
              className={`text-[11px] font-bold ${
                summary.requiredGpaForRemaining?.isPossible
                  ? 'text-emerald-700'
                  : 'text-rose-600'
              }`}
            >
              {summary.requiredGpaForRemaining?.isPossible ? 'Achievable' : 'Above 4.00'}
            </span>
          </div>
        </div>
      </section>

      {/* Interactive What-if Sandbox */}
      <section className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_1px_6px_rgba(0,0,0,0.02)] space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-slate-700" />
            <select
              value={selectedSemId}
              onChange={e => setSelectedSemId(e.target.value)}
              className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-900 focus:outline-none"
            >
              {simulatedSemesters.map(sem => (
                <option key={sem.id} value={sem.id}>
                  {sem.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleResetSimulation}
            type="button"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        {/* Projected CGPA Result Pill */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
              Simulated Projected CGPA
            </span>
            <div className="text-3xl font-extrabold mt-0.5">
              {simSummary.cgpa.toFixed(2)}
            </div>
          </div>

          <div className="text-right">
            {cgpaDelta !== 0 && (
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  cgpaDelta > 0
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-rose-500/20 text-rose-300'
                }`}
              >
                {cgpaDelta > 0 ? `+${cgpaDelta.toFixed(2)} Boost` : `${cgpaDelta.toFixed(2)} Drop`}
              </span>
            )}
            <span className="text-xs text-slate-400 block mt-1">
              Semester GPA: {simSummary.semesterCalculations.find(s => s.semesterId === selectedSemId)?.gpa.toFixed(2) || '0.00'}
            </span>
          </div>
        </div>

        {/* Quick Batch Marks */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 font-medium">Quick set:</span>
          <button
            onClick={() => handleSetAllCoursesInSem(85)}
            type="button"
            className="px-2 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800"
          >
            All A+ (85%)
          </button>
          <button
            onClick={() => handleSetAllCoursesInSem(76)}
            type="button"
            className="px-2 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800"
          >
            All A (76%)
          </button>
          <button
            onClick={() => handleSetAllCoursesInSem(71)}
            type="button"
            className="px-2 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800"
          >
            All A- (71%)
          </button>
          <button
            onClick={() => handleSetAllCoursesInSem(66)}
            type="button"
            className="px-2 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800"
          >
            All B+ (66%)
          </button>
        </div>

        {/* Course Score Sliders */}
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
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3"
                >
                  <div className="w-1/3 min-w-0">
                    <span className="text-xs font-bold text-slate-900 truncate block">
                      {c.courseCode}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      {c.credit} Cr
                    </span>
                  </div>

                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={currentScore}
                      onChange={e =>
                        handleUpdateSimulatedCourseScore(c.id, Number(e.target.value))
                      }
                      className="flex-1 accent-slate-900 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-900 w-10 text-right">
                      {currentScore}%
                    </span>
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
