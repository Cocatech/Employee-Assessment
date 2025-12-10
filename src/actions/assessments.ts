'use server';

import { prisma, findAssessmentById, findAssessmentsByEmployee, findAssessmentsByPeriod, findPendingAssessments } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import type { Assessment } from '@/types';

/**
 * Get all assessments with optional filters
 */
export async function getAssessments(params?: { 
  empCode?: string; 
  status?: string;
  year?: number;
  quarter?: number;
}): Promise<Assessment[]> {
  try {
    const where: any = {};
    
    if (params?.empCode) where.employeeId = params.empCode;
    if (params?.status) where.status = params.status;
    if (params?.year && params?.quarter) {
      const startDate = new Date(params.year, (params.quarter - 1) * 3, 1);
      const endDate = new Date(params.year, params.quarter * 3, 0);
      where.AND = [
        { periodStart: { gte: startDate } },
        { periodEnd: { lte: endDate } }
      ];
    }

    const assessments = await prisma.assessment.findMany({
      where,
      include: {
        employee: true,
        assessor: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return assessments.map((assessment) => ({
      id: assessment.id,
      title: assessment.title || '',
      description: assessment.description || undefined,
      type: assessment.assessmentType as Assessment['type'],
      assessmentType: assessment.assessmentType as Assessment['assessmentType'],
      status: assessment.status as Assessment['status'],
      employeeId: assessment.employeeId,
      assessorId: assessment.assessorId || '',
      periodStart: assessment.periodStart.toISOString(),
      periodEnd: assessment.periodEnd.toISOString(),
      dueDate: assessment.dueDate?.toISOString() || '',
      completedAt: assessment.completedAt?.toISOString() || undefined,
      score: assessment.score || undefined,
      finalScore: assessment.finalScore || undefined,
      createdAt: assessment.createdAt.toISOString(),
      updatedAt: assessment.updatedAt.toISOString(),
      submittedAt: assessment.submittedAt?.toISOString() || undefined,
      approvedAt: assessment.approvedAt?.toISOString() || undefined,
    }));
  } catch (error) {
    console.error('Error fetching assessments:', error);
    throw new Error('Failed to fetch assessments');
  }
}

/**
 * Get single assessment by ID
 */
export async function getAssessment(id: string) {
  try {
    const assessment = await findAssessmentById(id);
    
    if (!assessment) {
      return { success: false, error: 'Assessment not found' };
    }

    return {
      success: true,
      data: {
        id: assessment.id,
        title: assessment.title || '',
        description: assessment.description || undefined,
        type: assessment.assessmentType,
        assessmentType: assessment.assessmentType,
        status: assessment.status,
        employeeId: assessment.employeeId,
        assessorId: assessment.assessorId || '',
        periodStart: assessment.periodStart.toISOString(),
        periodEnd: assessment.periodEnd.toISOString(),
        dueDate: assessment.dueDate?.toISOString() || '',
        completedAt: assessment.completedAt?.toISOString() || undefined,
        score: assessment.score || undefined,
        finalScore: assessment.finalScore || undefined,
        createdAt: assessment.createdAt.toISOString(),
        updatedAt: assessment.updatedAt.toISOString(),
        submittedAt: assessment.submittedAt?.toISOString() || undefined,
        approvedAt: assessment.approvedAt?.toISOString() || undefined,
        employee: assessment.employee,
        responses: assessment.responses,
      },
    };
  } catch (error) {
    console.error('Error fetching assessment:', error);
    return { success: false, error: 'Failed to fetch assessment' };
  }
}

/**
 * Create a new assessment
 */
export async function createAssessment(data: Omit<Assessment, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const result = await prisma.assessment.create({
      data: {
        title: data.title,
        description: data.description || null,
        assessmentType: data.assessmentType || data.type,
        status: data.status || 'Pending',
        employeeId: data.employeeId,
        assessorId: data.assessorId || null,
        periodStart: new Date(data.periodStart),
        periodEnd: new Date(data.periodEnd),
        dueDate: data.dueDate ? new Date(data.dueDate) : new Date(),
      },
    });
    
    revalidatePath('/dashboard/assessments');
    revalidatePath('/admin/assessments');
    return { success: true, id: result.id };
  } catch (error) {
    console.error('Error creating assessment:', error);
    return { success: false, error: 'Failed to create assessment' };
  }
}

/**
 * Update an existing assessment
 */
export async function updateAssessment(id: string, data: Partial<Assessment>) {
  try {
    const updateData: any = {};
    
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description || null;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.score !== undefined) updateData.score = data.score;
    if (data.finalScore !== undefined) updateData.finalScore = data.finalScore;
    if (data.completedAt !== undefined) updateData.completedAt = new Date(data.completedAt);
    if (data.submittedAt !== undefined) updateData.submittedAt = new Date(data.submittedAt);
    if (data.approvedAt !== undefined) updateData.approvedAt = new Date(data.approvedAt);

    const updated = await prisma.assessment.update({
      where: { id },
      data: updateData,
      include: {
        employee: true,
        assessor: true,
      },
    });
    
    revalidatePath('/dashboard/assessments');
    revalidatePath('/admin/assessments');
    revalidatePath(`/dashboard/assessments/${id}`);
    
    return {
      success: true,
      data: {
        id: updated.id,
        title: updated.title || '',
        description: updated.description || undefined,
        type: updated.assessmentType,
        assessmentType: updated.assessmentType,
        status: updated.status,
        employeeId: updated.employeeId,
        assessorId: updated.assessorId || '',
        periodStart: updated.periodStart.toISOString(),
        periodEnd: updated.periodEnd.toISOString(),
        dueDate: updated.dueDate?.toISOString() || '',
        completedAt: updated.completedAt?.toISOString() || undefined,
        score: updated.score || undefined,
        finalScore: updated.finalScore || undefined,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.error('Error updating assessment:', error);
    return { success: false, error: 'Failed to update assessment' };
  }
}

/**
 * Delete an assessment
 */
export async function deleteAssessment(id: string) {
  try {
    await prisma.assessment.delete({
      where: { id },
    });
    
    revalidatePath('/dashboard/assessments');
    revalidatePath('/admin/assessments');
    return { success: true };
  } catch (error) {
    console.error('Error deleting assessment:', error);
    return { success: false, error: 'Failed to delete assessment' };
  }
}

/**
 * Get assessments by employee
 */
export async function getAssessmentsByEmployee(empCode: string) {
  try {
    const assessments = await findAssessmentsByEmployee(empCode);
    return assessments.map((assessment) => ({
      id: assessment.id,
      title: assessment.title || '',
      type: assessment.assessmentType,
      status: assessment.status,
      assessmentDate: assessment.createdAt.toISOString(),
      totalScore: assessment.score,
      finalScore: assessment.finalScore,
    }));
  } catch (error) {
    console.error('Error fetching assessments by employee:', error);
    return [];
  }
}

/**
 * Get pending assessments
 */
export async function getPendingAssessments() {
  try {
    const assessments = await findPendingAssessments();
    return assessments.map((assessment) => ({
      id: assessment.id,
      title: assessment.title || '',
      employeeId: assessment.employeeId,
      employeeName: assessment.employee.empName_Eng,
      dueDate: assessment.dueDate?.toISOString(),
      status: assessment.status,
    }));
  } catch (error) {
    console.error('Error fetching pending assessments:', error);
    return [];
  }
}

/**
 * Submit assessment
 */
export async function submitAssessment(id: string) {
  try {
    await prisma.assessment.update({
      where: { id },
      data: {
        status: 'Submitted',
        submittedAt: new Date(),
      },
    });

    revalidatePath('/dashboard/assessments');
    revalidatePath(`/dashboard/assessments/${id}`);
    return { success: true };
  } catch (error) {
    console.error('Error submitting assessment:', error);
    return { success: false, error: 'Failed to submit assessment' };
  }
}

/**
 * Approve assessment
 */
export async function approveAssessment(id: string, finalScore: number) {
  try {
    await prisma.assessment.update({
      where: { id },
      data: {
        status: 'Completed',
        finalScore,
        approvedAt: new Date(),
        completedAt: new Date(),
      },
    });

    revalidatePath('/dashboard/assessments');
    revalidatePath(`/dashboard/assessments/${id}`);
    return { success: true };
  } catch (error) {
    console.error('Error approving assessment:', error);
    return { success: false, error: 'Failed to approve assessment' };
  }
}

/**
 * Get assessment statistics
 */
export async function getAssessmentStats(year?: number, quarter?: number) {
  try {
    const where: any = {};
    if (year) where.assessmentYear = year;
    if (quarter) where.assessmentQuarter = quarter;

    const total = await prisma.assessment.count({ where });

    const byStatus = await prisma.assessment.groupBy({
      by: ['status'],
      where,
      _count: true,
    });

    const avgScore = await prisma.assessment.aggregate({
      where: {
        ...where,
        status: 'Completed',
      },
      _avg: {
        totalScore: true,
        finalScore: true,
      },
    });

    return {
      success: true,
      data: {
        total,
        byStatus: byStatus.reduce((acc, item) => {
          acc[item.status] = item._count;
          return acc;
        }, {} as Record<string, number>),
        avgScore: avgScore._avg.totalScore || 0,
        avgFinalScore: avgScore._avg.finalScore || 0,
      },
    };
  } catch (error) {
    console.error('Error fetching assessment stats:', error);
    return { success: false, error: 'Failed to fetch statistics' };
  }
}
