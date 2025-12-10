import { auth } from '@/lib/auth';
import { isSystemAdmin } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import { getPositions } from '@/actions/settings';
import { PositionManager } from '@/components/settings/PositionManager';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Briefcase, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Positions | Settings | TRTH Assessment',
  description: 'Manage employee positions',
};

export default async function PositionsPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  if (!await isSystemAdmin()) {
    redirect('/dashboard');
  }

  const positions = await getPositions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Briefcase className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Positions</h1>
            <p className="text-sm text-muted-foreground">
              Manage employee positions and job titles
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
      <Card className="p-4 bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-800">
          💡 Drag and drop to reorder positions. Changes will be reflected in employee forms.
        </p>
      </Card>

      {/* Position Manager */}
      <PositionManager positions={positions} />
    </div>
  );
}
