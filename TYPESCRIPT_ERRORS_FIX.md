# การแก้ไข TypeScript Errors หลัง Migration

## สรุปปัญหา

หลังจากทำ migration จาก SharePoint มา PostgreSQL พบว่า Prisma schema กับโค้ด Server Actions ไม่ตรงกัน ทำให้เกิด TypeScript errors 93 ข้อ

## ตัวเลือกในการแก้ไข

### ตัวเลือก 1: แก้ไข Prisma Schema (แนะนำ) ⭐

แก้ไข `prisma/schema.prisma` ให้ field names ตรงกับที่ใช้ในโค้ด:

#### Assessment Model
```prisma
model Assessment {
  id                String   @id @default(cuid())
  title             String?
  description       String?
  assessmentType    String
  status            String
  empCode           String   // เปลี่ยนจาก employeeId
  createdBy         String?  // เปลี่ยนจาก assessorId
  assessmentDate    DateTime @default(now())
  assessmentYear    Int
  assessmentQuarter Int
  periodStart       DateTime
  periodEnd         DateTime
  dueDate           DateTime?
  submittedDate     DateTime?  // เปลี่ยนจาก submittedAt
  approvedDate      DateTime?  // เปลี่ยนจาก approvedAt
  completedDate     DateTime?  // เปลี่ยนจาก completedAt
  totalScore        Float?     // เปลี่ยนจาก score
  finalScore        Float?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  employee          Employee @relation("EmployeeAssessments", fields: [empCode], references: [empCode])
  creator           Employee? @relation("AssessmentCreator", fields: [createdBy], references: [empCode])
  responses         AssessmentResponse[]

  @@index([empCode])
  @@index([status])
  @@index([assessmentYear])
  @@index([assessmentQuarter])
  @@map("assessments")
}
```

#### AssessmentQuestion Model
```prisma
model AssessmentQuestion {
  id              String   @id @default(cuid())
  questionText    String   // เปลี่ยนจาก questionTitle
  description     String?
  category        String
  assessmentLevel String   // เปลี่ยนจาก applicableLevel
  weight          Float
  maxScore        Float    @default(5)
  questionOrder   Int      // เปลี่ยนจาก order
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  responses       AssessmentResponse[]

  @@index([assessmentLevel])
  @@index([category])
  @@index([isActive])
  @@map("assessment_questions")
}
```

#### AssessmentResponse Model
```prisma
model AssessmentResponse {
  id              String   @id @default(cuid())
  assessmentId    String
  questionId      String
  
  // Scores
  scoreSelf       Float?
  scoreManager    Float?   // เปลี่ยนจาก scoreMgr
  scoreApprover2  Float?   // เปลี่ยนจาก scoreAppr2
  scoreGM         Float?   // เปลี่ยนจาก scoreGm
  
  // Comments
  commentSelf     String?  @db.Text
  commentManager  String?  @db.Text   // เปลี่ยนจาก commentMgr
  commentApprover2 String? @db.Text   // เปลี่ยนจาก commentAppr2
  commentGM       String?  @db.Text   // เปลี่ยนจาก commentGm
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  assessment      Assessment @relation(fields: [assessmentId], references: [id], onDelete: Cascade)
  question        AssessmentQuestion @relation(fields: [questionId], references: [id])

  @@unique([assessmentId, questionId])
  @@index([assessmentId])
  @@map("assessment_responses")
}
```

#### ขั้นตอนการแก้ไข
```bash
# 1. แก้ไข prisma/schema.prisma ตามด้านบน

# 2. ลบ old migrations (ถ้ามี)
rm -rf prisma/migrations

# 3. Generate Prisma Client ใหม่
npm run prisma:generate

# 4. Push schema to database
npm run db:push

# 5. Seed initial data
npm run db:seed

# 6. ตรวจสอบ TypeScript
npm run type-check
```

### ตัวเลือก 2: แก้ไข Server Actions

แก้ไขโค้ดใน `src/actions/*.ts` และ `src/lib/db/*.ts` ให้ใช้ชื่อ fields ตาม Prisma schema ปัจจุบัน แต่วิธีนี้จะเสียเวลามากกว่า

## สาเหตุของปัญหา

Migration ทำได้เร็วเกินไป โดยไม่ได้ synchronize field names ระหว่าง:
1. Prisma schema (`prisma/schema.prisma`)
2. Type definitions (`src/types/*.ts`)
3. Server Actions (`src/actions/*.ts`)
4. Database queries (`src/lib/db/*.ts`)

## Recommendation

แนะนำให้ใช้ **ตัวเลือก 1** เพราะ:
- ✅ แก้ไขครั้งเดียวที่ Prisma schema
- ✅ Prisma จะ auto-generate TypeScript types
- ✅ ไม่ต้องแก้โค้ดหลายไฟล์
- ✅ Field names ชัดเจนและสอดคล้องกับระบบเดิม

## Files ที่ต้องแก้ไข

หากเลือกตัวเลือก 1:
- ✅ `prisma/schema.prisma`
- ✅ Run commands ด้านบน

หากเลือกตัวเลือก 2:
- `src/actions/employees.ts` (ใช้งานได้แล้ว ✅)
- `src/actions/assessments.ts` (ต้องแก้ 33 errors)
- `src/actions/questions.ts` (ต้องแก้ 17 errors)
- `src/actions/responses.ts` (ต้องแก้ 18 errors)
- `src/lib/db/queries.ts` (ต้องแก้ 17 errors)
- `prisma/seed.ts` (ต้องแก้ 5 errors)
- `src/app/api/assessment/approve/route.ts` (ต้องแก้ 1 error)
- `src/app/api/assessment/submit/route.ts` (ต้องแก้ 1 error)
- `src/lib/auth/config.ts` (ต้องแก้ 1 error)

## Next Steps

1. เลือกวิธีการแก้ไข (แนะนำตัวเลือก 1)
2. ทำตามขั้นตอน
3. ทดสอบระบบ
4. Update documentation

---

**หมายเหตุ:** ระบบส่วนใหญ่ทำงานได้แล้ว แค่ต้อง sync field names ให้ตรงกัน!
