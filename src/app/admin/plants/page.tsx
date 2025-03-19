import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Plant {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
}

async function getPlants() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/plants/getAllPlants`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch plants');
    }

    const data = await response.json();
    return data.plants as Plant[];
  } catch (error) {
    console.error('Error fetching plants:', error);
    return [];
  }
}

export default async function PlantsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const plants = await getPlants();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Plants</h1>
        <Link href="/admin/plants/new">
          <Button>Add New Plant</Button>
        </Link>
      </div>

      <div className="mt-8">
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {plants.map((plant) => (
                <tr key={plant._id}>
                  <td className="whitespace-nowrap px-6 py-4">{plant.name}</td>
                  <td className="px-6 py-4">
                    <div className="max-w-xl truncate">{plant.description}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Link href={`/admin/plants/${plant._id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
              {plants.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No plants found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
