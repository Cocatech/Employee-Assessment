'use server';

import { employeeAdapter, isUsingMockAPI } from '@/lib/api';
import { 
  getListItems, 
  createListItem, 
  updateListItem, 
  deleteListItem,
  getEmployeeByCode,
  queryEmployees 
} from '@/lib/graph/sharepoint';
import { revalidatePath } from 'next/cache';
import type { Employee } from '@/types';

const EMPLOYEES_LIST = 'TRTH_Master_Employee';

/**
 * Get all employees (ใช้ adapter สำหรับ mock/SharePoint)
 */
export async function getEmployees(): Promise<Employee[]> {
  try {
    // ใช้ adapter ที่จะสลับระหว่าง mock และ SharePoint อัตโนมัติ
    if (isUsingMockAPI()) {
      return await employeeAdapter.getAll();
    }
    
    // SharePoint implementation (เดิม)
    const items = await getListItems(EMPLOYEES_LIST);
    return items.map((item) => ({
      empCode: item.fields.Title as string,
      empName_Eng: item.fields.EmpName_Eng as string,
      empName_Thai: (item.fields.EmpName_Thai as string) || undefined,
      email: (item.fields.Email as string) || null,
      phoneNumber: (item.fields.PhoneNumber as string) || undefined,
      position: item.fields.Position as string,
      group: item.fields.Group as string,
      team: (item.fields.Team as string) || undefined,
      assessmentLevel: item.fields.AssessmentLevel as string,
      employeeType: (item.fields.EmployeeType as 'Permanent' | 'Temporary') || 'Permanent',
      approver1_ID: item.fields.Approver1_ID as string,
      approver2_ID: (item.fields.Approver2_ID as string) || null,
      gm_ID: item.fields.GM_ID as string,
      joinDate: item.fields.JoinDate as string,
      warningCount: (item.fields.WarningCount as number) || 0,
    }));
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw new Error('Failed to fetch employees');
  }
}

/**
 * Get single employee by code (ใช้ adapter)
 */
export async function getEmployee(empCode: string) {
  try {
    if (isUsingMockAPI()) {
      const employee = await employeeAdapter.getByEmpCode(empCode);
      if (!employee) {
        return { success: false, error: 'Employee not found' };
      }
      return { success: true, data: employee };
    }
    
    // SharePoint implementation (เดิม)
    const employee = await getEmployeeByCode(empCode);
    if (!employee) {
      return { success: false, error: 'Employee not found' };
    }
    return { success: true, data: employee };
  } catch (error) {
    console.error('Error fetching employee:', error);
    return { success: false, error: 'Failed to fetch employee' };
  }
}

/**
 * Search employees by query
 */
export async function searchEmployees(query: string) {
  try {
    if (!query.trim()) {
      return await getEmployees();
    }

    // Search by name or code
    const filter = `(substringof('${query}', fields/Title) or substringof('${query}', fields/EmpName_Eng) or substringof('${query}', fields/EmpName_Thai))`;
    const results = await queryEmployees(filter);
    return results;
  } catch (error) {
    console.error('Error searching employees:', error);
    return [];
  }
}

/**
 * Filter employees by group
 */
export async function getEmployeesByGroup(group: string) {
  try {
    const filter = `fields/Group eq '${group}'`;
    return await queryEmployees(filter);
  } catch (error) {
    console.error('Error filtering employees:', error);
    return [];
  }
}

/**
 * Filter employees by type
 */
export async function getEmployeesByType(type: 'Permanent' | 'Temporary') {
  try {
    const filter = `fields/EmployeeType eq '${type}'`;
    return await queryEmployees(filter);
  } catch (error) {
    console.error('Error filtering employees by type:', error);
    return [];
  }
}

/**
 * Create a new employee (ใช้ adapter)
 */
export async function createEmployee(data: Omit<Employee, 'empCode'> & { empCode: string }) {
  try {
    if (isUsingMockAPI()) {
      await employeeAdapter.create(data as Employee);
      revalidatePath('/admin/employees');
      revalidatePath('/dashboard/employees');
      return { success: true, id: data.empCode };
    }

    // SharePoint implementation
    const result = await createListItem(EMPLOYEES_LIST, {
      Title: data.empCode,
      EmpName_Eng: data.empName_Eng,
      EmpName_Thai: data.empName_Thai || '',
      Email: data.email || '',
      PhoneNumber: data.phoneNumber || '',
      Position: data.position,
      Group: data.group,
      Team: data.team || '',
      AssessmentLevel: data.assessmentLevel,
      EmployeeType: data.employeeType,
      Approver1_ID: data.approver1_ID,
      Approver2_ID: data.approver2_ID || '-',
      GM_ID: data.gm_ID,
      JoinDate: data.joinDate,
      WarningCount: data.warningCount || 0,
    });
    
    revalidatePath('/admin/employees');
    revalidatePath('/dashboard/employees');
    return { success: true, id: result.id };
  } catch (error) {
    console.error('Error creating employee:', error);
    return { success: false, error: 'Failed to create employee' };
  }
}

