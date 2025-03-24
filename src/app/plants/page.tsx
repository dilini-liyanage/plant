import Image from 'next/image';

interface Plant {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  price?: number;
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
    <div className=" bg-none">
      <div className="bg-LightGreenBG py-24">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-PrimaryText">
            Our Plants
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Welcome to our plant nursery! We offer a wide range of plants for
            you to choose from.
          </p>
        </div>
      </div>
      <div className="container mx-auto py-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Our Plants</h1>
        </div>

        {plants.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            No plants available at the moment
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {plants.map((plant) => (
              <div
                key={plant._id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative h-64 w-full bg-gray-50">
                  <Image
                    src={plant.imageUrl}
                    alt={plant.name}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>

                {/* Content Container */}
                <div className="py-2 px-4 bg-[#3B755F] text-white">
                  <h2 className="text-lg font-semibold mb-0">{plant.name}</h2>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-300">
                      ${plant.price || '0.00'}
                    </span>
                    <button
                      className="rounded-full bg-white p-2 hover:bg-gray-100 transition-colors"
                      aria-label="View details"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="#3B755F"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
