-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "empCode" TEXT NOT NULL,
    "empName_Eng" TEXT NOT NULL,
    "empName_Thai" TEXT,
    "email" TEXT,
    "phoneNumber" TEXT,
    "position" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "team" TEXT,
    "assessmentLevel" TEXT NOT NULL,
    "employeeType" TEXT NOT NULL,
    "approver1_ID" TEXT,
    "approver2_ID" TEXT,
    "approver3_ID" TEXT,
    "gm_ID" TEXT,
    "joinDate" TIMESTAMP(3) NOT NULL,
    "warningCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_questions" (
    "id" TEXT NOT NULL,
    "questionTitle" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "maxScore" DOUBLE PRECISION NOT NULL DEFAULT 5,
    "order" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "applicableLevel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessment_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessments" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "assessmentType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "assessorId" TEXT,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "score" DOUBLE PRECISION,
    "finalScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_responses" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "questionTitle" TEXT NOT NULL,
    "questionWeight" DOUBLE PRECISION NOT NULL,
    "scoreSelf" DOUBLE PRECISION,
    "scoreMgr" DOUBLE PRECISION,
    "scoreAppr2" DOUBLE PRECISION,
    "scoreAppr3" DOUBLE PRECISION,
    "scoreGm" DOUBLE PRECISION,
    "commentSelf" TEXT,
    "commentMgr" TEXT,
    "commentAppr2" TEXT,
    "commentAppr3" TEXT,
    "commentGm" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessment_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "empCode" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'EMPLOYEE',
    "passwordHash" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delegations" (
    "id" TEXT NOT NULL,
    "delegatorId" TEXT NOT NULL,
    "delegateeId" TEXT NOT NULL,
    "permission" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "revokedBy" TEXT,

    CONSTRAINT "delegations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "changes" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employees_empCode_key" ON "employees"("empCode");

-- CreateIndex
CREATE INDEX "employees_empCode_idx" ON "employees"("empCode");

-- CreateIndex
CREATE INDEX "employees_group_idx" ON "employees"("group");

-- CreateIndex
CREATE INDEX "employees_assessmentLevel_idx" ON "employees"("assessmentLevel");

-- CreateIndex
CREATE INDEX "employees_isActive_idx" ON "employees"("isActive");

-- CreateIndex
CREATE INDEX "assessment_questions_applicableLevel_idx" ON "assessment_questions"("applicableLevel");

-- CreateIndex
CREATE INDEX "assessment_questions_category_idx" ON "assessment_questions"("category");

-- CreateIndex
CREATE INDEX "assessment_questions_isActive_idx" ON "assessment_questions"("isActive");

-- CreateIndex
CREATE INDEX "assessment_questions_order_idx" ON "assessment_questions"("order");

-- CreateIndex
CREATE INDEX "assessments_employeeId_idx" ON "assessments"("employeeId");

-- CreateIndex
CREATE INDEX "assessments_status_idx" ON "assessments"("status");

-- CreateIndex
CREATE INDEX "assessments_dueDate_idx" ON "assessments"("dueDate");

-- CreateIndex
CREATE INDEX "assessments_assessmentType_idx" ON "assessments"("assessmentType");

-- CreateIndex
CREATE INDEX "assessment_responses_assessmentId_idx" ON "assessment_responses"("assessmentId");

-- CreateIndex
CREATE INDEX "assessment_responses_questionId_idx" ON "assessment_responses"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_responses_assessmentId_questionId_key" ON "assessment_responses"("assessmentId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "users_empCode_key" ON "users"("empCode");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_empCode_idx" ON "users"("empCode");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "delegations_delegateeId_idx" ON "delegations"("delegateeId");

-- CreateIndex
CREATE INDEX "delegations_permission_idx" ON "delegations"("permission");

-- CreateIndex
CREATE INDEX "delegations_isActive_idx" ON "delegations"("isActive");

-- CreateIndex
CREATE INDEX "delegations_endDate_idx" ON "delegations"("endDate");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_entity_idx" ON "audit_logs"("entity");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("empCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_assessorId_fkey" FOREIGN KEY ("assessorId") REFERENCES "employees"("empCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_responses" ADD CONSTRAINT "assessment_responses_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_responses" ADD CONSTRAINT "assessment_responses_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "assessment_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
