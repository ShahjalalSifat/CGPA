'use client';

import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { useCgpa } from '@/context/CgpaContext';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  Check,
  AlertTriangle,
  X,
  FileText,
} from 'lucide-react';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ParsedCourseRow {
  level: number;
  semester: number;
  course_code: string;
  course_title: string;
  credit: number;
  course_type?: string;
  isValid: boolean;
  error?: string;
}

export default function CsvImportModal({ isOpen, onClose }: CsvImportModalProps) {
  const { importCoursesFromCsv } = useCgpa();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedCourseRow[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Download Sample CSV Template
  const handleDownloadTemplate = () => {
    const csvContent =
      'level,semester,course_code,course_title,credit,course_type\n' +
      '1,1,CIE 101,Engineering Mechanics,3.0,theory\n' +
      '1,1,CIE 102,Civil Engineering Drawing-I,1.5,sessional\n' +
      '1,1,MAT 105,Mathematics-I,3.0,theory\n' +
      '1,2,CIE 103,Surveying,4.0,theory\n' +
      '1,2,CIE 104,Practical Surveying,1.5,sessional\n' +
      '2,1,CIE 201,Mechanics of Solids-I,3.0,theory\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'cgpa_curriculum_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle CSV file selection and parsing via PapaParse
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setParseError(null);
    setIsProcessing(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: header => header.trim().toLowerCase().replace(/[\s-]+/g, '_'),
      complete: results => {
        setIsProcessing(false);
        if (results.errors.length > 0 && results.data.length === 0) {
          setParseError(`CSV Parsing failed: ${results.errors[0].message}`);
          return;
        }

        const rows: ParsedCourseRow[] = [];
        (results.data as Record<string, any>[]).forEach((r, idx) => {
          const level = parseInt(r.level || r.year || '1', 10);
          const semester = parseInt(r.semester || r.term || '1', 10);
          const course_code = (r.course_code || r.code || '').toString().trim().toUpperCase();
          const course_title = (r.course_title || r.title || '').toString().trim();
          const credit = parseFloat(r.credit || r.credits || '3.0');
          const course_type = (r.course_type || r.type || 'theory').toString().trim().toLowerCase();

          let isValid = true;
          let error = '';

          if (isNaN(level) || level < 1 || level > 6) {
            isValid = false;
            error = 'Invalid level (1-6)';
          } else if (isNaN(semester) || (semester !== 1 && semester !== 2)) {
            isValid = false;
            error = 'Semester must be 1 or 2';
          } else if (!course_code) {
            isValid = false;
            error = 'Missing course code';
          } else if (isNaN(credit) || credit <= 0 || credit > 15) {
            isValid = false;
            error = 'Invalid credit hours';
          }

          rows.push({
            level,
            semester,
            course_code,
            course_title: course_title || course_code,
            credit: isNaN(credit) ? 3.0 : credit,
            course_type,
            isValid,
            error,
          });
        });

        setParsedRows(rows);
      },
      error: err => {
        setIsProcessing(false);
        setParseError(`Error parsing CSV: ${err.message}`);
      },
    });
  };

  const validRowCount = parsedRows.filter(r => r.isValid).length;

  const handleConfirmImport = () => {
    const validRows = parsedRows.filter(r => r.isValid);
    if (validRows.length === 0) return;

    importCoursesFromCsv(validRows);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-slate-800" />
              <span>Bulk Course CSV Import</span>
            </h3>
            <p className="text-xs text-slate-500">
              Upload a spreadsheet to populate levels, semesters, and course credits.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template Download Bar */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-slate-600" />
            <span className="text-xs text-slate-700">
              Need standard CSV column structure?
            </span>
          </div>
          <button
            onClick={handleDownloadTemplate}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV Template</span>
          </button>
        </div>

        {/* Drop / Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-slate-50"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-800">
            {fileName ? fileName : 'Click to browse CSV file or drag and drop'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Columns: level, semester, course_code, course_title, credit, course_type
          </p>
        </div>

        {parseError && (
          <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{parseError}</span>
          </div>
        )}

        {/* Parsed Preview Table */}
        {parsedRows.length > 0 && (
          <div className="flex-1 overflow-hidden flex flex-col space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Preview Parsed Courses ({validRowCount} Valid of {parsedRows.length})</span>
            </div>

            <div className="flex-1 overflow-y-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-800 font-semibold sticky top-0 border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Level / Sem</th>
                    <th className="py-2 px-3">Code</th>
                    <th className="py-2 px-3">Title</th>
                    <th className="py-2 px-3 text-right">Credit</th>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parsedRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className={row.isValid ? 'hover:bg-slate-50/50' : 'bg-rose-50/50'}
                    >
                      <td className="py-2 px-3 font-semibold text-slate-800">
                        L{row.level} S{row.semester}
                      </td>
                      <td className="py-2 px-3 font-bold text-slate-900">
                        {row.course_code}
                      </td>
                      <td className="py-2 px-3 truncate max-w-xs">{row.course_title}</td>
                      <td className="py-2 px-3 text-right font-mono">{row.credit}</td>
                      <td className="py-2 px-3 capitalize">{row.course_type}</td>
                      <td className="py-2 px-3">
                        {row.isValid ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[10px]">
                            <Check className="w-3 h-3" /> Valid
                          </span>
                        ) : (
                          <span className="text-rose-600 font-bold text-[10px]">
                            {row.error}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmImport}
            disabled={validRowCount === 0}
            type="button"
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-sm cursor-pointer"
          >
            Import {validRowCount} Courses
          </button>
        </div>
      </div>
    </div>
  );
}
