import { NextRequest, NextResponse } from 'next/server';
import { UNIVERSITY_PRESETS } from '@/data/presets';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const preset = UNIVERSITY_PRESETS.find(p => p.id === id);

  if (!preset) {
    return NextResponse.json(
      { success: false, error: 'University preset not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: preset,
  });
}
