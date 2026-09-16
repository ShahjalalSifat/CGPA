'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useSyncExternalStore, ReactNode } from 'react';
import {
  Semester,
  Course,
  AssessmentComponent,
  GradingScaleEntry,
  UserProfile,
  OverallCalculation,
  CourseType,
  Quiz
} from '@/types/cgpa';
import {
  UNIVERSITY_PRESETS,
  DEFAULT_HSTU_GRADING_SCALE,
  DEFAULT_THEORY_COMPONENTS,
  DEFAULT_SESSIONAL_COMPONENTS,
  INITIAL_USER_PROFILE,
  generateInitialSemesterData
} from '@/data/presets';
import { calculateOverallCGPA } from '@/lib/calculations';

interface CgpaContextType {
  profile: UserProfile;
  semesters: Semester[];
  theoryComponents: AssessmentComponent[];
  sessionalComponents: AssessmentComponent[];
  gradingScale: GradingScaleEntry[];
  summary: OverallCalculation;
  isHydrated: boolean;
  
  // Profile & Targets
  updateProfile: (updates: Partial<UserProfile>) => void;
  setTargetCgpa: (target: number) => void;
  setProgramTotalCredits: (credits: number) => void;

  // Semesters & Courses CRUD
  addSemester: (level: number, semester: number, label?: string) => void;
  deleteSemester: (semesterId: string) => void;
  addCourse: (semesterId: string, course: Partial<Course>) => void;
  updateCourse: (semesterId: string, courseId: string, updates: Partial<Course>) => void;
  deleteCourse: (semesterId: string, courseId: string) => void;

  // Quizzes & Components
  addQuiz: (semesterId: string, courseId: string, marksTotal?: number) => void;
  updateQuiz: (semesterId: string, courseId: string, quizId: string, updates: Partial<Quiz>) => void;
  deleteQuiz: (semesterId: string, courseId: string, quizId: string) => void;
  updateCourseComponentScore: (semesterId: string, courseId: string, componentId: string, componentName: string, obtainedPercent: number) => void;

  // Assessment Weights Settings
  updateTheoryComponents: (components: AssessmentComponent[]) => void;
  updateSessionalComponents: (components: AssessmentComponent[]) => void;
  addTheoryComponent: (name: string, weightPercent: number, isQuizType?: boolean) => void;
  addSessionalComponent: (name: string, weightPercent: number) => void;
  deleteTheoryComponent: (componentId: string) => void;
  deleteSessionalComponent: (componentId: string) => void;
  resetDefaultWeights: () => void;

  // Grading Scale Settings
  updateGradingScale: (scale: GradingScaleEntry[]) => void;
  addGradingScaleEntry: (entry: Omit<GradingScaleEntry, 'id'>) => void;
  deleteGradingScaleEntry: (id: string) => void;
  resetDefaultGradingScale: () => void;

  // Presets & Bulk Import
  loadUniversityPreset: (presetId: string, departmentId?: string) => void;
  importCoursesFromCsv: (rows: Array<{ level: number; semester: number; course_code: string; course_title: string; credit: number; course_type?: string }>) => void;
  resetAllData: () => void;
  exportDataJson: () => string;
  importDataJson: (jsonString: string) => boolean;
}

const LOCAL_STORAGE_KEY = 'cgpa_calculator_v1_store';

const CgpaContext = createContext<CgpaContextType | undefined>(undefined);

const subscribe = () => () => {};

