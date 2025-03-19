import Image from 'next/image';

interface Plant {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
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
  // const { userId } = await auth();

  // if (!userId) {
  //   redirect('/sign-in');
  // }

  const plants = await getPlants();

  return (
    <div className="container mx-auto mt-12 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Our Plants</h1>
      </div>

      {plants.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          No plants available at the moment
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {plants.map((plant) => (
            <div
              key={plant._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <Image
                  src={plant.imageUrl}
                  alt={plant.name}
                  width={100}
                  height={100}
                />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {plant.name}
                </h2>
                <p className="text-gray-600">{plant.description}</p>
                <div className="mt-4 text-sm text-gray-500">
                  Added on {new Date(plant.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
