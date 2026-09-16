'use client';

import React, { useState } from 'react';
import { useCgpa } from '@/context/CgpaContext';
import { Course, CourseType, Semester } from '@/types/cgpa';
import { calculateCourseResult, calculateSemesterGPA } from '@/lib/calculations';
import {
  Plus,
  ChevronRight,
  ChevronDown,
  Trash2,
  Edit3,
  BookOpen,
  FlaskConical,
  RotateCcw,
  Sparkles,
  Award,
  Layers,
  ChevronUp,
} from 'lucide-react';

interface SemestersTabProps {
  onOpenAddCourse: (semesterId: string) => void;
  onOpenEditCourse: (semesterId: string, course: Course) => void;
}

export default function SemestersTab({
  onOpenAddCourse,
  onOpenEditCourse,
}: SemestersTabProps) {
  const {
    semesters,
    theoryComponents,
    sessionalComponents,
    gradingScale,
    deleteCourse,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    updateCourseComponentScore,
    profile,
    summary,
  } = useCgpa();

  const [activeSemIndex, setActiveSemIndex] = useState(0);
  const [expandedQuizCourseId, setExpandedQuizCourseId] = useState<string | null>(null);

  const activeSem = semesters[activeSemIndex] || semesters[0];

  if (!activeSem) {
    return (
      <div className="py-20 text-center text-slate-400">
        <p>No semesters found.</p>
      </div>
    );
  }

  const activeSemCalculation = calculateSemesterGPA(
    activeSem,
    theoryComponents,
    sessionalComponents,
    gradingScale
  );

  const isTheory = (course: Course) => course.courseType === 'theory';

  // Helper to handle direct mark input for a component
  // For Theory: Quiz (10), Mid (20), Attn (10), Final (60)
  // For Sessional: Lab (30), Viva (30), Attn (10), Final (30)
  const handleDirectMarkChange = (
    course: Course,
    componentNameOrType: string,
    rawMark: string,
    maxMarks: number
  ) => {
    const num = parseFloat(rawMark);
    const validMark = isNaN(num) ? 0 : Math.max(0, Math.min(num, maxMarks));
    const percent = maxMarks > 0 ? (validMark / maxMarks) * 100 : 0;

    // Find the matching component in course.componentScores
    const targetComp = course.componentScores.find(
      c => c.componentName.toLowerCase().includes(componentNameOrType.toLowerCase()) ||
           c.componentId.toLowerCase().includes(componentNameOrType.toLowerCase())
    );

    if (targetComp) {
      updateCourseComponentScore(
        activeSem.id,
        course.id,
        targetComp.componentId,
        targetComp.componentName,
        percent
      );
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-200 max-w-3xl mx-auto">
      {/* Top Floating CGPA & GPA Glance Banner (Ultra Minimalist) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_1px_6px_rgba(0,0,0,0.02)] flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Overall CGPA
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {summary.cgpa > 0 ? summary.cgpa.toFixed(2) : '0.00'}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ 4.00</span>
          </div>
        </div>

        <div className="h-8 w-px bg-slate-100" />

        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            {activeSem.label.replace('Semester ', 'S-').replace('Level ', 'L-')} GPA
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {activeSemCalculation.gpa > 0 ? activeSemCalculation.gpa.toFixed(2) : '0.00'}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ 4.00</span>
          </div>
        </div>

        <div className="h-8 w-px bg-slate-100 hidden sm:block" />

        <div className="hidden sm:block text-right">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Credits
          </span>
          <span className="text-sm font-bold text-slate-800 mt-0.5 block">
            {activeSemCalculation.totalCredits.toFixed(1)} Cr
          </span>
        </div>
      </div>

      {/* Horizontal Semester Selector (iOS Style Pill Switcher) */}
      <div className="relative">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth">
          {semesters.map((sem, idx) => {
            const isSelected = idx === activeSemIndex;
            const shortLabel = `L${sem.level} S${sem.semester}`;
            const semCalc = calculateSemesterGPA(
              sem,
              theoryComponents,
              sessionalComponents,
              gradingScale
            );
            const isGraded = semCalc.gpa > 0;

            return (
              <button
                key={sem.id}
                onClick={() => setActiveSemIndex(idx)}
                type="button"
                className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white hover:bg-slate-100/80 text-slate-600 border border-slate-200/80'
                }`}
              >
                <span>{shortLabel}</span>
                <span
                  className={`text-[10px] font-mono ${
                    isSelected ? 'text-slate-300' : isGraded ? 'text-slate-900 font-bold' : 'text-slate-400'
                  }`}
                >
                  {isGraded ? semCalc.gpa.toFixed(2) : '—'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Semester Header & Actions */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {activeSem.label}
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            {activeSem.courses.length} courses • {activeSemCalculation.totalCredits.toFixed(1)} credits
          </span>
        </div>

        <button
          onClick={() => onOpenAddCourse(activeSem.id)}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Course</span>
        </button>
      </div>

      {/* Course Cards List with Direct Mark Inputs */}
      <div className="space-y-3.5">
        {activeSem.courses.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/80 text-slate-400">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-xs">No courses in this semester yet.</p>
          </div>
        ) : (
          activeSem.courses.map(course => {
            const result = calculateCourseResult(
              course,
              theoryComponents,
              sessionalComponents,
              gradingScale
            );

            const isTheoryCourse = course.courseType === 'theory';
            const isQuizExpanded = expandedQuizCourseId === course.id;

            // Extract individual raw marks
            // Theory: Quiz (10%), Mid (20%), Attn (10%), Final (60%)
            const quizScore = course.componentScores.find(c => c.componentName.toLowerCase().includes('quiz'))?.obtainedPercent ?? 0;
            const midScore = course.componentScores.find(c => c.componentName.toLowerCase().includes('mid'))?.obtainedPercent ?? 0;
            const attnScore = course.componentScores.find(c => c.componentName.toLowerCase().includes('attendance'))?.obtainedPercent ?? 0;
            const finalScore = course.componentScores.find(c => c.componentName.toLowerCase().includes('final'))?.obtainedPercent ?? 0;

            // Sessional: Lab (30%), Viva (30%), Attn (10%), Final (30%)
            const labScore = course.componentScores.find(c => c.componentName.toLowerCase().includes('lab') || c.componentName.toLowerCase().includes('report'))?.obtainedPercent ?? 0;
            const vivaScore = course.componentScores.find(c => c.componentName.toLowerCase().includes('viva'))?.obtainedPercent ?? 0;

            // Converted raw mark values:
            const rawQuiz = ((quizScore / 100) * 10).toFixed(1).replace('.0', '');
            const rawMid = ((midScore / 100) * 20).toFixed(1).replace('.0', '');
            const rawAttn = ((attnScore / 100) * 10).toFixed(1).replace('.0', '');
            const rawFinal = ((finalScore / 100) * 60).toFixed(1).replace('.0', '');

            const rawLab = ((labScore / 100) * 30).toFixed(1).replace('.0', '');
            const rawViva = ((vivaScore / 100) * 30).toFixed(1).replace('.0', '');
            const rawSessFinal = ((finalScore / 100) * 30).toFixed(1).replace('.0', '');

            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.02)] space-y-3 transition-shadow hover:shadow-sm"
              >
                {/* Course Header: Code, Title, Credit, Grade Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {course.courseCode}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {course.credit} Cr
                      </span>
                      {course.isRetake && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                          Retake
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs text-slate-600 truncate font-normal">
                      {course.courseTitle}
                    </h3>
                  </div>

                  {/* Result Badge */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <div className="flex items-baseline justify-end gap-1">
                        <span className="text-sm font-extrabold text-slate-900">
                          {result.letterGrade}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          ({result.gradePoint.toFixed(2)})
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {result.scorePercent > 0 ? `${result.scorePercent.toFixed(1)}/100` : '0/100'}
                      </span>
                    </div>

                    {/* Edit & Delete actions */}
                    <div className="flex items-center gap-1 border-l border-slate-100 pl-2">
                      <button
                        onClick={() => onOpenEditCourse(activeSem.id, course)}
                        type="button"
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                        title="Edit course"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${course.courseCode}?`)) {
                            deleteCourse(activeSem.id, course.id);
                          }
                        }}
                        type="button"
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                        title="Delete course"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Direct Mark Inputs (Quiz, Mid, Attn, Final) */}
                {isTheoryCourse ? (
                  <div className="pt-2 border-t border-slate-100/80">
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {/* 1. Quiz Input */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight block">
                          Quiz (10)
                        </span>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="10"
                          placeholder="0"
                          value={rawQuiz === '0' ? '' : rawQuiz}
                          onChange={e =>
                            handleDirectMarkChange(course, 'quiz', e.target.value, 10)
                          }
                          className="w-full text-center text-xs font-bold py-1.5 px-1 rounded-xl bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-slate-900 focus:outline-none text-slate-900 transition-colors"
                        />
                      </div>

                      {/* 2. Mid Term Input */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight block">
                          Mid (20)
                        </span>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="20"
                          placeholder="0"
                          value={rawMid === '0' ? '' : rawMid}
                          onChange={e =>
                            handleDirectMarkChange(course, 'mid', e.target.value, 20)
                          }
                          className="w-full text-center text-xs font-bold py-1.5 px-1 rounded-xl bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-slate-900 focus:outline-none text-slate-900 transition-colors"
                        />
                      </div>

                      {/* 3. Attendance Input */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight block">
                          Attn (10)
                        </span>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="10"
                          placeholder="0"
                          value={rawAttn === '0' ? '' : rawAttn}
                          onChange={e =>
                            handleDirectMarkChange(course, 'attendance', e.target.value, 10)
                          }
                          className="w-full text-center text-xs font-bold py-1.5 px-1 rounded-xl bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-slate-900 focus:outline-none text-slate-900 transition-colors"
                        />
                      </div>

                      {/* 4. Final Exam Input */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight block">
                          Final (60)
                        </span>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="60"
                          placeholder="0"
                          value={rawFinal === '0' ? '' : rawFinal}
                          onChange={e =>
                            handleDirectMarkChange(course, 'final', e.target.value, 60)
                          }
                          className="w-full text-center text-xs font-bold py-1.5 px-1 rounded-xl bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-slate-900 focus:outline-none text-slate-900 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Expand Individual Quizzes Option */}
                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                      <button
                        onClick={() =>
                          setExpandedQuizCourseId(isQuizExpanded ? null : course.id)
                        }
                        type="button"
                        className="inline-flex items-center gap-1 hover:text-slate-700 transition-colors cursor-pointer"
                      >
                        <span>
                          {isQuizExpanded ? 'Hide Quizzes breakdown' : `Quizzes breakdown (${course.quizzes.length} slots)`}
                        </span>
                        {isQuizExpanded ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>

                      {course.quizzes.length > 0 && (
                        <span className="font-mono text-[10px]">
                          1 Cr = 1 Quiz auto-rule
                        </span>
                      )}
                    </div>

                    {/* Quizzes Sub-drawer */}
                    {isQuizExpanded && (
                      <div className="mt-3 p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">
                            Individual Quiz Scores
                          </span>
                          <button
                            onClick={() => addQuiz(activeSem.id, course.id, 20)}
                            type="button"
                            className="text-[11px] font-semibold text-slate-900 hover:underline"
                          >
                            + Add Extra Quiz
                          </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {course.quizzes.map((quiz, qIdx) => (
                            <div
                              key={quiz.id}
                              className="bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-between gap-1.5"
                            >
                              <span className="text-[11px] font-semibold text-slate-700">
                                Q{quiz.quizNumber || qIdx + 1}:
                              </span>
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  step="0.5"
                                  min="0"
                                  max={quiz.marksTotal}
                                  value={quiz.marksObtained}
                                  onChange={e =>
                                    updateQuiz(
                                      activeSem.id,
                                      course.id,
                                      quiz.id,
                                      {
                                        marksObtained: parseFloat(e.target.value) || 0,
                                      }
                                    )
                                  }
                                  className="w-10 text-right text-xs font-bold text-slate-900 border-b border-slate-300 focus:outline-none"
                                />
                                <span className="text-[10px] text-slate-400">
                                  /{quiz.marksTotal}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Sessional Course Direct Mark Inputs */
                  <div className="pt-2 border-t border-slate-100/80">
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight block">
                          Lab (30)
                        </span>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="30"
                          placeholder="0"
                          value={rawLab === '0' ? '' : rawLab}
                          onChange={e =>
                            handleDirectMarkChange(course, 'lab', e.target.value, 30)
                          }
                          className="w-full text-center text-xs font-bold py-1.5 px-1 rounded-xl bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-slate-900 focus:outline-none text-slate-900 transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight block">
                          Viva (30)
                        </span>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="30"
                          placeholder="0"
                          value={rawViva === '0' ? '' : rawViva}
                          onChange={e =>
                            handleDirectMarkChange(course, 'viva', e.target.value, 30)
                          }
                          className="w-full text-center text-xs font-bold py-1.5 px-1 rounded-xl bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-slate-900 focus:outline-none text-slate-900 transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight block">
                          Attn (10)
                        </span>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="10"
                          placeholder="0"
                          value={rawAttn === '0' ? '' : rawAttn}
                          onChange={e =>
                            handleDirectMarkChange(course, 'attendance', e.target.value, 10)
                          }
                          className="w-full text-center text-xs font-bold py-1.5 px-1 rounded-xl bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-slate-900 focus:outline-none text-slate-900 transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight block">
                          Exam (30)
                        </span>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="30"
                          placeholder="0"
                          value={rawSessFinal === '0' ? '' : rawSessFinal}
                          onChange={e =>
                            handleDirectMarkChange(course, 'final', e.target.value, 30)
                          }
                          className="w-full text-center text-xs font-bold py-1.5 px-1 rounded-xl bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-slate-900 focus:outline-none text-slate-900 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
