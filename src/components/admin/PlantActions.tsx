'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface PlantActionsProps {
  plantId: string;
}

export function PlantActions({ plantId }: PlantActionsProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this plant?')) {
      return;
    }

    try {
      const response = await fetch('/api/plants/deletePlant', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: plantId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete plant');
      }

      router.refresh();
    } catch (error) {
      console.error('Error deleting plant:', error);
      alert('Failed to delete plant. Please try again.');
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => router.push(`/admin/plants/view/${plantId}`)}
        variant="outline"
        size="sm"
        className="bg-LightGreenBG hover:bg-LightGreenBG/80 text-black"
      >
        View
      </Button>
      <Button
        onClick={() => router.push(`/admin/plants/edit/${plantId}`)}
        variant="outline"
        size="sm"
      >
        Edit
      </Button>
      <Button
        onClick={handleDelete}
        variant="destructive"
        size="sm"
        className="bg-red-400 hover:bg-red-500"
      >
        Delete
      </Button>
    </div>
  );
}
