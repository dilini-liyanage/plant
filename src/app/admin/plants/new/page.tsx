'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { X, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { PLANT_CATEGORIES } from '@/types/plant';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Category {
  _id: string;
  name: string;
}

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const handleCategorySelect = (value: string) => {
    setSelectedCategories((current) => {
      if (current.includes(value)) {
        return current.filter((name) => name !== value);
      }
      return [...current, value];
    });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/settings/addCategory');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

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

    if (selectedCategories.length === 0) {
      alert('Please select at least one category');
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
          categories: selectedCategories,
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

  useEffect(() => {
    console.log(categories);
  }, [categories]);
  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Add New Plant</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="plantName" className="mb-2 block text-sm font-medium">
            Plant Name
          </label>
          <Input
            id="plantName"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter plant name"
          />
        </div>

        <div>
          <label
            htmlFor="plantDescription"
            className="mb-2 block text-sm font-medium"
          >
            Description
          </label>
          <Textarea
            id="plantDescription"
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
            htmlFor="plantPrice"
            className="mb-2 block text-sm font-medium"
          >
            Price
          </label>
          <Input
            id="plantPrice"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
            placeholder="Enter plant price"
          />
        </div>

        <div>
          <label
            htmlFor="plantImage"
            className="mb-2 block text-sm font-medium"
          >
            Plant Image
          </label>
          <Input
            id="plantImage"
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

        <div className="space-y-2">
          <label
            htmlFor="careGuideInput"
            className="mb-2 block text-sm font-medium"
          >
            Care Guides
          </label>
          <div className="flex gap-2">
            <Input
              id="careGuideInput"
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

          <div className="mt-2 space-y-2">
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

        <div className="space-y-4">
          <label
            htmlFor="categories"
            className="mb-2 block text-sm font-medium"
          >
            Categories
          </label>
          <Select onValueChange={handleCategorySelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <SelectItem key={category._id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  No categories available
                </SelectItem>
              )}
            </SelectContent>
          </Select>

          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((categoryName) => (
                <div
                  key={categoryName}
                  className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm text-green-800"
                >
                  {categoryName}
                  <button
                    type="button"
                    onClick={() => handleCategorySelect(categoryName)}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button type="submit" disabled={loading || !imageUrl}>
          {loading ? 'Adding Plant...' : 'Add Plant'}
        </Button>
      </form>
    </div>
  );
}
