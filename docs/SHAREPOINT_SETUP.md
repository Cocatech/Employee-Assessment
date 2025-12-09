# SharePoint Lists Setup Guide - TRTH Employee Assessment System

## 📋 Overview

This document provides comprehensive instructions for setting up SharePoint Lists for the TRTH Employee Assessment System using a **Normalized Structure** approach.

### Architecture Choice: Normalized Structure ✅

We use a normalized database design with separate lists for:
- **Master Data**: Employees, Questions (KPI Master)
- **Transactional Data**: Assessments, Responses (per KPI)

**Benefits:**
- ✅ Flexible - Support multiple KPIs per assessment
- ✅ Detailed tracking - Individual scores and comments per KPI
- ✅ Scalable - Easy to add/modify KPIs without schema changes
- ✅ Reusable - Questions can be reused across assessments
- ✅ Auditable - Complete history of changes per question

---

## 📚 SharePoint Lists Structure

### List 1: TRTH_Master_Employee
**Purpose:** Store employee master data

### List 2: TRTH_Assessments
**Purpose:** Store assessment headers and workflow data

### List 3: TRTH_Questions
**Purpose:** Store KPI/question master data

### List 4: TRTH_Responses
**Purpose:** Store detailed scores and comments for each question in each assessment

---

## 🔧 Detailed Setup Instructions

## List 1: TRTH_Master_Employee

### Step 1: Create the List
1. Go to your SharePoint site
2. Click **New** → **List**
3. Choose **Blank list**
4. Name: `TRTH_Master_Employee`
5. Description: "Employee master data for TRTH Assessment System"
6. Click **Create**

### Step 2: Add Columns

#### Default Columns (Keep these):
- **Title** - Will be used for Employee Code

#### Columns to Add:

| Column Name | Type | Required | Settings | Description |
|------------|------|----------|----------|-------------|
| **EmpName_Eng** | Single line of text | ✅ Yes | Max 100 chars | Employee name (English) |
| **EmpName_Thai** | Single line of text | ⚠️ Optional | Max 100 chars | Employee name (Thai) |
| **Email** | Single line of text | ⚠️ Optional | Format: email | Employee email address |
| **PhoneNumber** | Single line of text | ⚠️ Optional | Max 20 chars | Contact phone number |
| **Position** | Single line of text | ✅ Yes | Max 100 chars | Job position/title |
| **Department** | Choice or Text | ✅ Yes | See choices below | Department name |
| **AssessmentLevel** | Choice | ✅ Yes | See choices below | Assessment level/grade |
| **EmployeeType** | Choice | ✅ Yes | Permanent, Temporary | Type of employment |
| **Approver1_ID** | Single line of text | ✅ Yes | Max 50 chars | Manager/First approver employee code |
| **Approver2_ID** | Single line of text | ⚠️ Optional | Max 50 chars | Second approver (can be "-" or empty) |
| **GM_ID** | Single line of text | ✅ Yes | Max 50 chars | GM employee code |
| **JoinDate** | Date and Time | ✅ Yes | Date only | Employee join date (YYYY-MM-DD) |
| **WarningCount** | Number | ⚠️ Optional | Default: 0 | Number of warnings/issues |

#### Department Choices (Customize as needed):
```
IT
HR
Finance
Operations
Sales
Marketing
Production
Quality Assurance
Logistics
Administration
```

#### AssessmentLevel Choices:
```
Level 1 - Entry
Level 2 - Junior
Level 3 - Senior
Level 4 - Lead
Level 5 - Manager
Level 6 - Senior Manager
Level 7 - Director
Level 8 - Executive
```

#### EmployeeType Choices:
```
Permanent
Temporary
```

### Step 3: Configure List Settings
1. Go to **List settings** → **Advanced settings**
2. Enable "Allow management of content types": **Yes**
3. Set "Item-level permissions": **Read all, Create and edit own**

### Step 4: Sample Data

```
Title: EMP001
EmpName_Eng: John Smith
EmpName_Thai: จอห์น สมิธ
Email: john.smith@trth.co.th
PhoneNumber: 081-234-5678
Position: Software Engineer
Department: IT
AssessmentLevel: Level 3 - Senior
EmployeeType: Permanent
Approver1_ID: MGR001
Approver2_ID: MGR002
GM_ID: GM001
JoinDate: 2020-01-15
WarningCount: 0
```

---

## List 2: TRTH_Assessments

### Step 1: Create the List
1. **New** → **List** → **Blank list**
2. Name: `TRTH_Assessments`
3. Description: "Assessment records and workflow tracking"
4. Click **Create**

### Step 2: Add Columns