/**
 * Update an existing employee (ใช้ adapter)
 */
export async function updateEmployee(empCode: string, data: Partial<Employee>) {
  try {
    if (isUsingMockAPI()) {
      await employeeAdapter.update(empCode, data);
      revalidatePath('/admin/employees');
      revalidatePath('/dashboard/employees');
      return { success: true };
    }

    // SharePoint implementation
    const employees = await queryEmployees(`fields/Title eq '${empCode}'`);
    if (employees.length === 0) {
      return { success: false, error: 'Employee not found' };
    }

    const items = await getListItems(EMPLOYEES_LIST);
    const item = items.find(i => i.fields.Title === empCode);
    if (!item) {
      return { success: false, error: 'Employee not found' };
    }

    await updateListItem(EMPLOYEES_LIST, item.id, {
      ...(data.empName_Eng && { EmpName_Eng: data.empName_Eng }),
      ...(data.empName_Thai !== undefined && { EmpName_Thai: data.empName_Thai }),
      ...(data.email !== undefined && { Email: data.email }),
      ...(data.phoneNumber !== undefined && { PhoneNumber: data.phoneNumber }),
      ...(data.position && { Position: data.position }),
      ...(data.group && { Group: data.group }),
      ...(data.team !== undefined && { Team: data.team }),
      ...(data.assessmentLevel && { AssessmentLevel: data.assessmentLevel }),
      ...(data.employeeType && { EmployeeType: data.employeeType }),
      ...(data.approver1_ID && { Approver1_ID: data.approver1_ID }),
      ...(data.approver2_ID !== undefined && { Approver2_ID: data.approver2_ID || '-' }),
      ...(data.gm_ID && { GM_ID: data.gm_ID }),
      ...(data.joinDate && { JoinDate: data.joinDate }),
      ...(data.warningCount !== undefined && { WarningCount: data.warningCount }),
    });
    
    revalidatePath('/admin/employees');
    revalidatePath('/dashboard/employees');
    return { success: true };
  } catch (error) {
    console.error('Error updating employee:', error);
    return { success: false, error: 'Failed to update employee' };
  }
}

/**
 * Delete an employee (ใช้ adapter)
 */
export async function deleteEmployee(empCode: string) {
  try {
    if (isUsingMockAPI()) {
      await employeeAdapter.delete(empCode);
      revalidatePath('/admin/employees');
      revalidatePath('/dashboard/employees');
      return { success: true };
    }

    // SharePoint implementation
    const items = await getListItems(EMPLOYEES_LIST);
    const item = items.find(i => i.fields.Title === empCode);
    
    if (!item) {
      return { success: false, error: 'Employee not found' };
    }

    await deleteListItem(EMPLOYEES_LIST, item.id);
    
    revalidatePath('/admin/employees');
    revalidatePath('/dashboard/employees');
    return { success: true };
  } catch (error) {
    console.error('Error deleting employee:', error);
    return { success: false, error: 'Failed to delete employee' };
  }
}

/**
 * Get unique groups for filter
 */
export async function getGroups(): Promise<string[]> {
  try {
    const employees = await getEmployees();
    const groupSet = new Set(employees.map(emp => emp.group));
    const groups = Array.from(groupSet);
    return groups.sort();
  } catch (error) {
    console.error('Error fetching groups:', error);
    return [];
  }
}

/**
 * Get employee statistics
 */
export async function getEmployeeStats() {
  try {
    const employees = await getEmployees();
    
    const stats = {
      total: employees.length,
      permanent: employees.filter(e => e.employeeType === 'Permanent').length,
      temporary: employees.filter(e => e.employeeType === 'Temporary').length,
      byGroup: employees.reduce((acc, emp) => {
        acc[emp.group] = (acc[emp.group] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
    
    return { success: true, data: stats };
  } catch (error) {
    console.error('Error fetching employee stats:', error);
    return { success: false, error: 'Failed to fetch statistics' };
  }
}
