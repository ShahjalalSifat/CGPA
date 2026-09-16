'use client';

import React, { useState } from 'react';
import { Course, CourseType } from '@/types/cgpa';
import { X, BookOpen, FlaskConical, Check } from 'lucide-react';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (courseData: Partial<Course>) => void;
  semesterLabel?: string;
  initialCourse?: Course | null;
}

function CourseForm({
  onClose,
  onSave,
  semesterLabel,
  initialCourse,
}: {
  onClose: () => void;
  onSave: (courseData: Partial<Course>) => void;
  semesterLabel?: string;
  initialCourse?: Course | null;
}) {
  const [courseCode, setCourseCode] = useState(initialCourse?.courseCode || '');
  const [courseTitle, setCourseTitle] = useState(initialCourse?.courseTitle || '');
  const [credit, setCredit] = useState(initialCourse?.credit ?? 3.0);
  const [contactHours, setContactHours] = useState(initialCourse?.contactHours ?? initialCourse?.credit ?? 3.0);
  const [courseType, setCourseType] = useState<CourseType>(initialCourse?.courseType || 'theory');
  const [isRetake, setIsRetake] = useState(!!initialCourse?.isRetake);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode.trim()) return;

    onSave({
      courseCode: courseCode.trim().toUpperCase(),
      courseTitle: courseTitle.trim() || courseCode.trim(),
      credit: Number(credit) || 3.0,
      contactHours: Number(contactHours) || Number(credit) || 3.0,
      courseType,
      isRetake,
    });
    onClose();
  };

  return (
    <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-150">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-bold text-slate-900 text-base">
            {initialCourse ? 'Edit Course' : 'Add New Course'}
          </h3>
          <p className="text-xs text-slate-500">
            {semesterLabel || 'Add course to semester'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Course Type Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Course Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setCourseType('theory')}
              className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                courseType === 'theory'
                  ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <div>
                <div className="text-xs font-bold">Theory Course</div>
                <div className={`text-[10px] ${courseType === 'theory' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Quiz + Mid + Final
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setCourseType('sessional')}
              className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                courseType === 'sessional'
                  ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-white'
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              <div>
                <div className="text-xs font-bold">Sessional / Lab</div>
                <div className={`text-[10px] ${courseType === 'sessional' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Lab Report + Viva + Test
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Course Code & Title */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Course Code
            </label>
            <input
              type="text"
              required
              placeholder="e.g. CIE 201"
              value={courseCode}
              onChange={e => setCourseCode(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 uppercase focus:bg-white focus:ring-2 focus:ring-slate-900 text-slate-900"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Course Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mechanics of Solids-I"
              value={courseTitle}
              onChange={e => setCourseTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 text-slate-900"
            />
          </div>
        </div>

        {/* Credit & Contact Hours */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Credit Hours
            </label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="12"
              required
              value={credit}
              onChange={e => setCredit(parseFloat(e.target.value) || 3.0)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Hours / Week
            </label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="20"
              value={contactHours}
              onChange={e => setContactHours(parseFloat(e.target.value) || credit)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 text-slate-900"
            />
          </div>
        </div>

        {/* Retake Checkbox */}
        <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
          <input
            type="checkbox"
            checked={isRetake}
            onChange={e => setIsRetake(e.target.checked)}
            className="rounded text-slate-900 focus:ring-slate-900 w-4 h-4"
          />
          <div className="text-xs">
            <span className="font-semibold text-slate-800 block">
              Mark as Retake / Improvement Course
            </span>
            <span className="text-[11px] text-slate-500">
              Course replaces or improves previous lower grade in CGPA calculation
            </span>
          </div>
        </label>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm"
          >
            {initialCourse ? 'Save Changes' : 'Add Course'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function CourseModal({
  isOpen,
  onClose,
  onSave,
  semesterLabel,
  initialCourse,
}: CourseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <CourseForm
        key={initialCourse?.id || 'new-course'}
        onClose={onClose}
        onSave={onSave}
        semesterLabel={semesterLabel}
        initialCourse={initialCourse}
      />
    </div>
  );
}
