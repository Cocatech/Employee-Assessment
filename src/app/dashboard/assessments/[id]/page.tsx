import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Send, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { getAssessments } from '@/actions/assessments';
import { getEmployees } from '@/actions/employees';
import { getResponsesByAssessment } from '@/actions/responses';
import { getQuestionsByLevel } from '@/actions/questions';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    id: string;
  };
}

export default async function AssessmentDetailPage({ params }: Props) {
  const { id } = params;

  // ดึงข้อมูล assessment
  const assessments = await getAssessments();
  const assessment = assessments.find(a => a.id === id);

  if (!assessment) {
    notFound();
  }

  // ดึงข้อมูล employee
  const employees = await getEmployees();
  const employee = employees.find(e => e.empCode === assessment.employeeId);

  console.log('Debug Assessment Detail:', {
    assessmentId: id,
    employeeId: assessment.employeeId,
    totalEmployees: employees.length,
    employee: employee ? `Found: ${employee.empCode}` : 'NOT FOUND',
    employeeCodes: employees.map(e => e.empCode)
  });

  // ดึงคำถามตามระดับของพนักงาน
  const questions = employee 
    ? await getQuestionsByLevel(employee.assessmentLevel)
    : [];

  console.log('Debug Questions:', {
    level: employee?.assessmentLevel,
    totalQuestions: questions.length,
    questionIds: questions.map(q => q.id)
  });

  // ดึงคำตอบที่มีอยู่
  const responses = await getResponsesByAssessment(id);

  // สร้าง map สำหรับหาคำตอบแต่ละคำถาม
  const responseMap = new Map(
    responses.map(r => [r.questionId, r])
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Draft' },
      SUBMITTED_MGR: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'With Manager' },
      SUBMITTED_APPR2: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'With Approver 2' },
      SUBMITTED_GM: { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'With GM' },
      COMPLETED: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Completed' },
      REJECTED: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Rejected' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;

    return (
      <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/assessments">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{assessment.title || `Assessment ${id}`}</h1>
              {getStatusBadge(assessment.status)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {employee?.empCode} - {employee?.empName_Eng}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {assessment.status === 'DRAFT' && (
            <Link href={`/dashboard/assessments/${id}/score`}>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Start Assessment
              </Button>
            </Link>
          )}
          {assessment.status === 'SUBMITTED_MGR' && (
            <Link href={`/dashboard/assessments/${id}/approve`}>
              <Button>
                <CheckCircle className="mr-2 h-4 w-4" />
                Review & Approve
              </Button>
            </Link>
          )}
          {assessment.status === 'SUBMITTED_APPR2' && (
            <Link href={`/dashboard/assessments/${id}/approve`}>
              <Button>
                <CheckCircle className="mr-2 h-4 w-4" />
                Approver 2 Review
              </Button>
            </Link>
          )}
          {assessment.status === 'SUBMITTED_APPR3' && (
            <Link href={`/dashboard/assessments/${id}/approve`}>
              <Button>
                <CheckCircle className="mr-2 h-4 w-4" />
                Approver 3 Review
              </Button>
            </Link>
          )}
          {assessment.status === 'SUBMITTED_GM' && (
            <Link href={`/dashboard/assessments/${id}/approve`}>
              <Button>
                <CheckCircle className="mr-2 h-4 w-4" />
                GM Review
              </Button>
            </Link>
          )}
          {assessment.status === 'COMPLETED' && (
            <Link href={`/dashboard/assessments/${id}/summary`}>
              <Button variant="outline">
                View Summary
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Assessment Info */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Assessment Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Assessment Type:</span>
              <span className="font-medium">{assessment.assessmentType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Period:</span>
              <span className="font-medium">
                {formatDate(assessment.periodStart)} - {formatDate(assessment.periodEnd)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Due Date:</span>
              <span className="font-medium">{formatDate(assessment.dueDate)}</span>
            </div>
            {assessment.submittedAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Submitted:</span>
                <span className="font-medium">{formatDate(assessment.submittedAt)}</span>
              </div>
            )}
            {assessment.score !== null && assessment.score !== undefined && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Score:</span>
                <span className="font-medium text-lg">{assessment.score.toFixed(2)} / 5.00</span>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Employee Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{employee?.empName_Eng}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Position:</span>
              <span className="font-medium">{employee?.position}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Group:</span>
              <span className="font-medium">{employee?.group}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Level:</span>
              <span className="font-medium">{employee?.assessmentLevel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium">{employee?.employeeType}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Questions and Responses */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Assessment Questions</h2>
        
        {questions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No questions found for this assessment level
          </div>
        ) : (
          <div className="space-y-4">
            {questions
              .sort((a, b) => a.order - b.order)
              .map((question) => {
                const response = responseMap.get(question.id);
                
                return (
                  <div
                    key={question.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{question.questionTitle}</span>
                          <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded">
                            {question.category}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Weight: {question.weight}%
                          </span>
                        </div>
                        {question.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {question.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Scores */}
                    <div className="grid grid-cols-4 gap-4 mt-3 pt-3 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Self Score</p>
                        <p className="text-lg font-semibold">
                          {response?.scoreSelf !== undefined && response?.scoreSelf !== null 
                            ? `${response.scoreSelf.toFixed(1)} / 5` 
                            : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Manager Score</p>
                        <p className="text-lg font-semibold">
                          {response?.scoreMgr !== undefined && response?.scoreMgr !== null 
                            ? `${response.scoreMgr.toFixed(1)} / 5` 
                            : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Approver 2 Score</p>
                        <p className="text-lg font-semibold">
                          {response?.scoreAppr2 !== undefined && response?.scoreAppr2 !== null 
                            ? `${response.scoreAppr2.toFixed(1)} / 5` 
                            : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">GM Score</p>
                        <p className="text-lg font-semibold">
                          {response?.scoreGm !== undefined && response?.scoreGm !== null 
                            ? `${response.scoreGm.toFixed(1)} / 5` 
                            : '-'}
                        </p>
                      </div>
                    </div>

                    {/* Comments */}
                    {(response?.commentSelf || response?.commentMgr || response?.commentAppr2 || response?.commentGm) && (
                      <div className="mt-3 pt-3 border-t space-y-2">
                        {response?.commentSelf && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Self Comment:</p>
                            <p className="text-sm">{response.commentSelf}</p>
                          </div>
                        )}
                        {response?.commentMgr && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Manager Comment:</p>
                            <p className="text-sm">{response.commentMgr}</p>
                          </div>
                        )}
                        {response?.commentAppr2 && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Approver 2 Comment:</p>
                            <p className="text-sm">{response.commentAppr2}</p>
                          </div>
                        )}
                        {response?.commentGm && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">GM Comment:</p>
                            <p className="text-sm">{response.commentGm}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </Card>

      {/* Summary */}
      {responses.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Questions</p>
              <p className="text-2xl font-bold">{questions.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Answered</p>
              <p className="text-2xl font-bold">{responses.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Progress</p>
              <p className="text-2xl font-bold">
                {questions.length > 0 
                  ? Math.round((responses.length / questions.length) * 100)
                  : 0}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Current Score</p>
              <p className="text-2xl font-bold">
                {assessment.score !== null && assessment.score !== undefined
                  ? assessment.score.toFixed(2)
                  : '-'}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
