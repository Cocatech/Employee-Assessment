# Questions Structure - TRTH Assessment System

## 📋 Overview

ข้อมูลจากไฟล์ PDF จริง (อยู่ใน `docs/questions/`):
- `General_Question.pdf` - คำถามทั่วไป
- `Interpreter_Question.pdf` - คำถามสำหรับล่าม
- `Operate_question.pdf` - คำถามสำหรับระดับปฏิบัติการ
- `supervise_question.pdf` - คำถามสำหรับระดับหัวหน้างาน
- `Management_Question.pdf` - คำถามสำหรับระดับผู้จัดการ

---

## 🎯 Assessment Levels

ระบบมี **5 ระดับหลัก**:

### 1. **General Level** (ทั่วไป)
- คำถามพื้นฐานที่ใช้กับทุกคน
- สามารถรวมกับคำถามระดับอื่นๆ ได้

### 2. **Interpreter Level** (ล่าม)
- ตำแหน่งเฉพาะทาง: ล่าม/นักแปล
- มีคำถามเฉพาะด้านภาษาและการสื่อสาร

### 3. **Operate Level** (ระดับปฏิบัติการ)
- พนักงานระดับปฏิบัติการ
- Level 1-3 ประมาณ
- เน้นทักษะการปฏิบัติงาน

### 4. **Supervise Level** (ระดับหัวหน้างาน)
- หัวหน้างาน/ซุปเปอร์ไวเซอร์
- Level 4-5 ประมาณ
- เน้นการบริหารทีมเบื้องต้น

### 5. **Management Level** (ระดับผู้จัดการ)
- ผู้จัดการ/ผู้บริหาร
- Level 6+ ประมาณ
- เน้นการบริหารจัดการระดับสูง

---

## 📊 Questions/KPI Structure

### จากไฟล์ Operate_question.pdf และ supervise_question.pdf

แต่ละชุดคำถามจะมี:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| **questionId** | string | รหัสคำถาม | "OP-001", "SV-001" |
| **title** | string | หัวข้อ KPI | "Quality of Work" |
| **description** | string | รายละเอียดคำถาม | "Accuracy and thoroughness of work" |
| **category** | string | หมวดหมู่ | "Performance", "Behavior", "Competency" |
| **weight** | number | น้ำหนัก (%) | 10, 15, 20 |
| **maxScore** | number | คะแนนเต็ม | 5 (scale 1-5) |
| **applicableLevel** | string | ระดับที่ใช้ | "Operate", "Supervise", "All" |
| **isActive** | boolean | สถานะใช้งาน | true/false |
| **order** | number | ลำดับการแสดง | 1, 2, 3... |

---

## 🗂️ SharePoint List: TRTH_Questions

### List Schema

```typescript
interface QuestionListItem {
  Title: string;              // questionId (Primary Key)
  QuestionTitle: string;      // ชื่อคำถาม/KPI
  Description: string;        // รายละเอียด
  Category: string;           // หมวดหมู่ (Choice)
  Weight: number;             // น้ำหนัก %
  MaxScore: number;           // คะแนนเต็ม (default: 5)
  ApplicableLevel: string;    // "Operate" | "Supervise" | "All"
  IsActive: boolean;          // สถานะใช้งาน
  DisplayOrder: number;       // ลำดับการแสดง
  CreatedDate: Date;
  ModifiedDate: Date;
}
```

### Category Choices
```
- Performance (ผลการปฏิบัติงาน)
- Quality (คุณภาพงาน)
- Behavior (พฤติกรรม)
- Competency (สมรรถนะ)
- Leadership (ความเป็นผู้นำ) - Supervise only
- Team Management (การบริหารทีม) - Supervise only
```

### ApplicableLevel Choices
```
- General
- Interpreter
- Operate
- Supervise
- Management
- All (ใช้ได้กับทุกระดับ)
```
## 💡 Example Questions

### General Level (ตัวอย่าง)

| ID | Title | Description | Category | Weight | Level |
|----|-------|-------------|----------|--------|-------|
| GN-001 | Attendance | การเข้างานสม่ำเสมอ | Behavior | 10% | General |
| GN-002 | Company Values | การยึดมั่นในค่านิยมองค์กร | Behavior | 10% | General |
| GN-003 | Professional Ethics | จรรยาบรรณวิชาชีพ | Behavior | 10% | General |

### Interpreter Level (ตัวอย่าง)

| ID | Title | Description | Category | Weight | Level |
|----|-------|-------------|----------|--------|-------|
| INT-001 | Translation Accuracy | ความแม่นยำในการแปล | Quality | 25% | Interpreter |
| INT-002 | Language Proficiency | ความชำนาญภาษา | Competency | 20% | Interpreter |
| INT-003 | Cultural Sensitivity | ความเข้าใจวัฒนธรรม | Competency | 15% | Interpreter |

### Operate Level (ตัวอย่าง)

| ID | Title | Description | Category | Weight | Level |
|----|-------|-------------|----------|--------|-------|
| OP-001 | Quality of Work | ความถูกต้องและความละเอียดของงาน | Quality | 15% | Operate |
| OP-002 | Productivity | ปริมาณงานที่ทำสำเร็จตามเป้าหมาย | Performance | 15% | Operate |
| OP-003 | Teamwork | การทำงานร่วมกับผู้อื่น | Behavior | 10% | Operate |
| OP-004 | Safety Compliance | การปฏิบัติตามมาตรฐานความปลอดภัย | Performance | 15% | Operate |

### Supervise Level (ตัวอย่าง)

