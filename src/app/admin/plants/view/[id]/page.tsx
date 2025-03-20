'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';

interface Plant {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

export default function ViewPlant({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });

  // Fetch existing plant data
  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const response = await fetch(`/api/plants/getPlant?id=${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch plant');
        const plant = await response.json();

        setFormData({
          name: plant.name,
          description: plant.description,
          price: plant.price,
        });
        setImageUrl(plant.imageUrl);
      } catch (error) {
        console.error('Error fetching plant:', error);
        alert('Failed to load plant data');
      }
    };

    fetchPlant();
  }, [params.id]);

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Edit Plant</h1>
      <form className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Plant Name
          </label>
          <p>{formData.name}</p>
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            Description
          </label>
          <p>{formData.description}</p>
        </div>

        <div>
          <label htmlFor="price" className="mb-2 block text-sm font-medium">
            Price
          </label>
          <p>{formData.price}</p>
        </div>
        <div className="space-y-4">
          <span className="mb-2 block text-sm font-medium">Plant Image</span>

          <p>{imageUrl}</p>
          <div className="relative">
            <div className="mt-4"></div>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/plants')}
          >
            Back to Home page
          </Button>
        </div>
      </form>
    </div>
  );
}
