import { GradingScaleEntry, AssessmentComponent, UniversityPreset } from '@/types/cgpa';

export const DEFAULT_HSTU_GRADING_SCALE: GradingScaleEntry[] = [
  { id: 'scale-1', letterGrade: 'A+', gradePoint: 4.00, minPercent: 80, maxPercent: null },
  { id: 'scale-2', letterGrade: 'A',  gradePoint: 3.75, minPercent: 75, maxPercent: 80 },
  { id: 'scale-3', letterGrade: 'A-', gradePoint: 3.50, minPercent: 70, maxPercent: 75 },
  { id: 'scale-4', letterGrade: 'B+', gradePoint: 3.25, minPercent: 65, maxPercent: 70 },
  { id: 'scale-5', letterGrade: 'B',  gradePoint: 3.00, minPercent: 60, maxPercent: 65 },
  { id: 'scale-6', letterGrade: 'B-', gradePoint: 2.75, minPercent: 55, maxPercent: 60 },
  { id: 'scale-7', letterGrade: 'C+', gradePoint: 2.50, minPercent: 50, maxPercent: 55 },
  { id: 'scale-8', letterGrade: 'C',  gradePoint: 2.25, minPercent: 45, maxPercent: 50 },
  { id: 'scale-9', letterGrade: 'D',  gradePoint: 2.00, minPercent: 40, maxPercent: 45 },
  { id: 'scale-10', letterGrade: 'F', gradePoint: 0.00, minPercent: 0,  maxPercent: 40 },
];

export const DEFAULT_THEORY_COMPONENTS: AssessmentComponent[] = [
  { id: 'comp-th-1', courseType: 'theory', name: 'Quiz', weightPercent: 10, isQuizType: true, description: '1 credit = 1 quiz slot, average scaled' },
  { id: 'comp-th-2', courseType: 'theory', name: 'Mid Term', weightPercent: 20, isQuizType: false, description: 'Mid-semester written exam' },
  { id: 'comp-th-3', courseType: 'theory', name: 'Attendance', weightPercent: 10, isQuizType: false, description: 'Class attendance and participation' },
  { id: 'comp-th-4', courseType: 'theory', name: 'Final Exam', weightPercent: 60, isQuizType: false, description: 'Semester final examination' },
];

export const DEFAULT_SESSIONAL_COMPONENTS: AssessmentComponent[] = [
  { id: 'comp-ses-1', courseType: 'sessional', name: 'Lab Report', weightPercent: 30, isQuizType: false, description: 'Lab manual and weekly reports' },
  { id: 'comp-ses-2', courseType: 'sessional', name: 'Viva Voce', weightPercent: 30, isQuizType: false, description: 'Oral examination and questions' },
  { id: 'comp-ses-3', courseType: 'sessional', name: 'Attendance', weightPercent: 10, isQuizType: false, description: 'Lab regular attendance' },
  { id: 'comp-ses-4', courseType: 'sessional', name: 'Final Performance / Exam', weightPercent: 30, isQuizType: false, description: 'Lab test and practical performance' },
];

