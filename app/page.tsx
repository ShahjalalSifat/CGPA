'use client';

import React, { useState } from 'react';
import { CgpaProvider, useCgpa } from '@/context/CgpaContext';
import Navbar from '@/components/Navbar';
import BottomNav, { TabType } from '@/components/BottomNav';
import DashboardTab from '@/components/DashboardTab';
import SemestersTab from '@/components/SemestersTab';
import SimulatorTab from '@/components/SimulatorTab';
import AnalyticsTab from '@/components/AnalyticsTab';
import SettingsTab from '@/components/SettingsTab';
import CourseModal from '@/components/CourseModal';
import CsvImportModal from '@/components/CsvImportModal';
import TranscriptModal from '@/components/TranscriptModal';
import ShareModal from '@/components/ShareModal';
import { Course } from '@/types/cgpa';

function CgpaAppContent() {
  const { addCourse, updateCourse, isHydrated, semesters } = useCgpa();
  const [activeTab, setActiveTab] = useState<TabType>('semesters');

  // Modal states
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Course modal
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [activeSemesterIdForCourse, setActiveSemesterIdForCourse] = useState<string | null>(null);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);

  const handleOpenAddCourse = (semesterId: string) => {
    setActiveSemesterIdForCourse(semesterId);
    setCourseToEdit(null);
    setIsCourseModalOpen(true);
  };

  const handleOpenEditCourse = (semesterId: string, course: Course) => {
    setActiveSemesterIdForCourse(semesterId);
    setCourseToEdit(course);
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = (courseData: Partial<Course>) => {
    if (!activeSemesterIdForCourse) return;
    if (courseToEdit) {
      updateCourse(activeSemesterIdForCourse, courseToEdit.id, courseData);
    } else {
      addCourse(activeSemesterIdForCourse, courseData);
    }
  };

  const activeSemLabel = semesters.find(s => s.id === activeSemesterIdForCourse)?.label;

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
          <span className="text-xs font-semibold text-slate-500">Loading CGPA Architecture...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900 selection:bg-slate-900 selection:text-white pb-20">
      {/* Top Navigation */}
      <Navbar
        onOpenCsvImport={() => setIsCsvModalOpen(true)}
        onOpenTranscript={() => setIsTranscriptModalOpen(true)}
        onOpenShare={() => setIsShareModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardTab
            onNavigateTab={tab => setActiveTab(tab)}
            onOpenTranscript={() => setIsTranscriptModalOpen(true)}
          />
        )}

        {activeTab === 'semesters' && (
          <SemestersTab
            onOpenAddCourse={handleOpenAddCourse}
            onOpenEditCourse={handleOpenEditCourse}
          />
        )}

        {activeTab === 'simulator' && <SimulatorTab />}

        {activeTab === 'analytics' && (
          <AnalyticsTab onOpenTranscript={() => setIsTranscriptModalOpen(true)} />
        )}

        {activeTab === 'settings' && <SettingsTab />}
      </main>

      {/* Floating iOS Bottom Nav */}
      <BottomNav activeTab={activeTab} onChangeTab={tab => setActiveTab(tab)} />

      {/* Modals */}
      <CourseModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onSave={handleSaveCourse}
        semesterLabel={activeSemLabel}
        initialCourse={courseToEdit}
      />

      <CsvImportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
      />

      <TranscriptModal
        isOpen={isTranscriptModalOpen}
        onClose={() => setIsTranscriptModalOpen(false)}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
}

export default function Page() {
  return (
    <CgpaProvider>
      <CgpaAppContent />
    </CgpaProvider>
  );
}
