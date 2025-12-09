import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, TrendingUp, TrendingDown, Minus } from 'lucide-react';
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

export default async function AssessmentSummaryPage({ params }: Props) {
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

  if (!employee) {
    return <div className="p-8 text-center text-red-600">Employee not found</div>;
  }

  // ดึงคำถามและคำตอบ
  const questions = await getQuestionsByLevel(employee.assessmentLevel);
  const responses = await getResponsesByAssessment(id);

  // สร้าง map สำหรับหาคำตอบแต่ละคำถาม
  const responseMap = new Map(responses.map(r => [r.questionId, r]));

  // คำนวณคะแนนเฉลี่ย
  const calculateAverageScore = (field: 'scoreSelf' | 'scoreMgr' | 'scoreAppr2' | 'scoreGm') => {
    const scores = responses
      .map(r => r[field])
      .filter((score): score is number => score !== undefined && score !== null);
    
    if (scores.length === 0) return null;
    return (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(2);
  };

  const avgSelf = calculateAverageScore('scoreSelf');
  const avgMgr = calculateAverageScore('scoreMgr');
  const avgAppr2 = calculateAverageScore('scoreAppr2');
  const avgGm = calculateAverageScore('scoreGm');

  const getScoreColor = (score?: number | string | null) => {
    if (score === undefined || score === null) return 'text-gray-400';
    const numScore = typeof score === 'string' ? parseFloat(score) : score;
    if (numScore >= 4.5) return 'text-green-600';
    if (numScore >= 3.5) return 'text-blue-600';
    if (numScore >= 2.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getComparison = (score1: string | null, score2: string | null) => {
    if (!score1 || !score2) return null;
    const diff = parseFloat(score2) - parseFloat(score1);
    if (Math.abs(diff) < 0.1) return { icon: Minus, text: 'Same', color: 'text-gray-500' };
    if (diff > 0) return { icon: TrendingUp, text: `+${diff.toFixed(2)}`, color: 'text-green-600' };
    return { icon: TrendingDown, text: diff.toFixed(2), color: 'text-red-600' };
  };

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

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/assessments/${id}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Assessment Summary</h1>
              {getStatusBadge(assessment.status)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {employee.empCode} - {employee.empName_Eng} ({employee.position})
            </p>
          </div>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>

      {/* Overall Scores */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Overall Scores</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {avgSelf && (
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Self Assessment</p>
              <p className={`text-3xl font-bold ${getScoreColor(avgSelf)}`}>{avgSelf}</p>
              <p className="text-xs text-muted-foreground mt-1">/ 5.0</p>
            </div>
          )}
          {avgMgr && (
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Manager</p>
              <p className={`text-3xl font-bold ${getScoreColor(avgMgr)}`}>{avgMgr}</p>
              <p className="text-xs text-muted-foreground mt-1">/ 5.0</p>
              {avgSelf && (() => {
                const comp = getComparison(avgSelf, avgMgr);
                if (comp) {
                  const Icon = comp.icon;
                  return (
                    <div className={`flex items-center justify-center gap-1 mt-2 ${comp.color}`}>
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{comp.text}</span>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          )}
          {avgAppr2 && (
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Approver 2</p>
              <p className={`text-3xl font-bold ${getScoreColor(avgAppr2)}`}>{avgAppr2}</p>
              <p className="text-xs text-muted-foreground mt-1">/ 5.0</p>
            </div>
          )}
          {avgGm && (
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">GM (Final)</p>
              <p className={`text-3xl font-bold ${getScoreColor(avgGm)}`}>{avgGm}</p>
              <p className="text-xs text-muted-foreground mt-1">/ 5.0</p>
            </div>
          )}
        </div>
      </Card>

      {/* Detailed Comparison */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Detailed Score Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Question</th>
                <th className="text-center py-3 px-4 bg-blue-50">Self</th>
                {responses.some(r => r.scoreMgr !== null && r.scoreMgr !== undefined) && (
                  <th className="text-center py-3 px-4 bg-green-50">Manager</th>
                )}
                {responses.some(r => r.scoreAppr2 !== null && r.scoreAppr2 !== undefined) && (
                  <th className="text-center py-3 px-4 bg-yellow-50">Approver 2</th>
                )}
                {responses.some(r => r.scoreGm !== null && r.scoreGm !== undefined) && (
                  <th className="text-center py-3 px-4 bg-orange-50">GM</th>
                )}
              </tr>
            </thead>
            <tbody>
              {questions
                .sort((a, b) => a.order - b.order)
                .map((question, index) => {
                  const response = responseMap.get(question.id);
                  if (!response) return null;

                  return (
                    <tr key={question.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{question.questionTitle}</p>
                          <p className="text-xs text-muted-foreground">
                            Weight: {question.weight}% | Category: {question.category}
                          </p>
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className={`text-lg font-bold ${getScoreColor(response.scoreSelf)}`}>
                          {response.scoreSelf?.toFixed(1) || 'N/A'}
                        </span>
                      </td>
                      {responses.some(r => r.scoreMgr !== null && r.scoreMgr !== undefined) && (
                        <td className="text-center py-3 px-4">
                          <span className={`text-lg font-bold ${getScoreColor(response.scoreMgr)}`}>
                            {response.scoreMgr?.toFixed(1) || '-'}
                          </span>
                        </td>
                      )}
                      {responses.some(r => r.scoreAppr2 !== null && r.scoreAppr2 !== undefined) && (
                        <td className="text-center py-3 px-4">
                          <span className={`text-lg font-bold ${getScoreColor(response.scoreAppr2)}`}>
                            {response.scoreAppr2?.toFixed(1) || '-'}
                          </span>
                        </td>
                      )}
                      {responses.some(r => r.scoreGm !== null && r.scoreGm !== undefined) && (
                        <td className="text-center py-3 px-4">
                          <span className={`text-lg font-bold ${getScoreColor(response.scoreGm)}`}>
                            {response.scoreGm?.toFixed(1) || '-'}
                          </span>
                        </td>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Comments Summary */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Comments & Feedback</h2>
        <div className="space-y-4">
          {questions
            .sort((a, b) => a.order - b.order)
            .map(question => {
              const response = responseMap.get(question.id);
              if (!response) return null;

              const hasComments = response.commentSelf || response.commentMgr || 
                                response.commentAppr2 || response.commentGm;
              
              if (!hasComments) return null;

              return (
                <div key={question.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">{question.questionTitle}</h3>
                  <div className="space-y-3">
                    {response.commentSelf && (
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="text-sm font-medium text-blue-900 mb-1">Self Comment:</p>
                        <p className="text-sm">{response.commentSelf}</p>
                      </div>
                    )}
                    {response.commentMgr && (
                      <div className="bg-green-50 p-3 rounded">
                        <p className="text-sm font-medium text-green-900 mb-1">Manager Feedback:</p>
                        <p className="text-sm">{response.commentMgr}</p>
                      </div>
                    )}
                    {response.commentAppr2 && (
                      <div className="bg-yellow-50 p-3 rounded">
                        <p className="text-sm font-medium text-yellow-900 mb-1">Approver 2 Feedback:</p>
                        <p className="text-sm">{response.commentAppr2}</p>
                      </div>
                    )}
                    {response.commentGm && (
                      <div className="bg-orange-50 p-3 rounded">
                        <p className="text-sm font-medium text-orange-900 mb-1">GM Feedback:</p>
                        <p className="text-sm">{response.commentGm}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </Card>
    </div>
  );
}
