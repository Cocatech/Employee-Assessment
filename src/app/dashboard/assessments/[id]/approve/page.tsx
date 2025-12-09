import ApprovalForm from '@/components/assessment/ApprovalForm';
import { getAssessments } from '@/actions/assessments';
import { getEmployees } from '@/actions/employees';
import { getQuestionsByLevel } from '@/actions/questions';
import { getResponsesByAssessment } from '@/actions/responses';
import { notFound, redirect } from 'next/navigation';

interface Props {
  params: {
    id: string;
  };
}

export default async function AssessmentApprovalPage({ params }: Props) {
  const { id } = params;

  // ดึงข้อมูล assessment
  const assessments = await getAssessments();
  const assessment = assessments.find(a => a.id === id);

  if (!assessment) {
    notFound();
  }

  // ตรวจสอบว่าสามารถ approve ได้หรือไม่
  if (!['SUBMITTED_MGR', 'SUBMITTED_APPR2', 'SUBMITTED_APPR3', 'SUBMITTED_GM'].includes(assessment.status)) {
    redirect(`/dashboard/assessments/${id}`);
  }

  // ดึงข้อมูล employee
  const employees = await getEmployees();
  const employee = employees.find(e => e.empCode === assessment.employeeId);

  if (!employee) {
    return <div className="p-8 text-center text-red-600">Employee not found</div>;
  }

  // ดึงคำถามตามระดับของพนักงาน
  const questions = await getQuestionsByLevel(employee.assessmentLevel);

  // ดึงคำตอบที่มีอยู่
  const responses = await getResponsesByAssessment(id);

  // กำหนด role ตาม assessment status
  // TODO: ในระบบจริงต้องเช็คจาก session/user authentication
  let currentUserRole: 'manager' | 'approver2' | 'approver3' | 'gm' = 'manager';
  if (assessment.status === 'SUBMITTED_MGR') {
    currentUserRole = 'manager';
  } else if (assessment.status === 'SUBMITTED_APPR2') {
    currentUserRole = 'approver2';
  } else if (assessment.status === 'SUBMITTED_APPR3') {
    currentUserRole = 'approver3';
  } else if (assessment.status === 'SUBMITTED_GM') {
    currentUserRole = 'gm';
  }

  return (
    <div className="container mx-auto py-6">
      <ApprovalForm
        assessmentId={id}
        assessmentStatus={assessment.status}
        employee={{
          empCode: employee.empCode,
          empName_Eng: employee.empName_Eng,
          position: employee.position,
          group: employee.group,
        }}
        questions={questions}
        responses={responses}
        currentUserRole={currentUserRole}
        approver2Id={employee.approver2_ID}
        approver3Id={employee.approver3_ID}
      />
    </div>
  );
}
