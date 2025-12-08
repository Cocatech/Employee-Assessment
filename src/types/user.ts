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