| ID | Title | Description | Category | Weight | Level |
|----|-------|-------------|----------|--------|-------|
| SV-001 | Team Leadership | ความสามารถในการนำทีม | Leadership | 20% | Supervise |
| SV-002 | Decision Making | การตัดสินใจและแก้ไขปัญหา | Competency | 15% | Supervise |
| SV-003 | Team Development | การพัฒนาทีมงาน | Leadership | 15% | Supervise |
| SV-004 | Goal Achievement | การบรรลุเป้าหมายของทีม | Performance | 20% | Supervise |

### Management Level (ตัวอย่าง)

| ID | Title | Description | Category | Weight | Level |
|----|-------|-------------|----------|--------|-------|
| MG-001 | Strategic Planning | การวางแผนเชิงกลยุทธ์ | Leadership | 25% | Management |
| MG-002 | Resource Management | การบริหารทรัพยากร | Competency | 20% | Management |
| MG-003 | Change Management | การบริหารการเปลี่ยนแปลง | Leadership | 20% | Management |
| MG-004 | Business Acumen | ความรอบรู้ทางธุรกิจ | Competency | 15% | Management |

**หมายเหตุ:** น้ำหนักรวมของแต่ละระดับต้อง = 100%ement | การบรรลุเป้าหมายของทีม | Performance | 20% | Supervise |
| SV-005 | Communication | การสื่อสารและประสานงาน | Behavior | 10% | Supervise |

**Total Weight: 100%**

---

## 🔄 Response Structure

### SharePoint List: TRTH_Responses

แต่ละ Response จะเชื่อมกับคำถาม:

```typescript
interface ResponseListItem {
  Title: string;                    // responseId
  AssessmentID: string;             // Link to Assessment
  QuestionID: string;               // Link to Question
  QuestionTitle: string;            // For reference
  QuestionWeight: number;           // For calculation
  
  // Scores (1-5 scale)
  Score_Self: number;               // คะแนนจากตนเอง
  Score_Manager: number;            // คะแนนจากหัวหน้า
  Score_Approver2: number;          // คะแนนจาก Approver2
  Score_GM: number;                 // คะแนนจาก GM
  
  // Comments
  Comment_Self: string;             // ความคิดเห็นจากตนเอง
  Comment_Manager: string;          // ความคิดเห็นจากหัวหน้า
  Comment_Approver2: string;        // ความคิดเห็นจาก Approver2
  Comment_GM: string;               // ความคิดเห็นจาก GM
  
  // Metadata
  CreatedDate: Date;
  ModifiedDate: Date;
}
```

---

## 🎨 Score Table Display

### Color Coding (ตาม ScoreTable.tsx)

| Role | Color | Column Header | Can Edit |
|------|-------|---------------|----------|
| **Self** | 🔵 Blue | Score (Self) | ตัวเอง (DRAFT) |
### CSV Format for Questions Import

```csv
Title,QuestionTitle,Description,Category,Weight,MaxScore,ApplicableLevel,IsActive,DisplayOrder
GN-001,Attendance,การเข้างานสม่ำเสมอ,Behavior,10,5,General,TRUE,1
INT-001,Translation Accuracy,ความแม่นยำในการแปล,Quality,25,5,Interpreter,TRUE,1
OP-001,Quality of Work,ความถูกต้องและความละเอียดของงาน,Quality,15,5,Operate,TRUE,1
SV-001,Team Leadership,ความสามารถในการนำทีม,Leadership,20,5,Supervise,TRUE,1
MG-001,Strategic Planning,การวางแผนเชิงกลยุทธ์,Leadership,25,5,Management,TRUE,1
```Weighted Average
finalScore = Σ(questionScore × questionWeight) / Σ(questionWeight)

// Example:
// Question 1: Score 4, Weight 15% → 4 × 0.15 = 0.60
// Question 2: Score 5, Weight 20% → 5 × 0.20 = 1.00
// Question 3: Score 3, Weight 10% → 3 × 0.10 = 0.30
// Total: (0.60 + 1.00 + 0.30) / (0.15 + 0.20 + 0.10) × 5 = 4.22/5
```

---

## 📥 Data Import

### CSV Format for Questions Import

```csv
Title,QuestionTitle,Description,Category,Weight,MaxScore,ApplicableLevel,IsActive,DisplayOrder
OP-001,Quality of Work,ความถูกต้องและความละเอียดของงาน,Quality,15,5,Operate,TRUE,1
OP-002,Productivity,ปริมาณงานที่ทำสำเร็จตามเป้าหมาย,Performance,15,5,Operate,TRUE,2
SV-001,Leadership,ความสามารถในการนำทีม,Leadership,20,5,Supervise,TRUE,1
```

---

## 🔍 Next Steps

1. **รอยืนยันจากคุณ**: โครงสร้างนี้ตรงกับความต้องการไหม?
2. **ดูข้อมูลจาก PDF**: ต้องการให้ผมแยกรายละเอียดคำถามจากไฟล์ PDF จริงไหม?
3. **สร้าง Seed Data**: สร้างข้อมูลตัวอย่างสำหรับ import เข้า SharePoint
4. **Update Types**: ปรับปรุง TypeScript types ให้ตรงกับโครงสร้างจริง

---

## 📌 Notes

- คำถามแต่ละระดับควรมีน้ำหนักรวม = 100%
- Scale คะแนน: 1-5 (1 = ต่ำสุด, 5 = สูงสุด)
- แต่ละ Assessment จะดึงคำถามที่ตรงกับ `assessmentLevel` ของพนักงาน
- สามารถมีคำถามที่ใช้ได้กับทุกระดับ (ApplicableLevel = "All")

