import { NextRequest, NextResponse } from 'next/server';
import { createResponse, updateResponse } from '@/actions/responses';
import { getResponsesByAssessment } from '@/actions/responses';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { responses } = body;

    if (!Array.isArray(responses) || responses.length === 0) {
      return NextResponse.json(
        { error: 'Invalid responses data' },
        { status: 400 }
      );
    }

    // ดึงคำตอบที่มีอยู่แล้ว
    const assessmentId = responses[0].assessmentId;
    const existingResponses = await getResponsesByAssessment(assessmentId);

    // สร้าง map ของคำตอบเดิมตาม questionId
    const existingMap = new Map(
      existingResponses.map(r => [r.questionId, r])
    );

    const results = [];

    // บันทึกหรืออัปเดตแต่ละคำตอบ
    for (const response of responses) {
      const existing = existingMap.get(response.questionId);

      if (existing) {
        // อัปเดตคำตอบเดิม
        const updated = await updateResponse(existing.id, {
          scoreSelf: response.scoreSelf,
          commentSelf: response.commentSelf,
        });
        results.push(updated);
      } else {
        // สร้างคำตอบใหม่
        const created = await createResponse({
          assessmentId: response.assessmentId,
          questionId: response.questionId,
          scoreSelf: response.scoreSelf,
          commentSelf: response.commentSelf,
        });
        results.push(created);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Responses saved successfully',
      count: results.length 
    });

  } catch (error) {
    console.error('Error saving responses:', error);
    return NextResponse.json(
      { error: 'Failed to save responses' },
      { status: 500 }
    );
  }
}
