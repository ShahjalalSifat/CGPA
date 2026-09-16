import {
  Course,
  AssessmentComponent,
  GradingScaleEntry,
  Semester,
  SemesterCalculation,
  OverallCalculation,
  Quiz
} from '@/types/cgpa';

/**
 * Calculates quiz average percentage across all quiz slots for a course.
 */
export function calculateQuizAveragePercentage(quizzes: Quiz[]): number {
  if (!quizzes || quizzes.length === 0) return 0;
  
  // Filter quizzes that have a positive total mark
  const validQuizzes = quizzes.filter(q => q.marksTotal > 0);
  if (validQuizzes.length === 0) return 0;

  const totalPercentage = validQuizzes.reduce((acc, q) => {
    const pct = Math.min(100, Math.max(0, (q.marksObtained / q.marksTotal) * 100));
    return acc + pct;
  }, 0);

  return totalPercentage / validQuizzes.length;
}

/**
 * Maps a numerical percentage score (0-100) to Letter Grade and Grade Point based on grading scale.
 */
export function mapScoreToGrade(
  scorePercent: number,
  gradingScale: GradingScaleEntry[]
): { letterGrade: string; gradePoint: number } {
  const score = Math.round(scorePercent * 100) / 100;

  // Sort grading scale from highest minPercent downwards
  const sortedScale = [...gradingScale].sort((a, b) => b.minPercent - a.minPercent);

  for (const entry of sortedScale) {
    if (score >= entry.minPercent) {
      if (entry.maxPercent === null || score < entry.maxPercent || score >= entry.minPercent) {
        return {
          letterGrade: entry.letterGrade,
          gradePoint: entry.gradePoint,
        };
      }
    }
  }

  // Fallback to lowest scale entry or F
  const lowest = sortedScale[sortedScale.length - 1];
  return lowest
    ? { letterGrade: lowest.letterGrade, gradePoint: lowest.gradePoint }
    : { letterGrade: 'F', gradePoint: 0.0 };
}

/**
 * Computes individual course final score % and mapped grade point based on component weights.
 */
export function calculateCourseResult(
  course: Course,
  theoryComponents: AssessmentComponent[],
  sessionalComponents: AssessmentComponent[],
  gradingScale: GradingScaleEntry[]
): {
  scorePercent: number;
  gradePoint: number;
  letterGrade: string;
  componentBreakdown: { name: string; weight: number; obtainedPct: number; weightedScore: number }[];
} {
  // If manual override is active
  if (course.manualOverride && course.manualScorePercent !== undefined) {
    const grade = mapScoreToGrade(course.manualScorePercent, gradingScale);
    return {
      scorePercent: course.manualScorePercent,
      gradePoint: course.manualGradePoint !== undefined ? course.manualGradePoint : grade.gradePoint,
      letterGrade: grade.letterGrade,
      componentBreakdown: [],
    };
  }

  const components = course.courseType === 'theory' ? theoryComponents : sessionalComponents;
  const quizAveragePct = calculateQuizAveragePercentage(course.quizzes);

  let totalWeightedScore = 0;
  let totalApplicableWeight = 0;

  const componentBreakdown = components.map(comp => {
    let obtainedPct = 0;

    if (comp.isQuizType) {
      obtainedPct = quizAveragePct;
    } else {
      const recorded = course.componentScores?.find(c => c.componentId === comp.id || c.componentName === comp.name);
      obtainedPct = recorded ? recorded.obtainedPercent : 0;
    }

    const weightedScore = (obtainedPct * comp.weightPercent) / 100;
    totalWeightedScore += weightedScore;
    totalApplicableWeight += comp.weightPercent;

    return {
      name: comp.name,
      weight: comp.weightPercent,
      obtainedPct,
      weightedScore,
    };
  });

  // Normalize if total components sum is not exactly 100
  let finalScorePercent = totalWeightedScore;
  if (totalApplicableWeight > 0 && totalApplicableWeight !== 100) {
    finalScorePercent = (totalWeightedScore / totalApplicableWeight) * 100;
  }

  finalScorePercent = Math.min(100, Math.max(0, finalScorePercent));
  const { letterGrade, gradePoint } = mapScoreToGrade(finalScorePercent, gradingScale);

  return {
    scorePercent: Number(finalScorePercent.toFixed(2)),
    gradePoint,
    letterGrade,
    componentBreakdown,
  };
}

/**
 * Computes Semester GPA: Σ(credit_i × grade_point_i) / Σ(credit_i)
 */
export function calculateSemesterGPA(
  semester: Semester,
  theoryComponents: AssessmentComponent[],
  sessionalComponents: AssessmentComponent[],
  gradingScale: GradingScaleEntry[]
): SemesterCalculation {
  let totalCredits = 0;
  let earnedCredits = 0;
  let totalGradePoints = 0;

  const courseResults = semester.courses.map(course => {
    const result = calculateCourseResult(course, theoryComponents, sessionalComponents, gradingScale);
    const credit = Number(course.credit) || 0;
    totalCredits += credit;

    if (result.gradePoint > 0) {
      earnedCredits += credit;
    }

    totalGradePoints += credit * result.gradePoint;

    return {
      courseId: course.id,
      courseCode: course.courseCode,
      courseTitle: course.courseTitle,
      credit,
      courseType: course.courseType,
      scorePercent: result.scorePercent,
      gradePoint: result.gradePoint,
      letterGrade: result.letterGrade,
      isPassed: result.gradePoint > 0,
    };
  });

  const gpa = totalCredits > 0 ? Number((totalGradePoints / totalCredits).toFixed(2)) : 0.0;

  return {
    semesterId: semester.id,
    label: semester.label,
    level: semester.level,
    semester: semester.semester,
    totalCredits: Number(totalCredits.toFixed(2)),
    earnedCredits: Number(earnedCredits.toFixed(2)),
    gpa,
    totalGradePoints: Number(totalGradePoints.toFixed(2)),
    courseResults,
  };
}