#### Columns to Add:

| Column Name | Type | Required | Settings | Description |
|------------|------|----------|----------|-------------|
| **Title** | Single line of text | ✅ Yes | Max 200 chars | Assessment title (auto-filled) |
| **EmpCode** | Single line of text | ✅ Yes | Max 50 chars | Employee code being assessed |
| **AssessmentType** | Choice | ✅ Yes | See choices below | Type/period of assessment |
| **Status** | Choice | ✅ Yes | See choices below | Current workflow status |
| **Current_Assignee_Email** | Single line of text | ⚠️ Optional | Format: email | Email of current assignee (for Power Automate) |
| **PeriodStart** | Date and Time | ✅ Yes | Date only | Assessment period start date |
| **PeriodEnd** | Date and Time | ✅ Yes | Date only | Assessment period end date |
| **DueDate** | Date and Time | ✅ Yes | Date only | Submission due date |
| **SubmittedAt** | Date and Time | ⚠️ Optional | Date and time | When first submitted by employee |
| **ApprovedAt** | Date and Time | ⚠️ Optional | Date and time | When fully approved |
| **RejectionReason** | Multiple lines of text | ⚠️ Optional | Plain text | Reason if rejected |
| **Score** | Number | ⚠️ Optional | Decimal, 0-5 | Overall score |
| **FinalScore** | Number | ⚠️ Optional | Decimal, 0-5 | Calculated final score |
| **Type** | Choice | ⚠️ Optional | self, manager, peer, 360 | Legacy field |
| **Description** | Multiple lines of text | ⚠️ Optional | Rich text | Assessment description/notes |

#### AssessmentType Choices:
```
Annual
Mid-year
Probation
Special
```

#### Status Choices:
```
DRAFT
SUBMITTED_MGR
SUBMITTED_APPR2
SUBMITTED_GM
COMPLETED
REJECTED
```

#### Type Choices (Legacy):
```
self
manager
peer
360
```

### Step 3: Configure Validation
1. Go to **List settings** → **Validation settings**
2. Add formula: `=[PeriodEnd]>=[PeriodStart]`
3. Message: "Period End must be after Period Start"

### Step 4: Sample Data

```
Title: Annual Assessment 2025 - EMP001
EmpCode: EMP001
AssessmentType: Annual
Status: DRAFT
Current_Assignee_Email: emp001@trth.co.th
PeriodStart: 2025-01-01
PeriodEnd: 2025-12-31
DueDate: 2026-01-15
Score: (empty)
FinalScore: (empty)
```

---

## List 3: TRTH_Questions

### Step 1: Create the List
1. **New** → **List** → **Blank list**
2. Name: `TRTH_Questions`
3. Description: "KPI and question master data"
4. Click **Create**

### Step 2: Add Columns

| Column Name | Type | Required | Settings | Description |
|------------|------|----------|----------|-------------|
| **Title** | Single line of text | ✅ Yes | Max 200 chars | Question/KPI topic |
| **Description** | Multiple lines of text | ⚠️ Optional | Rich text | Detailed description/criteria |
| **Category** | Choice | ✅ Yes | See choices below | Question category |
| **Weight** | Number | ✅ Yes | Decimal, 0-100 | Weight/importance (%) |
| **Order** | Number | ✅ Yes | Integer | Display order |
| **IsActive** | Yes/No | ✅ Yes | Default: Yes | Is this question currently active |
| **ApplicableLevel** | Choice or Text | ⚠️ Optional | Multiple selections | Which levels this applies to |

#### Category Choices:
```
Job Knowledge
Quality of Work
Productivity
Communication
Teamwork
Leadership
Problem Solving
Initiative
Attendance
Professional Development
```

#### ApplicableLevel (Allow multiple selections):
```
Level 1 - Entry
Level 2 - Junior
Level 3 - Senior
Level 4 - Lead
Level 5 - Manager
Level 6 - Senior Manager
Level 7 - Director
Level 8 - Executive
All Levels
```

### Step 3: Sample Data

```
Title: Technical Skills
Description: Demonstrates proficiency in required technical skills and tools
Category: Job Knowledge
Weight: 15
Order: 1
IsActive: Yes
ApplicableLevel: All Levels

Title: Code Quality
Description: Writes clean, maintainable, and well-documented code
Category: Quality of Work
Weight: 15
Order: 2
IsActive: Yes
ApplicableLevel: Level 1 - Entry; Level 2 - Junior; Level 3 - Senior
```

---

## List 4: TRTH_Responses

### Step 1: Create the List
1. **New** → **List** → **Blank list**
2. Name: `TRTH_Responses`
3. Description: "Detailed assessment responses per question"
4. Click **Create**

