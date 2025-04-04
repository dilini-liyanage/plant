import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface Plant {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

async function getPlantStats() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseUrl}/api/plants/getAllPlants`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch plant stats');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching plant stats:', error);
    return {
      totalPlants: 0,
      plants: [],
    };
  }
}

export default async function AdminDashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const { totalPlants, plants } = await getPlantStats();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-SecondaryText">Dashboard</h1>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-500">Total Plants</h2>
          <p className="mt-2 text-3xl font-bold">{totalPlants}</p>
          <div className="mt-4">
            <Link href="/admin/plants">
              <Button variant="outline" size="sm">
                View All Plants
              </Button>
            </Link>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-500">Quick Actions</h2>
          <div className="mt-4 flex flex-col gap-4">
            <Link href="/admin/plants/new">
              <Button className="w-full bg-DarkGreenBG hover:bg-DarkGreenBG/80 text-white">
                Add New Plant
              </Button>
            </Link>
            <Link href="/" target="_blank">
              <Button variant="outline" className="w-full ">
                View Website
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Recent Plants</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {plants.slice(0, 4).map((plant: Plant) => (
            <div
              key={plant._id}
              className="rounded-lg border bg-white p-4 shadow-sm flex flex-col h-full"
            >
              <div className="relative h-48 w-full bg-gray-50">
                <Image
                  src={plant.imageUrl}
                  alt={plant.name}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <h3 className="font-medium mt-2">{plant.name}</h3>
              <p className="mt-1 text-sm text-gray-600">
                {plant.description.substring(0, 100)}
                {plant.description.length > 100 ? '...' : ''}
              </p>
              <div className="flex justify-end mt-auto pt-4">
                <Link href={`/admin/plants/edit/${plant._id}`}>
                  <Button variant="outline" size="sm">
                    Edit Plant
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
