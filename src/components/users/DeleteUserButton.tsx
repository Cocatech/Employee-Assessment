'use client';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface DeleteUserButtonProps {
  userId: string;
  deleteAction: (formData: FormData) => Promise<void>;
}

export function DeleteUserButton({ userId, deleteAction }: DeleteUserButtonProps) {
  const handleDelete = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this user?')) {
      const formData = new FormData();
      formData.append('id', userId);
      deleteAction(formData);
    }
  };

  return (
    <form onSubmit={handleDelete}>
      <Button type="submit" variant="destructive">
        <Trash2 className="h-4 w-4 mr-2" />
        Delete User
      </Button>
    </form>
  );
}
