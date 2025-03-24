'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

// Define the Category interface
interface Category {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export default function Categories() {
  const router = useRouter();
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/settings/addCategory');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/settings/addCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: categoryName }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to add category');
      }

      const newCategory = await response.json();
      setCategories((prev) => [...prev, newCategory.category]);
      setCategoryName('');
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to add category'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Categories</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label
            htmlFor="categoryName"
            className="mb-2 block text-sm font-medium"
          >
            Category Name
          </label>
          <Input
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
            required
            className="mb-2"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" disabled={loading || !categoryName.trim()}>
          {loading ? 'Adding Category...' : 'Add Category'}
        </Button>
      </form>

      {/* Categories List */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Existing Categories</h2>
        <div className="space-y-2">
          {categories.map((category: Category) => (
            <div
              key={category._id}
              className="flex items-center justify-between p-3 bg-white rounded-lg shadow"
            >
              <span>{category.name}</span>
              <span className="text-sm text-gray-500">
                {new Date(category.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
