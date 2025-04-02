'use client';

import Footer from '@/components/public/Footer';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Plant {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface HomeClientProps {
  featuredPlants: Plant[];
}

export default function HomeClient({ featuredPlants }: HomeClientProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <main>
        <section className="container mx-auto flex-1 py-20 text-center">
          <div className="flex flex-col md:flex-row">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full md:w-1/2 flex flex-col justify-center items-start"
            >
              <h2 className="text-3xl text-PrimaryText font-bold mb-4">
                Let&apos;s Bring
              </h2>
              <h2 className="text-6xl text-PrimaryText font-bold mb-4 text-left">
                A New{' '}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-SecondaryText"
                >
                  Green Friend{' '}
                </motion.span>
                Home
              </h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl mb-8 text-gray-600 text-left"
              >
                Lorem ipsum dolor sit amet, consectetur <br />
                adipiscing elit. Proin dapibus diam in consequat tempor. Donec{' '}
                <br /> eget justo ut est pretium gravida. Phasellus vulputate
                erat ipsum,
                <br /> nec gravida magna sodales in.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Link href="/plants">
                  <Button
                    size="lg"
                    className="bg-DarkGreenBG text-white hover:bg-SecondaryText/80"
                  >
                    Browse Our Collection
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full md:w-1/2 flex justify-center items-center"
            >
              <Image
                src="/plant-hp2.png"
                alt="Plant Nursery"
                width={500}
                height={500}
              />
            </motion.div>
          </div>
        </section>
        {/* plant collection section */}
        <section className="py-16 bg-LightGreenBG">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-4xl font-bold text-[#2B5540]">
                  Make your home beautiful
                </h2>
                <p className="text-xl text-gray-600 mt-2">
                  with these products
                </p>
              </div>
              <div className="text-center">
                <Link href="/plants">
                  <Button
                    size="lg"
                    className="bg-transparent text-DarkGreenBG hover:bg-transparent hover:text-SecondaryText"
                  >
                    View more{' '}
                    <span>
                      <ChevronRight className="w-5 h-5" />
                    </span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Plants Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {featuredPlants.map((plant, index) => (
                <motion.div
                  key={plant._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg overflow-hidden group"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square">
                    <Image
                      src={plant.imageUrl}
                      alt={plant.name}
                      fill
                      className="object-cover p-4"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4 bg-[#2B5540] text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{plant.name}</h3>
                        <p className="text-lg font-bold">${plant.price}</p>
                      </div>
                      <Link
                        href={`/plants/${plant._id}`}
                        className="p-2 rounded-full bg-white text-[#2B5540] hover:bg-gray-100 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <Image
                  src="/plant-collection.jpg"
                  alt="Collection of plants"
                  width={600}
                  height={400}
                  className="object-contain rounded-xl"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h2 className="text-4xl font-bold text-[#2B5540]">
                  Infuse your home with <br />
                  natural beauty
                </h2>
                <p className="text-gray-600">
                  Indulge in scheduled deliveries of beautifully tailored floral
                  arrangements designed just for you.
                </p>
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-[#2B5540] text-white p-6 rounded-lg flex items-start gap-4"
                  >
                    <div className="bg-white/10 p-2 rounded-full">
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Exceptional quality
                      </h3>
                      <p className="text-white/80 text-sm">
                        Improving standards seed expectations
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-[#2B5540] text-white p-6 rounded-lg flex items-start gap-4"
                  >
                    <div className="bg-white/10 p-2 rounded-full">
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Safely home delivery
                      </h3>
                      <p className="text-white/80 text-sm">
                        Delivery Service for Your Safety and Convenience
                      </p>
                    </div>
                  </motion.div>

                  {/* Nature Daily Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-[#2B5540] text-white p-6 rounded-lg flex items-start gap-4"
                  >
                    <div className="bg-white/10 p-2 rounded-full">
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Incorporate nature daily
                      </h3>
                      <p className="text-white/80 text-sm">
                        Your Lifestyle with Daily Nature Connections
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
