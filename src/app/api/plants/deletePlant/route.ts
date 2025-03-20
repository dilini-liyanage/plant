import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get request body
    const body = await request.json();
    const { id } = body;

    // Validate required fields
    if (!id) {
      return new NextResponse('Plant ID is required', { status: 400 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('plantDB');

    // Update plant document
    const result = await db
      .collection('plant')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return new NextResponse('Plant not found or unauthorized', {
        status: 404,
      });
    }

    return NextResponse.json({
      message: 'Plant deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting plant:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
