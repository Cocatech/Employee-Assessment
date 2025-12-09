import { NextRequest, NextResponse } from 'next/server';
import { updateAssessment } from '@/actions/assessments';
import { getAssessments } from '@/actions/assessments';
import { calculateAssessmentScore } from '@/actions/responses';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assessmentId, action, nextStatus } = body;

    if (!assessmentId || !action) {
      return NextResponse.json(
        { error: 'Assessment ID and action are required' },
        { status: 400 }
      );
    }

    // ดึงข้อมูล assessment
    const assessments = await getAssessments();
    const assessment = assessments.find(a => a.id === assessmentId);

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      );
    }

    if (action === 'reject') {
      // Reject assessment
      const updated = await updateAssessment(assessmentId, {
        status: 'REJECTED',
        updatedAt: new Date().toISOString(),
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Assessment rejected',
        assessment: updated 
      });
    }

    if (action === 'approve') {
      // Calculate scores
      const scores = await calculateAssessmentScore(assessmentId);

      // Update assessment with new status and scores
      const updateData: any = {
        status: nextStatus,
        updatedAt: new Date().toISOString(),
      };

      // Update score based on current status
      if (assessment.status === 'SUBMITTED_MGR') {
        updateData.score = scores.managerScore;
      } else if (assessment.status === 'SUBMITTED_APPR2') {
        updateData.score = scores.approver2Score;
      } else if (assessment.status === 'SUBMITTED_APPR3') {
        updateData.score = scores.approver3Score;
      } else if (assessment.status === 'SUBMITTED_GM') {
        updateData.finalScore = scores.finalScore;
        updateData.approvedAt = new Date().toISOString();
      }

      const updated = await updateAssessment(assessmentId, updateData);

      return NextResponse.json({ 
        success: true, 
        message: 'Assessment approved',
        assessment: updated,
        scores 
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error processing assessment approval:', error);
    return NextResponse.json(
      { error: 'Failed to process assessment' },
      { status: 500 }
    );
  }
}
