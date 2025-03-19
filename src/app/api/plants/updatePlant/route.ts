import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get request body
    const body = await request.json();
    const { id, name, description, imageUrl } = body;

    // Validate required fields
    if (!id || !name || !description) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('plantDB');

    // Update plant document
    const result = await db.collection('plant').updateOne(
      { _id: new ObjectId(id), createdBy: userId },
      {
        $set: {
          name,
          description,
          imageUrl,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return new NextResponse('Plant not found or unauthorized', {
        status: 404,
      });
    }

    return NextResponse.json({
      message: 'Plant updated successfully',
    });
  } catch (error) {
    console.error('Error updating plant:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
