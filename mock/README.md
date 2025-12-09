# Mock Server - TRTH Assessment System

## 🎯 Purpose
Mock REST API server for testing and development without SharePoint connection.

## 📊 Data Source
- Mock data based on real Excel data (TRTH_Assessment_Data.xlsx)
- 5 sample employees covering all assessment levels
- Questions for all 5 levels (General, Interpreter, Operate, Supervise, Management)
- Sample assessments and responses

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install --save-dev json-server
```

### 2. Start Mock Server
```bash
npm run mock:server
```

Server runs on: `http://localhost:3001`

### 3. Test API
```bash
# Get all employees
curl http://localhost:3001/api/employees

# Get employee by code
curl http://localhost:3001/api/employees?empCode=11002

# Get questions for specific level
curl http://localhost:3001/api/questions?applicableLevel=Operate

# Get all assessments
curl http://localhost:3001/api/assessments

# Get responses for assessment
curl http://localhost:3001/api/responses?assessmentId=ASS-2025-11011-001
```

## 📁 Files Structure

```
mock/
├── db.json           # Mock database (auto-generated from Excel data)
├── routes.json       # API route mappings
└── README.md         # This file
```

## 🔗 API Endpoints

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees?empCode={code}` - Get employee by code
- `POST /api/employees` - Create employee
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee

### Questions
- `GET /api/questions` - Get all questions
- `GET /api/questions?applicableLevel={level}` - Get questions by level
- `POST /api/questions` - Create question
- `PUT /api/questions/{id}` - Update question

### Assessments
- `GET /api/assessments` - Get all assessments
- `GET /api/assessments/{id}` - Get assessment by ID
- `GET /api/assessments?empCode={code}` - Get assessments for employee
- `POST /api/assessments` - Create assessment
- `PUT /api/assessments/{id}` - Update assessment

### Responses
- `GET /api/responses` - Get all responses
- `GET /api/responses?assessmentId={id}` - Get responses for assessment
- `POST /api/responses` - Create response
- `PUT /api/responses/{id}` - Update response

## 💾 Sample Data

### Employees (5 records)
- **11002** - Ayako Kaihatsu (Management Level, GM)
- **11007** - Wannapa Pawana (Supervise Level, Manager)
- **11011** - Kamonchart Somchai (Operate Level, Senior Engineer)
- **11015** - Siriwan Interpreter (Interpreter Level)
- **11020** - Somchai Temporary (Operate Level, Temporary)

### Questions (11 records)
- **General** (2): Attendance, Company Values
- **Operate** (3): Quality, Productivity, Safety
- **Supervise** (2): Leadership, Decision Making
- **Management** (2): Strategic Planning, Resource Management
- **Interpreter** (2): Translation Accuracy, Language Proficiency

### Assessments (2 records)
- ASS-2025-11002-001 (Ayako - DRAFT)
- ASS-2025-11011-001 (Kamonchart - SUBMITTED_MGR with responses)

## 🔄 Switch Between Mock and Real Data

### Option 1: Environment Variable
```bash
# .env.local
USE_MOCK_API=true   # Use mock server
USE_MOCK_API=false  # Use SharePoint
```

### Option 2: Code Flag
```typescript
// src/lib/config.ts
export const USE_MOCK = process.env.NODE_ENV === 'development';
```

## 🧪 Testing Scenarios

### 1. Employee Management
- ✅ List all employees
- ✅ Filter by group
- ✅ Filter by employee type
- ✅ Search by name/code
- ✅ View employee details
- ✅ CRUD operations

### 2. Assessment Workflow
- ✅ Create new assessment
- ✅ Self-assessment (DRAFT)
- ✅ Submit to manager (SUBMITTED_MGR)
- ✅ Manager review (SUBMITTED_APPR2)
- ✅ Approver2 review (SUBMITTED_GM)
- ✅ GM final review (COMPLETED)
- ✅ Reject flow (REJECTED)

### 3. Score Entry
- ✅ Enter self scores
- ✅ Enter manager scores
- ✅ Calculate weighted average
- ✅ Color-coded display

## 🔧 Customization

### Add More Data
Edit `db.json` directly or use API:

```bash
# Add new employee
curl -X POST http://localhost:3001/api/employees \
  -H "Content-Type: application/json" \
  -d '{"empCode":"11025","empName_Eng":"New Employee",...}'
```

### Modify Routes
Edit `routes.json` to change API paths.

## 📝 Notes

- Data persists in `db.json` during development
- Server auto-reloads on file changes
- CORS enabled for local development
- Perfect for UI/UX testing before SharePoint integration
