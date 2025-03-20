import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { PlantSchema } from '@/types/plant';

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { userId } = await auth();
//     if (!userId) {
//       return new NextResponse('Unauthorized', { status: 401 });
//     }

//     const client = await clientPromise;
//     const db = client.db('plantDB');

//     const plant = await db
//       .collection('plant')
//       .findOne({ _id: new ObjectId(params.id) });

//     if (!plant) {
//       return new NextResponse('Plant not found', { status: 404 });
//     }

//     return NextResponse.json({
//       ...plant,
//       _id: plant._id.toString(),
//     });
//   } catch (error) {
//     console.error('Error fetching plant:', error);
//     return new NextResponse('Internal Server Error', { status: 500 });
//   }
// }

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { name, description, imageUrl } = body;

    // Validate required fields
    if (!name || !description || !imageUrl) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('plantDB');

    // Check if plant exists and belongs to user
    const existingPlant = await db
      .collection('plant')
      .findOne({ _id: new ObjectId(params.id) });

    if (!existingPlant) {
      return new NextResponse('Plant not found', { status: 404 });
    }

    if (existingPlant.createdBy !== userId) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    // Update plant
    const result = await db.collection('plant').updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          name,
          description,
          imageUrl,
          updatedAt: new Date(),
        },
      }
    );

    if (result.modifiedCount === 0) {
      return new NextResponse('Failed to update plant', { status: 400 });
    }

    return NextResponse.json({ message: 'Plant updated successfully' });
  } catch (error) {
    console.error('Error updating plant:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
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
