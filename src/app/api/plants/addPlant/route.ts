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
    const { name, description, imageUrl, price, careGuides, categories } = body;

    // Validate required fields
    if (!name || !description || !imageUrl || !categories) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Validate categories is an array
    // if (!Array.isArray(categories) || categories.length === 0) {
    //   return new NextResponse('At least one category is required', { status: 400 });
    // }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('plantDB');

    // Create new plant document
    const newPlant = {
      name,
      description,
      imageUrl,
      price,
      categories, // Add categories field
      careGuides: careGuides || [],
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
