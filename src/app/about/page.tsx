import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Plant Nursery',
  description:
    'Learn more about our plant nursery and our mission to bring nature into your home.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">About Us</h1>

        <div className="space-y-6">
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-gray-600 leading-relaxed">
              Founded in 2024, our plant nursery has been dedicated to bringing
              the beauty of nature into homes and spaces across the country. We
              believe that every space deserves a touch of greenery, and
              we&apos;re here to make that possible.
            </p>
          </section>

          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to provide high-quality plants and exceptional
              service to plant enthusiasts and beginners alike. We strive to
              make plant care accessible and enjoyable for everyone, while
              promoting sustainable practices and environmental consciousness.
            </p>
          </section>

          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Quality: We carefully select and nurture each plant</li>
              <li>Sustainability: We practice eco-friendly growing methods</li>
              <li>
                Education: We provide resources and guidance for plant care
              </li>
              <li>Community: We foster a community of plant lovers</li>
            </ul>
          </section>

          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
            <p className="text-gray-600 leading-relaxed">
              Our team consists of passionate horticulturists, plant experts,
              and customer service professionals who are dedicated to providing
              you with the best plants and service. We&apos;re always here to
              help you with any questions about plant care or selection.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
