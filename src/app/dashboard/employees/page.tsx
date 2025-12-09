import { getEmployees, getGroups } from '@/actions/employees';
import { EmployeeTable } from '@/components/employees/EmployeeTable';
import { EmployeeFilters } from '@/components/employees/EmployeeFilters';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Plus, Users } from 'lucide-react';

export const metadata = {
  title: 'Employees | TRTH Assessment',
  description: 'Manage employee records',
};

export default async function DashboardEmployeesPage({
  searchParams,
}: {
  searchParams: { 
    search?: string; 
    group?: string; 
    type?: string;
  };
}) {
  const [employees, groups] = await Promise.all([
    getEmployees(),
    getGroups(),
  ]);

  // Filter employees based on search params
  let filteredEmployees = employees;

  if (searchParams.search) {
    const query = searchParams.search.toLowerCase();
    filteredEmployees = filteredEmployees.filter(
      (emp) =>
        emp.empCode.toLowerCase().includes(query) ||
        emp.empName_Eng.toLowerCase().includes(query) ||
        emp.empName_Thai?.toLowerCase().includes(query) ||
        emp.position.toLowerCase().includes(query)
    );
  }

  if (searchParams.group) {
    filteredEmployees = filteredEmployees.filter((emp) =>
      emp.group.includes(searchParams.group!)
    );
  }

  if (searchParams.type) {
    filteredEmployees = filteredEmployees.filter(
      (emp) => emp.employeeType === searchParams.type
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Employee Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage employee records and information
            </p>
          </div>
        </div>
        <Link href="/dashboard/employees/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
              <p className="text-2xl font-bold">{employees.length}</p>
            </div>
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Permanent Staff</p>
              <p className="text-2xl font-bold">
                {employees.filter((e) => e.employeeType === 'Permanent').length}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Temporary Staff</p>
              <p className="text-2xl font-bold">
                {employees.filter((e) => e.employeeType === 'Temporary').length}
              </p>
            </div>
            <Users className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <EmployeeFilters groups={groups} />
      </Card>

      {/* Employee Table */}
      <Card className="p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            {filteredEmployees.length} {filteredEmployees.length === 1 ? 'Employee' : 'Employees'}
          </h2>
          {(searchParams.search || searchParams.group || searchParams.type) && (
            <p className="text-sm text-muted-foreground mt-1">
              Filtered from {employees.length} total employees
            </p>
          )}
        </div>
        <EmployeeTable employees={filteredEmployees} />
      </Card>
    </div>
  );
}
