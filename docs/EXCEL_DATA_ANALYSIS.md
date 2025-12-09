# Excel Data Analysis - TRTH Assessment System

## 📊 ไฟล์: TRTH Assessment Data.xlsx

**วันที่วิเคราะห์:** December 9, 2025  
**ขนาดไฟล์:** ~22 MB  
**จำนวน Sheets:** 7 sheets

---

## 📋 Sheet Structure Overview

### 1. **Emp_data** (Employee Master Data)
- **Rows:** 218 พนักงาน
- **Columns:** 27 columns
- **Purpose:** ข้อมูลพนักงานหลัก

#### 🔑 Key Fields (จาก Row 2):
| Column | Field Name | Example Data | Notes |
|--------|-----------|--------------|-------|
| 1 | **Empcode** | 11002, 11007 | รหัสพนักงาน (Primary Key) |
| 2 | **Title Eng name** | Ms., Mr. | คำนำหน้าภาษาอังกฤษ |
| 3 | **Eng name** | Ayako, Wannapa | ชื่อภาษาอังกฤษ |
| 4 | **Eng Surname** | Kaihatsu, Pawana | นามสกุลภาษาอังกฤษ |
| 5 | **Title Thai name** | น.ส., นาย | คำนำหน้าภาษาไทย |
| 6 | **Thai name** | อายาโคะ ไคฮาสึ | ชื่อ-นามสกุลภาษาไทย |
| 7 | **Plant** | Amata | โรงงาน/สาขา |
| 8 | **Group** | ADM,DRC | **กลุ่มงาน (ตรงกับที่เราปรับไปแล้ว!)** |
| 9 | **Team** | Environment (A),Safety/Energy (G) | **ทีม (ตรงกับที่เราปรับไปแล้ว!)** |
| 10 | **Position** | General Manager, Manager | ตำแหน่งงาน |
| 11 | **Employee day** | 1-Oct-10 | วันที่เข้างาน |
| 12 | **Probation term** | 92 | ระยะเวลาทดลองงาน (วัน) |
| 13 | **Pass probation date** | 1-Jan-11 | วันผ่านทดลองงาน |
| 14 | **Sending Assessment** | 7-Apr-25 | วันส่งประเมิน |
| 15 | **Self evaluation** | Ms. Ayako K. | ผู้ประเมินตนเอง |

#### ✅ ข้อสังเกต:
- ใช้ **Group** และ **Team** แล้ว! (ตรงกับที่เราปรับ structure)
- Group format: "ADM,DRC" (คั่นด้วย comma)
- Team format: รายละเอียดหลายบรรทัด/หลายทีม

---

### 2. **Emp_pic** (Employee Photos)
- **Rows:** 217 records
- **Columns:** 3 columns
- **Purpose:** เก็บรูปภาพพนักงาน

#### Fields:
| Column | Field Name | Notes |
|--------|-----------|-------|
| 1 | Empcode | รหัสพนักงาน |
| 2 | Eng name | ชื่อ |
| 3 | Emp pic | รูปภาพ (embedded) |

---

### 3. **Operate** (Operate Level Assessment)
- **Rows:** 149 records
- **Columns:** 44 columns
- **Purpose:** แบบฟอร์มประเมินระดับ Operate

#### Header:
> **人事考課シート  แบบฟอร์มประเมินผลการปฏิบัติงานของพนักงาน_Operate Level**

#### โครงสร้าง:
- มีคำถาม/KPI หลายข้อ
- แต่ละข้อมี: คะแนน (Self, Manager, Approver, GM) + Comments
- 44 columns = ข้อมูลพนักงาน + คะแนนแต่ละ KPI

---

### 4. **General** (General Level Assessment)
- **Rows:** 148 records
- **Columns:** 45 columns
- **Purpose:** แบบฟอร์มประเมินระดับ General (คำถามทั่วไป)

#### Header:
> **人事考課シート  แบบฟอร์มประเมินผลการปฏิบัติงานของพนักงาน_General Level**

---

### 5. **Supervise** (Supervise Level Assessment)
- **Rows:** 171 records
- **Columns:** 44 columns
- **Purpose:** แบบฟอร์มประเมินระดับ Supervise

#### Header:
> **人事考課シート  แบบฟอร์มประเมินผลการปฏิบัติงานของพนักงาน_Supervise Level**

---

### 6. **Interpreter** (Interpreter Level Assessment)
- **Rows:** 157 records
- **Columns:** 45 columns
- **Purpose:** แบบฟอร์มประเมินสำหรับล่าม

---

### 7. **Management** (Management Level Assessment)
- **Rows:** 127 records
- **Columns:** 44 columns
- **Purpose:** แบบฟอร์มประเมินระดับ Management

#### Header:
> **人事考課シート  แบบฟอร์มประเมินผลการปฏิบัติงานของพนักงาน_Management Level**

---

## 🎯 Key Findings

### ✅ ข้อมูลที่ตรงกับระบบของเรา:

1. **Group และ Team Fields**
   - Excel ใช้ "Group" และ "Team" แล้ว!
   - ตรงกับ structure ที่เราเพิ่งปรับไป
   - ไม่ต้องแก้ไขอะไรเพิ่มเติม ✅

