import { auth } from '@/lib/auth';
import { isSystemAdmin } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import { getGroups } from '@/actions/settings';
import { GroupManager } from '@/components/settings/GroupManager';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Building, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Groups | Settings | TRTH Assessment',
  description: 'Manage organizational groups',
};

export default async function GroupsPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  if (!await isSystemAdmin()) {
    redirect('/dashboard');
  }

  const groups = await getGroups();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Building className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Groups</h1>
            <p className="text-sm text-muted-foreground">
              Manage organizational groups and departments
            </p>
          </div>
        </div>
        <Link href="/dashboard/settings">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Settings
          </Button>
        </Link>
      </div>

      {/* Info */}
      <Card className="p-4 bg-green-50 border-green-200">
        <p className="text-sm text-green-800">
          💡 Drag and drop to reorder groups. Group codes can be combined using commas (e.g., PRD,QA).
        </p>
      </Card>

      {/* Group Manager */}
      <GroupManager groups={groups} />
    </div>
  );
}
