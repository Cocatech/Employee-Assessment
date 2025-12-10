/**
 * Data Adapter
 * สลับระหว่าง Mock API และ SharePoint ตาม environment variable
 */

import { Employee } from '@/types/user';
import { AssessmentQuestion, Assessment, AssessmentResponse } from '@/types/assessment';
import {
  mockEmployeeClient,
  mockAssessmentClient,
  mockQuestionClient,
  mockResponseClient,
} from './mock-client';

const USE_MOCK_API = process.env.USE_MOCK_API === 'true';

function transformMockEmployee(data: any): Employee {
  return {
    empCode: data.empCode,
    empName_Eng: data.empName_Eng,
    empName_Thai: data.empName_Thai,
    email: data.email,
    phoneNumber: data.phoneNumber,
    position: data.position,
    group: data.group,
    team: data.team,
    assessmentLevel: data.assessmentLevel,
    employeeType: data.employeeType,
    approver1_ID: data.approver1_ID,
    approver2_ID: data.approver2_ID,
    gm_ID: data.gm_ID,
    joinDate: data.joinDate,
    warningCount: data.warningCount || 0,
  };
}

export const employeeAdapter = {
  async getAll(params?: { group?: string; employeeType?: string; search?: string }): Promise<Employee[]> {
    if (USE_MOCK_API) {
      const data = await mockEmployeeClient.getAll(params);
      return data.map(transformMockEmployee);
    } else {
      const { getEmployees } = await import('@/actions/employees');
      return await getEmployees();
    }
  },

  async getByEmpCode(empCode: string): Promise<Employee | null> {
    if (USE_MOCK_API) {
      const data = await mockEmployeeClient.getByEmpCode(empCode);
      return data ? transformMockEmployee(data) : null;
    } else {
      const { getEmployeeByCode } = await import('@/lib/graph/sharepoint');
      const result = await getEmployeeByCode(empCode);
      return result || null;
    }
  },

  async create(employee: Partial<Employee>): Promise<Employee> {
    if (USE_MOCK_API) {
      const data = await mockEmployeeClient.create({
        ...employee,
        id: Date.now(),
        warningCount: employee.warningCount || 0,
      });
      return transformMockEmployee(data);
    } else {
      throw new Error('SharePoint employee creation not implemented yet');
    }
  },

  async update(empCode: string, employee: Partial<Employee>): Promise<Employee> {
    if (USE_MOCK_API) {
      const existing = await mockEmployeeClient.getByEmpCode(empCode);
      if (!existing) {
        throw new Error(`Employee with empCode ${empCode} not found`);
      }
      const data = await mockEmployeeClient.update(existing.id, {
        ...existing,
        ...employee,
      });
      return transformMockEmployee(data);
    } else {
      throw new Error('SharePoint employee update not implemented yet');
    }
  },

  async delete(empCode: string): Promise<void> {
    if (USE_MOCK_API) {
      const existing = await mockEmployeeClient.getByEmpCode(empCode);
      if (!existing) {
        throw new Error(`Employee with empCode ${empCode} not found`);
      }
      await mockEmployeeClient.delete(existing.id);
    } else {
      throw new Error('SharePoint employee deletion not implemented yet');
    }
  },
};

export const questionAdapter = {
  async getAll(params?: { level?: string; category?: string }): Promise<AssessmentQuestion[]> {
    if (USE_MOCK_API) {
      return await mockQuestionClient.getAll(params);
    } else {
      throw new Error('SharePoint questions not implemented yet');
    }
  },

  async create(question: Partial<AssessmentQuestion>): Promise<AssessmentQuestion> {
    if (USE_MOCK_API) {
      const result = await mockQuestionClient.create({
        ...question,
        id: Date.now(),
      });
      return result as AssessmentQuestion;
    } else {
      throw new Error('SharePoint questions not implemented yet');
    }
  },

  async update(id: number, question: Partial<AssessmentQuestion>): Promise<AssessmentQuestion> {
    if (USE_MOCK_API) {
      const result = await mockQuestionClient.update(id, question);
      return result as AssessmentQuestion;
    } else {
      throw new Error('SharePoint questions not implemented yet');
    }
  },

  async delete(id: number): Promise<void> {
    if (USE_MOCK_API) {
      await mockQuestionClient.delete(id);
    } else {
      throw new Error('SharePoint questions not implemented yet');
    }
  },
};

