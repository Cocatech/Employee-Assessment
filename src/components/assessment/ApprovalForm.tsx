'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Question {
  id: string;
  questionTitle: string;
  description?: string;
  category: string;
  weight: number;
  maxScore: number;
  order: number;
}

interface Response {
  id: string;
  questionId: string;
  scoreSelf?: number;
  scoreMgr?: number;
  scoreAppr2?: number;
  scoreAppr3?: number;
  scoreGm?: number;
  commentSelf?: string;
  commentMgr?: string;
  commentAppr2?: string;
  commentAppr3?: string;
  commentGm?: string;
}

interface Employee {
  empCode: string;
  empName_Eng: string;
  position: string;
  group: string;
}

interface ApprovalFormProps {
  assessmentId: string;
  assessmentStatus: string;
  employee: Employee;
  questions: Question[];
  responses: Response[];
  currentUserRole: 'manager' | 'approver2' | 'approver3' | 'gm';
  approver2Id?: string | null;
  approver3Id?: string | null;
}

export default function ApprovalForm({ 
  assessmentId,
  assessmentStatus,
  employee,
  questions,
  responses: initialResponses,
  currentUserRole,
  approver2Id,
  approver3Id
}: ApprovalFormProps) {
  const router = useRouter();
  const [responses, setResponses] = useState<Record<string, Partial<Response>>>(
    Object.fromEntries(initialResponses.map(r => [r.questionId, r]))
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // กำหนด field ที่ใช้ตาม role
  const scoreField = currentUserRole === 'manager' ? 'scoreMgr' 
    : currentUserRole === 'approver2' ? 'scoreAppr2'
    : currentUserRole === 'approver3' ? 'scoreAppr3'
    : 'scoreGm';
  
  const commentField = currentUserRole === 'manager' ? 'commentMgr'
    : currentUserRole === 'approver2' ? 'commentAppr2'
    : currentUserRole === 'approver3' ? 'commentAppr3'
    : 'commentGm';

  const roleLabel = currentUserRole === 'manager' ? 'Manager'
    : currentUserRole === 'approver2' ? 'Approver 2'
    : currentUserRole === 'approver3' ? 'Approver 3'
    : 'GM';

  const handleScoreChange = (questionId: string, score: string) => {
    const numScore = parseFloat(score);
    if (numScore >= 0 && numScore <= 5) {
      setResponses(prev => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          [scoreField]: numScore,
        }
      }));
    }
  };

  const handleCommentChange = (questionId: string, comment: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [commentField]: comment,
      }
    }));
  };

  const validateResponses = (): boolean => {
    const unanswered = questions.filter(q => {
      const response = responses[q.id];
      return !response || response[scoreField] === undefined || response[scoreField] === null;
    });

    if (unanswered.length > 0) {
      setError(`Please score all questions. ${unanswered.length} question(s) remaining.`);
      return false;
    }

    return true;
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const responseData = Object.entries(responses).map(([questionId, resp]) => ({
        id: resp.id,
        assessmentId,
        questionId,
        [scoreField]: resp[scoreField],
        [commentField]: resp[commentField] || '',
      }));

      const response = await fetch('/api/assessment/save-responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses: responseData }),
      });

      if (response.ok) {
        setSuccessMessage('Draft saved successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError('Failed to save draft');
      }
    } catch (err) {
      setError('An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

  const handleApprove = async () => {
    if (!validateResponses()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Save responses first
      const responseData = Object.entries(responses).map(([questionId, resp]) => ({
        id: resp.id,
        assessmentId,
        questionId,
        [scoreField]: resp[scoreField],
        [commentField]: resp[commentField] || '',
      }));

      const saveResponse = await fetch('/api/assessment/save-responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses: responseData }),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save responses');
      }

      // Determine next status
      let nextStatus = '';
      if (currentUserRole === 'manager') {
        // ถ้ามี Approver2 ให้ส่งต่อไป, ไม่มีแต่มี Approver3 ให้ส่งไป Approver3, ไม่มีทั้งคู่ให้ส่งไป GM
        if (approver2Id && approver2Id !== '-') {
          nextStatus = 'SUBMITTED_APPR2';
        } else if (approver3Id && approver3Id !== '-') {
          nextStatus = 'SUBMITTED_APPR3';
        } else {
          nextStatus = 'SUBMITTED_GM';
        }
      } else if (currentUserRole === 'approver2') {
        // ถ้ามี Approver3 ให้ส่งต่อไป, ไม่มีให้ส่งไป GM
        nextStatus = approver3Id && approver3Id !== '-' ? 'SUBMITTED_APPR3' : 'SUBMITTED_GM';
      } else if (currentUserRole === 'approver3') {
        nextStatus = 'SUBMITTED_GM';
      } else {
        nextStatus = 'COMPLETED';
      }

      // Update assessment status
      const approveResponse = await fetch('/api/assessment/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          assessmentId,
          action: 'approve',
          nextStatus 
        }),
      });

      if (approveResponse.ok) {
        router.push(`/dashboard/assessments/${assessmentId}?approved=true`);
        router.refresh();
      } else {
        setError('Failed to approve assessment');
      }
    } catch (err) {
      setError('An error occurred while approving');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!confirm('Are you sure you want to reject this assessment? This will send it back to the employee.')) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const rejectResponse = await fetch('/api/assessment/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          assessmentId,
          action: 'reject',
          nextStatus: 'REJECTED'
        }),
      });

      if (rejectResponse.ok) {
        router.push(`/dashboard/assessments/${assessmentId}?rejected=true`);
        router.refresh();
      } else {
        setError('Failed to reject assessment');
      }
    } catch (err) {
      setError('An error occurred while rejecting');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreColor = (score?: number) => {
    if (score === undefined || score === null) return 'text-gray-400';
    if (score >= 4.5) return 'text-green-600';
    if (score >= 3.5) return 'text-blue-600';
    if (score >= 2.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const calculateProgress = () => {
    const answered = questions.filter(q => {
      const response = responses[q.id];
      return response && response[scoreField] !== undefined && response[scoreField] !== null;
    }).length;
    return Math.round((answered / questions.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/assessments/${assessmentId}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{roleLabel} Review</h1>
            <p className="text-sm text-muted-foreground">
              {employee.empCode} - {employee.empName_Eng} ({employee.position})
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Review Progress</span>
          <span className="text-sm text-muted-foreground">
            {calculateProgress()}% Complete ({Object.values(responses).filter(r => r[scoreField] !== undefined).length} / {questions.length})
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${calculateProgress()}%` }}
          />
        </div>
      </Card>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          {successMessage}
        </div>
      )}

      {/* Questions */}
      <div className="space-y-4">
        {questions
          .sort((a, b) => a.order - b.order)
          .map((question, index) => {
            const response = responses[question.id] || {};
            
            return (
              <Card key={question.id} className="p-6">
                <div className="space-y-4">
                  {/* Question Header */}
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            Question {index + 1}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-muted rounded">
                            {question.category}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Weight: {question.weight}%
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold mt-1">
                          {question.questionTitle}
                        </h3>
                        {question.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {question.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Employee's Self Assessment (Read-only) */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold mb-2 text-blue-900">Employee's Self Assessment</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block text-blue-900">Score</label>
                        <div className="flex items-center gap-2">
                          <span className={`text-2xl font-bold ${getScoreColor(response.scoreSelf)}`}>
                            {response.scoreSelf !== undefined ? response.scoreSelf.toFixed(1) : 'N/A'}
                          </span>
                          <span className="text-sm text-muted-foreground">/ 5.0</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block text-blue-900">Comment</label>
                        <p className="text-sm text-gray-700">
                          {response.commentSelf || 'No comment provided'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Manager Score (if reviewing as Approver2/GM) */}
                  {currentUserRole !== 'manager' && response.scoreMgr !== undefined && response.scoreMgr !== null && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold mb-2 text-green-900">Manager's Review</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block text-green-900">Score</label>
                          <div className="flex items-center gap-2">
                            <span className={`text-2xl font-bold ${getScoreColor(response.scoreMgr)}`}>
                              {response.scoreMgr.toFixed(1)}
                            </span>
                            <span className="text-sm text-muted-foreground">/ 5.0</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block text-green-900">Comment</label>
                          <p className="text-sm text-gray-700">
                            {response.commentMgr || 'No comment provided'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Approver2 Score (if reviewing as Approver3/GM) */}
                  {['approver3', 'gm'].includes(currentUserRole) && response.scoreAppr2 !== undefined && response.scoreAppr2 !== null && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold mb-2 text-yellow-900">Approver 2's Review</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block text-yellow-900">Score</label>
                          <div className="flex items-center gap-2">
                            <span className={`text-2xl font-bold ${getScoreColor(response.scoreAppr2)}`}>
                              {response.scoreAppr2.toFixed(1)}
                            </span>
                            <span className="text-sm text-muted-foreground">/ 5.0</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block text-yellow-900">Comment</label>
                          <p className="text-sm text-gray-700">
                            {response.commentAppr2 || 'No comment provided'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Approver3 Score (if reviewing as GM) */}
                  {currentUserRole === 'gm' && response.scoreAppr3 !== undefined && response.scoreAppr3 !== null && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold mb-2 text-purple-900">Approver 3's Review</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block text-purple-900">Score</label>
                          <div className="flex items-center gap-2">
                            <span className={`text-2xl font-bold ${getScoreColor(response.scoreAppr3)}`}>
                              {response.scoreAppr3.toFixed(1)}
                            </span>
                            <span className="text-sm text-muted-foreground">/ 5.0</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block text-purple-900">Comment</label>
                          <p className="text-sm text-gray-700">
                            {response.commentAppr3 || 'No comment provided'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Your Score Input */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold mb-3 text-orange-900">Your {roleLabel} Review</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Your Score (0-5) <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            max="5"
                            step="0.5"
                            value={response[scoreField] ?? ''}
                            onChange={(e) => handleScoreChange(question.id, e.target.value)}
                            className="w-24"
                            placeholder="0.0"
                          />
                          <span className="text-sm text-muted-foreground">/ 5.0</span>
                          {response[scoreField] !== undefined && response[scoreField] !== null && (
                            <span className={`text-lg font-bold ml-2 ${getScoreColor(response[scoreField])}`}>
                              {response[scoreField]!.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="text-sm font-medium mb-2 block">
                        Your Feedback (Optional)
                      </label>
                      <textarea
                        value={response[commentField] ?? ''}
                        onChange={(e) => handleCommentChange(question.id, e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[80px]"
                        placeholder="Provide feedback, suggestions for improvement..."
                      />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
      </div>

      {/* Actions */}
      <Card className="p-6 sticky bottom-4 bg-background shadow-lg">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {calculateProgress() === 100 ? (
              <span className="text-green-600 font-medium">✓ All questions reviewed</span>
            ) : (
              <span>Complete all questions to approve</span>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSaving || isSubmitting}
            >
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button
              variant="outline"
              onClick={handleReject}
              disabled={isSaving || isSubmitting}
              className="border-red-500 text-red-600 hover:bg-red-50"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isSaving || isSubmitting || calculateProgress() < 100}
            >
              {isSubmitting ? 'Processing...' : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve & Submit
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
