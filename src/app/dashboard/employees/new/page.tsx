'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { createEmployee } from '@/actions/employees';

export default function NewEmployeePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      empCode: formData.get('empCode') as string,
      empName_Eng: formData.get('empName_Eng') as string,
      empName_Thai: formData.get('empName_Thai') as string || '',
      email: formData.get('email') as string || '',
      phoneNumber: formData.get('phoneNumber') as string || '',
      position: formData.get('position') as string,
      group: formData.get('group') as string,
      team: formData.get('team') as string || '',
      assessmentLevel: formData.get('assessmentLevel') as any,
      employeeType: formData.get('employeeType') as any,
      approver1_ID: formData.get('approver1_ID') as string,
      approver2_ID: formData.get('approver2_ID') as string || null,
      gm_ID: formData.get('gm_ID') as string,
      joinDate: formData.get('joinDate') as string,
      warningCount: 0,
    };

    try {
      const result = await createEmployee(data);
      
      if (result.success) {
        router.push('/dashboard/employees');
        router.refresh();
      } else {
        setError(result.error || 'Failed to create employee');
      }
    } catch (err) {
      setError('An error occurred while creating employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/employees">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Add New Employee</h1>
              <p className="text-sm text-muted-foreground">
                Create a new employee record
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card className="p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="empCode" className="text-sm font-medium">
                    Employee Code <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="empCode"
                    name="empCode"
                    placeholder="e.g., 11021"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="empName_Eng" className="text-sm font-medium">
                    Name (English) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="empName_Eng"
                    name="empName_Eng"
                    placeholder="e.g., John Smith"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="empName_Thai" className="text-sm font-medium">
                    Name (Thai)
                  </label>
                  <Input
                    id="empName_Thai"
                    name="empName_Thai"
                    placeholder="e.g., จอห์น สมิธ"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.s@trth.co.th"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phoneNumber" className="text-sm font-medium">
                    Phone Number
                  </label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="081-234-5678"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="joinDate" className="text-sm font-medium">
                    Join Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="joinDate"
                    name="joinDate"
                    type="date"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Organization */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Organization</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="position" className="text-sm font-medium">
                    Position <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="position"
                    name="position"
                    placeholder="e.g., Senior Engineer"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="group" className="text-sm font-medium">
                    Group <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="group"
                    name="group"
                    placeholder="e.g., PRD,QA"
                    required
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: CODE1,CODE2 (e.g., PRD,QA)
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="team" className="text-sm font-medium">
                    Team
                  </label>
                  <Input
                    id="team"
                    name="team"
                    placeholder="e.g., Production Line A"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="assessmentLevel" className="text-sm font-medium">
                    Assessment Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="assessmentLevel"
                    name="assessmentLevel"
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="">Select Level</option>
                    <option value="Management">Management</option>
                    <option value="Supervise">Supervise</option>
                    <option value="Operate">Operate</option>
                    <option value="Interpreter">Interpreter</option>
                    <option value="General">General</option>
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Management (6+), Supervise (4-5), Operate (1-3)
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="employeeType" className="text-sm font-medium">
                    Employee Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="employeeType"
                    name="employeeType"
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="">Select Type</option>
                    <option value="Permanent">Permanent</option>
                    <option value="Temporary">Temporary</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Approvers */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Approvers</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="approver1_ID" className="text-sm font-medium">
                    Approver 1 (Manager) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="approver1_ID"
                    name="approver1_ID"
                    placeholder="e.g., 11007"
                    required
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground">
                    Direct manager employee code
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="approver2_ID" className="text-sm font-medium">
                    Approver 2 (Optional)
                  </label>
                  <Input
                    id="approver2_ID"
                    name="approver2_ID"
                    placeholder="e.g., 11005 or leave empty"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground">
                    Second approver (if applicable)
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="gm_ID" className="text-sm font-medium">
                    GM <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="gm_ID"
                    name="gm_ID"
                    placeholder="e.g., 11002"
                    required
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground">
                    General Manager employee code
                  </p>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Link href="/dashboard/employees">
                <Button type="button" variant="outline" disabled={isSubmitting}>
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Employee
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
