import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';
import { Plant } from '@/types/plant';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  try {
    // Get plantId from URL if it exists
    const { searchParams } = new URL(request.url);
    const plantId = searchParams.get('id');

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('plantDB');

    // If plantId is provided, return single plant
    if (plantId) {
      if (!ObjectId.isValid(plantId)) {
        return new NextResponse('Invalid plant ID', { status: 400 });
      }

      const plant = await db
        .collection('plant')
        .findOne({ _id: new ObjectId(plantId) });

      if (!plant) {
        return new NextResponse('Plant not found', { status: 404 });
      }

      // Transform single plant
      const transformedPlant = {
        ...plant,
        _id: plant._id.toString(),
        createdAt:
          plant.createdAt instanceof Date
            ? plant.createdAt.toISOString()
            : new Date().toISOString(),
      };

      return NextResponse.json(transformedPlant);
    }
  } catch (error) {
    console.error('Error getting plants:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