/**
 * Computes Overall CGPA across all active/completed semesters, with target delta & required GPA calculator.
 */
export function calculateOverallCGPA(
  semesters: Semester[],
  theoryComponents: AssessmentComponent[],
  sessionalComponents: AssessmentComponent[],
  gradingScale: GradingScaleEntry[],
  targetCgpa: number = 3.75,
  programTotalCredits: number = 161.0
): OverallCalculation {
  const semesterCalculations = semesters.map(sem =>
    calculateSemesterGPA(sem, theoryComponents, sessionalComponents, gradingScale)
  );

  // We consider courses in completed semesters OR semesters with some entered grades
  let totalCreditsAttempted = 0;
  let totalCreditsEarned = 0;
  let totalQualityPoints = 0;

  const gradeCounts: Record<string, { count: number; creditTotal: number; gradePoint: number }> = {};
  gradingScale.forEach(scale => {
    gradeCounts[scale.letterGrade] = { count: 0, creditTotal: 0, gradePoint: scale.gradePoint };
  });

  semesterCalculations.forEach(semCalc => {
    // Check if semester has any non-zero grades or is marked completed
    const hasGrades = semCalc.courseResults.some(c => c.scorePercent > 0 || c.gradePoint > 0);
    if (hasGrades) {
      totalCreditsAttempted += semCalc.totalCredits;
      totalCreditsEarned += semCalc.earnedCredits;
      totalQualityPoints += semCalc.totalGradePoints;

      semCalc.courseResults.forEach(c => {
        if (gradeCounts[c.letterGrade]) {
          gradeCounts[c.letterGrade].count += 1;
          gradeCounts[c.letterGrade].creditTotal += c.credit;
        } else {
          gradeCounts[c.letterGrade] = { count: 1, creditTotal: c.credit, gradePoint: c.gradePoint };
        }
      });
    }
  });

  const cgpa = totalCreditsAttempted > 0 ? Number((totalQualityPoints / totalCreditsAttempted).toFixed(2)) : 0.0;
  const creditCompletionPercentage = programTotalCredits > 0
    ? Number(Math.min(100, (totalCreditsEarned / programTotalCredits) * 100).toFixed(1))
    : 0;

  const targetDifference = Number((cgpa - targetCgpa).toFixed(2));
  const isTargetAchieved = cgpa >= targetCgpa && totalCreditsAttempted > 0;

  // Grade Distribution
  const totalGradedCourses = Object.values(gradeCounts).reduce((acc, curr) => acc + curr.count, 0);
  const gradeDistribution = Object.entries(gradeCounts).map(([letterGrade, data]) => ({
    letterGrade,
    gradePoint: data.gradePoint,
    count: data.count,
    creditTotal: data.creditTotal,
    percentage: totalGradedCourses > 0 ? Number(((data.count / totalGradedCourses) * 100).toFixed(1)) : 0,
  }));

  // Required GPA for remaining credits
  const remainingCredits = Math.max(0, Number((programTotalCredits - totalCreditsAttempted).toFixed(2)));
  let requiredGpaForRemaining: { remainingCredits: number; requiredGpa: number; isPossible: boolean; statusText: string } | undefined;

  if (remainingCredits > 0 && targetCgpa > 0) {
    // targetCGPA = (totalQualityPoints + (remainingCredits * reqGPA)) / programTotalCredits
    // => reqGPA = (targetCGPA * programTotalCredits - totalQualityPoints) / remainingCredits
    const neededQualityPoints = targetCgpa * programTotalCredits;
    const remainingQualityPointsNeeded = neededQualityPoints - totalQualityPoints;
    const reqGpa = remainingQualityPointsNeeded / remainingCredits;

    const roundedReqGpa = Number(reqGpa.toFixed(2));
    const isPossible = roundedReqGpa <= 4.00;

    let statusText = '';
    if (roundedReqGpa <= 0) {
      statusText = 'Target secured! Even with minimum passing grades, target will be met.';
    } else if (roundedReqGpa <= 3.25) {
      statusText = `Comfortable! Maintain an average GPA of ${roundedReqGpa.toFixed(2)} in remaining ${remainingCredits} credits.`;
    } else if (roundedReqGpa <= 3.75) {
      statusText = `Attainable with focus: Maintain an average GPA of ${roundedReqGpa.toFixed(2)} across remaining semesters.`;
    } else if (roundedReqGpa <= 4.00) {
      statusText = `Challenging: High precision required! You need an average GPA of ${roundedReqGpa.toFixed(2)} / 4.00.`;
    } else {
      statusText = `Mathematically out of reach for a ${targetCgpa.toFixed(2)} CGPA. Highest achievable CGPA is ${( (totalQualityPoints + remainingCredits * 4.0) / programTotalCredits ).toFixed(2)}.`;
    }

    requiredGpaForRemaining = {
      remainingCredits,
      requiredGpa: Math.max(0, roundedReqGpa),
      isPossible,
      statusText,
    };
  }

  return {
    cgpa,
    totalCreditsAttempted: Number(totalCreditsAttempted.toFixed(2)),
    totalCreditsEarned: Number(totalCreditsEarned.toFixed(2)),
    programTotalCredits,
    creditCompletionPercentage,
    targetCgpa,
    targetDifference,
    isTargetAchieved,
    semesterCalculations,
    gradeDistribution,
    requiredGpaForRemaining,
  };
}
