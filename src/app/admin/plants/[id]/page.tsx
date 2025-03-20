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

export default function EditPlant({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  // Fetch existing plant data
  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const response = await fetch(`/api/plants/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch plant');
        const plant = await response.json();

        setFormData({
          name: plant.name,
          description: plant.description,
        });
        setImageUrl(plant.imageUrl);
      } catch (error) {
        console.error('Error fetching plant:', error);
        alert('Failed to load plant data');
      }
    };

    fetchPlant();
  }, [params.id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'plant-nursery'
    );

    try {
      setLoading(true);
      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        setImageUrl(data.secure_url);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !imageUrl) return;

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
          id: params.id,
          name: formData.name,
          description: formData.description,
          imageUrl: imageUrl,
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
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
            rows={4}
          />
        </div>

        <div className="space-y-4">
          <span className="mb-2 block text-sm font-medium">Plant Image</span>

          {/* Current Image Display */}
          <div className="relative">
            {imageUrl && (
              <div className="relative aspect-square w-64 overflow-hidden rounded-lg border">
                <Image
                  src={imageUrl}
                  alt="Current plant image"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </div>
            )}

            {/* Upload Button Overlay */}
            <div className="mt-4">
              <label
                htmlFor="image-upload"
                className="inline-flex cursor-pointer items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {loading ? 'Uploading...' : 'Change Image'}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={loading}
                  className="hidden"
                />
              </label>
              <p className="mt-2 text-sm text-gray-500">
                Click to upload a new image
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button type="submit" disabled={loading || !imageUrl}>
            {loading ? 'Updating Plant...' : 'Update Plant'}
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
