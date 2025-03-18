import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import clientPromise from '@/lib/mongodb';
import Image from 'next/image';

export default async function PlantsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const client = await clientPromise;
  const db = client.db('plant-nursery');
  const plants = await db.collection('plants').find({}).toArray();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Plants</h1>
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
                  Categories
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Featured
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {plants.map((plant) => (
                <tr key={plant._id.toString()}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      {plant.images && plant.images[0] && (
                        <Image
                          src={plant.images[0].url}
                          alt={plant.images[0].alt}
                          className="mr-4 h-10 w-10 rounded-full object-cover"
                          width={40}
                          height={40}
                        />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">
                          {plant.name}
                        </div>
                        {plant.scientificName && (
                          <div className="text-sm text-gray-500">
                            {plant.scientificName}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {plant.categories?.map((category: string) => (
                        <span
                          key={category}
                          className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {plant.featured ? (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                        Featured
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800">
                        Not Featured
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex space-x-2">
                      <Link href={`/admin/plants/${plant._id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/plants/${plant._id}`} target="_blank">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {plants.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No plants found. Add your first plant!
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
