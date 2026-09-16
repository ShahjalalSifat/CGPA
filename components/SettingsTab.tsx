'use client';

import React, { useState } from 'react';
import { useCgpa } from '@/context/CgpaContext';
import { UNIVERSITY_PRESETS } from '@/data/presets';
import { AssessmentComponent, GradingScaleEntry } from '@/types/cgpa';
import {
  Settings2,
  Sliders,
  GraduationCap,
  Scale,
  Plus,
  Trash2,
  RotateCcw,
  Check,
  AlertCircle,
  Download,
  Upload,
  User,
  ShieldCheck,
  Building,
} from 'lucide-react';

export default function SettingsTab() {
  const {
    profile,
    updateProfile,
    theoryComponents,
    sessionalComponents,
    gradingScale,
    updateTheoryComponents,
    updateSessionalComponents,
    addTheoryComponent,
    addSessionalComponent,
    deleteTheoryComponent,
    deleteSessionalComponent,
    resetDefaultWeights,
    updateGradingScale,
    addGradingScaleEntry,
    deleteGradingScaleEntry,
    resetDefaultGradingScale,
    loadUniversityPreset,
    resetAllData,
    exportDataJson,
    importDataJson,
  } = useCgpa();

  // Local states for adding new component
  const [newTheoryName, setNewTheoryName] = useState('');
  const [newTheoryWeight, setNewTheoryWeight] = useState(10);
  const [newTheoryIsQuiz, setNewTheoryIsQuiz] = useState(false);

  const [newSessionalName, setNewSessionalName] = useState('');
  const [newSessionalWeight, setNewSessionalWeight] = useState(15);

  // Local state for adding new grade scale
  const [newGradeLetter, setNewGradeLetter] = useState('');
  const [newGradePoint, setNewGradePoint] = useState(3.0);
  const [newGradeMin, setNewGradeMin] = useState(60);
  const [newGradeMax, setNewGradeMax] = useState<number | ''>(65);

  // JSON Import state
  const [jsonInput, setJsonInput] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Calculations for weights sum
  const theorySum = theoryComponents.reduce((acc, c) => acc + c.weightPercent, 0);
  const sessionalSum = sessionalComponents.reduce((acc, c) => acc + c.weightPercent, 0);

  const handleTheoryWeightChange = (id: string, weight: number) => {
    const updated = theoryComponents.map(c => (c.id === id ? { ...c, weightPercent: weight } : c));
    updateTheoryComponents(updated);
  };

  const handleSessionalWeightChange = (id: string, weight: number) => {
    const updated = sessionalComponents.map(c => (c.id === id ? { ...c, weightPercent: weight } : c));
    updateSessionalComponents(updated);
  };

  const handleAddTheoryComponent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTheoryName.trim()) return;
    addTheoryComponent(newTheoryName.trim(), Number(newTheoryWeight) || 10, newTheoryIsQuiz);
    setNewTheoryName('');
    setNewTheoryWeight(10);
    setNewTheoryIsQuiz(false);
  };

  const handleAddSessionalComponent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionalName.trim()) return;
    addSessionalComponent(newSessionalName.trim(), Number(newSessionalWeight) || 15);
    setNewSessionalName('');
    setNewSessionalWeight(15);
  };

  const handleAddGradeEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGradeLetter.trim()) return;
    addGradingScaleEntry({
      letterGrade: newGradeLetter.trim().toUpperCase(),
      gradePoint: Number(newGradePoint),
      minPercent: Number(newGradeMin),
      maxPercent: newGradeMax === '' ? null : Number(newGradeMax),
    });
    setNewGradeLetter('');
    setNewGradePoint(3.0);
    setNewGradeMin(60);
    setNewGradeMax('');
  };

  const handleDownloadBackup = () => {
    const json = exportDataJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cgpa-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = () => {
    if (!jsonInput.trim()) return;
    const success = importDataJson(jsonInput);
    if (success) {
      setImportStatus('Backup restored successfully!');
      setJsonInput('');
      setTimeout(() => setImportStatus(null), 3000);
    } else {
      setImportStatus('Error: Invalid JSON structure.');
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-slate-800" />
          <span>University Rules & System Configuration</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Fully customize assessment weight components, grading scale tables, and curriculum presets.
        </p>
      </div>

      {/* University & Department Preset Switcher */}
      <section className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-slate-800" />
            <h3 className="font-bold text-slate-900 text-base">
              University Curriculum Preset
            </h3>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {profile.universityName}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {UNIVERSITY_PRESETS.map(preset => {
            const isSelected = profile.universityId === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => loadUniversityPreset(preset.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                    : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold">{preset.shortName}</span>
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
                <h4 className="text-xs font-semibold line-clamp-1">{preset.name}</h4>
                <p className={`text-[11px] mt-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  {preset.departments[0]?.name} ({preset.departments[0]?.programTotalCredits} Cr)
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Student Profile Information */}
      <section className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-slate-800" />
          <h3 className="font-bold text-slate-900 text-base">Student Profile & Degree Goals</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Student Name</label>
            <input
              type="text"
              value={profile.fullName}
              onChange={e => updateProfile({ fullName: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Student ID / Roll</label>
            <input
              type="text"
              value={profile.studentId}
              onChange={e => updateProfile({ studentId: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
            <input
              type="text"
              value={profile.departmentName}
              onChange={e => updateProfile({ departmentName: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target CGPA</label>
            <input
              type="number"
              step="0.05"
              min="2.00"
              max="4.00"
              value={profile.targetCgpa}
              onChange={e => updateProfile({ targetCgpa: parseFloat(e.target.value) || 3.75 })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Total Program Credits</label>
            <input
              type="number"
              step="0.5"
              value={profile.programTotalCredits}
              onChange={e => updateProfile({ programTotalCredits: parseFloat(e.target.value) || 161.0 })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 text-slate-900"
            />
          </div>
        </div>
      </section>

      {/* Assessment Weights Configuration */}
      <section className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sliders className="w-5 h-5 text-slate-800" />
              <span>Assessment Weighting Model (Core Rule)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Dynamic assessment components for Theory and Sessional courses. Must sum to 100%.
            </p>
          </div>

          <button
            onClick={resetDefaultWeights}
            type="button"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default Weights</span>
          </button>
        </div>

        {/* 1. Theory Components Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Theory Course Components
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  theorySum === 100
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                Total: {theorySum}% {theorySum === 100 ? '(Valid 100%)' : '(Must sum to 100%)'}
              </span>
            </div>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-800 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Component Name</th>
                  <th className="py-2.5 px-4">Quiz Auto-Gen Rule</th>
                  <th className="py-2.5 px-4 text-right">Weight (%)</th>
                  <th className="py-2.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {theoryComponents.map(comp => (
                  <tr key={comp.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                      {comp.name}
                    </td>
                    <td className="py-2.5 px-4 text-slate-500">
                      {comp.isQuizType ? (
                        <span className="font-semibold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                          1 Credit = 1 Quiz
                        </span>
                      ) : (
                        'Standard exam component'
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={comp.weightPercent}
                        onChange={e =>
                          handleTheoryWeightChange(comp.id, Number(e.target.value) || 0)
                        }
                        className="w-16 px-2 py-1 text-xs font-bold text-right rounded border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                      <span className="ml-1 text-slate-400 font-bold">%</span>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <button
                        onClick={() => deleteTheoryComponent(comp.id)}
                        type="button"
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Delete component"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add custom theory component */}
          <form
            onSubmit={handleAddTheoryComponent}
            className="flex items-center gap-2 flex-wrap bg-slate-50 p-3 rounded-xl border border-slate-200/80"
          >
            <input
              type="text"
              placeholder="Add Component (e.g. Assignment, Presentation)"
              value={newTheoryName}
              onChange={e => setNewTheoryName(e.target.value)}
              className="flex-1 min-w-[180px] px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-900"
            />
            <div className="flex items-center gap-1">
              <input
                type="number"
                placeholder="Weight %"
                value={newTheoryWeight}
                onChange={e => setNewTheoryWeight(Number(e.target.value))}
                className="w-16 px-2 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-900"
              />
              <span className="text-xs text-slate-500 font-bold">%</span>
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              + Add Theory Component
            </button>
          </form>
        </div>

        {/* 2. Sessional Components Table */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Sessional / Lab Course Components
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  sessionalSum === 100
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                Total: {sessionalSum}% {sessionalSum === 100 ? '(Valid 100%)' : '(Must sum to 100%)'}
              </span>
            </div>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-800 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Component Name</th>
                  <th className="py-2.5 px-4 text-right">Weight (%)</th>
                  <th className="py-2.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sessionalComponents.map(comp => (
                  <tr key={comp.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                      {comp.name}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={comp.weightPercent}
                        onChange={e =>
                          handleSessionalWeightChange(comp.id, Number(e.target.value) || 0)
                        }
                        className="w-16 px-2 py-1 text-xs font-bold text-right rounded border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                      <span className="ml-1 text-slate-400 font-bold">%</span>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <button
                        onClick={() => deleteSessionalComponent(comp.id)}
                        type="button"
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Delete component"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add custom sessional component */}
          <form
            onSubmit={handleAddSessionalComponent}
            className="flex items-center gap-2 flex-wrap bg-slate-50 p-3 rounded-xl border border-slate-200/80"
          >
            <input
              type="text"
              placeholder="Add Sessional Component (e.g. Project, Field Work)"
              value={newSessionalName}
              onChange={e => setNewSessionalName(e.target.value)}
              className="flex-1 min-w-[180px] px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-900"
            />
            <div className="flex items-center gap-1">
              <input
                type="number"
                placeholder="Weight %"
                value={newSessionalWeight}
                onChange={e => setNewSessionalWeight(Number(e.target.value))}
                className="w-16 px-2 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-900"
              />
              <span className="text-xs text-slate-500 font-bold">%</span>
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              + Add Sessional Component
            </button>
          </form>
        </div>
      </section>

      {/* Grading Scale Configuration */}
      <section className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Scale className="w-5 h-5 text-slate-800" />
              <span>Grading Scale (Letter Grade to GPA Map)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Default HSTU Scale (A+ 4.00, A 3.75, A- 3.50, B+ 3.25, etc.). Fully customizable.
            </p>
          </div>

          <button
            onClick={resetDefaultGradingScale}
            type="button"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset HSTU Scale</span>
          </button>
        </div>

        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-800 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Letter Grade</th>
                <th className="py-2.5 px-4 text-center">Grade Point</th>
                <th className="py-2.5 px-4 text-center">Numerical Range (%)</th>
                <th className="py-2.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {gradingScale.map(entry => (
                <tr key={entry.id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 font-bold text-slate-900">{entry.letterGrade}</td>
                  <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-800">
                    {entry.gradePoint.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-4 text-center text-slate-600">
                    {entry.maxPercent !== null
                      ? `${entry.minPercent}% to below ${entry.maxPercent}%`
                      : `${entry.minPercent}% and above`}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <button
                      onClick={() => deleteGradingScaleEntry(entry.id)}
                      type="button"
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add custom grade entry */}
        <form
          onSubmit={handleAddGradeEntry}
          className="flex items-center gap-2 flex-wrap bg-slate-50 p-3 rounded-xl border border-slate-200/80"
        >
          <input
            type="text"
            placeholder="Grade (e.g. A+)"
            value={newGradeLetter}
            onChange={e => setNewGradeLetter(e.target.value)}
            className="w-24 px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-bold uppercase"
          />
          <input
            type="number"
            step="0.05"
            placeholder="GPA (e.g. 4.00)"
            value={newGradePoint}
            onChange={e => setNewGradePoint(Number(e.target.value))}
            className="w-24 px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
          />
          <input
            type="number"
            placeholder="Min % (e.g. 80)"
            value={newGradeMin}
            onChange={e => setNewGradeMin(Number(e.target.value))}
            className="w-24 px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
          />
          <input
            type="number"
            placeholder="Max % (opt)"
            value={newGradeMax}
            onChange={e => setNewGradeMax(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-24 px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
          />
          <button
            type="submit"
            className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            + Add Grade Entry
          </button>
        </form>
      </section>

      {/* Data Backup, Export & Reset */}
      <section className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Data Backup & Reset</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-900">Export / Download Backup</h4>
            <p className="text-xs text-slate-500">
              Save all semesters, courses, quizzes, and university settings as a JSON file.
            </p>
            <button
              onClick={handleDownloadBackup}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download JSON Backup</span>
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-900">Restore from JSON</h4>
            <textarea
              placeholder="Paste backup JSON string here..."
              value={jsonInput}
              onChange={e => setJsonInput(e.target.value)}
              rows={2}
              className="w-full text-xs font-mono p-2 rounded-lg border border-slate-200 bg-white"
            />
            {importStatus && (
              <p className="text-xs font-semibold text-slate-800">{importStatus}</p>
            )}
            <button
              onClick={handleImportJson}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Restore Data</span>
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Reset everything back to fresh preloaded HSTU Civil preset.
          </span>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset all data? This will restore initial preset.')) {
                resetAllData();
              }
            }}
            type="button"
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
          >
            Reset All Data to Preset
          </button>
        </div>
      </section>
    </div>
  );
}
