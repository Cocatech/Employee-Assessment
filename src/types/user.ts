/**
 * User type definitions
 */
export interface User {
  id: string;
  email: string;
  name: string;
  department?: string;
  position?: string;
  managerId?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  manager?: User;
  directReports?: User[];
}

/**
 * Employee data from SharePoint Master_Employee list
 */
export interface Employee {
  empCode: string; // Title field
  empName_Eng: string;
  empName_Thai?: string; // Thai name
  email: string | null;
  phoneNumber?: string; // Contact number
  position: string;
  department: string;
  assessmentLevel: string;
  employeeType: 'Permanent' | 'Temporary'; // Staff type
  approver1_ID: string;
  approver2_ID: string | null;
  gm_ID: string;
  joinDate: string; // YYYY-MM-DD format
  warningCount: number;
}

/**
 * Extended User for Dual Authentication
 */
export interface ExtendedUser extends User {
  empCode?: string;
  role?: 'PERMANENT' | 'TEMP_USER' | 'MANAGER' | 'GM' | 'ADMIN';
  employee?: Employee;
}
