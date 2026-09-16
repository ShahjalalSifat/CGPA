import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { rows } = await req.json();

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No course rows provided' },
        { status: 400 }
      );
    }

    const validatedRows: Array<{
      level: number;
      semester: number;
      course_code: string;
      course_title: string;
      credit: number;
      course_type: 'theory' | 'sessional';
    }> = [];
    const errors: string[] = [];

    rows.forEach((r, idx) => {
      const level = parseInt(r.level, 10);
      const semester = parseInt(r.semester, 10);
      const credit = parseFloat(r.credit);
      const courseCode = (r.course_code || r.code || '').trim();
      const courseTitle = (r.course_title || r.title || '').trim();
      const rawType = (r.course_type || r.type || 'theory').toLowerCase();
      const courseType = rawType.includes('ses') || rawType.includes('lab') ? 'sessional' : 'theory';

      if (isNaN(level) || level < 1 || level > 6) {
        errors.push(`Row ${idx + 1}: Invalid level "${r.level}" (must be 1-6)`);
        return;
      }
      if (isNaN(semester) || (semester !== 1 && semester !== 2)) {
        errors.push(`Row ${idx + 1}: Invalid semester "${r.semester}" (must be 1 or 2)`);
        return;
      }
      if (!courseCode) {
        errors.push(`Row ${idx + 1}: Missing course code`);
        return;
      }
      if (isNaN(credit) || credit <= 0 || credit > 10) {
        errors.push(`Row ${idx + 1}: Invalid credit "${r.credit}" (must be between 0.5 and 10)`);
        return;
      }

      validatedRows.push({
        level,
        semester,
        course_code: courseCode,
        course_title: courseTitle || courseCode,
        credit,
        course_type: courseType,
      });
    });

    return NextResponse.json({
      success: true,
      validCount: validatedRows.length,
      errorCount: errors.length,
      errors,
      data: validatedRows,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Invalid import data' },
      { status: 400 }
    );
  }
}