export const UNIVERSITY_PRESETS: UniversityPreset[] = [
  {
    id: 'hstu',
    name: 'Hajee Mohammad Danesh Science and Technology University',
    shortName: 'HSTU',
    defaultGradingScale: DEFAULT_HSTU_GRADING_SCALE,
    defaultTheoryComponents: DEFAULT_THEORY_COMPONENTS,
    defaultSessionalComponents: DEFAULT_SESSIONAL_COMPONENTS,
    departments: [
      {
        id: 'hstu-ce',
        name: 'Civil Engineering',
        programTotalCredits: 161.0,
        semesters: [
          {
            level: 1,
            semester: 1,
            label: 'Level 1 Semester I (L-1 S-I)',
            courses: [
              { courseCode: 'CIE 101', courseTitle: 'Engineering Mechanics', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'CIE 102', courseTitle: 'Civil Engineering Drawing-I', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
              { courseCode: 'MAT 105', courseTitle: 'Mathematics-I (Differential & Integral Calculus)', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'CHM 103', courseTitle: 'Chemistry', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'CHM 104', courseTitle: 'Chemistry Sessional', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
              { courseCode: 'EEE 165', courseTitle: 'Basic Electrical Technology', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'EEE 166', courseTitle: 'Basic Electrical Technology Sessional', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
              { courseCode: 'SSH 101', courseTitle: 'English and Sociology', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
            ],
          },
          {
            level: 1,
            semester: 2,
            label: 'Level 1 Semester II (L-1 S-II)',
            courses: [
              { courseCode: 'CIE 103', courseTitle: 'Surveying', credit: 4.0, contactHours: 4.0, courseType: 'theory' },
              { courseCode: 'CIE 104', courseTitle: 'Practical Surveying', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
              { courseCode: 'MAT 107', courseTitle: 'Mathematics-II (Differential Equations & Vector Analysis)', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'PHY 103', courseTitle: 'Physics', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'PHY 104', courseTitle: 'Physics Sessional', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
              { courseCode: 'CSE 165', courseTitle: 'Computer Programming', credit: 2.0, contactHours: 2.0, courseType: 'theory' },
              { courseCode: 'CSE 166', courseTitle: 'Computer Programming Sessional', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
              { courseCode: 'SSH 103', courseTitle: 'Government and Economics', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
            ],
          },
          {
            level: 2,
            semester: 1,
            label: 'Level 2 Semester I (L-2 S-I)',
            courses: [
              { courseCode: 'CIE 201', courseTitle: 'Mechanics of Solids-I', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'CIE 202', courseTitle: 'Engineering Materials Sessional-I', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
              { courseCode: 'CIE 203', courseTitle: 'Engineering Materials', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'CIE 204', courseTitle: 'Civil Engineering Drawing-II', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
              { courseCode: 'MAT 205', courseTitle: 'Mathematics-III (Matrices, Complex Variables & Laplace)', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'STA 201', courseTitle: 'Statistics', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'CIE 206', courseTitle: 'Computer Aided Drafting Sessional', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
            ],
          },
          {
            level: 2,
            semester: 2,
            label: 'Level 2 Semester II (L-2 S-II)',
            courses: [
              { courseCode: 'CIE 207', courseTitle: 'Mechanics of Solids-II', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'CIE 208', courseTitle: 'Mechanics of Solids Sessional', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
              { courseCode: 'CIE 209', courseTitle: 'Fluid Mechanics', credit: 4.0, contactHours: 4.0, courseType: 'theory' },
              { courseCode: 'CIE 210', courseTitle: 'Fluid Mechanics Sessional', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
              { courseCode: 'CIE 211', courseTitle: 'Numerical Methods', credit: 2.0, contactHours: 2.0, courseType: 'theory' },
              { courseCode: 'CIE 212', courseTitle: 'Numerical Methods Sessional', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
              { courseCode: 'MAT 207', courseTitle: 'Mathematics-IV (Fourier Analysis & Harmonic Functions)', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
            ],
          },
          {
            level: 3,
            semester: 1,
            label: 'Level 3 Semester I (L-3 S-I)',
            courses: [
              { courseCode: 'CIE 301', courseTitle: 'Structural Analysis and Design-I', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'CIE 302', courseTitle: 'Structural Analysis and Design Sessional-I', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
              { courseCode: 'CIE 303', courseTitle: 'Environmental Engineering-I', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'CIE 304', courseTitle: 'Environmental Engineering Sessional-I', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
              { courseCode: 'CIE 305', courseTitle: 'Geotechnical Engineering-I', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'CIE 306', courseTitle: 'Geotechnical Engineering Sessional-I', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
              { courseCode: 'CIE 307', courseTitle: 'Open Channel Flow', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'CIE 308', courseTitle: 'Open Channel Flow Sessional', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
            ],
          },
          {
            level: 3,
            semester: 2,
            label: 'Level 3 Semester II (L-3 S-II)',
            courses: [
              { courseCode: 'CIE 309', courseTitle: 'Structural Analysis and Design-II', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'CIE 310', courseTitle: 'Structural Analysis and Design Sessional-II', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
              { courseCode: 'CIE 311', courseTitle: 'Design of Concrete Structures-I', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'CIE 312', courseTitle: 'Concrete Structures Design Sessional-I', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
              { courseCode: 'CIE 313', courseTitle: 'Transportation Engineering-I', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'CIE 314', courseTitle: 'Transportation Engineering Sessional-I', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
              { courseCode: 'CIE 315', courseTitle: 'Hydrology', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
            ],
          },
          {
            level: 4,
            semester: 1,
            label: 'Level 4 Semester I (L-4 S-I)',
            courses: [
              { courseCode: 'CIE 400', courseTitle: 'Project and Thesis (Part-I)', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
              { courseCode: 'CIE 401', courseTitle: 'Design of Concrete Structures-II', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'CIE 402', courseTitle: 'Concrete Structures Design Sessional-II', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
              { courseCode: 'CIE 403', courseTitle: 'Environmental Engineering-II', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'CIE 405', courseTitle: 'Geotechnical Engineering-II', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'CIE 407', courseTitle: 'Transportation Engineering-II', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'CIE 408', courseTitle: 'Transportation Engineering Sessional-II', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
              { courseCode: 'CIE 410', courseTitle: 'Practical Field Survey & Industrial Training', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
            ],
          },
          {
            level: 4,
            semester: 2,
            label: 'Level 4 Semester II (L-4 S-II)',
            courses: [
              { courseCode: 'CIE 400', courseTitle: 'Project and Thesis (Part-II)', credit: 3.0, contactHours: 6.0, courseType: 'sessional' },
              { courseCode: 'CIE 409', courseTitle: 'Structural Analysis and Design-III (Steel Structures)', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'CIE 411', courseTitle: 'Construction Management and Law', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'CIE 413', courseTitle: 'Irrigation and Flood Control', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'CIE 415', courseTitle: 'Prestressed Concrete (Elective Theory)', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'CIE 416', courseTitle: 'Prestressed Concrete Design Sessional', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
              { courseCode: 'CIE 420', courseTitle: 'Comprehensive Viva-Voce', credit: 1.0, contactHours: 1.0, courseType: 'sessional' },
            ],
          },
        ],
      },
      {
        id: 'hstu-cse',
        name: 'Computer Science & Engineering',
        programTotalCredits: 160.0,
        semesters: [
          {
            level: 1,
            semester: 1,
            label: 'Level 1 Semester I (L-1 S-I)',
            courses: [
              { courseCode: 'CSE 101', courseTitle: 'Structured Programming Language', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'CSE 102', courseTitle: 'Structured Programming Sessional', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
              { courseCode: 'MAT 101', courseTitle: 'Mathematics-I (Differential Calculus & Coordinate Geometry)', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'PHY 101', courseTitle: 'Physics (Electricity, Magnetism & Modern Physics)', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'PHY 102', courseTitle: 'Physics Sessional', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
              { courseCode: 'ENG 101', courseTitle: 'Technical English', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'EEE 101', courseTitle: 'Electrical Circuits', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'EEE 102', courseTitle: 'Electrical Circuits Sessional', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
            ],
          },
          {
            level: 1,
            semester: 2,
            label: 'Level 1 Semester II (L-1 S-II)',
            courses: [
              { courseCode: 'CSE 103', courseTitle: 'Discrete Mathematics', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'CSE 105', courseTitle: 'Object Oriented Programming', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'CSE 106', courseTitle: 'Object Oriented Programming Sessional', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
              { courseCode: 'CSE 108', courseTitle: 'Software Development Project-I', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
              { courseCode: 'MAT 103', courseTitle: 'Mathematics-II (Integral Calculus & Differential Equations)', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'EEE 103', courseTitle: 'Electronic Devices & Circuits', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'EEE 104', courseTitle: 'Electronic Devices & Circuits Sessional', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
            ],
          }
        ]
      }
    ],
  },
  {
    id: 'generic-ugc',
    name: 'Universal UGC Standard (General University Template)',
    shortName: 'UGC Standard',
    defaultGradingScale: DEFAULT_HSTU_GRADING_SCALE,
    defaultTheoryComponents: DEFAULT_THEORY_COMPONENTS,
    defaultSessionalComponents: DEFAULT_SESSIONAL_COMPONENTS,
    departments: [
      {
        id: 'generic-eng',
        name: 'General Engineering (4-Year)',
        programTotalCredits: 160.0,
        semesters: [
          {
            level: 1,
            semester: 1,
            label: 'Level 1 Semester I (L-1 S-I)',
            courses: [
              { courseCode: 'ENG 101', courseTitle: 'Engineering Fundamentals', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'ENG 102', courseTitle: 'Engineering Workshop Sessional', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
              { courseCode: 'MAT 101', courseTitle: 'Calculus & Analytical Geometry', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'PHY 101', courseTitle: 'General Physics', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
              { courseCode: 'PHY 102', courseTitle: 'General Physics Lab', credit: 1.5, contactHours: 3.0, courseType: 'sessional' },
              { courseCode: 'HUM 101', courseTitle: 'English Communication', credit: 3.0, contactHours: 3.0, courseType: 'theory' },
            ]
          }
        ]
      }
    ]
  }
];

export const INITIAL_USER_PROFILE = {
  id: 'user-default-1',
  fullName: 'HSTU Civil Engineering Student',
  studentId: '2001001',
  universityId: 'hstu',
  universityName: 'Hajee Mohammad Danesh Science and Technology University',
  departmentId: 'hstu-ce',
  departmentName: 'Civil Engineering',
  targetCgpa: 3.75,
  programTotalCredits: 161.0,
  startingYear: '2023',
};

// Generates initial populated semester state with realistic sample grades for L-1 S-I and S-II
export function generateInitialSemesterData() {
  const hstu = UNIVERSITY_PRESETS[0];
  const ceDept = hstu.departments[0];

  return ceDept.semesters.map((semTemplate, sIdx) => {
    const semId = `sem-${semTemplate.level}-${semTemplate.semester}`;
    const isCompleted = sIdx < 2; // Level 1 is completed
    const isCurrent = sIdx === 2; // Level 2 S-1 is current

    const courses = semTemplate.courses.map((courseTemplate, cIdx) => {
      const courseId = `crs-${semTemplate.level}-${semTemplate.semester}-${cIdx + 1}`;
      const numQuizzes = Math.max(1, Math.round(courseTemplate.credit));

      // Quizzes
      const quizzes = [];
      if (courseTemplate.courseType === 'theory') {
        for (let q = 1; q <= numQuizzes; q++) {
          // Pre-populate sample marks if completed or current
          let obtained = 0;
          const total = 20;
          if (isCompleted) {
            // Realistic good grades: 16-19 out of 20
            obtained = Math.round(16 + Math.random() * 3.5);
          } else if (isCurrent && q === 1) {
            obtained = 18;
          }
          quizzes.push({
            id: `quiz-${courseId}-${q}`,
            quizNumber: q,
            marksObtained: obtained,
            marksTotal: total,
            isExtra: false,
          });
        }
      }

      // Component scores
      const componentScores = [];
      if (courseTemplate.courseType === 'theory') {
        // Quiz, Mid, Attendance, Final
        let midPct = 0;
        let attPct = 0;
        let finPct = 0;
        if (isCompleted) {
          midPct = Math.round(76 + Math.random() * 18);
          attPct = Math.round(85 + Math.random() * 15);
          finPct = Math.round(74 + Math.random() * 19);
        } else if (isCurrent) {
          midPct = 82;
          attPct = 95;
          finPct = 0; // Not done yet
        }
        componentScores.push(
          { componentId: 'comp-th-1', componentName: 'Quiz', obtainedPercent: 0 }, // computed from quizzes
          { componentId: 'comp-th-2', componentName: 'Mid Term', obtainedPercent: midPct },
          { componentId: 'comp-th-3', componentName: 'Attendance', obtainedPercent: attPct },
          { componentId: 'comp-th-4', componentName: 'Final Exam', obtainedPercent: finPct }
        );
      } else {
        // Lab Report, Viva, Attendance, Final Performance
        let repPct = 0;
        let vivPct = 0;
        let attPct = 0;
        let finPct = 0;
        if (isCompleted) {
          repPct = Math.round(80 + Math.random() * 15);
          vivPct = Math.round(75 + Math.random() * 20);
          attPct = Math.round(90 + Math.random() * 10);
          finPct = Math.round(80 + Math.random() * 15);
        } else if (isCurrent) {
          repPct = 85;
          vivPct = 80;
          attPct = 100;
          finPct = 0;
        }
        componentScores.push(
          { componentId: 'comp-ses-1', componentName: 'Lab Report', obtainedPercent: repPct },
          { componentId: 'comp-ses-2', componentName: 'Viva Voce', obtainedPercent: vivPct },
          { componentId: 'comp-ses-3', componentName: 'Attendance', obtainedPercent: attPct },
          { componentId: 'comp-ses-4', componentName: 'Final Performance / Exam', obtainedPercent: finPct }
        );
      }

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
      isCompleted,
      courses,
    };
  });
}
