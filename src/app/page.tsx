import clientPromise from '@/lib/mongodb';
import HomeClient from '@/components/HomeClient';

interface Plant {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
}

// Function to fetch featured plants
async function getFeaturedPlants(): Promise<Plant[]> {
  const client = await clientPromise;
  const db = client.db('plantDB');

  const plants = await db
    .collection('plant')
    .find({})
    .sort({ createdAt: -1 })
    .limit(4)
    .toArray();

  return plants.map((plant) => ({
    _id: plant._id.toString(),
    name: plant.name,
    price: plant.price || 0,
    imageUrl: plant.imageUrl,
  }));
}

export default async function Home() {
  const featuredPlants = await getFeaturedPlants();
  return <HomeClient featuredPlants={featuredPlants} />;
}
