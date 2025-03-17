import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import clientPromise from '@/lib/mongodb';
import Image from 'next/image';

export default async function AdminDashboard() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }
  
  const client = await clientPromise;
  const db = client.db('plant-nursery');
  
  // Get counts for dashboard
  const totalPlants = await db.collection('plants').countDocuments();
  const featuredPlants = await db.collection('plants').countDocuments({ featured: true });
  
  // Get category counts
  const categories = await db.collection('plants').aggregate([
    { $unwind: '$categories' },
    { $group: { _id: '$categories', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]).toArray();
  
  // Get recent plants
  const recentPlants = await db.collection('plants')
    .find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .toArray();
  
  // Convert MongoDB documents to plain objects with serialized _id
  const serializedPlants = recentPlants.map(plant => ({
    ...plant,
    _id: plant._id.toString(),
    createdAt: plant.createdAt instanceof Date ? plant.createdAt.toISOString() : plant.createdAt
  }));
  
  return (
    <div>
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-500">Total Plants</h2>
          <p className="mt-2 text-3xl font-bold">{totalPlants}</p>
          <div className="mt-4">
            <Link href="/admin/plants">
              <Button variant="outline" size="sm">View All Plants</Button>
            </Link>
          </div>
        </div>
        
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-500">Featured Plants</h2>
          <p className="mt-2 text-3xl font-bold">{featuredPlants}</p>
          <div className="mt-4">
            <Link href="/admin/plants?featured=true">
              <Button variant="outline" size="sm">View Featured</Button>
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
              <Button variant="outline" className="w-full">View Website</Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium">Top Categories</h2>
          <div className="mt-4">
            {categories.length > 0 ? (
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category._id} className="flex items-center justify-between">
                    <span>{category._id}</span>
                    <div className="flex items-center">
                      <div className="h-2 w-40 overflow-hidden rounded-full bg-gray-200">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${(category.count / totalPlants) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm">{category.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No categories found</p>
            )}
          </div>
        </div>
        
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium">Recent Plants</h2>
          <div className="mt-4">
            {serializedPlants.length > 0 ? (
              <div className="divide-y">
                {serializedPlants.map((plant) => (
                  <div key={plant._id} className="flex items-center py-3">
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                      {plant.images && plant.images[0] ? (
                        <Image
                          src={plant.images[0].url}
                          alt={plant.name}
                          className="h-full w-full object-cover"
                          width={40}
                          height={40}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs">
                          No img
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-medium">{plant.name}</p>
                      <p className="text-sm text-gray-500">
                        Added {new Date(plant.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Link href={`/admin/plants/${plant._id}`}>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No plants found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}