### Step 2: Add Columns

| Column Name | Type | Required | Settings | Description |
|------------|------|----------|----------|-------------|
| **Title** | Single line of text | ✅ Yes | Auto: "Response-{AssessmentId}-{QuestionId}" | Unique identifier |
| **AssessmentId** | Single line of text | ✅ Yes | Max 50 chars | Reference to assessment ID |
| **QuestionId** | Single line of text | ✅ Yes | Max 50 chars | Reference to question ID |
| **QuestionTitle** | Single line of text | ⚠️ Optional | Max 200 chars | Copy of question title (for reference) |
| **QuestionWeight** | Number | ⚠️ Optional | Decimal | Copy of weight (for calculation) |
| **ScoreSelf** | Number | ⚠️ Optional | Decimal, 0-5 | Employee self-assessment score |
| **ScoreMgr** | Number | ⚠️ Optional | Decimal, 0-5 | Manager score |
| **ScoreAppr2** | Number | ⚠️ Optional | Decimal, 0-5 | Approver2 score |
| **ScoreGm** | Number | ⚠️ Optional | Decimal, 0-5 | GM score |
| **CommentSelf** | Multiple lines of text | ⚠️ Optional | Plain text | Employee comment |
| **CommentMgr** | Multiple lines of text | ⚠️ Optional | Plain text | Manager comment |
| **CommentAppr2** | Multiple lines of text | ⚠️ Optional | Plain text | Approver2 comment |
| **CommentGm** | Multiple lines of text | ⚠️ Optional | Plain text | GM comment |

### Step 3: Configure Indexed Columns
For performance, index these columns:
1. Go to **List settings** → **Indexed columns**
2. Create indexes for:
   - AssessmentId
   - QuestionId

### Step 4: Sample Data

```
Title: Response-001-Q1
AssessmentId: 001
QuestionId: Q1
QuestionTitle: Technical Skills
QuestionWeight: 15
ScoreSelf: 4.0
ScoreMgr: 4.5
ScoreAppr2: (empty)
ScoreGm: (empty)
CommentSelf: I have improved my technical skills significantly
CommentMgr: Shows strong technical abilities and continuous learning
```

---

## 🔗 Relationships Between Lists

```
TRTH_Master_Employee (1) ────< (Many) TRTH_Assessments
                                        │
                                        └─< (Many) TRTH_Responses >─┐
                                                                      │
TRTH_Questions (1) ──────────────────────────────────────────────────┘
                                                (Many)
```

**Key Relationships:**
1. **Employee → Assessments**: One employee can have many assessments
2. **Assessment → Responses**: One assessment has many responses (one per question)
3. **Question → Responses**: One question can appear in many assessment responses

---

## 📊 Graph API Queries

### Get SharePoint Site ID

```http
GET https://graph.microsoft.com/v1.0/sites/{tenant}.sharepoint.com:/sites/{site-name}
```

Example:
```http
GET https://graph.microsoft.com/v1.0/sites/trth.sharepoint.com:/sites/TRTHAssessment
```

Response includes `id` field - save this as `SHAREPOINT_SITE_ID`

### Query Employee by Code

```http
GET https://graph.microsoft.com/v1.0/sites/{site-id}/lists/TRTH_Master_Employee/items
  ?$expand=fields
  &$filter=fields/Title eq 'EMP001'
```

### Get All Assessments for Employee

```http
GET https://graph.microsoft.com/v1.0/sites/{site-id}/lists/TRTH_Assessments/items
  ?$expand=fields
  &$filter=fields/EmpCode eq 'EMP001'
  &$orderby=fields/Created desc
```

### Get Responses for Assessment

```http
GET https://graph.microsoft.com/v1.0/sites/{site-id}/lists/TRTH_Responses/items
  ?$expand=fields
  &$filter=fields/AssessmentId eq '001'
  &$orderby=fields/QuestionId
```

---

## 🔒 Permissions Setup

### Recommended Permission Levels:

1. **HR/Admin Group**
   - Full Control on all lists
   - Can add/edit/delete all items

2. **Managers Group**
   - Contribute on TRTH_Assessments
   - Read on TRTH_Master_Employee
   - Read on TRTH_Questions
   - Contribute on TRTH_Responses (filtered to their team)

3. **Employees Group**
   - Read own items on TRTH_Master_Employee
   - Read/Edit own items on TRTH_Assessments
   - Read/Edit own items on TRTH_Responses

