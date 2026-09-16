'use client';

import React, { useState } from 'react';
import { useCgpa } from '@/context/CgpaContext';
import { Course, CourseType, Semester } from '@/types/cgpa';
import { calculateCourseResult, calculateSemesterGPA } from '@/lib/calculations';
import {
  Plus,
  ChevronDown,
  ChevronUp,
  Trash2,
  Edit3,
  FlaskConical,
  BookOpen,
  HelpCircle,
  PlusCircle,
  X,
  RotateCcw,
  Check,
  Percent,
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
    deleteSemester,
    deleteCourse,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    updateCourseComponentScore,
    addSemester,
    updateCourse,
  } = useCgpa();

  const [expandedSemesterId, setExpandedSemesterId] = useState<string | null>(
    semesters[0]?.id || null
  );
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  const [isAddingSemester, setIsAddingSemester] = useState(false);
  const [newSemLevel, setNewSemLevel] = useState(1);
  const [newSemNumber, setNewSemNumber] = useState(1);

  const toggleSemester = (id: string) => {
    setExpandedSemesterId(prev => (prev === id ? null : id));
  };

  const toggleCourseExpand = (id: string) => {
    setExpandedCourseId(prev => (prev === id ? null : id));
  };

  const handleCreateSemester = (e: React.FormEvent) => {
    e.preventDefault();
    addSemester(newSemLevel, newSemNumber);
    setIsAddingSemester(false);
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Academic Semesters & Courses
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure assessments, quizzes (1 credit = 1 quiz), and exam scores.
          </p>
        </div>

        <button
          onClick={() => setIsAddingSemester(true)}
          type="button"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-slate-700" />
          <span>Add Semester</span>
        </button>
      </div>

      {/* Add Semester Dialog inline */}
      {isAddingSemester && (
        <form
          onSubmit={handleCreateSemester}
          className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Create New Semester</h3>
            <button
              type="button"
              onClick={() => setIsAddingSemester(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Level (Year)
              </label>
              <select
                value={newSemLevel}
                onChange={e => setNewSemLevel(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {[1, 2, 3, 4, 5].map(lvl => (
                  <option key={lvl} value={lvl}>
                    Level {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Semester
              </label>
              <select
                value={newSemNumber}
                onChange={e => setNewSemNumber(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value={1}>Semester I</option>
                <option value={2}>Semester II</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingSemester(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm"
            >
              Create Semester
            </button>
          </div>
        </form>
      )}

      {/* Semesters List */}
      <div className="space-y-4">
        {semesters.map(semester => {
          const isExpanded = expandedSemesterId === semester.id;
          const semCalc = calculateSemesterGPA(
            semester,
            theoryComponents,
            sessionalComponents,
            gradingScale
          );
          const hasScores = semCalc.courseResults.some(
            c => c.scorePercent > 0 || c.gradePoint > 0
          );

          return (
            <div
              key={semester.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.02)] overflow-hidden transition-all"
            >
              {/* Semester Header Accordion trigger */}
              <div
                onClick={() => toggleSemester(semester.id)}
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 transition-colors select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-800 text-xs">
                    L{semester.level}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
                      {semester.label}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {semester.courses.length} Courses • {semCalc.totalCredits} Total Credits
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Semester GPA Badge */}
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      GPA
                    </span>
                    <span
                      className={`text-sm sm:text-base font-bold ${
                        hasScores ? 'text-slate-900' : 'text-slate-400'
                      }`}
                    >
                      {hasScores ? semCalc.gpa.toFixed(2) : '—'}
                    </span>
                  </div>

                  <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Semester Content */}
              {isExpanded && (
                <div className="border-t border-slate-100 p-4 sm:p-6 space-y-4 bg-slate-50/40">
                  {/* Quick actions for semester */}
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Course List & Assessments
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onOpenAddCourse(semester.id);
                        }}
                        type="button"
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Course</span>
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          if (confirm(`Delete ${semester.label} and all its courses?`)) {
                            deleteSemester(semester.id);
                          }
                        }}
                        type="button"
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete semester"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Empty state */}
                  {semester.courses.length === 0 && (
                    <div className="text-center py-8 bg-white rounded-xl border border-dashed border-slate-200">
                      <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs text-slate-500 font-medium">No courses in this semester yet.</p>
                      <button
                        onClick={() => onOpenAddCourse(semester.id)}
                        type="button"
                        className="mt-2 text-xs font-semibold text-slate-900 underline"
                      >
                        Add first course
                      </button>
                    </div>
                  )}

                  {/* Courses */}
                  <div className="space-y-3">
                    {semester.courses.map(course => {
                      const isCourseExpanded = expandedCourseId === course.id;
                      const courseRes = calculateCourseResult(
                        course,
                        theoryComponents,
                        sessionalComponents,
                        gradingScale
                      );
                      const isTheory = course.courseType === 'theory';

                      return (
                        <div
                          key={course.id}
                          className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden"
                        >
                          {/* Course summary row */}
                          <div
                            onClick={() => toggleCourseExpand(course.id)}
                            className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/50 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`p-2 rounded-lg text-xs font-bold ${
                                  isTheory
                                    ? 'bg-slate-100 text-slate-800'
                                    : 'bg-slate-900 text-white'
                                }`}
                              >
                                {isTheory ? (
                                  <BookOpen className="w-4 h-4" />
                                ) : (
                                  <FlaskConical className="w-4 h-4" />
                                )}
                              </div>

                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                                    {course.courseCode}
                                  </span>
                                  <span className="text-xs text-slate-600 font-medium">
                                    {course.courseTitle}
                                  </span>
                                  {course.isRetake && (
                                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                                      Retake
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                                  <span>{course.credit} Credits</span>
                                  <span>•</span>
                                  <span className="capitalize">{course.courseType}</span>
                                  {isTheory && (
                                    <>
                                      <span>•</span>
                                      <span>{course.quizzes.length} Quizzes</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Score & Grade Point Badges */}
                            <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center">
                              <div className="text-right">
                                <span className="text-xs font-bold text-slate-900 block">
                                  {courseRes.scorePercent > 0
                                    ? `${courseRes.scorePercent.toFixed(1)}%`
                                    : '—'}
                                </span>
                                <span className="text-[10px] text-slate-400">Total Score</span>
                              </div>

                              <div
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                                  courseRes.gradePoint >= 3.75
                                    ? 'bg-slate-900 text-white'
                                    : courseRes.gradePoint >= 3.0
                                    ? 'bg-slate-200 text-slate-900'
                                    : courseRes.gradePoint > 0
                                    ? 'bg-amber-100 text-amber-900'
                                    : 'bg-slate-100 text-slate-500'
                                }`}
                              >
                                {courseRes.gradePoint > 0
                                  ? `${courseRes.letterGrade} (${courseRes.gradePoint.toFixed(2)})`
                                  : 'F (0.00)'}
                              </div>

                              <div className="flex items-center gap-1 text-slate-400">
                                <button
                                  onClick={e => {
                                    e.stopPropagation();
                                    onOpenEditCourse(semester.id, course);
                                  }}
                                  type="button"
                                  className="p-1 hover:text-slate-700 rounded"
                                  title="Edit course info"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={e => {
                                    e.stopPropagation();
                                    if (confirm(`Remove ${course.courseCode}?`)) {
                                      deleteCourse(semester.id, course.id);
                                    }
                                  }}
                                  type="button"
                                  className="p-1 hover:text-rose-600 rounded"
                                  title="Delete course"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Expanded Assessment Inputs Drawer */}
                          {isCourseExpanded && (
                            <div className="border-t border-slate-100 p-4 bg-slate-50/70 space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                  Assessment Marks Breakdown
                                </h4>
                                <span className="text-[11px] text-slate-500 font-medium">
                                  Weights apply automatically based on university rules
                                </span>
                              </div>

                              {/* Quizzes Section if Theory Course */}
                              {isTheory && (
                                <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-bold text-slate-900">
                                        Quizzes (Rule: 1 credit = 1 quiz)
                                      </span>
                                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                        Weight: 10%
                                      </span>
                                    </div>

                                    <button
                                      onClick={() => addQuiz(semester.id, course.id, 20)}
                                      type="button"
                                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-slate-700 bg-slate-100 hover:bg-slate-200/80 px-2 py-1 rounded-lg cursor-pointer"
                                    >
                                      <PlusCircle className="w-3.5 h-3.5 text-slate-700" />
                                      <span>Add Extra Quiz (+)</span>
                                    </button>
                                  </div>

                                  {/* Quiz slots list */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                                    {course.quizzes.map((quiz, qIdx) => {
                                      const pct =
                                        quiz.marksTotal > 0
                                          ? ((quiz.marksObtained / quiz.marksTotal) * 100).toFixed(0)
                                          : 0;

                                      return (
                                        <div
                                          key={quiz.id}
                                          className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5"
                                        >
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="font-semibold text-slate-800">
                                              Quiz {quiz.quizNumber} {quiz.isExtra ? '(Extra)' : ''}
                                            </span>
                                            <div className="flex items-center gap-1">
                                              <span className="text-[10px] font-bold text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                                {pct}%
                                              </span>
                                              {quiz.isExtra && (
                                                <button
                                                  onClick={() =>
                                                    deleteQuiz(semester.id, course.id, quiz.id)
                                                  }
                                                  type="button"
                                                  className="text-slate-400 hover:text-rose-600 ml-1"
                                                >
                                                  <X className="w-3 h-3" />
                                                </button>
                                              )}
                                            </div>
                                          </div>

                                          <div className="flex items-center gap-1.5 text-xs">
                                            <div className="flex-1">
                                              <span className="text-[10px] text-slate-400 block mb-0.5">
                                                Obtained
                                              </span>
                                              <input
                                                type="number"
                                                min="0"
                                                max={quiz.marksTotal}
                                                step="0.5"
                                                value={quiz.marksObtained || ''}
                                                onChange={e =>
                                                  updateQuiz(semester.id, course.id, quiz.id, {
                                                    marksObtained: Math.max(
                                                      0,
                                                      parseFloat(e.target.value) || 0
                                                    ),
                                                  })
                                                }
                                                placeholder="0"
                                                className="w-full px-2 py-1 text-xs font-semibold rounded-md border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                                              />
                                            </div>
                                            <span className="text-slate-400 self-end pb-1 font-bold">/</span>
                                            <div className="flex-1">
                                              <span className="text-[10px] text-slate-400 block mb-0.5">
                                                Total
                                              </span>
                                              <input
                                                type="number"
                                                min="1"
                                                max="100"
                                                value={quiz.marksTotal || 20}
                                                onChange={e =>
                                                  updateQuiz(semester.id, course.id, quiz.id, {
                                                    marksTotal: Math.max(
                                                      1,
                                                      parseFloat(e.target.value) || 20
                                                    ),
                                                  })
                                                }
                                                className="w-full px-2 py-1 text-xs font-semibold rounded-md border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Non-quiz components (Mid Term, Attendance, Final / Lab Report, Viva, Final) */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {(isTheory ? theoryComponents : sessionalComponents)
                                  .filter(comp => !comp.isQuizType)
                                  .map(comp => {
                                    const recorded = course.componentScores?.find(
                                      c => c.componentId === comp.id || c.componentName === comp.name
                                    );
                                    const currentScore = recorded ? recorded.obtainedPercent : 0;

                                    return (
                                      <div
                                        key={comp.id}
                                        className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-2"
                                      >
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs font-bold text-slate-900">
                                            {comp.name}
                                          </span>
                                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                            Weight: {comp.weightPercent}%
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                          <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            step="1"
                                            value={currentScore}
                                            onChange={e =>
                                              updateCourseComponentScore(
                                                semester.id,
                                                course.id,
                                                comp.id,
                                                comp.name,
                                                Number(e.target.value)
                                              )
                                            }
                                            className="flex-1 accent-slate-900 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                                          />
                                          <div className="flex items-center border border-slate-200 rounded-lg px-2 py-1 bg-slate-50 w-20">
                                            <input
                                              type="number"
                                              min="0"
                                              max="100"
                                              value={currentScore || ''}
                                              onChange={e =>
                                                updateCourseComponentScore(
                                                  semester.id,
                                                  course.id,
                                                  comp.id,
                                                  comp.name,
                                                  Number(e.target.value)
                                                )
                                              }
                                              placeholder="0"
                                              className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none text-right"
                                            />
                                            <span className="text-[10px] font-bold text-slate-400 ml-0.5">
                                              %
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>

                              {/* Weighted Contribution Summary Bar */}
                              <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-2">
                                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                                  <span>Weighted Contribution to Course Score</span>
                                  <span className="text-slate-900 font-bold">
                                    Total: {courseRes.scorePercent}% → {courseRes.letterGrade} ({courseRes.gradePoint.toFixed(2)})
                                  </span>
                                </div>
                                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                                  {courseRes.componentBreakdown.map((b, bIdx) => {
                                    const colors = ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8'];
                                    return (
                                      <div
                                        key={b.name}
                                        style={{ width: `${b.weightedScore}%`, backgroundColor: colors[bIdx % colors.length] }}
                                        title={`${b.name}: ${b.weightedScore.toFixed(1)}%`}
                                        className="h-full first:rounded-l-full last:rounded-r-full"
                                      />
                                    );
                                  })}
                                </div>
                                <div className="flex flex-wrap gap-3 text-[11px] text-slate-500 pt-1">
                                  {courseRes.componentBreakdown.map(b => (
                                    <span key={b.name}>
                                      <strong className="text-slate-700">{b.name}:</strong> {b.obtainedPct.toFixed(0)}% (adds +{b.weightedScore.toFixed(1)}%)
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
