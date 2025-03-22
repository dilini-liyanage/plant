import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-1 p-4">
        <section className="py-20 text-center">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 flex flex-col justify-center items-start">
              <h2 className="text-3xl text-PrimaryText font-bold mb-4">
                Let’s Bring
              </h2>
              <h2 className="text-6xl text-PrimaryText font-bold mb-4 text-left">
                A New <span className="text-SecondaryText">Green Friend </span>{' '}
                Home
              </h2>
              <p className="text-xl mb-8 text-gray-600 text-left">
                Lorem ipsum dolor sit amet, consectetur <br />
                adipiscing elit. Proin dapibus diam in consequat tempor. Donec{' '}
                <br /> eget justo ut est pretium gravida. Phasellus vulputate
                erat ipsum,
                <br /> nec gravida magna sodales in.
              </p>
              <Link href="/plants">
                <Button
                  size="lg"
                  className="bg-DarkGreenBG text-white hover:bg-SecondaryText/80"
                >
                  Browse Our Collection
                </Button>
              </Link>
            </div>
            <div className="w-full md:w-1/2 flex justify-center items-center">
              <Image
                src="/plant-hp2.png"
                alt="Plant Nursery"
                width={500}
                height={500}
              />
            </div>
          </div>
        </section>

        {/* Featured plants section will go here */}
      </main>
      <footer className="bg-LightGreenBG p-4">
        <div className="container mx-auto text-center">
          <p>
            © {new Date().getFullYear()} Plant Nursery. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
