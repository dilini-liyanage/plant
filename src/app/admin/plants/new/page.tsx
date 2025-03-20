'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { X } from 'lucide-react';

export default function NewPlant() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });
  const [careGuides, setCareGuides] = useState<string[]>([]);
  const [newCareGuide, setNewCareGuide] = useState('');

  const addCareGuide = () => {
    if (newCareGuide.trim()) {
      setCareGuides([...careGuides, newCareGuide.trim()]);
      setNewCareGuide('');
    }
  };

  const removeCareGuide = (index: number) => {
    setCareGuides(careGuides.filter((_, i) => i !== index));
  };

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
    if (!imageUrl) {
      alert('Please upload an image first');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/plants/addPlant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price) || 0,
          imageUrl,
          careGuides,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add plant');
      }

      router.push('/admin/plants');
      router.refresh();
    } catch (error) {
      console.error('Error adding plant:', error);
      alert('Failed to add plant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Add New Plant</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Plant Name
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter plant name"
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
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Enter plant description"
            rows={4}
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            Price
          </label>
          <Input
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            placeholder="Enter plant price"
          />
        </div>

        <div>
          <label htmlFor="image" className="mb-2 block text-sm font-medium">
            Plant Image
          </label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            required
            disabled={loading}
          />
          {imageUrl && (
            <div className="mt-2">
              <Image
                src={imageUrl}
                alt="Plant preview"
                width={200}
                height={200}
                className="rounded-lg object-cover"
              />
            </div>
          )}
        </div>

        {/* Care Guides Section */}
        <div className="space-y-2">
          <label htmlFor="careGuide" className="mb-2 block text-sm font-medium">
            Care Guides
          </label>
          <div className="flex gap-2">
            <Input
              id="careGuide"
              value={newCareGuide}
              onChange={(e) => setNewCareGuide(e.target.value)}
              placeholder="Add a care guide point"
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCareGuide();
                }
              }}
            />
            <Button type="button" onClick={addCareGuide} variant="secondary">
              Add
            </Button>
          </div>

          {/* Care Guides List */}
          <div className="mt-2 space-y-2" aria-label="Care guides list">
            {careGuides.map((guide, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-md bg-gray-50 p-2"
              >
                <span className="flex-1">{guide}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCareGuide(index)}
                  className="h-8 w-8 p-0"
                  aria-label={`Remove care guide: ${guide}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={loading || !imageUrl}>
          {loading ? 'Adding Plant...' : 'Add Plant'}
        </Button>
      </form>
    </div>
  );
}
