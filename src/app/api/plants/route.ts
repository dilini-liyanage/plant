import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';
import { PlantSchema } from '@/types/plant';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('plantDB');

    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    const query = searchParams.get('query');

    let filter: Record<string, any> = {};

    if (featured === 'true') {
      filter.featured = true;
    }

    if (category) {
      filter.categories = category;
    }

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { scientificName: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ];
    }

    const plants = await db.collection('plants').find(filter).toArray();

    return NextResponse.json(plants);
  } catch (error) {
    console.error('Error fetching plants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plants' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    const plantData = {
      ...validatedData,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection('plants').insertOne(plantData);

    return NextResponse.json(
      { id: result.insertedId, ...plantData },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating plant:', error);

    if (error === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create plant' },
      { status: 500 }
    );
  }
}
