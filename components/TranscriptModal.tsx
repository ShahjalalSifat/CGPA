'use client';

import React from 'react';
import { useCgpa } from '@/context/CgpaContext';
import {
  FileText,
  Printer,
  X,
  Award,
  GraduationCap,
  Download,
} from 'lucide-react';

interface TranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TranscriptModal({ isOpen, onClose }: TranscriptModalProps) {
  const { profile, summary, gradingScale } = useCgpa();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Controls Topbar (Hidden on Print) */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50 no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-800" />
            <span className="font-bold text-slate-900 text-sm">
              Official Academic Transcript Summary
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Transcript Document Container */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-12 space-y-8 bg-white text-slate-900 font-sans print:p-0 print:overflow-visible">
          {/* Institution Header */}
          <div className="text-center space-y-1.5 border-b-2 border-slate-900 pb-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-2">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide text-slate-900">
              {profile.universityName}
            </h1>
            <p className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
              Department of {profile.departmentName}
            </p>
            <p className="text-xs text-slate-500">
              OFFICIAL ACADEMIC RECORD & GRADE TRANSCRIPT
            </p>
          </div>

          {/* Student Info & Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 font-medium block uppercase text-[10px]">Student Name</span>
              <span className="font-bold text-slate-900 text-sm">{profile.fullName}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block uppercase text-[10px]">Student ID / Roll</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{profile.studentId}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block uppercase text-[10px]">Total Credits Earned</span>
              <span className="font-bold text-slate-900 text-sm">
                {summary.totalCreditsEarned} / {profile.programTotalCredits} Cr
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block uppercase text-[10px]">Cumulative CGPA</span>
              <span className="font-extrabold text-slate-900 text-base">
                {summary.cgpa > 0 ? summary.cgpa.toFixed(2) : '0.00'} / 4.00
              </span>
            </div>
          </div>

          {/* Semester-by-Semester Course Records */}
          <div className="space-y-6">
            {summary.semesterCalculations.map((semCalc) => {
              const isGraded = semCalc.courseResults.some(c => c.scorePercent > 0 || c.gradePoint > 0);

              return (
                <div key={semCalc.semesterId} className="space-y-2 break-inside-avoid">
                  <div className="flex items-center justify-between border-b border-slate-300 pb-1.5">
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 uppercase tracking-wide">
                      {semCalc.label}
                    </h3>
                    <div className="flex items-center gap-3 text-xs font-semibold">
                      <span>Credits: {semCalc.totalCredits.toFixed(1)}</span>
                      <span>•</span>
                      <span>
                        GPA:{' '}
                        <strong className="text-slate-900 font-extrabold">
                          {isGraded ? semCalc.gpa.toFixed(2) : 'Pending'}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-medium text-[11px]">
                        <th className="py-1.5 px-2">Course Code</th>
                        <th className="py-1.5 px-2">Course Title</th>
                        <th className="py-1.5 px-2 text-center">Type</th>
                        <th className="py-1.5 px-2 text-right">Credit</th>
                        <th className="py-1.5 px-2 text-right">Score %</th>
                        <th className="py-1.5 px-2 text-center">Grade</th>
                        <th className="py-1.5 px-2 text-right">Point</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {semCalc.courseResults.map((c) => (
                        <tr key={c.courseId} className="text-slate-800">
                          <td className="py-1.5 px-2 font-bold">{c.courseCode}</td>
                          <td className="py-1.5 px-2">{c.courseTitle}</td>
                          <td className="py-1.5 px-2 text-center capitalize text-slate-500 text-[10px]">
                            {c.courseType}
                          </td>
                          <td className="py-1.5 px-2 text-right font-mono">{c.credit.toFixed(1)}</td>
                          <td className="py-1.5 px-2 text-right font-mono">
                            {c.scorePercent > 0 ? `${c.scorePercent.toFixed(1)}%` : '—'}
                          </td>
                          <td className="py-1.5 px-2 text-center font-bold">{c.letterGrade}</td>
                          <td className="py-1.5 px-2 text-right font-mono font-semibold">
                            {c.gradePoint.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>

          {/* Grading Scale Reference Key */}
          <div className="border-t-2 border-slate-300 pt-4 space-y-2 break-inside-avoid">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Grading Scale Reference ({profile.universityName})
            </span>
            <div className="grid grid-cols-5 gap-2 text-[10px] text-slate-600">
              {gradingScale.map((scale) => (
                <div key={scale.id} className="p-1.5 rounded bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900">{scale.letterGrade}: </span>
                  <span>{scale.gradePoint.toFixed(2)} </span>
                  <span className="text-slate-400">
                    ({scale.maxPercent ? `${scale.minPercent}-${scale.maxPercent}%` : `≥${scale.minPercent}%`})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Signature Block for Print */}
          <div className="pt-12 grid grid-cols-2 gap-8 text-center text-xs text-slate-500 print-only">
            <div className="border-t border-slate-400 pt-2">
              <span className="font-semibold text-slate-800 block">Prepared By</span>
              <span>Department Office of Academic Affairs</span>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <span className="font-semibold text-slate-800 block">Controller of Examinations</span>
              <span>{profile.universityName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
