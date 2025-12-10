import { auth } from '@/lib/auth';
import { isSystemAdmin } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import { getTeams, getGroups } from '@/actions/settings';
import { TeamManager } from '@/components/settings/TeamManager';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Teams | Settings | TRTH Assessment',
  description: 'Manage teams',
};

export default async function TeamsPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  if (!await isSystemAdmin()) {
    redirect('/dashboard');
  }

  const [teams, groups] = await Promise.all([
    getTeams(),
    getGroups(),
  ]);

  const groupOptions = groups.map((g) => ({
    code: g.code,
    name: g.name,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Teams</h1>
            <p className="text-sm text-muted-foreground">
              Manage teams within groups
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
      <Card className="p-4 bg-purple-50 border-purple-200">
        <p className="text-sm text-purple-800">
          💡 Drag and drop to reorder teams. Teams can be linked to specific groups.
        </p>
      </Card>

      {/* Team Manager */}
      <TeamManager teams={teams} groups={groupOptions} />
    </div>
  );
}
