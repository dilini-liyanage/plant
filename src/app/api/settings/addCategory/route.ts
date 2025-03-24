import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface CategoryRequest {
  name: string;
}

interface Category {
  _id: ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body: CategoryRequest = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return new NextResponse('Category name is required', { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('plantDB');
    const categoriesCollection = db.collection<Category>('categories');

    const existingCategory = await categoriesCollection.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
    });

    if (existingCategory) {
      return new NextResponse('Category already exists', { status: 409 });
    }

    const newCategory: Omit<Category, '_id'> = {
      name: name.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId,
    };

    const result = await categoriesCollection.insertOne(
      newCategory as Category
    );

    // Transform the response to match the frontend type
    const responseCategory = {
      _id: result.insertedId.toString(),
      ...newCategory,
      createdAt: newCategory.createdAt.toISOString(),
      updatedAt: newCategory.updatedAt.toISOString(),
    };

    return NextResponse.json({
      message: 'Category added successfully',
      category: responseCategory,
    });
  } catch (error) {
    console.error('Error adding category:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('plantDB');

    const categories = await db
      .collection('category')
      .find({})
      .sort({ name: 1 })
      .toArray();

    // Transform ObjectId to string and dates to ISO strings
    const transformedCategories = categories.map((category) => ({
      ...category,
      _id: category._id.toString(),
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    }));

    return NextResponse.json(transformedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
