'use server';

import { revalidatePath } from 'next/cache';
import { AssessmentQuestion } from '@/types/assessment';
import { questionAdapter, isUsingMockAPI } from '@/lib/api/data-adapter';
import { getListItems, createListItem, updateListItem, deleteListItem } from '@/lib/graph/sharepoint';

const QUESTIONS_LIST = 'TRTH_Questions';

/**
 * Get all questions (ใช้ adapter)
 */
export async function getQuestions(params?: { level?: string; category?: string }): Promise<AssessmentQuestion[]> {
  try {
    if (isUsingMockAPI()) {
      return await questionAdapter.getAll(params);
    }

    // SharePoint implementation
    const items = await getListItems(QUESTIONS_LIST);
    return items.map((item) => ({
      id: item.id,
      questionTitle: item.fields.Title as string,
      description: item.fields.Description as string,
      category: item.fields.Category as AssessmentQuestion['category'],
      weight: item.fields.Weight as number,
      maxScore: 5, // Default
      order: item.fields.Order as number,
      isActive: item.fields.IsActive as boolean,
      applicableLevel: item.fields.ApplicableLevel as AssessmentQuestion['applicableLevel'],
      createdAt: item.createdDateTime,
      updatedAt: item.lastModifiedDateTime,
    }));
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw new Error('Failed to fetch questions');
  }
}

/**
 * Get questions by assessment level
 */
export async function getQuestionsByLevel(level: string): Promise<AssessmentQuestion[]> {
  try {
    if (isUsingMockAPI()) {
      const allQuestions = await questionAdapter.getAll();
      return allQuestions.filter(q => 
        q.applicableLevel === level || q.applicableLevel === 'All'
      );
    }

    // SharePoint implementation with filter
    const items = await getListItems(QUESTIONS_LIST);
    return items
      .filter(item => 
        item.fields.ApplicableLevel === level || 
        item.fields.ApplicableLevel === 'All'
      )
      .map((item) => ({
        id: item.id,
        questionTitle: item.fields.Title as string,
        description: item.fields.Description as string,
        category: item.fields.Category as AssessmentQuestion['category'],
        weight: item.fields.Weight as number,
        maxScore: 5,
        order: item.fields.Order as number,
        isActive: item.fields.IsActive as boolean,
        applicableLevel: item.fields.ApplicableLevel as AssessmentQuestion['applicableLevel'],
        createdAt: item.createdDateTime,
        updatedAt: item.lastModifiedDateTime,
      }));
  } catch (error) {
    console.error('Error fetching questions by level:', error);
    throw new Error('Failed to fetch questions by level');
  }
}

/**
 * Create a new question (ใช้ adapter)
 */
export async function createQuestion(data: Omit<AssessmentQuestion, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    if (isUsingMockAPI()) {
      await questionAdapter.create(data);
      revalidatePath('/admin/questions');
      revalidatePath('/dashboard/questions');
      return { success: true };
    }

    // SharePoint implementation
    await createListItem(QUESTIONS_LIST, {
      Title: data.questionTitle,
      Description: data.description,
      Category: data.category,
      Weight: data.weight,
      Order: data.order,
      IsActive: data.isActive,
      ApplicableLevel: data.applicableLevel,
    });
    
    revalidatePath('/admin/questions');
    revalidatePath('/dashboard/questions');
    return { success: true };
  } catch (error) {
    console.error('Error creating question:', error);
    return { success: false, error: 'Failed to create question' };
  }
}

/**
 * Update an existing question (ใช้ adapter)
 */
export async function updateQuestion(id: string, data: Partial<AssessmentQuestion>) {
  try {
    if (isUsingMockAPI()) {
      await questionAdapter.update(Number(id), data);
      revalidatePath('/admin/questions');
      revalidatePath('/dashboard/questions');
      return { success: true };
    }

    // SharePoint implementation
    await updateListItem(QUESTIONS_LIST, id, {
      ...(data.questionTitle && { Title: data.questionTitle }),
      ...(data.description !== undefined && { Description: data.description }),
      ...(data.category && { Category: data.category }),
      ...(data.weight !== undefined && { Weight: data.weight }),
      ...(data.order !== undefined && { Order: data.order }),
      ...(data.isActive !== undefined && { IsActive: data.isActive }),
      ...(data.applicableLevel && { ApplicableLevel: data.applicableLevel }),
    });
    
    revalidatePath('/admin/questions');
    revalidatePath('/dashboard/questions');
    return { success: true };
  } catch (error) {
    console.error('Error updating question:', error);
    return { success: false, error: 'Failed to update question' };
  }
}

/**
 * Delete a question (ใช้ adapter)
 */
export async function deleteQuestion(id: string) {
  try {
    if (isUsingMockAPI()) {
      await questionAdapter.delete(Number(id));
      revalidatePath('/admin/questions');
      revalidatePath('/dashboard/questions');
      return { success: true };
    }

    // SharePoint implementation
    await deleteListItem(QUESTIONS_LIST, id);
    
    revalidatePath('/admin/questions');
    revalidatePath('/dashboard/questions');
    return { success: true };
  } catch (error) {
    console.error('Error deleting question:', error);
    return { success: false, error: 'Failed to delete question' };
  }
}
