/**
 * Assessment type definitions
 */

export type AssessmentStatus = 'draft' | 'pending' | 'in_progress' | 'completed' | 'approved';
export type AssessmentType = 'self' | 'manager' | 'peer' | '360';

export interface Assessment {
  id: string;
  title: string;
  description?: string;
  type: AssessmentType;
  status: AssessmentStatus;
  employeeId: string;
  assessorId: string;
  periodStart: string;
  periodEnd: string;
  dueDate: string;
  completedAt?: string;
  score?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentQuestion {
  id: string;
  assessmentId: string;
  category: string;
  question: string;
  weight: number;
  order: number;
}

export interface AssessmentResponse {
  id: string;
  assessmentId: string;
  questionId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface AssessmentSummary {
  totalAssessments: number;
  completedAssessments: number;
  pendingAssessments: number;
  averageScore: number;
}
