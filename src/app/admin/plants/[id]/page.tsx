'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Plant {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

export default function EditPlant({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [plant, setPlant] = useState<Plant | null>(null);

  useEffect(() => {
    // Fetch plant data
    const fetchPlant = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/plants/getAllPlants`);
        if (!response.ok) throw new Error('Failed to fetch plant');

        const data = await response.json();
        const foundPlant = data.plants.find((p: Plant) => p._id === params.id);
        if (foundPlant) {
          setPlant(foundPlant);
        } else {
          throw new Error('Plant not found');
        }
      } catch (error) {
        console.error('Error fetching plant:', error);
        alert('Failed to load plant data');
        router.push('/admin/plants');
      }
    };

    fetchPlant();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plant) return;

    setLoading(true);
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/plants/updatePlant`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: plant._id,
          name: plant.name,
          description: plant.description,
          imageUrl: plant.imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update plant');
      }

      router.push('/admin/plants');
      router.refresh();
    } catch (error) {
      console.error('Error updating plant:', error);
      alert('Failed to update plant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!plant) {
    return (
      <div className="p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Edit Plant</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Plant Name
          </label>
          <Input
            id="name"
            value={plant.name}
            onChange={(e) => setPlant({ ...plant, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            Description
          </label>
          <Textarea
            id="description"
            value={plant.description}
            onChange={(e) =>
              setPlant({ ...plant, description: e.target.value })
            }
            required
            rows={4}
          />
        </div>
        <div>
          <label htmlFor="imageUrl" className="mb-2 block text-sm font-medium">
            Image URL
          </label>
          <Input
            id="imageUrl"
            value={plant.imageUrl}
            onChange={(e) => setPlant({ ...plant, imageUrl: e.target.value })}
            required
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Plant'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/plants')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
