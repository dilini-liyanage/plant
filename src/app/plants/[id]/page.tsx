import { ObjectId } from 'mongodb';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import clientPromise from '@/lib/mongodb';
import { Button } from '@/components/ui/button';

export async function generateMetadata({ params }: { params: { id: string } }) {
  if (!ObjectId.isValid(params.id)) {
    return {
      title: 'Plant Not Found',
    };
  }

  const client = await clientPromise;
  const db = client.db('plant-nursery');
  const plant = await db.collection('plants').findOne({
    _id: new ObjectId(params.id),
  });

  if (!plant) {
    return {
      title: 'Plant Not Found',
    };
  }

  return {
    title: plant.seoMetadata?.title || plant.name,
    description: plant.seoMetadata?.description || plant.description.substring(0, 160),
    keywords: plant.seoMetadata?.keywords || plant.categories,
  };
}

export default async function PlantPage({ params }: { params: { id: string } }) {
  if (!ObjectId.isValid(params.id)) {
    notFound();
  }

  const client = await clientPromise;
  const db = client.db('plant-nursery');
  const plant = await db.collection('plants').findOne({
    _id: new ObjectId(params.id),
  });

  if (!plant) {
    notFound();
  }

  // Get related plants (same category)
  const relatedPlants = await db
    .collection('plants')
    .find({
      _id: { $ne: new ObjectId(params.id) },
      categories: { $in: plant.categories },
    })
    .limit(4)
    .toArray();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/plants">
          <Button variant="ghost" size="sm">
            ← Back to Plants
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          {plant.images && plant.images.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-lg">
                <img
                  src={plant.images[0].url}
                  alt={plant.images[0].alt}
                  className="h-auto w-full object-cover"
                />
              </div>
              {plant.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {plant.images.map((image, index) => (
                    <div
                      key={image.publicId}
                      className="overflow-hidden rounded-lg border"
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="h-24 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-64 w-full items-center justify-center rounded-lg bg-gray-100">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold">{plant.name}</h1>
          {plant.scientificName && (
            <p className="mt-1 text-lg italic text-gray-600">
              {plant.scientificName}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {plant.categories?.map((category) => (
              <Link key={category} href={`/plants?category=${category}`}>
                <span className="rounded-full bg-secondary px-3 py-1 text-sm">
                  {category}
                </span>
              </Link>
            ))}
          </div>

          {plant.price !== undefined && (
            <p className="mt-6 text-2xl font-bold text-primary">
              ${plant.price.toFixed(2)}
            </p>
          )}

          <div
            className="prose mt-6 max-w-none"
            dangerouslySetInnerHTML={{ __html: plant.description }}
          />

          <div className="mt-8">
            <h2 className="text-xl font-bold">Care Instructions</h2>
            <div
              className="prose mt-2 max-w-none"
              dangerouslySetInnerHTML={{ __html: plant.careInstructions }}
            />
          </div>
        </div>
      </div>

      {relatedPlants.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">Related Plants</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedPlants.map((relatedPlant) => (
              <Link
                href={`/plants/${relatedPlant._id}`}
                key={relatedPlant._id.toString()}
                className="group overflow-hidden rounded-lg border transition-all hover:shadow-md"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  {relatedPlant.images && relatedPlant.images[0] ? (
                    <img
                      src={relatedPlant.images[0].url}
                      alt={relatedPlant.images[0].alt}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold">{relatedPlant.name}</h3>
                  {relatedPlant.scientificName && (
                    <p className="text-sm italic text-gray-500">
                      {relatedPlant.scientificName}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 