2. **5 Assessment Levels**
   - General, Interpreter, Operate, Supervise, Management
   - ตรงกับที่เราออกแบบไว้แล้ว ✅

3. **Assessment Structure**
   - แต่ละ level มี sheet แยก
   - เก็บคะแนนและ comments หลายระดับ (Self, Manager, Approver, GM)
   - ตรงกับ ScoreTable component ที่เรามี ✅

### 📊 ข้อมูลสถิติ:

| Sheet | Records | Purpose |
|-------|---------|---------|
| Emp_data | 218 | พนักงานทั้งหมด |
| Operate | 149 | ประเมินระดับ Operate |
| Supervise | 171 | ประเมินระดับ Supervise |
| Interpreter | 157 | ประเมินสำหรับล่าม |
| General | 148 | คำถามทั่วไป |
| Management | 127 | ประเมินระดับ Management |

---

## 🔄 การ Map ข้อมูลเข้า SharePoint

### TRTH_Master_Employee (จาก Emp_data sheet)

```typescript
{
  Title: "11002",                    // Empcode
  EmpName_Eng: "Ayako Kaihatsu",    // Eng name + Eng Surname
  EmpName_Thai: "อายาโคะ ไคฮาสึ",     // Thai name
  Email: "",                         // ต้องเพิ่มจาก AD หรือ manual
  PhoneNumber: "",                   // ไม่มีใน Excel (ต้องเพิ่ม)
  Position: "General Manager",       // Position
  Group: "ADM,DRC",                  // Group ✅
  Team: "Environment (A),...",       // Team ✅
  AssessmentLevel: "Management",     // ต้องกำหนดตาม Position
  EmployeeType: "Permanent",         // ต้องกำหนด (ไม่มีใน Excel)
  Approver1_ID: "",                  // ต้องกำหนด
  Approver2_ID: "",                  // ต้องกำหนด
  GM_ID: "",                         // ต้องกำหนด
  JoinDate: "2010-10-01",           // Employee day
  WarningCount: 0
}
```

### TRTH_Questions (จาก Operate/General/Supervise/Interpreter/Management sheets)

ต้องแยกคำถามออกจากแต่ละ sheet และสร้างเป็น master questions:

```typescript
{
  Title: "OP-001",
  QuestionTitle: "Quality of Work",
  Description: "คำอธิบายจากคอลัมน์ใน Excel",
  Category: "Quality",
  Weight: 15,
  MaxScore: 5,
  ApplicableLevel: "Operate",
  IsActive: true,
  DisplayOrder: 1
}
```

### TRTH_Assessments (สร้างจากข้อมูล Assessment ในแต่ละ sheet)

```typescript
{
  Title: "ASS-2025-11002-001",
  EmployeeCode: "11002",
  AssessmentPeriod: "2025-Annual",
  AssessmentLevel: "Management",
  Status: "COMPLETED",
  // ... fields อื่นๆ
}
```

### TRTH_Responses (คะแนนและ comments จากแต่ละคำถาม)

```typescript
{
  Title: "RESP-001",
  AssessmentID: "ASS-2025-11002-001",
  QuestionID: "OP-001",
  Score_Self: 4,
  Score_Manager: 5,
  Score_Approver2: 4,
  Score_GM: 5,
  Comment_Self: "...",
  Comment_Manager: "...",
  // ...
}
```

---

## 📝 Next Steps

### 1. ข้อมูลที่ต้องเพิ่ม/ปรับปรุง:
- ❌ Email (ต้องดึงจาก Azure AD หรือเพิ่มด้วยมือ)
- ❌ PhoneNumber (ไม่มีใน Excel)
- ❌ EmployeeType (Permanent/Temporary - ต้องกำหนด)
- ❌ Approver hierarchy (Approver1_ID, Approver2_ID, GM_ID)
- ❌ AssessmentLevel (ต้อง map จาก Position)

### 2. ข้อมูลที่พร้อมใช้งาน:
- ✅ Empcode
- ✅ Names (Eng + Thai)
- ✅ Position
- ✅ **Group** ✅
- ✅ **Team** ✅
- ✅ JoinDate
- ✅ Plant
- ✅ Assessment records (5 levels)

### 3. การเตรียม SharePoint:
1. สร้าง 4 Lists ตาม `SHAREPOINT_SETUP.md`
2. Import ข้อมูลพนักงานจาก Emp_data sheet
3. แยกคำถามจาก 5 sheets (Operate, General, Supervise, Interpreter, Management)
4. สร้าง Assessment records
5. Import คะแนนและ comments

---

## 🎉 สรุป

ข้อมูลใน Excel **สอดคล้องกับระบบที่เราออกแบบไว้มากๆ!**

- ✅ Group และ Team fields ตรงกัน 100%
- ✅ 5 Assessment Levels ครบถ้วน
- ✅ โครงสร้างคะแนนและ comments ตรงกับ ScoreTable
- ✅ มีข้อมูลพนักงาน 218 คน พร้อม assessment records

**พร้อมนำไป implement ใน SharePoint ได้เลยครับ!** 🚀
