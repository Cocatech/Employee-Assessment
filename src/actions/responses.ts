'use server';

import { revalidatePath } from 'next/cache';
import { AssessmentResponse } from '@/types/assessment';
import { responseAdapter, isUsingMockAPI } from '@/lib/api/data-adapter';
import { getListItems, createListItem, updateListItem, deleteListItem } from '@/lib/graph/sharepoint';

const RESPONSES_LIST = 'TRTH_Responses';

/**
 * Get all responses for an assessment (ใช้ adapter)
 */
export async function getResponsesByAssessment(assessmentId: string): Promise<AssessmentResponse[]> {
  try {
    if (isUsingMockAPI()) {
      return await responseAdapter.getAll({ assessmentId });
    }

    // SharePoint implementation
    const items = await getListItems(RESPONSES_LIST);
    return items
      .filter(item => item.fields.AssessmentId === assessmentId)
      .map((item) => ({
        id: item.id,
        assessmentId: item.fields.AssessmentId as string,
        questionId: item.fields.QuestionId as string,
        questionTitle: item.fields.QuestionTitle as string,
        questionWeight: item.fields.QuestionWeight as number,
        scoreSelf: item.fields.ScoreSelf as number | undefined,
        scoreMgr: item.fields.ScoreMgr as number | undefined,
        scoreAppr2: item.fields.ScoreAppr2 as number | undefined,
        scoreGm: item.fields.ScoreGm as number | undefined,
        commentSelf: item.fields.CommentSelf as string | undefined,
        commentMgr: item.fields.CommentMgr as string | undefined,
        commentAppr2: item.fields.CommentAppr2 as string | undefined,
        commentGm: item.fields.CommentGm as string | undefined,
        rating: item.fields.ScoreSelf as number || 0, // Legacy field
        createdAt: item.createdDateTime,
        updatedAt: item.lastModifiedDateTime,
      }));
  } catch (error) {
    console.error('Error fetching responses:', error);
    // Return empty array instead of throwing to prevent page crash
    return [];
  }
}

/**
 * Create a new response (ใช้ adapter)
 */
export async function createResponse(data: Omit<AssessmentResponse, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    if (isUsingMockAPI()) {
      await responseAdapter.create(data);
      revalidatePath(`/dashboard/assessments/${data.assessmentId}`);
      return { success: true };
    }

    // SharePoint implementation
    await createListItem(RESPONSES_LIST, {
      Title: `Response-${data.assessmentId}-${data.questionId}`,
      AssessmentId: data.assessmentId,
      QuestionId: data.questionId,
      QuestionTitle: data.questionTitle,
      QuestionWeight: data.questionWeight,
      ScoreSelf: data.scoreSelf,
      ScoreMgr: data.scoreMgr,
      ScoreAppr2: data.scoreAppr2,
      ScoreGm: data.scoreGm,
      CommentSelf: data.commentSelf,
      CommentMgr: data.commentMgr,
      CommentAppr2: data.commentAppr2,
      CommentGm: data.commentGm,
    });
    
    revalidatePath(`/dashboard/assessments/${data.assessmentId}`);
    return { success: true };
  } catch (error) {
    console.error('Error creating response:', error);
    return { success: false, error: 'Failed to create response' };
  }
}

/**
 * Update an existing response (ใช้ adapter)
 */
export async function updateResponse(id: string, data: Partial<AssessmentResponse>) {
  try {
    if (isUsingMockAPI()) {
      await responseAdapter.update(Number(id), data);
      if (data.assessmentId) {
        revalidatePath(`/dashboard/assessments/${data.assessmentId}`);
      }
      return { success: true };
    }

    // SharePoint implementation
    await updateListItem(RESPONSES_LIST, id, {
      ...(data.scoreSelf !== undefined && { ScoreSelf: data.scoreSelf }),
      ...(data.scoreMgr !== undefined && { ScoreMgr: data.scoreMgr }),
      ...(data.scoreAppr2 !== undefined && { ScoreAppr2: data.scoreAppr2 }),
      ...(data.scoreGm !== undefined && { ScoreGm: data.scoreGm }),
      ...(data.commentSelf !== undefined && { CommentSelf: data.commentSelf }),
      ...(data.commentMgr !== undefined && { CommentMgr: data.commentMgr }),
      ...(data.commentAppr2 !== undefined && { CommentAppr2: data.commentAppr2 }),
      ...(data.commentGm !== undefined && { CommentGm: data.commentGm }),
    });
    
    if (data.assessmentId) {
      revalidatePath(`/dashboard/assessments/${data.assessmentId}`);
    }
    return { success: true };
  } catch (error) {
    console.error('Error updating response:', error);
    return { success: false, error: 'Failed to update response' };
  }
}

/**
 * Delete a response (ใช้ adapter)
 */
export async function deleteResponse(id: string, assessmentId?: string) {
  try {
    if (isUsingMockAPI()) {
      // responseAdapter doesn't have delete method, will add if needed
      throw new Error('Delete response not implemented for mock API yet');
    }

    // SharePoint implementation
    await deleteListItem(RESPONSES_LIST, id);
    
    if (assessmentId) {
      revalidatePath(`/dashboard/assessments/${assessmentId}`);
    }
    return { success: true };
  } catch (error) {
    console.error('Error deleting response:', error);
    return { success: false, error: 'Failed to delete response' };
  }
}

/**
 * Calculate total score from responses
 */
export async function calculateAssessmentScore(assessmentId: string): Promise<number> {
  try {
    const responses = await getResponsesByAssessment(assessmentId);
    
    let totalWeightedScore = 0;
    let totalWeight = 0;

    responses.forEach(response => {
      // Use the latest score available (priority: GM > Approver2 > Manager > Self)
      const score = response.scoreGm ?? response.scoreAppr2 ?? response.scoreMgr ?? response.scoreSelf ?? 0;
      const weight = response.questionWeight ?? 0;
      
      totalWeightedScore += score * weight;
      totalWeight += weight;
    });

    // Calculate weighted average
    const finalScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
    
    return Math.round(finalScore * 100) / 100; // Round to 2 decimal places
  } catch (error) {
    console.error('Error calculating assessment score:', error);
    return 0;
  }
}
