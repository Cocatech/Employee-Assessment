import { getEmployee } from '@/actions/employees';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Briefcase, Calendar, Users, Shield, Edit } from 'lucide-react';

export default async function EmployeeDetailPage({
  params,
}: {
  params: { empCode: string };
}) {
  const result = await getEmployee(params.empCode);

  if (!result.success || !result.data) {
    notFound();
  }

  const employee = result.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/employees">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{employee.empName_Eng}</h1>
            {employee.empName_Thai && (
              <p className="text-muted-foreground">{employee.empName_Thai}</p>
            )}
          </div>
        </div>
        <Link href={`/dashboard/employees/${employee.empCode}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </Link>
      </div>

      {/* Employee Info Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Employee Code</p>
                <p className="text-base">{employee.empCode}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-base">{employee.email || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p className="text-base">{employee.phoneNumber || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Position</p>
                <p className="text-base">{employee.position}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Join Date</p>
                <p className="text-base">
                  {new Date(employee.joinDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Organization & Assessment */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Organization & Assessment</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Group</p>
                <p className="text-base">{employee.group}</p>
              </div>
            </div>

            {employee.team && (
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Team</p>
                  <p className="text-base whitespace-pre-line">{employee.team}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assessment Level</p>
                <p className="text-base">
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                    {employee.assessmentLevel}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Employee Type</p>
                <p className="text-base">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      employee.employeeType === 'Permanent'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {employee.employeeType}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Warning Count</p>
                <p className="text-base">{employee.warningCount}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Approvers */}
        <Card className="p-6 md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Approval Hierarchy</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Approver 1</p>
              <p className="text-base font-medium">{employee.approver1_ID}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Approver 2</p>
              <p className="text-base font-medium">{employee.approver2_ID || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">General Manager</p>
              <p className="text-base font-medium">{employee.gm_ID}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Assessment History */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Assessment History</h2>
        <p className="text-sm text-muted-foreground">No assessments found for this employee.</p>
      </Card>
    </div>
  );
}
