import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-1 p-4">
        <section className="py-20 text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to Plant Nursery</h2>
          <p className="text-xl mb-8">Discover beautiful plants for your home and garden</p>
          <Link href="/plants">
            <Button size="lg">Browse Our Collection</Button>
          </Link>
        </section>
        
        {/* Featured plants section will go here */}
      </main>
      <footer className="bg-gray-100 p-4">
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()} Plant Nursery. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
