import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ObjectId } from 'mongodb';
import PlantForm from '@/components/admin/PlantForm';
import clientPromise from '@/lib/mongodb';

export default async function EditPlantPage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }
  
  if (!ObjectId.isValid(params.id)) {
    redirect('/admin/plants');
  }
  
  const client = await clientPromise;
  const db = client.db('plant-nursery');
  const plant = await db.collection('plants').findOne({
    _id: new ObjectId(params.id),
  });
  
  if (!plant) {
    redirect('/admin/plants');
  }
  
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Edit Plant: {plant.name}</h1>
      <PlantForm initialData={plant as any} isEditing />
    </div>
  );
}
