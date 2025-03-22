'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AboutUs() {
  const router = useRouter();
  return (
    <div>
      <div className="bg-LightGreenBG py-24">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-PrimaryText">
            About Our Plant Shop
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Bringing nature&apos;s beauty into your home with carefully curated
            plants and expert care guidance.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-10">
        <div>
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Our Story
          </h2>
          <div className="mb-16 grid gap-12 md:grid-cols-2 md:items-center">
            <div className="relative aspect-square h-full w-full overflow-hidden rounded-lg">
              <Image
                src="/plant-shop.jpg"
                alt="Our plant shop interior"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="space-y-6">
              <p className="text-gray-600">
                Founded in 2023, our plant shop blossomed from a deep-rooted
                passion for bringing the beauty, serenity, and countless
                benefits of plants into every home. We believe that every space,
                whether it&apos;s a cozy apartment, a bustling office, or a
                sprawling backyard, can be transformed into a vibrant sanctuary
                with the right green companion. Our mission is simple: to help
                you discover the perfect plants that not only enhance your
                surroundings but also enrich your life.
              </p>
              <p className="text-gray-600">
                What began as a humble collection of plants has since grown into
                a thoughtfully curated selection of greenery, each chosen for
                its unique charm, resilience, and ability to thrive in a variety
                of environments. From lush tropical foliage to hardy succulents,
                air-purifying wonders to flowering beauties, our collection is
                designed to cater to every plant lover&apos;s needs, whether
                you&apos;re a seasoned gardener or just starting your green
                journey.
              </p>
              <p className="text-gray-600">
                At the heart of our shop is a commitment to quality,
                sustainability, and education. We work closely with trusted
                growers to ensure that every plant we offer is healthy,
                well-cared for, and ready to flourish in your care. But our
                relationship with you doesn&apos;t end at the checkout,
                we&apos;re here to support you every step of the way. From
                personalized plant recommendations to expert care tips,
                we&apos;re dedicated to helping you create and maintain a
                thriving indoor or outdoor oasis.
              </p>
              <p className="text-gray-600">
                Thank you for being a part of our growing family. Together,
                let&apos;s cultivate spaces that inspire, nurture, and bring
                joy, one plant at a time.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
            Our Values
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Quality First',
                description:
                  'We carefully select and nurture each plant to ensure it arrives in perfect condition.',
                icon: '🌱',
              },
              {
                title: 'Expert Guidance',
                description:
                  'Our detailed care guides help you keep your plants thriving long after purchase.',
                icon: '📖',
              },
              {
                title: 'Sustainability',
                description:
                  "We're committed to eco-friendly practices in everything we do.",
                icon: '🌍',
              },
            ].map((value, index) => (
              <div
                key={index}
                className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 text-3xl">{value.icon}</div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
            Our Team
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Founder & Plant Specialist',
                image: '/team-member1.jpg',
              },
              {
                name: 'Mike Chen',
                role: 'Plant Care Expert',
                image: '/team-member2.jpg',
              },
              {
                name: 'Emma Davis',
                role: 'Customer Experience Manager',
                image: '/team-member3.jpg',
              },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 relative mx-auto aspect-square w-48 overflow-hidden rounded-full">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="mb-1 text-xl font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
        {/* end section */}
        <div className="relative h-[300px] w-full rounded-xl overflow-hidden">
          <Image
            src="/hero-plants.png"
            alt="Plants collection"
            fill
            className="object-cover brightness-75"
            priority
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <h2 className="mb-6 text-4xl font-bold text-white">
              Find A Perfect Plant For Your Home
            </h2>
            <button
              onClick={() => router.push('/plants')}
              className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-gray-900 transition-all hover:bg-gray-100"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
