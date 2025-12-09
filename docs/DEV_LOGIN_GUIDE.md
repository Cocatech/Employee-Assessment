# 🔐 Development Login Guide

## การ Login ในโหมดพัฒนา (Mock API)

ตอนนี้ระบบตั้งค่าให้ใช้ Mock API (`USE_MOCK_API=true`) และปิด Azure AD ไว้ สามารถ login ได้ด้วย **Credentials** โดยไม่ต้อง Microsoft 365

---

## 🚀 วิธี Login (Development Mode)

### เปิดหน้า Login
```
http://localhost:3000/auth/signin
```

### เลือก Tab: **"Temporary Staff"**

### ใช้ข้อมูลพนักงานใน Mock Database:

#### 👤 Option 1: Management Level
- **Employee Code:** `11002`
- **Password:** `password` หรือ `11002` หรือ `01102010`
- **Name:** Ayako Kaihatsu
- **Level:** Management

#### 👤 Option 2: Supervise Level
- **Employee Code:** `11007`
- **Password:** `password` หรือ `11007` หรือ `15032015`
- **Name:** Wannapa Pawana
- **Level:** Supervise

#### 👤 Option 3: Operate Level (Permanent)
- **Employee Code:** `11011`
- **Password:** `password` หรือ `11011` หรือ `20062018`
- **Name:** Kamonchart Somchai
- **Level:** Operate

#### 👤 Option 4: Interpreter Level
- **Employee Code:** `11015`
- **Password:** `password` หรือ `11015` หรือ `10082019`
- **Name:** Siriwan Interpreter
- **Level:** Interpreter

#### 👤 Option 5: Operate Level (Temporary)
- **Employee Code:** `11020`
- **Password:** `password` หรือ `11020` หรือ `15012024`
- **Name:** Somchai Temporary
- **Level:** Operate

---

## 🔑 Password Options (Development)

ในโหมด development สามารถใช้ password ได้ 3 แบบ:

1. **`password`** - Simple password สำหรับทดสอบง่ายๆ ✅ แนะนำ
2. **`{empCode}`** - ใช้ Employee Code เป็น password (เช่น `11002`)
3. **`DDMMYYYY`** - JoinDate ในรูปแบบ วันเดือนปี (เช่น `01102010`)

---

## 📱 หน้าที่สามารถเข้าถึงหลัง Login

### User Pages:
- `/dashboard` - Dashboard หลัก
- `/assessment` - หน้าประเมินตนเอง
- `/profile` - ข้อมูลส่วนตัว

### Admin Pages (ถ้ามีสิทธิ์):
- `/admin/employees` - จัดการพนักงาน ✅ **พร้อมใช้งาน**
- `/admin/employees/[empCode]` - รายละเอียดพนักงาน ✅ **พร้อมใช้งาน**
- `/admin/assessments` - จัดการการประเมิน
- `/admin/questions` - จัดการคำถาม

---

## ⚙️ Configuration Files

### `.env.local` (Current Settings):
```env
# Mock API Mode
USE_MOCK_API=true
MOCK_API_URL=http://localhost:3001

# Auth (ไม่จำเป็นต้องตั้งค่า Azure AD)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=development-secret-key-change-in-production

# Azure AD (ปิดการใช้งานในโหมด dev)
AZURE_AD_CLIENT_ID=
AZURE_AD_CLIENT_SECRET=
AZURE_AD_TENANT_ID=

# SharePoint (ไม่ใช้ในโหมด mock)
SHAREPOINT_SITE_ID=
```

---

## 🔄 สลับระหว่าง Mock และ Production

### Mock Mode (Development):
```env
USE_MOCK_API=true
```
- ใช้ json-server (http://localhost:3001)
- Login ด้วย credentials (ไม่ต้อง Azure AD)
- Password: `password`, `{empCode}`, หรือ `DDMMYYYY`

### Production Mode:
```env
USE_MOCK_API=false
```
- ใช้ SharePoint Online
- Login ด้วย Microsoft Entra ID (Azure AD)
- ต้องตั้งค่า AZURE_AD_* variables

---

## 🧪 ทดสอบ Login

### 1. เริ่ม Mock Server (Terminal 1):
```bash
npm run mock:server
```

### 2. เริ่ม Next.js (Terminal 2):
```bash
npm run dev
```

### 3. เปิดเบราว์เซอร์:
```
http://localhost:3000
```

### 4. ระบบจะ redirect ไปหน้า signin อัตโนมัติ

### 5. Login ด้วย:
- **Employee Code:** `11002`
- **Password:** `password`

### 6. หลัง login สำเร็จจะไปที่:
```
http://localhost:3000/dashboard
```

---

## ✅ Mock Data Available

### Employees: 5 คน
1. **11002** - Ayako Kaihatsu (Management)
2. **11007** - Wannapa Pawana (Supervise)
3. **11011** - Kamonchart Somchai (Operate)
4. **11015** - Siriwan Interpreter (Interpreter)
5. **11020** - Somchai Temporary (Operate - Temporary)

### Questions: 11 ข้อ
- General: 2 questions
- Operate: 3 questions
- Supervise: 2 questions
- Management: 2 questions
- Interpreter: 2 questions

### Assessments: 2 รายการ
- ASS-2025-11002-001 (Management - DRAFT)
- ASS-2025-11011-001 (Operate - SUBMITTED_MGR)

---

## 🐛 Troubleshooting

### ปัญหา: ไม่สามารถ login ได้
**แก้ไข:**
1. ตรวจสอบว่า mock server ทำงานที่ http://localhost:3001
2. ตรวจสอบว่า `.env.local` มี `USE_MOCK_API=true`
3. Restart Next.js server

### ปัญหา: หน้า blank หลัง login
**แก้ไข:**
1. เช็ค browser console สำหรับ errors
2. เช็ค terminal logs
3. ลอง clear browser cookies/cache

### ปัญหา: Employee not found
**แก้ไข:**
1. ตรวจสอบว่า empCode ถูกต้อง (11002, 11007, 11011, 11015, 11020)
2. ตรวจสอบว่า mock server มีข้อมูล: http://localhost:3001/api/employees

---

## 🎯 Next Steps

1. ✅ Login เข้าระบบด้วย empCode `11002` password `password`
2. ✅ ทดสอบหน้า Dashboard
3. ✅ ทดสอบหน้า Employee Management (`/admin/employees`)
4. 🔜 ทดสอบ Assessment workflow
5. 🔜 สร้าง Question Management
6. 🔜 Integration testing ทั้งระบบ

---

**พร้อมทดสอบแล้วครับ!** ใช้ empCode `11002` กับ password `password` เพื่อเข้าสู่ระบบ 🚀
