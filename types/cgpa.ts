export type CourseType = 'theory' | 'sessional';

export interface GradingScaleEntry {
  id: string;
  letterGrade: string;
  gradePoint: number;
  minPercent: number;
  maxPercent: number | null; // null for open-ended e.g. >=80
}

export interface AssessmentComponent {
  id: string;
  courseType: CourseType;
  name: string;
  weightPercent: number;
  isQuizType?: boolean; // true for "1 credit = 1 quiz"
  description?: string;
}

export interface Quiz {
  id: string;
  quizNumber: number;
  marksObtained: number;
  marksTotal: number;
  isExtra?: boolean;
}

export interface UserCourseComponentScore {
  componentId: string;
  componentName: string;
  obtainedPercent: number; // 0 - 100
}

export interface Course {
  id: string;
  semesterId: string;
  courseCode: string;
  courseTitle: string;
  credit: number;
  contactHours?: number;
  courseType: CourseType;
  isRetake?: boolean;
  quizzes: Quiz[];
  componentScores: UserCourseComponentScore[];
  // Calculated or direct override
  computedScorePercent?: number;
  computedGradePoint?: number;
  computedLetterGrade?: string;
  manualOverride?: boolean;
  manualGradePoint?: number;
  manualScorePercent?: number;
}

export interface Semester {
  id: string;
  level: number;
  semester: number;
  label: string;
  courses: Course[];
  isCompleted?: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  studentId: string;
  universityId: string;
  universityName: string;
  departmentId: string;
  departmentName: string;
  targetCgpa: number;
  programTotalCredits: number;
  startingYear?: string;
  avatarUrl?: string;
}

export interface UniversityPreset {
  id: string;
  name: string;
  shortName: string;
  departments: {
    id: string;
    name: string;
    programTotalCredits: number;
    semesters: {
      level: number;
      semester: number;
      label: string;
      courses: {
        courseCode: string;
        courseTitle: string;
        credit: number;
        contactHours?: number;
        courseType: CourseType;
      }[];
    }[];
  }[];
  defaultGradingScale: GradingScaleEntry[];
  defaultTheoryComponents: AssessmentComponent[];
  defaultSessionalComponents: AssessmentComponent[];
}

export interface SemesterCalculation {
  semesterId: string;
  label: string;
  level: number;
  semester: number;
  totalCredits: number;
  earnedCredits: number;
  gpa: number;
  totalGradePoints: number;
  courseResults: {
    courseId: string;
    courseCode: string;
    courseTitle: string;
    credit: number;
    courseType: CourseType;
    scorePercent: number;
    gradePoint: number;
    letterGrade: string;
    isPassed: boolean;
  }[];
}

export interface OverallCalculation {
  cgpa: number;
  totalCreditsAttempted: number;
  totalCreditsEarned: number;
  programTotalCredits: number;
  creditCompletionPercentage: number;
  targetCgpa: number;
  targetDifference: number;
  isTargetAchieved: boolean;
  semesterCalculations: SemesterCalculation[];
  gradeDistribution: {
    letterGrade: string;
    gradePoint: number;
    count: number;
    creditTotal: number;
    percentage: number;
  }[];
  requiredGpaForRemaining?: {
    remainingCredits: number;
    requiredGpa: number;
    isPossible: boolean;
    statusText: string;
  };
}
