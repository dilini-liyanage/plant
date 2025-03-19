import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface Plant {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
}

async function getPlantStats() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/plants/getAllPlants`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch plant stats');
    }

    const data = await response.json();
    return {
      totalPlants: data.totalPlants,
      plants: data.plants as Plant[],
    };
  } catch (error) {
    console.error('Error fetching plant stats:', error);
    return {
      totalPlants: 0,
      plants: [] as Plant[],
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
    <div>
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

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
              <Button className="w-full">Add New Plant</Button>
            </Link>
            <Link href="/" target="_blank">
              <Button variant="outline" className="w-full">
                View Website
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Recent Plants</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plants.slice(0, 6).map((plant) => (
            <div
              key={plant._id}
              className="rounded-lg border bg-white p-4 shadow-sm"
            >
              <h3 className="font-medium">{plant.name}</h3>
              <p className="mt-1 text-sm text-gray-600">
                {plant.description.substring(0, 100)}
                {plant.description.length > 100 ? '...' : ''}
              </p>
              <div className="mt-4">
                <Link href={`/admin/plants/${plant._id}`}>
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
