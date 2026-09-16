'use client';

import React from 'react';
import { useCgpa } from '@/context/CgpaContext';
import {
  GraduationCap,
  UploadCloud,
  FileText,
  Share2,
  Sparkles,
  Target,
} from 'lucide-react';

interface NavbarProps {
  onOpenCsvImport: () => void;
  onOpenTranscript: () => void;
  onOpenShare: () => void;
}

export default function Navbar({
  onOpenCsvImport,
  onOpenTranscript,
  onOpenShare,
}: NavbarProps) {
  const { profile, summary } = useCgpa();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & University badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold tracking-tight text-slate-900 text-base sm:text-lg">
                  CGPA Calculator
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  {profile.universityId === 'hstu' ? 'HSTU Preset' : profile.departmentName}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal truncate max-w-[200px] sm:max-w-xs">
                {profile.departmentName} • {profile.programTotalCredits} Credits
              </p>
            </div>
          </div>

          {/* Current CGPA Pill & Target Delta */}
          <div className="hidden md:flex items-center gap-4 bg-slate-50/90 border border-slate-200/80 px-4 py-1.5 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-1.5">
              <span className="text-xs uppercase font-medium text-slate-400 tracking-wider">CGPA</span>
              <span className="font-bold text-slate-900 text-base">
                {summary.cgpa > 0 ? summary.cgpa.toFixed(2) : '0.00'}
              </span>
              <span className="text-xs text-slate-400">/ 4.00</span>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-1.5 text-xs">
              <Target className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500">Target:</span>
              <span className="font-semibold text-slate-800">{profile.targetCgpa.toFixed(2)}</span>
              {summary.cgpa > 0 && (
                <span
                  className={`ml-1 font-semibold px-1.5 py-0.5 rounded ${
                    summary.targetDifference >= 0
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                  }`}
                >
                  {summary.targetDifference >= 0 ? `+${summary.targetDifference.toFixed(2)}` : summary.targetDifference.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCsvImport}
              id="nav-csv-import-btn"
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200/90 rounded-lg hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
              title="Bulk import courses via CSV"
            >
              <UploadCloud className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Import CSV</span>
            </button>

            <button
              onClick={onOpenTranscript}
              id="nav-transcript-btn"
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200/90 rounded-lg hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
              title="Official academic transcript view"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Transcript</span>
            </button>

            <button
              onClick={onOpenShare}
              id="nav-share-btn"
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg transition-colors shadow-sm cursor-pointer"
              title="Share CGPA summary"
            >
              <Share2 className="w-4 h-4 text-slate-700" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
