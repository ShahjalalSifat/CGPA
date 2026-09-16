'use client';

import React, { useState } from 'react';
import { useCgpa } from '@/context/CgpaContext';
import {
  Share2,
  Copy,
  Check,
  X,
  Award,
  Link,
  GraduationCap,
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const { profile, summary } = useCgpa();
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const generateTextSummary = () => {
    let text = `🎓 Academic Performance Summary\n`;
    text += `Student: ${profile.fullName} (${profile.studentId})\n`;
    text += `Institution: ${profile.universityName} - ${profile.departmentName}\n`;
    text += `Current CGPA: ${summary.cgpa.toFixed(2)} / 4.00 (Target: ${profile.targetCgpa.toFixed(2)})\n`;
    text += `Completed Credits: ${summary.totalCreditsEarned} / ${profile.programTotalCredits} (${summary.creditCompletionPercentage}%)\n\n`;
    text += `Semester Breakdown:\n`;

    summary.semesterCalculations.forEach(s => {
      if (s.courseResults.some(c => c.scorePercent > 0 || c.gradePoint > 0)) {
        text += `• ${s.label}: GPA ${s.gpa.toFixed(2)} (${s.totalCredits} Cr)\n`;
      }
    });

    return text;
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(generateTextSummary());
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-slate-800" />
            <h3 className="font-bold text-slate-900 text-base">Share Academic Summary</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview Card */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900">{profile.fullName}</span>
            <span className="text-[10px] font-semibold bg-slate-900 text-white px-2 py-0.5 rounded-full">
              CGPA {summary.cgpa.toFixed(2)}
            </span>
          </div>
          <p className="text-slate-500 font-medium">
            {profile.departmentName} • {profile.universityName}
          </p>
          <div className="pt-2 border-t border-slate-200 flex justify-between text-slate-700 font-semibold">
            <span>{summary.totalCreditsEarned} Credits Earned</span>
            <span>Target: {profile.targetCgpa.toFixed(2)}</span>
          </div>
        </div>

        {/* Copy Actions */}
        <div className="space-y-2">
          <button
            onClick={handleCopySummary}
            type="button"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            {copiedSummary ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSummary ? 'Copied to Clipboard!' : 'Copy Formatted Report'}</span>
          </button>

          <button
            onClick={handleCopyLink}
            type="button"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Link className="w-4 h-4" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy App Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
