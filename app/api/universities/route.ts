import { NextResponse } from 'next/server';
import { UNIVERSITY_PRESETS } from '@/data/presets';

export async function GET() {
  const list = UNIVERSITY_PRESETS.map(p => ({
    id: p.id,
    name: p.name,
    shortName: p.shortName,
    departmentCount: p.departments.length,
    departments: p.departments.map(d => ({
      id: d.id,
      name: d.name,
      programTotalCredits: d.programTotalCredits,
      totalSemesters: d.semesters.length,
    })),
  }));

  return NextResponse.json({
    success: true,
    data: list,
  });
}
