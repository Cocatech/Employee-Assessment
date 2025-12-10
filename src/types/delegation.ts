/**
 * Delegation type definitions
 */

export type DelegationPermission = 
  | 'MANAGE_EMPLOYEES'     // Create, Edit, Delete employees
  | 'MANAGE_ASSESSMENTS'   // Create, Edit, Delete assessments (Admin privilege)
  | 'VIEW_REPORTS'         // View all reports and statistics
  | 'MANAGE_QUESTIONS';    // Manage question bank

export interface Delegation {
  id: string;
  delegatorId: string;        // Admin who grants (empCode)
  delegateeId: string;        // Employee who receives (empCode)
  permission: DelegationPermission;
  startDate: string;          // ISO date string
  endDate: string;            // ISO date string
  reason?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  revokedAt?: string;
  revokedBy?: string;
}

export interface DelegationWithNames extends Delegation {
  delegatorName?: string;
  delegateeName?: string;
}
