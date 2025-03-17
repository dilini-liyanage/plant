import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import PlantForm from '@/components/admin/PlantForm';

export default async function NewPlantPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }
  
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Add New Plant</h1>
      <PlantForm />
    </div>
  );
}
