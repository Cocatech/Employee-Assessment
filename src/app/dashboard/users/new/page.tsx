import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import * as bcrypt from 'bcryptjs';

export const metadata = {
  title: 'Add New User | TRTH Assessment',
  description: 'Create a new system user',
};

async function createUser(formData: FormData) {
  'use server';
  
  const empCode = (formData.get('empCode') as string) || null;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const role = formData.get('role') as string;
  const password = formData.get('password') as string;

  if (!email || !name || !role || !password) {
    throw new Error('Missing required fields');
  }

  // ถ้ามี empCode ให้ตรวจสอบว่ามี Employee อยู่จริง
  if (empCode) {
    const employee = await prisma.employee.findUnique({
      where: { empCode },
    });

    if (!employee) {
      throw new Error(`Employee with code ${empCode} not found`);
    }

    // ตรวจสอบว่ามี User ที่ใช้ empCode นี้แล้วหรือไม่
    const existingUser = await prisma.user.findUnique({
      where: { empCode },
    });

    if (existingUser) {
      throw new Error(`User with empCode ${empCode} already exists`);
    }
  }

  // ตรวจสอบว่ามี email ซ้ำหรือไม่
  const existingEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existingEmail) {
    throw new Error(`User with email ${email} already exists`);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      empCode,
      email,
      name,
      role,
      passwordHash,
      isActive: true,
    },
  });

  revalidatePath('/dashboard/users');
  redirect('/dashboard/users');
}

export default async function NewUserPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const currentUser = session.user as any;
  const role = currentUser?.role;
  const userType = currentUser?.userType;
  
  // Only System Admin or Employee Admin can access
  if (userType !== 'SYSTEM_ADMIN' && role !== 'ADMIN') {
    redirect('/dashboard');
  }

  // ดึง Employee ที่ยังไม่มี User
  const employees = await prisma.employee.findMany({
    where: {
      isActive: true,
      user: null, // ยังไม่มี User เชื่อมอยู่
    },
    orderBy: { empCode: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/dashboard/users">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold">Add New User</h1>

      <Card className="p-6">
        <form action={createUser} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="empCode" className="text-sm font-medium">
              Select Employee (Optional)
            </label>
            <select
              id="empCode"
              name="empCode"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">System User (No Employee Link)</option>
              {employees.map((emp) => (
                <option key={emp.empCode} value={emp.empCode}>
                  {emp.empCode} - {emp.empName_Eng} ({emp.position})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500">
              Leave empty for system admin accounts. Only employees without user accounts are shown.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              placeholder="e.g., System Administrator"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="user@trth.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              id="role"
              name="role"
              required
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select Role</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="EMPLOYEE">Employee</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password <span className="text-red-500">*</span>
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
            />
            <p className="text-xs text-gray-500">Minimum 6 characters</p>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <Link href="/dashboard/users">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Create User
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
