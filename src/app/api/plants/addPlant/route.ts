import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get request body
    const body = await request.json();
    const { name, description, imageUrl, price } = body;

    // Validate required fields
    if (!name || !description || !imageUrl) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('plantDB');

    // Create new plant document
    const newPlant = {
      name,
      description,
      imageUrl,
      price,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId,
    };

    // Insert into database
    const result = await db.collection('plant').insertOne(newPlant);

    return NextResponse.json({
      message: 'Plant added successfully',
      plantId: result.insertedId,
    });
  } catch (error) {
    console.error('Error adding plant:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
