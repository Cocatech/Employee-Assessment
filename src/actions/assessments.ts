'use server';

import { getListItems, createListItem, updateListItem, deleteListItem } from '@/lib/graph/sharepoint';
import { revalidatePath } from 'next/cache';
import type { Assessment } from '@/types';

const ASSESSMENTS_LIST = 'Assessments';

/**
 * Get all assessments from SharePoint
 */
export async function getAssessments(): Promise<Assessment[]> {
  try {
    const items = await getListItems(ASSESSMENTS_LIST);
    return items.map((item) => ({
      id: item.id,
      title: item.fields.Title as string,
      description: item.fields.Description as string | undefined,
      type: item.fields.Type as Assessment['type'],
      status: item.fields.Status as Assessment['status'],
      employeeId: item.fields.EmployeeId as string,
      assessorId: item.fields.AssessorId as string,
      periodStart: item.fields.PeriodStart as string,
      periodEnd: item.fields.PeriodEnd as string,
      dueDate: item.fields.DueDate as string,
      completedAt: item.fields.CompletedAt as string | undefined,
      score: item.fields.Score as number | undefined,
      createdAt: item.createdDateTime,
      updatedAt: item.lastModifiedDateTime,
    }));
  } catch (error) {
    console.error('Error fetching assessments:', error);
    throw new Error('Failed to fetch assessments');
  }
}

/**
 * Create a new assessment in SharePoint
 */
export async function createAssessment(data: Omit<Assessment, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const result = await createListItem(ASSESSMENTS_LIST, {
      Title: data.title,
      Description: data.description,
      Type: data.type,
      Status: data.status,
      EmployeeId: data.employeeId,
      AssessorId: data.assessorId,
      PeriodStart: data.periodStart,
      PeriodEnd: data.periodEnd,
      DueDate: data.dueDate,
    });
    
    revalidatePath('/dashboard/assessments');
    return { success: true, id: result.id };
  } catch (error) {
    console.error('Error creating assessment:', error);
    return { success: false, error: 'Failed to create assessment' };
  }
}

/**
 * Update an existing assessment in SharePoint
 */
export async function updateAssessment(id: string, data: Partial<Assessment>) {
  try {
    await updateListItem(ASSESSMENTS_LIST, id, {
      ...(data.title && { Title: data.title }),
      ...(data.description !== undefined && { Description: data.description }),
      ...(data.status && { Status: data.status }),
      ...(data.score !== undefined && { Score: data.score }),
      ...(data.completedAt && { CompletedAt: data.completedAt }),
    });
    
    revalidatePath('/dashboard/assessments');
    return { success: true };
  } catch (error) {
    console.error('Error updating assessment:', error);
    return { success: false, error: 'Failed to update assessment' };
  }
}

/**
 * Delete an assessment from SharePoint
 */
export async function deleteAssessment(id: string) {
  try {
    await deleteListItem(ASSESSMENTS_LIST, id);
    
    revalidatePath('/dashboard/assessments');
    return { success: true };
  } catch (error) {
    console.error('Error deleting assessment:', error);
    return { success: false, error: 'Failed to delete assessment' };
  }
}
