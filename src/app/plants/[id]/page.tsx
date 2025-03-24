'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ArrowLeft, DollarSign, Minus, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Plant {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  price: string;
  careGuides?: string[];
  categories?: string[];
}

export default function ViewPlant({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [plant, setPlant] = useState<Plant | null>(null);

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const response = await fetch(`/api/plants/getPlant?id=${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch plant');
        const data = await response.json();
        setPlant(data);
      } catch (error) {
        console.error('Error fetching plant:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlant();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Plant Not Found</h1>
        <Button onClick={() => router.push('/plants')} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Plants
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <Button
          onClick={() => router.push('/plants')}
          variant="ghost"
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Plants
        </Button>

        <div className="grid md:grid-cols-3 gap-16">
          {/* Left Column - Image */}
          <div className="relative h-[600px] w-full bg-LightGreenBG rounded-md overflow-hidden">
            <Image
              src={plant.imageUrl}
              alt={plant.name}
              fill
              className="object-contain p-8"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Right Column - Content */}
          <div className="space-y-8 col-span-2">
            {/* Plant Name and Category */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {plant.name}
              </h1>
              <p className="text-gray-600 text-lg">
                {plant.categories?.[0] || 'Indoor Plant'}
              </p>
            </div>

            {/* Price Section */}
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold">
                ${plant.price || '0.00'}
              </span>
            </div>

            {/* Description Section */}
            <div className="border-t pt-8">
              <button className="flex items-center justify-between w-full py-2">
                <span className="text-lg font-medium">Description</span>
              </button>
              <div className="pt-4 text-gray-600">{plant.description}</div>
            </div>

            {/* Care Guide Section */}
            {plant.careGuides && plant.careGuides.length > 0 && (
              <div className="border-t pt-8">
                <button className="flex items-center justify-between w-full py-2">
                  <span className="text-lg font-medium">Care Guide</span>
                </button>
                <div className="pt-4">
                  <ul className="space-y-3">
                    {plant.careGuides.map((guide, index) => (
                      <li
                        key={index}
                        className="flex items-start text-gray-600"
                      >
                        <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3" />
                        {guide}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
