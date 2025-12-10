import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { DeleteUserButton } from '@/components/users/DeleteUserButton';
import * as bcrypt from 'bcryptjs';

export const metadata = {
  title: 'Edit User | TRTH Assessment',
  description: 'Edit system user details',
};

async function updateUser(formData: FormData) {
  'use server';
  
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const role = formData.get('role') as string;
  const isActive = formData.get('isActive') === 'true';
  const password = formData.get('password') as string;

  const updateData: any = {
    email,
    name,
    role,
    isActive,
  };

  if (password) {
    updateData.passwordHash = await bcrypt.hash(password, 10);
  }

  await prisma.user.update({
    where: { id },
    data: updateData,
  });

  revalidatePath('/dashboard/users');
  redirect('/dashboard/users');
}

async function deleteUser(formData: FormData) {
  'use server';
  
  const id = formData.get('id') as string;
  
  await prisma.user.delete({
    where: { id },
  });

  revalidatePath('/dashboard/users');
  redirect('/dashboard/users');
}

export default async function EditUserPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  
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

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      employee: true,
    },
  });

  if (!user) {
    redirect('/dashboard/users');
  }

  // Get all employees for dropdown
  const employees = await prisma.employee.findMany({
    where: { isActive: true },
    orderBy: { empCode: 'asc' },
  });

  const currentEmployee = user.employee;

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

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit User</h1>
        <DeleteUserButton userId={user.id} deleteAction={deleteUser} />
      </div>

      <Card className="p-6">
        <form action={updateUser} className="space-y-6">
          <input type="hidden" name="id" value={user.id} />

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Employee Link
            </label>
            {user.empCode ? (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{user.empCode}</span>
                    {user.employee && (
                      <span className="text-sm text-gray-600 ml-2">
                        - {user.employee.empName_Eng} ({user.employee.position})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="text-yellow-900 font-medium">🔧 System Admin (No Employee Link)</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              defaultValue={user.name}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Full Name
            </label>
            <Input
              type="text"
              value={currentEmployee?.empName_Eng || user.name}
              disabled
              className="bg-gray-100"
            />
            <p className="text-xs text-gray-500">
              Name will be automatically updated from selected employee
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={user.email}
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
              defaultValue={user.role}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="EMPLOYEE">Employee</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="isActive" className="text-sm font-medium">
              Status
            </label>
            <select
              id="isActive"
              name="isActive"
              defaultValue={user.isActive ? 'true' : 'false'}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              New Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Leave blank to keep current password"
              minLength={6}
            />
            <p className="text-xs text-gray-500">Leave blank to keep current password</p>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <Link href="/dashboard/users">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Update User
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
