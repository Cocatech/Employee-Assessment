import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Plus, Shield, UserCheck, UserX } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/db';

export const metadata = {
  title: 'User Management | TRTH Assessment',
  description: 'Manage system users and roles',
};

export default async function UsersPage() {
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

  // Get all users with employee info
  const users = await prisma.user.findMany({
    include: {
      employee: {
        select: { position: true, group: true, empName_Thai: true }
      }
    },
    orderBy: { createdAt: 'desc' },
  });

  const getRoleBadge = (role: string) => {
    const config = {
      ADMIN: { color: 'bg-red-100 text-red-800', icon: Shield },
      MANAGER: { color: 'bg-blue-100 text-blue-800', icon: UserCheck },
      EMPLOYEE: { color: 'bg-gray-100 text-gray-800', icon: Users },
    };
    const roleConfig = config[role as keyof typeof config] || config.EMPLOYEE;
    const Icon = roleConfig.icon;
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${roleConfig.color}`}>
        <Icon className="h-3 w-3" />
        {role}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage system users and their roles
            </p>
          </div>
        </div>
        <Link href="/dashboard/users/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">{users.filter(u => u.isActive).length}</p>
            </div>
            <UserCheck className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Inactive</p>
              <p className="text-2xl font-bold">{users.filter(u => !u.isActive).length}</p>
            </div>
            <UserX className="h-8 w-8 text-gray-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Admins</p>
              <p className="text-2xl font-bold">{users.filter(u => u.role === 'ADMIN').length}</p>
            </div>
            <Shield className="h-8 w-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">All Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Employee Code</th>
                <th className="text-left py-3 px-4 font-medium">Name</th>
                <th className="text-left py-3 px-4 font-medium">Position</th>
                <th className="text-left py-3 px-4 font-medium">Email</th>
                <th className="text-left py-3 px-4 font-medium">Role</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Last Login</th>
                <th className="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">
                    {user.empCode || <span className="text-muted-foreground italic">System</span>}
                  </td>
                  <td className="py-3 px-4">
                    <div>{user.name}</div>
                    {user.employee?.empName_Thai && (
                      <div className="text-xs text-muted-foreground">{user.employee.empName_Thai}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {user.employee?.position || '-'}
                    {user.employee?.group && (
                      <div className="text-xs text-muted-foreground">{user.employee.group}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{user.email}</td>
                  <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                  <td className="py-3 px-4">
                    {user.isActive ? (
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link href={`/dashboard/users/${user.id}`}>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