export function CgpaProvider({ children }: { children: ReactNode }) {
  const isHydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const [profile, setProfile] = useState<UserProfile>(() => {
    if (typeof window === 'undefined') return INITIAL_USER_PROFILE;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.profile) return parsed.profile;
      }
    } catch {}
    return INITIAL_USER_PROFILE;
  });

  const [semesters, setSemesters] = useState<Semester[]>(() => {
    if (typeof window === 'undefined') return generateInitialSemesterData();
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.semesters && parsed.semesters.length > 0) return parsed.semesters;
      }
    } catch {}
    return generateInitialSemesterData();
  });

  const [theoryComponents, setTheoryComponents] = useState<AssessmentComponent[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_THEORY_COMPONENTS;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.theoryComponents) return parsed.theoryComponents;
      }
    } catch {}
    return DEFAULT_THEORY_COMPONENTS;
  });

  const [sessionalComponents, setSessionalComponents] = useState<AssessmentComponent[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_SESSIONAL_COMPONENTS;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.sessionalComponents) return parsed.sessionalComponents;
      }
    } catch {}
    return DEFAULT_SESSIONAL_COMPONENTS;
  });

  const [gradingScale, setGradingScale] = useState<GradingScaleEntry[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_HSTU_GRADING_SCALE;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.gradingScale) return parsed.gradingScale;
      }
    } catch {}
    return DEFAULT_HSTU_GRADING_SCALE;
  });

  // Sync to LocalStorage on changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const payload = {
        profile,
        semesters,
        theoryComponents,
        sessionalComponents,
        gradingScale,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [profile, semesters, theoryComponents, sessionalComponents, gradingScale, isHydrated]);

  // Overall calculations memoized
  const summary = useMemo(() => {
    return calculateOverallCGPA(
      semesters,
      theoryComponents,
      sessionalComponents,
      gradingScale,
      profile.targetCgpa,
      profile.programTotalCredits
    );
  }, [semesters, theoryComponents, sessionalComponents, gradingScale, profile.targetCgpa, profile.programTotalCredits]);

  // Profile methods
  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const setTargetCgpa = (target: number) => {
    setProfile(prev => ({ ...prev, targetCgpa: target }));
  };

  const setProgramTotalCredits = (credits: number) => {
    setProfile(prev => ({ ...prev, programTotalCredits: credits }));
  };

  // Semesters & Courses CRUD
  const addSemester = (level: number, semester: number, label?: string) => {
    const semLabel = label || `Level ${level} Semester ${semester === 1 ? 'I' : 'II'} (L-${level} S-${semester === 1 ? 'I' : 'II'})`;
    const newSem: Semester = {
      id: `sem-${level}-${semester}-${Date.now()}`,
      level,
      semester,
      label: semLabel,
      isCompleted: false,
      courses: [],
    };
    setSemesters(prev => [...prev, newSem]);
  };

  const deleteSemester = (semesterId: string) => {
    setSemesters(prev => prev.filter(s => s.id !== semesterId));
  };

  const addCourse = (semesterId: string, courseData: Partial<Course>) => {
    const credit = courseData.credit || 3.0;
    const courseType: CourseType = courseData.courseType || 'theory';
    const numQuizzes = courseType === 'theory' ? Math.max(1, Math.round(credit)) : 0;
    
    const quizzes: Quiz[] = [];
    if (courseType === 'theory') {
      for (let i = 1; i <= numQuizzes; i++) {
        quizzes.push({
          id: `q-${Date.now()}-${i}`,
          quizNumber: i,
          marksObtained: 0,
          marksTotal: 20,
          isExtra: false,
        });
      }
    }

    const componentScores = (courseType === 'theory' ? theoryComponents : sessionalComponents).map(comp => ({
      componentId: comp.id,
      componentName: comp.name,
      obtainedPercent: 0,
    }));

    const newCourse: Course = {
      id: `crs-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      semesterId,
      courseCode: courseData.courseCode || 'NEW 101',
      courseTitle: courseData.courseTitle || 'New Course Title',
      credit,
      contactHours: courseData.contactHours || credit,
      courseType,
      isRetake: !!courseData.isRetake,
      quizzes,
      componentScores,
    };

    setSemesters(prev => prev.map(s => {
      if (s.id === semesterId) {
        return { ...s, courses: [...s.courses, newCourse] };
      }
      return s;
    }));
  };

  const updateCourse = (semesterId: string, courseId: string, updates: Partial<Course>) => {
    setSemesters(prev => prev.map(s => {
      if (s.id === semesterId) {
        return {
          ...s,
          courses: s.courses.map(c => {
            if (c.id === courseId) {
              const updated = { ...c, ...updates };
              // If credit changed and course is theory, ensure quiz slots match unless customized
              if (updates.credit && updates.credit !== c.credit && updated.courseType === 'theory') {
                const targetCount = Math.max(1, Math.round(updates.credit));
                const nonExtraQuizzes = updated.quizzes.filter(q => !q.isExtra);
                if (nonExtraQuizzes.length < targetCount) {
                  const extraNeeded = targetCount - nonExtraQuizzes.length;
                  const newQuizzes = [...updated.quizzes];
                  for (let i = 0; i < extraNeeded; i++) {
                    const nextNum = nonExtraQuizzes.length + i + 1;
                    newQuizzes.push({
                      id: `q-${Date.now()}-${nextNum}`,
                      quizNumber: nextNum,
                      marksObtained: 0,
                      marksTotal: 20,
                      isExtra: false,
                    });
                  }
                  updated.quizzes = newQuizzes;
                }
              }
              return updated;
            }
            return c;
          }),
        };
      }
      return s;
    }));
  };

  const deleteCourse = (semesterId: string, courseId: string) => {
    setSemesters(prev => prev.map(s => {
      if (s.id === semesterId) {
        return { ...s, courses: s.courses.filter(c => c.id !== courseId) };
      }
      return s;
    }));
  };

  // Quizzes
  const addQuiz = (semesterId: string, courseId: string, marksTotal = 20) => {
    setSemesters(prev => prev.map(s => {
      if (s.id === semesterId) {
        return {
          ...s,
          courses: s.courses.map(c => {
            if (c.id === courseId) {
              const nextNum = c.quizzes.length + 1;
              const newQuiz: Quiz = {
                id: `q-extra-${Date.now()}`,
                quizNumber: nextNum,
                marksObtained: 0,
                marksTotal,
                isExtra: true,
              };
              return { ...c, quizzes: [...c.quizzes, newQuiz] };
            }
            return c;
          }),
        };
      }
      return s;
    }));
  };

  const updateQuiz = (semesterId: string, courseId: string, quizId: string, updates: Partial<Quiz>) => {
    setSemesters(prev => prev.map(s => {
      if (s.id === semesterId) {
        return {
          ...s,
          courses: s.courses.map(c => {
            if (c.id === courseId) {
              return {
                ...c,
                quizzes: c.quizzes.map(q => q.id === quizId ? { ...q, ...updates } : q),
              };
            }
            return c;
          }),
        };
      }
      return s;
    }));
  };

  const deleteQuiz = (semesterId: string, courseId: string, quizId: string) => {
    setSemesters(prev => prev.map(s => {
      if (s.id === semesterId) {
        return {
          ...s,
          courses: s.courses.map(c => {
            if (c.id === courseId) {
              const remaining = c.quizzes.filter(q => q.id !== quizId);
              // Renumber
              const renumbered = remaining.map((q, idx) => ({ ...q, quizNumber: idx + 1 }));
              return { ...c, quizzes: renumbered };
            }
            return c;
          }),
        };
      }
      return s;
    }));
  };

  // Course Component Score
  const updateCourseComponentScore = (
    semesterId: string,
    courseId: string,
    componentId: string,
    componentName: string,
    obtainedPercent: number
  ) => {
    const clamped = Math.min(100, Math.max(0, Number(obtainedPercent) || 0));
    setSemesters(prev => prev.map(s => {
      if (s.id === semesterId) {
        return {
          ...s,
          courses: s.courses.map(c => {
            if (c.id === courseId) {
              const existingIdx = c.componentScores.findIndex(comp => comp.componentId === componentId || comp.componentName === componentName);
              const updatedScores = [...c.componentScores];
              if (existingIdx >= 0) {
                updatedScores[existingIdx] = {
                  ...updatedScores[existingIdx],
                  obtainedPercent: clamped,
                };
              } else {
                updatedScores.push({
                  componentId,
                  componentName,
                  obtainedPercent: clamped,
                });
              }
              return { ...c, componentScores: updatedScores };
            }
            return c;
          }),
        };
      }
      return s;
    }));
  };

  // Assessment Weights Settings
  const updateTheoryComponents = (components: AssessmentComponent[]) => {
    setTheoryComponents(components);
  };

  const updateSessionalComponents = (components: AssessmentComponent[]) => {
    setSessionalComponents(components);
  };

  const addTheoryComponent = (name: string, weightPercent: number, isQuizType = false) => {
    const newComp: AssessmentComponent = {
      id: `comp-th-${Date.now()}`,
      courseType: 'theory',
      name,
      weightPercent,
      isQuizType,
    };
    setTheoryComponents(prev => [...prev, newComp]);
  };

  const addSessionalComponent = (name: string, weightPercent: number) => {
    const newComp: AssessmentComponent = {
      id: `comp-ses-${Date.now()}`,
      courseType: 'sessional',
      name,
      weightPercent,
      isQuizType: false,
    };
    setSessionalComponents(prev => [...prev, newComp]);
  };

  const deleteTheoryComponent = (componentId: string) => {
    setTheoryComponents(prev => prev.filter(c => c.id !== componentId));
  };

  const deleteSessionalComponent = (componentId: string) => {
    setSessionalComponents(prev => prev.filter(c => c.id !== componentId));
  };

  const resetDefaultWeights = () => {
    setTheoryComponents(DEFAULT_THEORY_COMPONENTS);
    setSessionalComponents(DEFAULT_SESSIONAL_COMPONENTS);
  };

  // Grading Scale Settings
  const updateGradingScale = (scale: GradingScaleEntry[]) => {
    setGradingScale(scale);
  };

  const addGradingScaleEntry = (entry: Omit<GradingScaleEntry, 'id'>) => {
    const newEntry: GradingScaleEntry = {
      ...entry,
      id: `scale-${Date.now()}`,
    };
    setGradingScale(prev => [...prev, newEntry].sort((a, b) => b.minPercent - a.minPercent));
  };

  const deleteGradingScaleEntry = (id: string) => {
    setGradingScale(prev => prev.filter(e => e.id !== id));
  };

  const resetDefaultGradingScale = () => {
    setGradingScale(DEFAULT_HSTU_GRADING_SCALE);
  };

  // Preset switch
  const loadUniversityPreset = (presetId: string, departmentId?: string) => {
    const preset = UNIVERSITY_PRESETS.find(p => p.id === presetId) || UNIVERSITY_PRESETS[0];
    const dept = departmentId
      ? preset.departments.find(d => d.id === departmentId) || preset.departments[0]
      : preset.departments[0];

    setTheoryComponents(preset.defaultTheoryComponents);
    setSessionalComponents(preset.defaultSessionalComponents);
    setGradingScale(preset.defaultGradingScale);

    setProfile(prev => ({
      ...prev,
      universityId: preset.id,
      universityName: preset.name,
      departmentId: dept.id,
      departmentName: dept.name,
      programTotalCredits: dept.programTotalCredits,
    }));

    // Copy curriculum templates
    const newSemesters: Semester[] = dept.semesters.map((semTemplate) => {
      const semId = `sem-${semTemplate.level}-${semTemplate.semester}`;
      const courses: Course[] = semTemplate.courses.map((courseTemplate, cIdx) => {
        const courseId = `crs-${semTemplate.level}-${semTemplate.semester}-${cIdx + 1}`;
        const numQuizzes = courseTemplate.courseType === 'theory' ? Math.max(1, Math.round(courseTemplate.credit)) : 0;
        
        const quizzes: Quiz[] = [];
        if (courseTemplate.courseType === 'theory') {
          for (let q = 1; q <= numQuizzes; q++) {
            quizzes.push({
              id: `quiz-${courseId}-${q}`,
              quizNumber: q,
              marksObtained: 0,
              marksTotal: 20,
              isExtra: false,
            });
          }
        }

        const componentScores = (courseTemplate.courseType === 'theory' ? preset.defaultTheoryComponents : preset.defaultSessionalComponents).map(comp => ({
          componentId: comp.id,
          componentName: comp.name,
          obtainedPercent: 0,
        }));

        return {
          id: courseId,
          semesterId: semId,
          courseCode: courseTemplate.courseCode,
          courseTitle: courseTemplate.courseTitle,
          credit: courseTemplate.credit,
          contactHours: courseTemplate.contactHours,
          courseType: courseTemplate.courseType,
          isRetake: false,
          quizzes,
          componentScores,
        };
      });

      return {
        id: semId,
        level: semTemplate.level,
        semester: semTemplate.semester,
        label: semTemplate.label,
        isCompleted: false,
        courses,
      };
    });

    setSemesters(newSemesters);
  };

  // CSV Bulk Import
  const importCoursesFromCsv = (rows: Array<{ level: number; semester: number; course_code: string; course_title: string; credit: number; course_type?: string }>) => {
    const updatedSemesters = [...semesters];

    rows.forEach(row => {
      const level = Number(row.level) || 1;
      const semNum = Number(row.semester) || 1;
      const credit = Number(row.credit) || 3.0;
      const courseType: CourseType = (row.course_type && row.course_type.toLowerCase().includes('ses')) ? 'sessional' : 'theory';

      let sem = updatedSemesters.find(s => s.level === level && s.semester === semNum);
      if (!sem) {
        sem = {
          id: `sem-${level}-${semNum}-${Date.now()}`,
          level,
          semester: semNum,
          label: `Level ${level} Semester ${semNum === 1 ? 'I' : 'II'} (L-${level} S-${semNum === 1 ? 'I' : 'II'})`,
          courses: [],
        };
        updatedSemesters.push(sem);
      }

      const numQuizzes = courseType === 'theory' ? Math.max(1, Math.round(credit)) : 0;
      const quizzes: Quiz[] = [];
      for (let i = 1; i <= numQuizzes; i++) {
        quizzes.push({
          id: `q-csv-${Date.now()}-${i}`,
          quizNumber: i,
          marksObtained: 0,
          marksTotal: 20,
          isExtra: false,
        });
      }

      const componentScores = (courseType === 'theory' ? theoryComponents : sessionalComponents).map(comp => ({
        componentId: comp.id,
        componentName: comp.name,
        obtainedPercent: 0,
      }));

      const newCourse: Course = {
        id: `crs-csv-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        semesterId: sem.id,
        courseCode: row.course_code || 'CRS 000',
        courseTitle: row.course_title || 'Imported Course',
        credit,
        contactHours: credit,
        courseType,
        isRetake: false,
        quizzes,
        componentScores,
      };

      sem.courses.push(newCourse);
    });

    // Sort semesters by level, then semester
    updatedSemesters.sort((a, b) => a.level === b.level ? a.semester - b.semester : a.level - b.level);
    setSemesters(updatedSemesters);
  };

  const resetAllData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setProfile(INITIAL_USER_PROFILE);
    setTheoryComponents(DEFAULT_THEORY_COMPONENTS);
    setSessionalComponents(DEFAULT_SESSIONAL_COMPONENTS);
    setGradingScale(DEFAULT_HSTU_GRADING_SCALE);
    setSemesters(generateInitialSemesterData());
  };

  const exportDataJson = () => {
    return JSON.stringify({
      profile,
      semesters,
      theoryComponents,
      sessionalComponents,
      gradingScale,
      exportedAt: new Date().toISOString(),
    }, null, 2);
  };

  const importDataJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.profile) setProfile(parsed.profile);
      if (parsed.semesters) setSemesters(parsed.semesters);
      if (parsed.theoryComponents) setTheoryComponents(parsed.theoryComponents);
      if (parsed.sessionalComponents) setSessionalComponents(parsed.sessionalComponents);
      if (parsed.gradingScale) setGradingScale(parsed.gradingScale);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <CgpaContext.Provider
      value={{
        profile,
        semesters,
        theoryComponents,
        sessionalComponents,
        gradingScale,
        summary,
        isHydrated,
        updateProfile,
        setTargetCgpa,
        setProgramTotalCredits,
        addSemester,
        deleteSemester,
        addCourse,
        updateCourse,
        deleteCourse,
        addQuiz,
        updateQuiz,
        deleteQuiz,
        updateCourseComponentScore,
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
        importCoursesFromCsv,
        resetAllData,
        exportDataJson,
        importDataJson,
      }}
    >
      {children}
    </CgpaContext.Provider>
  );
}

export function useCgpa() {
  const context = useContext(CgpaContext);
  if (!context) {
    throw new Error('useCgpa must be used within a CgpaProvider');
  }
  return context;
}