function transformMockAssessment(data: any): Assessment {
  console.log('Transform Mock Assessment - Input:', {
    id: data.id,
    employeeId: data.employeeId,
    hasEmployeeId: 'employeeId' in data,
    allKeys: Object.keys(data)
  });
  
  const result = {
    id: data.id,
    title: data.title,
    description: data.description,
    type: data.type || 'self',
    assessmentType: data.assessmentType,
    status: data.status,
    employeeId: data.employeeId,
    assessorId: data.assessorId,
    periodStart: data.periodStart,
    periodEnd: data.periodEnd,
    dueDate: data.dueDate,
    completedAt: data.completedAt,
    score: data.score,
    finalScore: data.finalScore,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    submittedAt: data.submittedAt,
    approvedAt: data.approvedAt,
  };
  
  console.log('Transform Mock Assessment - Output:', {
    id: result.id,
    employeeId: result.employeeId
  });
  
  return result;
}

export const assessmentAdapter = {
  async getAll(params?: { empCode?: string; year?: number; status?: string }): Promise<Assessment[]> {
    if (USE_MOCK_API) {
      const data = await mockAssessmentClient.getAll(params);
      return data.map(transformMockAssessment);
    } else {
      throw new Error('SharePoint assessments not implemented yet');
    }
  },

  async getById(id: string): Promise<Assessment | null> {
    if (USE_MOCK_API) {
      const data = await mockAssessmentClient.getById(id);
      return data ? transformMockAssessment(data) : null;
    } else {
      throw new Error('SharePoint assessments not implemented yet');
    }
  },

  async create(assessment: Partial<Assessment>): Promise<Assessment> {
    if (USE_MOCK_API) {
      const result = await mockAssessmentClient.create({
        ...assessment,
        id: `ASS-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return result as Assessment;
    } else {
      throw new Error('SharePoint assessments not implemented yet');
    }
  },

  async update(id: string, assessment: Partial<Assessment>): Promise<Assessment> {
    if (USE_MOCK_API) {
      const existing = await mockAssessmentClient.getById(id);
      if (!existing) {
        throw new Error(`Assessment ${id} not found`);
      }
      const result = await mockAssessmentClient.update(existing.id, {
        ...assessment,
        updatedAt: new Date().toISOString(),
      });
      return result as Assessment;
    } else {
      throw new Error('SharePoint assessments not implemented yet');
    }
  },

  async delete(id: string): Promise<void> {
    if (USE_MOCK_API) {
      const existing = await mockAssessmentClient.getById(id);
      if (!existing) {
        throw new Error(`Assessment ${id} not found`);
      }
      await mockAssessmentClient.delete(existing.id);
    } else {
      throw new Error('SharePoint assessments not implemented yet');
    }
  },
};

export const responseAdapter = {
  async getAll(params?: { assessmentId?: string }): Promise<AssessmentResponse[]> {
    if (USE_MOCK_API) {
      return await mockResponseClient.getAll(params);
    } else {
      throw new Error('SharePoint responses not implemented yet');
    }
  },

  async create(response: Partial<AssessmentResponse>): Promise<AssessmentResponse> {
    if (USE_MOCK_API) {
      const result = await mockResponseClient.create({
        ...response,
        id: Date.now(),
      });
      return result as AssessmentResponse;
    } else {
      throw new Error('SharePoint responses not implemented yet');
    }
  },

  async update(id: number, response: Partial<AssessmentResponse>): Promise<AssessmentResponse> {
    if (USE_MOCK_API) {
      const result = await mockResponseClient.update(id, response);
      return result as AssessmentResponse;
    } else {
      throw new Error('SharePoint responses not implemented yet');
    }
  },
};

export function isUsingMockAPI(): boolean {
  return USE_MOCK_API;
}
