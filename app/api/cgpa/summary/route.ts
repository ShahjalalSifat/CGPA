import { NextRequest, NextResponse } from 'next/server';
import { calculateOverallCGPA } from '@/lib/calculations';
import { Semester, AssessmentComponent, GradingScaleEntry } from '@/types/cgpa';
import { DEFAULT_HSTU_GRADING_SCALE, DEFAULT_THEORY_COMPONENTS, DEFAULT_SESSIONAL_COMPONENTS } from '@/data/presets';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      semesters = [],
      theoryComponents = DEFAULT_THEORY_COMPONENTS,
      sessionalComponents = DEFAULT_SESSIONAL_COMPONENTS,
      gradingScale = DEFAULT_HSTU_GRADING_SCALE,
      targetCgpa = 3.75,
      programTotalCredits = 161.0,
    } = body as {
      semesters: Semester[];
      theoryComponents?: AssessmentComponent[];
      sessionalComponents?: AssessmentComponent[];
      gradingScale?: GradingScaleEntry[];
      targetCgpa?: number;
      programTotalCredits?: number;
    };

    const summary = calculateOverallCGPA(
      semesters,
      theoryComponents,
      sessionalComponents,
      gradingScale,
      targetCgpa,
      programTotalCredits
    );

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Invalid calculation payload' },
      { status: 400 }
    );
  }
}