### Steps to Configure:
1. Go to **List settings** → **Permissions for this list**
2. Click **Break permission inheritance**
3. Create groups: HR_Admin, Managers, Employees
4. Assign permission levels as above
5. Use item-level permissions for row-level security

---

## 🧪 Testing Checklist

### Phase 1: Data Entry
- [ ] Create 3+ test employees (different types, levels, departments)
- [ ] Verify all required fields are captured
- [ ] Test validation rules
- [ ] Test lookup relationships

### Phase 2: Assessment Workflow
- [ ] Create test assessment for each employee
- [ ] Add questions to assessment (create responses)
- [ ] Test score entry for different roles
- [ ] Verify calculations work correctly

### Phase 3: Integration Testing
- [ ] Test Graph API queries from application
- [ ] Verify authentication works
- [ ] Test CRUD operations through app
- [ ] Check Power Automate triggers

### Phase 4: Performance Testing
- [ ] Load 100+ employees
- [ ] Create 50+ assessments
- [ ] Verify query performance
- [ ] Check indexed columns are used

---

## 📈 Data Migration Guide

### From Excel/CSV to SharePoint

#### Step 1: Prepare Data Files

**Employees.csv:**
```csv
Title,EmpName_Eng,EmpName_Thai,Email,PhoneNumber,Position,Department,AssessmentLevel,EmployeeType,Approver1_ID,Approver2_ID,GM_ID,JoinDate,WarningCount
EMP001,John Smith,จอห์น สมิธ,john@trth.co.th,081-234-5678,Engineer,IT,Level 3,Permanent,MGR001,MGR002,GM001,2020-01-15,0
```

**Questions.csv:**
```csv
Title,Description,Category,Weight,Order,IsActive,ApplicableLevel
Technical Skills,Proficiency in technical skills,Job Knowledge,15,1,Yes,All Levels
```

#### Step 2: Import Using SharePoint UI
1. Open each list
2. Click **New** → **Upload** → **From File**
3. Select CSV file
4. Map columns
5. Import

#### Step 3: Import Using PowerShell
```powershell
Connect-PnPOnline -Url "https://trth.sharepoint.com/sites/TRTHAssessment"

# Import Employees
Import-Csv "Employees.csv" | ForEach-Object {
    Add-PnPListItem -List "TRTH_Master_Employee" -Values @{
        "Title" = $_.Title
        "EmpName_Eng" = $_.EmpName_Eng
        "EmpName_Thai" = $_.EmpName_Thai
        # ... other fields
    }
}
```

---

## 🐛 Troubleshooting

### Issue: "Access Denied" when querying via Graph API

**Solution:**
1. Verify App Registration has `Sites.Read.All` permission
2. Grant admin consent in Azure Portal
3. Check site permissions for service account

### Issue: Slow query performance

**Solution:**
1. Add indexes to frequently queried columns (AssessmentId, QuestionId, EmpCode)
2. Use `$select` to limit returned fields
3. Implement pagination with `$top` and `$skip`
4. Cache frequently accessed data

### Issue: Validation errors on import

**Solution:**
1. Verify date format is YYYY-MM-DD
2. Check choice field values match exactly (case-sensitive)
3. Ensure required fields have values
4. Check numeric fields don't have text

---

## 📚 Additional Resources

### SharePoint Documentation
- [SharePoint Lists](https://support.microsoft.com/sharepoint)
- [Column Types](https://support.microsoft.com/en-us/office/list-column-types-0d8ddb7b-7dc7-414d-a283-ee9dca891df7)

### Graph API Documentation
- [Work with lists](https://docs.microsoft.com/en-us/graph/api/resources/list)
- [Work with list items](https://docs.microsoft.com/en-us/graph/api/resources/listitem)
- [Filter query examples](https://docs.microsoft.com/en-us/graph/query-parameters)

### PowerShell PnP
- [PnP PowerShell](https://pnp.github.io/powershell/)
- [SharePoint PnP cmdlets](https://pnp.github.io/powershell/cmdlets/)

---

## 📝 Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-12-09 | 1.0 | Initial setup guide with normalized structure | System |
| | | Added all required fields from PDF requirements | |
| | | Includes sample data and migration guide | |

---

## ✅ Next Steps After Setup

1. ✅ Verify all lists are created with correct columns
2. ✅ Import sample data for testing
3. ✅ Configure permissions for different user groups
4. ✅ Set up Power Automate flows (see POWER_AUTOMATE_SETUP.md)
5. ✅ Test Graph API queries from the application
6. ✅ Update `.env.local` with SHAREPOINT_SITE_ID
7. ✅ Run end-to-end workflow test

---

*Last updated: December 9, 2025*
*For questions or issues, contact the development team*
