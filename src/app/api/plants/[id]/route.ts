import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { PlantSchema } from '@/types/plant';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid plant ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('plant-nursery');

    const plant = await db
      .collection('plants')
      .findOne({ _id: new ObjectId(id) });

    if (!plant) {
      return NextResponse.json({ error: 'Plant not found' }, { status: 404 });
    }

    return NextResponse.json(plant);
  } catch (error) {
    console.error('Error fetching plant:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plant' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid plant ID' }, { status: 400 });
    }

    const body = await request.json();

    // Validate the request body against our schema
    const validatedData = PlantSchema.omit({
      _id: true,
      createdAt: true,
      updatedAt: true,
    }).parse(body);

    const client = await clientPromise;
    const db = client.db('plant-nursery');

    const now = new Date();
    const updateData = {
      ...validatedData,
      updatedAt: now,
    };

    const result = await db
      .collection('plants')
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Plant not found' }, { status: 404 });
    }

    return NextResponse.json({ id, ...updateData });
  } catch (error) {
    console.error('Error updating plant:', error);

    if (error === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update plant' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid plant ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('plant-nursery');

    const result = await db
      .collection('plants')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Plant not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting plant:', error);
    return NextResponse.json(
      { error: 'Failed to delete plant' },
      { status: 500 }
    );
  }
}
