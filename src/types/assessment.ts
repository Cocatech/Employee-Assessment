/**
 * Assessment type definitions
 */

export type AssessmentStatus = 
  | 'DRAFT' 
  | 'SUBMITTED_MGR' 
  | 'SUBMITTED_APPR2' 
  | 'SUBMITTED_GM' 
  | 'COMPLETED' 
  | 'REJECTED';

export type AssessmentType = 'self' | 'manager' | 'peer' | '360';

export interface Assessment {
  id: string;
  title: string;
  description?: string;
  type: AssessmentType;
  assessmentType: 'Annual' | 'Mid-year' | 'Probation' | 'Special'; // Assessment period type
  status: AssessmentStatus;
  employeeId: string;
  assessorId: string;
  periodStart: string;
  periodEnd: string;
  dueDate: string;
  completedAt?: string;
  score?: number;
  finalScore?: number; // Calculated final score
  createdAt: string;
  updatedAt: string;
  submittedAt?: string; // When first submitted
  approvedAt?: string; // When fully approved
}

export interface AssessmentQuestion {
  id: string;
  assessmentId: string;
  category: string;
  question: string;
  description?: string; // Detailed description/criteria
  weight: number;
  order: number;
  isActive: boolean; // Is this question currently in use
  applicableLevel?: string; // Which assessment levels this applies to
  createdAt?: string;
  updatedAt?: string;
}

export interface AssessmentResponse {
  id: string;
  assessmentId: string;
  questionId: string;
  questionTitle?: string; // For easy reference
  questionWeight?: number; // For easy calculation
  scoreSelf?: number; // Employee self-score (0-5)
  scoreMgr?: number; // Manager score (0-5)
  scoreAppr2?: number; // Approver2 score (0-5)
  scoreGm?: number; // GM score (0-5)
  commentSelf?: string; // Employee comment
  commentMgr?: string; // Manager comment
  commentAppr2?: string; // Approver2 comment
  commentGm?: string; // GM comment
  rating: number; // Legacy field (backward compatibility)
  comment?: string; // Legacy field (backward compatibility)
  createdAt: string;
  updatedAt?: string;
}

export interface AssessmentSummary {
  totalAssessments: number;
  completedAssessments: number;
  pendingAssessments: number;
  averageScore: number;
}

/**
 * KPI Item for Score Table
 */
export interface KPIItem {
  id: string;
  topic: string;
  weight: number;
  scoreSelf?: number;
  scoreMgr?: number;
  scoreAppr2?: number;
  scoreGm?: number;
  commentSelf?: string;
  commentMgr?: string;
  commentGm?: string;
}

/**
 * Enhanced Assessment with Approver workflow
 */
export interface AssessmentWorkflow {
  currentAssigneeEmail: string | null;
  approver1Email?: string;
  approver2Email?: string;
  gmEmail?: string;
  submittedAt?: string;
  approvedAt?: string;
}
