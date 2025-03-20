import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';
import { Plant } from '@/types/plant';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('plantDB');

    // Otherwise, return all plants (existing functionality)
    const plants = await db
      .collection('plant')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    const totalPlants = await db.collection('plant').countDocuments();

    // Transform MongoDB ObjectIds to strings
    const transformedPlants = plants.map((plant) => ({
      ...plant,
      _id: plant._id.toString(),
      createdAt:
        plant.createdAt instanceof Date
          ? plant.createdAt.toISOString()
          : new Date().toISOString(),
    }));

    return NextResponse.json({
      plants: transformedPlants,
      totalPlants,
    });
  } catch (error) {
    console.error('Error getting plants:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
