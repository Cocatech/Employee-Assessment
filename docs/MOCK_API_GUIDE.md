# Mock API Testing Guide

## สรุปที่ทำเสร็จแล้ว ✅

1. **Mock Data Structure** - สร้าง `mock/db.json` พร้อมข้อมูล:
   - 5 employees ครอบคลุมทุก assessment level
   - 11 questions สำหรับ 5 ระดับ
   - 2 assessments ตัวอย่าง
   - 3 responses ตัวอย่าง

2. **Mock API Routes** - สร้าง `mock/routes.json` สำหรับ API endpoint mappings

3. **Dependencies** - ติดตั้งแล้ว:
   - `json-server` - สำหรับ mock REST API
   - `react-hook-form` - สำหรับ form management

4. **Mock API Client** - สร้าง `src/lib/api/mock-client.ts`:
   - `mockEmployeeClient` - จัดการข้อมูล employees
   - `mockAssessmentClient` - จัดการ assessments
   - `mockQuestionClient` - จัดการ questions
   - `mockResponseClient` - จัดการ responses

5. **Data Adapter Layer** - สร้าง `src/lib/api/data-adapter.ts`:
   - สลับระหว่าง Mock API และ SharePoint อัตโนมัติ
   - ใช้ environment variable `USE_MOCK_API` สำหรับควบคุม
   - รองรับทุก CRUD operations

6. **Environment Configuration** - สร้าง `.env.local`:
   - `USE_MOCK_API=true` - เปิดใช้งาน mock mode
   - `MOCK_API_URL=http://localhost:3001` - URL ของ mock server

7. **Updated Actions** - อัปเดต `src/actions/employees.ts`:
   - ใช้ `employeeAdapter` สำหรับสลับ data source
   - เก็บ SharePoint code ไว้สำหรับ production

## วิธีการทดสอบ Mock API

### 1. เริ่ม Mock Server

เปิด Terminal ใหม่ใน VS Code (Command Prompt หรือ PowerShell) แล้วพิมพ์:

```bash
npm run mock:server
```

หรือใช้ batch file:
```bash
start-mock-server.bat
```

หรือใช้ npx โดยตรง:
```bash
npx json-server --watch mock/db.json --port 3001 --routes mock/routes.json
```

Mock server จะทำงานที่: **http://localhost:3001**

### 2. ทดสอบ API Endpoints

ใช้ browser หรือ curl/Postman ทดสอบ:

**ดูข้อมูล employees:**
```
http://localhost:3001/api/employees
```

**ดู employee คนเดียว:**
```
http://localhost:3001/api/employees?empCode=11002
```

**ดู questions:**
```
http://localhost:3001/api/questions
```

**ดู questions ตาม level:**
```
http://localhost:3001/api/questions?level=Management
```

**ดู assessments:**
```
http://localhost:3001/api/assessments
```

**ดู responses:**
```
http://localhost:3001/api/responses
```

### 3. เริ่ม Next.js Dev Server

เปิด Terminal อีกหน้าต่างแล้วรัน:

```bash
npm run dev
```

Next.js จะทำงานที่: **http://localhost:3000**

### 4. ตรวจสอบการทำงาน

- เปิด http://localhost:3000
- ไปที่หน้า Employee Management
- ระบบจะดึงข้อมูลจาก Mock API แทน SharePoint
- ลองทดสอบ CRUD operations

## การสลับระหว่าง Mock และ SharePoint

### ใช้ Mock API (สำหรับทดสอบ):
แก้ `.env.local`:
```
USE_MOCK_API=true
```

### ใช้ SharePoint (Production):
แก้ `.env.local`:
```
USE_MOCK_API=false
```

## ข้อมูล Mock ที่มี

### Employees (5 คน):
- 11002 - Ayako Tanaka (Management)
- 11007 - Wannapa Srisawat (Supervise)
- 11011 - Kamonchart Panyasiri (Operate)
- 11015 - Siriwan Kiatkulwong (Interpreter)
- 11020 - Somchai Jai-in (Operate - Temporary)

### Questions (11 ข้อ):
- General: 2 ข้อ
- Operate: 3 ข้อ
- Supervise: 2 ข้อ
- Management: 2 ข้อ
- Interpreter: 2 ข้อ

### Assessments (2 รายการ):
- ASS-2025-11002-001 (Management - DRAFT)
- ASS-2025-11011-001 (Operate - SUBMITTED_MGR)

## ปัญหาที่พบ

⚠️ **PowerShell Encoding Issue**: 
- Terminal มีปัญหา encoding ทำให้คำสั่ง npm/npx ไม่ทำงาน
- **วิธีแก้**: ให้เปิด Terminal ใหม่ใน VS Code แล้วพิมพ์คำสั่งเอง
- หรือใช้ Command Prompt (cmd) แทน PowerShell

## ขั้นตอนต่อไป

1. ✅ รัน mock server ด้วยตัวเอง
2. ✅ รัน dev server
3. ✅ ทดสอบ Employee Management UI กับ mock data
4. 🔜 ทดสอบ CRUD operations
5. 🔜 สร้าง Assessment workflow กับ mock data
6. 🔜 ทดสอบทุก features ก่อนไป deploy ใน SharePoint จริง

## Files ที่สร้างใหม่

```
.env.local                          # Environment config (USE_MOCK_API=true)
.env.local.example                  # Template สำหรับ setup
mock/
  db.json                           # Mock database
  routes.json                       # API route mappings
  README.md                         # Documentation
src/lib/api/
  mock-client.ts                    # Mock API client
  data-adapter.ts                   # Adapter สำหรับสลับ mock/real
  index.ts                          # Exports
start-mock-server.bat               # Batch script สำหรับเริ่ม server
docs/
  MOCK_API_GUIDE.md                 # คู่มือนี้
```

---

**หมายเหตุ**: ตอนนี้ระบบพร้อมทดสอบแบบ offline โดยไม่ต้องใช้ SharePoint แล้วครับ! 🎉
