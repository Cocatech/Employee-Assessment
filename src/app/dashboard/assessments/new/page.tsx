import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { getEmployees } from '@/actions/employees';
import { createAssessment } from '@/actions/assessments';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';

export const metadata = {
  title: 'Create New Assessment | TRTH Assessment',
  description: 'Create a new employee assessment',
};

async function handleCreateAssessment(formData: FormData) {
  'use server';
  
  const employeeId = formData.get('employeeId') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const assessmentType = formData.get('assessmentType') as string;
  const periodStart = formData.get('periodStart') as string;
  const periodEnd = formData.get('periodEnd') as string;
  const dueDate = formData.get('dueDate') as string;

  if (!employeeId || !title || !assessmentType || !periodStart || !periodEnd) {
    return;
  }

  const result = await createAssessment({
    title,
    description: description || undefined,
    type: 'self',
    assessmentType: assessmentType as 'Annual' | 'Mid-year' | 'Probation' | 'Special',
    status: 'DRAFT',
    employeeId,
    assessorId: employeeId, // TODO: Get from session
    periodStart,
    periodEnd,
    dueDate: dueDate || periodEnd,
    score: undefined,
    finalScore: undefined,
    completedAt: undefined,
  });

  if (result.success && result.id) {
    revalidatePath('/dashboard/assessments');
    redirect(`/dashboard/assessments/${result.id}`);
  }
}

export default async function NewAssessmentPage() {
  // Check authorization
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  // Get user info from session
  const currentUser = session.user as any;
  const role = currentUser?.role;
  const userType = currentUser?.userType;
  const empCode = currentUser?.empCode;

  // Check if user has permission to create assessments
  // Only allow: System Admin or Employee Admin
  const isAdmin = userType === 'SYSTEM_ADMIN' || role === 'ADMIN';
  
  const hasPermission = isAdmin;
  
  // Get employees list
  const employees = await getEmployees();

  // If no permission, show access denied
  if (!hasPermission) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/dashboard/assessments">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
        
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="rounded-full bg-red-100 p-3">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-600 mb-4">
                You do not have permission to create assessments.
              </p>
              <p className="text-sm text-gray-500">
                Only Admin (System Administrator) can create employee assessments.
              </p>
            </div>
            <Link href="/dashboard/assessments">
              <Button>Return to Assessments</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/dashboard/assessments">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold">Create New Assessment</h1>
          <p className="text-gray-600 mt-1">Fill in the details to create a new employee assessment</p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <form action={handleCreateAssessment} className="space-y-6">
          {/* Employee Selection */}
          <div className="space-y-2">
            <label htmlFor="employeeId" className="text-sm font-medium">
              Employee <span className="text-red-500">*</span>
            </label>
            <select
              id="employeeId"
              name="employeeId"
              required
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.empCode} value={emp.empCode}>
                  {emp.empCode} - {emp.empName_Eng} ({emp.assessmentLevel})
                </option>
              ))}
            </select>
          </div>

          {/* Assessment Type */}
          <div className="space-y-2">
            <label htmlFor="assessmentType" className="text-sm font-medium">
              Assessment Type <span className="text-red-500">*</span>
            </label>
            <select
              id="assessmentType"
              name="assessmentType"
              required
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select Type</option>
              <option value="Probation">Probation (ทดลองงาน)</option>
              <option value="Annual">Annual (ประจำปี)</option>
              <option value="Mid-year">Mid-year (กลางปี)</option>
              <option value="Special">Special (พิเศษ)</option>
            </select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Assessment Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="e.g., Annual Performance Review 2024"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Optional description or notes about this assessment"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Period Start */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="periodStart" className="text-sm font-medium">
                Period Start <span className="text-red-500">*</span>
              </label>
              <Input
                id="periodStart"
                name="periodStart"
                type="date"
                required
              />
            </div>

            {/* Period End */}
            <div className="space-y-2">
              <label htmlFor="periodEnd" className="text-sm font-medium">
                Period End <span className="text-red-500">*</span>
              </label>
              <Input
                id="periodEnd"
                name="periodEnd"
                type="date"
                required
              />
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <label htmlFor="dueDate" className="text-sm font-medium">
              Due Date
            </label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
            />
            <p className="text-xs text-gray-500">Optional deadline for completing this assessment</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <Link href="/dashboard/assessments">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Create Assessment
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
